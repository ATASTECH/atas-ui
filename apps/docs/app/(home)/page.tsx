//import Testimonials from "@/components/sections/testimonials";
//import VideoTestimonials from "@/components/sections/video-testimonials";
import ComponentDemos from "@/components/sections/component-demos";
import { HeroSection } from "@/components/sections/hero-section";
import Footer from "@/components/sections/footer";

export default function HomePage() {
  return (
    <main className="flex h-full flex-col">
      <HeroSection />
      <ComponentDemos />
      {/* <Testimonials />
      <VideoTestimonials /> */}
      <Footer />
    </main>
  );
}
