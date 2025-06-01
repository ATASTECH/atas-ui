//import Testimonials from "@/components/sections/testimonials";
//import VideoTestimonials from "@/components/sections/video-testimonials";
import ComponentDemos from "@/components/sections/component-demos";
import { HeroSection } from "@/components/sections/hero-section";
import Footer from "@/components/sections/footer";
//import ShowcaseHome from "@/components/sections/showcase";


export default function HomePage() {
  return (
    <main className="flex h-full flex-col">
      <HeroSection />
      {/* <ShowcaseHome /> */}
      <ComponentDemos />
      {/* <Testimonials />
      <VideoTestimonials /> */}
      <Footer />
    </main>
  );
}
