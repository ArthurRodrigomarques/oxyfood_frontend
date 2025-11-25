import { About } from "@/components/home/about";
import { CTA } from "@/components/home/cta";
import { Features } from "@/components/home/features";
import { Footer } from "@/components/home/footer";
import { Header } from "@/components/home/header";
import { Hero } from "@/components/home/hero";
import { Pricing } from "@/components/home/pricing";

export default function Home() {
  return (
    <main>
      <Header />
      <Hero />
      <Features />
      <Pricing />
      <About />
      <CTA />
      <Footer />
    </main>
  );
}
