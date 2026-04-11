import { Navbar } from "./components/Navbar";
import { Hero } from "./components/Hero";
import { TrustStrip } from "./components/TrustStrip";
import { HowItWorks } from "./components/HowItWorks";
import { Features } from "./components/Features";
import { Comparison } from "./components/Comparison";
import { OpenSource } from "./components/OpenSource";
import { StarCTA } from "./components/StarCTA";
import { FAQ } from "./components/FAQ";
import { InstallCTA } from "./components/InstallCTA";
import { Footer } from "./components/Footer";
import { useGitHubStars } from "./hooks/useGitHubStars";

export function App() {
  const stars = useGitHubStars();

  return (
    <div className="min-h-screen bg-white overflow-x-hidden">
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-[100] focus:px-4 focus:py-2 focus:rounded-lg focus:bg-[#30B8B0] focus:text-white focus:font-semibold focus:shadow-lg"
      >
        Skip to content
      </a>
      <Navbar stars={stars} />
      <main id="main">
        <Hero />
        <TrustStrip />
        <HowItWorks />
        <Features />
        <Comparison />
        <OpenSource stars={stars} />
        <StarCTA stars={stars} />
        <FAQ />
        <InstallCTA />
      </main>
      <Footer />
    </div>
  );
}
