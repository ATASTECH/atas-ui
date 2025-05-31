'use client';

import React, { useEffect, useRef, useState, MutableRefObject, useCallback } from "react";
import useEmblaCarousel from "embla-carousel-react";
import Fade from "embla-carousel-fade";
import { gsap } from "gsap";
import { IconChevronRight, IconChevronLeft, IconVolume, IconVolumeOff, IconLink } from '@tabler/icons-react';
interface Story {
  id: number;
  image: string;
  title: string;
  updatedAt: string;
  videos?: { id: number; video: string; description: string | null; link: string | null }[];
}

const getTimeAgo = (dateString: string) => {
  const updatedDate = new Date(dateString);
  const now = new Date();
  const diffMs = now.getTime() - updatedDate.getTime();
  const diffMin = diffMs / 1000 / 60;
  const diffHour = diffMin / 60;
  const diffDay = diffHour / 24;
  const diffWeek = diffDay / 7;
  if (diffMin < 1) return "now";
  if (diffMin < 60) return `${Math.floor(diffMin)} minutes ago`;
  if (diffHour < 24) return `${Math.floor(diffHour)} hours ago`;
  if (diffDay < 7) return `${Math.floor(diffDay)} days ago`;
  return `${Math.floor(diffWeek)} weeks ago`;
};

interface FullScreenCarouselProps {
  onClose: () => void;
  stories: Story[];
  initialStoryIndex?: number;
  origin?: { x: number; y: number };
}

