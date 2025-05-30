import Link from "next/link";
//import Testimonials from "@/components/sections/testimonials";
//import VideoTestimonials from "@/components/sections/video-testimonials";
import ComponentDemos from "@/components/sections/component-demos";
import { HeroSection } from "@/components/sections/hero-section";

export default function HomePage() {
  return (
    <main className="flex h-full flex-col">
      <HeroSection />
      <ComponentDemos />
      {/* <Testimonials />
      <VideoTestimonials /> */}
      <footer className="relative border-t border-border py-6 md:py-0">
      <div className="container flex flex-col items-center justify-between gap-4 md:h-16 md:flex-row">
        <p className="text-center text-sm leading-loose text-muted-foreground md:text-left">
            Made with <span className="text-red-500">♥</span> by{" "}
            <Link
              href="https://github.com/ATASTECH"
              target="_blank"
              className="text-foreground underline-offset-4 transition-colors hover:underline"
              prefetch
            >
              ATASTECH.
            </Link>
          </p>
        </div>
      </footer>
    </main>
  );
}
