'use client';

import React, { useState, useEffect } from "react";
import { startTransition } from 'react';
import Stories from "@/components/ui/stories";

interface Video {
  id: number;
  video: string;
  description:  string | null;
  link: string | null;
}

interface Story {
  id: number;
  title: string;
  image: string;
  createdAt: string;
  updatedAt: string;
  videos: Video[];
}

const StoriesDemo: React.FC = () => {
  const [isModalOpen, setModalOpen] = useState(false);
  const [selectedStoryIndex, setSelectedStoryIndex] = useState(0);
  const [isMobile, setIsMobile] = useState(() => typeof window !== 'undefined' ? window.innerWidth < 768 : false);

  useEffect(() => {
    const handleResize = () => {
      startTransition(() => {
        setIsMobile(window.innerWidth < 768);
      });
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const isLoading = false;
  const error = null;

  const storiesData = {
    results: [
      {
        id: 1,
        title: "Story 1",
        image: "/images/story/story-avatar-1.jpeg",
        created: "2025-01-01T00:00:00Z",
        modified: "2025-01-02T00:00:00Z",
        videos: [
          {
            id: 101,
            video: "/images/story/story-1.mp4",
            description: null,
            link: null
          },
          {
            id: 101,
            video: "/images/story/story-4.mp4",
            description: "",
            link: null
          },
        ]
      },
      {
        id: 2,
        title: "Story 2",
        image: "/images/story/story-avatar-2.jpeg",
        created: "2025-02-01T00:00:00Z",
        modified: "2025-02-02T00:00:00Z",
        videos: [
          {
            id: 102,
            video: "/images/story/story-2.mp4",
            description: "lots of calm 🌊🌤️",
            link: null
          },
          {
            id: 102,
            video: "/images/story/story-3.mp4",
            description: "lots of freedom 💨🌊",
            link: "https://ui.atastech.com"
          }
        ]
      }
    ]
  };
  const placeholderCount = isMobile ? 3 : 9;

  const stories: Story[] = storiesData ? storiesData.results.map(story => ({
    id: story.id,
    title: story.title,
    image: story.image,
    createdAt: story.created,
    updatedAt: story.modified,
    videos: story.videos
  })) : [];

  if (error) return null;
  if (!isLoading && stories.length === 0) return null;

  const handleStoryClick = (index: number) => {
    setSelectedStoryIndex(index);
    setModalOpen(true);
  };

  return (
    <>
      <div className="p-4 my-4 max-w-6xl xl:ml-6">
        <div className="flex flex-wrap gap-4">
          {(isLoading && stories.length === 0
            ? Array.from({ length: placeholderCount }).map((_, idx) => (
              <div key={`story-loader-${idx}`} className="flex flex-col items-center">
                <div className="p-[2px] rounded-full bg-gradient-to-tr from-yellow-500 via-red-400 to-purple-500">
                  <div className="w-20 h-20 rounded-full overflow-hidden bg-white dark:bg-zinc-950 animate-pulse" />
                </div>
                <div className="h-4 w-16 bg-neutral-300 dark:bg-zinc-900 mt-2 animate-pulse"></div>
              </div>
            ))
            : stories.map((story, index) => (
              <div
                key={story.id}
                className="flex flex-col items-center cursor-pointer"
                onClick={() => handleStoryClick(index)}
              >
                <div className="p-[2px] rounded-full bg-gradient-to-tr from-yellow-500 via-red-400 to-purple-500">
                  <div className="w-20 h-20 rounded-full overflow-hidden bg-white dark:bg-zinc-950">
                    <img
                      src={story.image}
                      alt={story.title}
                      width={84}
                      height={84}
                      className="object-cover"
                    />
                  </div>
                </div>
                <h1 className="text-sm font-regular tracking-tighter mt-2 dark:text-neutral-200">
                  {story.title}
                </h1>
              </div>
            )))
          }
        </div>
      </div>
      {isModalOpen && stories[selectedStoryIndex]?.videos && (
        <Stories
          onClose={() => setModalOpen(false)}
          stories={stories}
          initialStoryIndex={selectedStoryIndex}
        />
      )}
    </>
  );
};

export default StoriesDemo;