export default function FullScreenCarousel({
  onClose,
  stories,
  initialStoryIndex,
  origin,
}: FullScreenCarouselProps) {
  const multiStory = stories !== undefined && stories.length > 0;
  const [currentStoryIndex, setCurrentStoryIndex] = useState<number>(multiStory ? (initialStoryIndex || 0) : 0);
  const [activeIndex, setActiveIndex] = useState(0);
  const currentVideoSrcs = React.useMemo(() => {
    return stories[currentStoryIndex]?.videos?.map(v => v.video) || [];
  }, [stories, currentStoryIndex]);
  const currentVideo = stories[currentStoryIndex]?.videos?.[activeIndex];
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: false }, [Fade()]);
  const containerRef = useRef<HTMLDivElement>(null) as MutableRefObject<HTMLDivElement | null>;
  const overlayRef = useRef<HTMLDivElement>(null);
  const infoRef = useRef<HTMLDivElement>(null);
  const videoRefs = useRef<HTMLVideoElement[]>([]);
  const progressRef = useRef<HTMLDivElement>(null);
  const [activeProgress, setActiveProgress] = useState(0);
  const [isHeld, setIsHeld] = useState(false);
  const holdTimeoutRef = useRef<number | null>(null);
  const [isMuted, setIsMuted] = useState(true);
  const [videoLoading, setVideoLoading] = useState<boolean[]>(() =>
    stories.map(() => true)
  );
  const [touchStartY, setTouchStartY] = useState<number | null>(null);
  const touchThreshold = 100;

  useEffect(() => {
    const container = containerRef.current;
    const progress = progressRef.current;
    if (container) {
      const centerX = window.innerWidth / 2;
      const centerY = window.innerHeight / 2;
      const offsetX = origin ? origin.x - centerX : 0;
      const offsetY = origin ? origin.y - centerY : 0;
      container.style.transformOrigin = "center center";
      const targets = [container];
      if (progress) targets.push(progress);
      gsap.fromTo(
        targets,
        { opacity: 0, scale: 0.5, x: offsetX, y: offsetY },
        { duration: 0.6, opacity: 1, scale: 1, x: 0, y: 0, ease: "power2.out" }
      );
    }
  }, [origin]);

  const handleClose = useCallback(() => {
    const container = containerRef.current;
    const progress = progressRef.current;
    if (!container) return onClose();
    const targets = [container];
    if (progress) targets.push(progress);
    gsap.to(targets, {
      duration: 0.5,
      opacity: 0,
      scale: 0.8,
      ease: "power2.in",
      onComplete: onClose,
    });
  }, [onClose]);

  useEffect(() => {
    if (!emblaApi) return;
    const onSelect = () => {
      setActiveIndex(emblaApi.selectedScrollSnap());
      setActiveProgress(0);
    };
    emblaApi.on("select", onSelect);
    onSelect();
    return () => {
      emblaApi.off("select", onSelect);
    };
  }, [emblaApi]);

  useEffect(() => {
    videoRefs.current.forEach((video) => video && video.pause());
    const currentVideo = videoRefs.current[activeIndex];
    if (!currentVideo) return;
    currentVideo.currentTime = 0;
    currentVideo.play().catch(() => {});
    const onTimeUpdate = () => {
      if (currentVideo.duration) {
        const prog = (currentVideo.currentTime / currentVideo.duration) * 100;
        setActiveProgress(prog);
      }
    };
    const onEnded = () => {
      if (activeIndex < currentVideoSrcs.length - 1) {
        if (emblaApi) emblaApi.scrollNext();
      } else {
        if (currentStoryIndex < stories!.length - 1) {
          performStoryTransition("next");
        } else {
          handleClose();
        }
      }
    };
    currentVideo.addEventListener("timeupdate", onTimeUpdate);
    currentVideo.addEventListener("ended", onEnded);
    return () => {
      currentVideo.removeEventListener("timeupdate", onTimeUpdate);
      currentVideo.removeEventListener("ended", onEnded);
    };
  }, [activeIndex, emblaApi, currentVideoSrcs, multiStory, currentStoryIndex, stories, handleClose]);
  
  useEffect(() => {
    const currentVideo = videoRefs.current[activeIndex];
    if (currentVideo) {
      currentVideo.muted = isMuted;
    }
  }, [isMuted, activeIndex]);
  const handlePointerDown = () => {
    setIsHeld(false);
    const currentVideo = videoRefs.current[activeIndex];
    currentVideo?.pause();
    holdTimeoutRef.current = window.setTimeout(() => {
      setIsHeld(true);
    }, 300);
  };

  const handlePointerUp = () => {
    if (holdTimeoutRef.current) {
      clearTimeout(holdTimeoutRef.current);
      holdTimeoutRef.current = null;
    }
    const currentVideo = videoRefs.current[activeIndex];
    currentVideo?.play().catch(() => {});
  };

  const performStoryTransition = useCallback((direction: "prev" | "next") => {
    const container = containerRef.current;
    const overlay = overlayRef.current;
    const info = infoRef.current;
    const progress = progressRef.current;
    if (!container || !overlay || !info || !progress) return;

    gsap.killTweensOf([container, overlay, info, progress]);
    const offsetX = direction === "next" ? -100 : 100;

    const tl = gsap.timeline({
      onComplete: () => {
        if (direction === "next") {
          setCurrentStoryIndex((prev) => prev + 1);
        } else {
          setCurrentStoryIndex((prev) => prev - 1);
        }
        setActiveIndex(0);

        gsap.set([container, overlay], { opacity: 0, scale: 0.8, x: -offsetX });
        gsap.set(info, { opacity: 0, scale: 0.8, clearProps: "transform" });
        gsap.set(progress, { opacity: 0, scale: 0.8, x: -offsetX });

        const tlIn = gsap.timeline();
        tlIn.to([container, overlay, progress], {
          duration: 0.5,
          opacity: 1,
          scale: 1,
          x: 0,
          ease: "power2.out"
        }, 0);
        tlIn.to(info, {
          duration: 0.5,
          opacity: 1,
          scale: 1,
          clearProps: "transform",
          ease: "power2.out"
        }, 0);
      }
    });

    tl.to([container, overlay, info, progress], {
      duration: 0.3,
      opacity: 0,
      scale: 0.8,
      x: offsetX,
      ease: "power2.in"
    }, 0);
  }, []);
  
  useEffect(() => {
    if (infoRef.current) {
      gsap.set(infoRef.current, { opacity: 1, scale: 1, clearProps: "transform" });
    }
  }, [currentStoryIndex]);

  useEffect(() => {
    setVideoLoading(
      stories[currentStoryIndex]?.videos?.map(() => true) || []
    );
  }, [stories.length, currentStoryIndex]);

  const handleClick = (direction: "prev" | "next") => {
    if (!isHeld && emblaApi) {
      if (multiStory) {
        if (direction === "next") {
          if (activeIndex < currentVideoSrcs.length - 1) {
            emblaApi.scrollNext();
          } else if (currentStoryIndex < stories!.length - 1) {
            performStoryTransition("next");
          } else {
            handleClose();
          }
        } else {
          if (activeIndex > 0) {
            emblaApi.scrollPrev();
          } else if (currentStoryIndex > 0) {
            performStoryTransition("prev");
          }
        }
      } else {
        if (direction === "prev") {
          emblaApi.scrollPrev();
        } else {
          emblaApi.scrollNext();
        }
      }
    }
  };

  const handleStoryPrev = () => {
    if (multiStory && currentStoryIndex > 0) {
      performStoryTransition("prev");
    }
  };

  const handleStoryNext = () => {
    if (multiStory && currentStoryIndex < (stories?.length || 0) - 1) {
      performStoryTransition("next");
    }
  };

  const toggleMute = () => {
    setIsMuted((prev) => !prev);
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStartY(e.touches[0].clientY);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (touchStartY !== null) {
      const currentY = e.touches[0].clientY;
      const deltaY = currentY - touchStartY;
      if (Math.abs(deltaY) > touchThreshold) {
        handleClose();
      }
    }
  };

  const handleVideoError = useCallback(() => {
    const currentVideos = stories[currentStoryIndex]?.videos;
    if (!currentVideos || currentVideos.length === 0) {
      let nextStoryIndex = currentStoryIndex + 1;
      while (
        nextStoryIndex < stories.length &&
        (!stories[nextStoryIndex]?.videos ||
         stories[nextStoryIndex].videos?.length === 0 ||
         !stories[nextStoryIndex]?.videos?.[0]?.video)
      ) {
        nextStoryIndex++;
      }
      if (nextStoryIndex < stories.length) {
        performStoryTransition("next");
      } else {
        handleClose();
      }
      return;
    }
    if (activeIndex < currentVideos.length - 1) {
      setActiveIndex(activeIndex + 1);
    } else {
      let nextStoryIndex = currentStoryIndex + 1;
      while (
        nextStoryIndex < stories.length &&
        (!stories[nextStoryIndex]?.videos ||
         stories[nextStoryIndex].videos?.length === 0 ||
         !stories[nextStoryIndex]?.videos?.[0]?.video)
      ) {
        nextStoryIndex++;
      }
      if (nextStoryIndex < stories.length) {
        performStoryTransition("next");
      } else {
        handleClose();
      }
    }
  }, [activeIndex, currentStoryIndex, stories, performStoryTransition, handleClose]);

  const handleTouchEnd = () => {
    setTouchStartY(null);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-neutral-500/50 dark:bg-zinc-800/50 backdrop-blur-md p-6"
      onClick={handleClose}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      <div className="relative h-full w-[500px] max-w-[500px]" onClick={(e) => e.stopPropagation()}>
        <div className="absolute top-8 right-4 flex items-center gap-3 z-20">
          <button onClick={toggleMute} className="text-2xl text-white">
            {isMuted ? <IconVolumeOff stroke={2} /> : <IconVolume stroke={2} />}
          </button>
          <button onClick={handleClose} className="text-3xl font-bold text-white">
            &times;
          </button>
        </div>
        {multiStory && currentStoryIndex > 0 && (
          <button onClick={handleStoryPrev} className="hidden md:block absolute left-[-100px] top-1/2 transform -translate-y-1/2 text-neutral-300 hover:text-white text-2xl z-20 mx-12 bg-neutral-700 bg-opacity-50 hover:bg-opacity-75 rounded-full p-1 shadow-lg">
            <IconChevronLeft stroke={2} />
          </button>
        )}
        {multiStory && currentStoryIndex < (stories?.length || 0) - 1 && (
          <button onClick={handleStoryNext} className="hidden md:block absolute right-[-100px] top-1/2 transform -translate-y-1/2 text-neutral-300 hover:text-white text-2xl z-20 mx-12 bg-neutral-700 bg-opacity-50 hover:bg-opacity-75 rounded-full p-1 shadow-lg">
            <IconChevronRight stroke={2} />
          </button>
        )}
        {multiStory && currentStoryIndex > 0 && (
          <div onClick={handleStoryPrev} className="hidden md:block absolute left-[-320px] top-1/2 transform -translate-y-1/2 max-w-[250px] max-h-[500px] cursor-pointer">
            <video src={stories?.[currentStoryIndex - 1]?.videos?.[0]?.video || ""} muted={true} playsInline preload="metadata" onLoadedData={(e) => { const video = e.currentTarget; video.currentTime = 0; video.pause(); }} className="w-full h-full object-cover rounded-2xl" />
          </div>
        )}
        {multiStory && currentStoryIndex < (stories?.length || 0) - 1 && (
          <div onClick={handleStoryNext} className="hidden md:block absolute right-[-320px] top-1/2 transform -translate-y-1/2 max-w-[250px] max-h-[500px] cursor-pointer">
            <video src={stories?.[currentStoryIndex + 1]?.videos?.[0]?.video || ""} muted={true} playsInline preload="metadata" onLoadedData={(e) => { const video = e.currentTarget; video.currentTime = 0; video.pause(); }} className="w-full h-full object-cover rounded-2xl" />
          </div>
        )}
        <div ref={(node) => { emblaRef(node); containerRef.current = node; }} key={currentStoryIndex} className="overflow-hidden rounded-2xl h-full w-full">
          <div className="flex h-full w-full">
            {currentVideoSrcs.map((src, index) => (
            <div key={index} className="relative min-w-full h-full">
              {videoLoading[index] && (
                <div className="absolute inset-0 bg-neutral-300 dark:bg-zinc-900 animate-pulse rounded-2xl" />
              )}
              <video
                ref={(el) => { if (el) videoRefs.current[index] = el; }}
                onLoadStart={() =>
                  setVideoLoading((prev) => {
                    const next = [...prev];
                    next[index] = true;
                    return next;
                  })
                }
                onLoadedData={() =>
                  setVideoLoading((prev) => {
                    const next = [...prev];
                    next[index] = false;
                    return next;
                  })
                }
                className={`h-full w-full object-cover rounded-2xl ${
                  videoLoading[index] ? 'opacity-0' : 'opacity-100'
                }`}
                muted={isMuted}
                playsInline
                autoPlay={false}
                onError={handleVideoError}
              >
                <source src={src} type="video/mp4" />
              </video>
              {videoLoading[index] && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-6 h-6 border-2 border-neutral-300 border-t-neutral-500 rounded-full animate-spin" />
                </div>
              )}
            </div>
          ))}
          </div>
        </div>
        <div className="absolute inset-0 flex" onMouseDown={handlePointerDown} onMouseUp={handlePointerUp} onTouchStart={handlePointerDown} onTouchEnd={handlePointerUp}>
          <div className="w-1/2" onClick={() => handleClick("prev")} />
          <div className="w-1/2" onClick={() => handleClick("next")} />
        </div>
        <div ref={progressRef} className="absolute top-4 left-4 right-4 z-30 flex gap-2">
          {currentVideoSrcs.map((_, index) => {
            let value = 0;
            if (index < activeIndex) value = 100;
            else if (index === activeIndex) value = activeProgress;
            return (
              <div key={index} className="h-2 flex-1 rounded-full bg-neutral-200/30">
                <div style={{ width: `${value}%` }} className="h-full rounded-full bg-white" />
              </div>
            );
          })}
        </div>
        <div ref={infoRef} className="absolute bottom-10 left-1/2 transform -translate-x-1/2 z-10 max-w-[250px] flex flex-col items-center text-center">
          {currentVideo && (currentVideo.description || currentVideo.link) && (
            <>
              {currentVideo.description && (
                <p className="bg-neutral-100/80 p-2 text-sm text-neutral-900 rounded-2xl item-center text-center mt-12">{currentVideo.description}</p>
              )}
              {currentVideo.link && (
                <a 
                  href={currentVideo.link} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="bg-neutral-100/80 p-2 text-lg text-neutral-900 rounded-2xl item-center text-center mt-5 block flex items-center gap-2 justify-center"
                >
                  <IconLink stroke={2} size={20} />
                  <span>visit us</span>
                </a>
              )}
            </>
          )}
        </div>
        {stories[currentStoryIndex] && (
          <div ref={overlayRef} className="absolute top-10 left-4 z-10 flex items-center gap-2">
            <div className="w-8 h-8 rounded-full overflow-hidden border border-white/20">
              <img src={stories[currentStoryIndex].image} alt={stories[currentStoryIndex].title} className="object-cover w-full h-full" />
            </div>
            <div className="flex flex-col">
              <span className="text-white font-regular text-lg">{stories[currentStoryIndex].title}</span>
              <span className="text-white text-[10px]">{getTimeAgo(stories[currentStoryIndex].updatedAt)}</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}