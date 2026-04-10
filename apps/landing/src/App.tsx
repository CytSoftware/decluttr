import { Navbar } from "./components/Navbar";
import { Hero } from "./components/Hero";
import { Stats } from "./components/Stats";
import { HowItWorks } from "./components/HowItWorks";
import { Features } from "./components/Features";
import { Comparison } from "./components/Comparison";
import { OpenSource } from "./components/OpenSource";
import { InstallCTA } from "./components/InstallCTA";
import { Footer } from "./components/Footer";
import { useGitHubStars } from "./hooks/useGitHubStars";

export function App() {
  const stars = useGitHubStars();

  return (
    <div className="min-h-screen bg-white overflow-x-hidden">
      <Navbar stars={stars} />
      <Hero />
      <Stats />
      <HowItWorks />
      <Features />
      <Comparison />
      <OpenSource stars={stars} />
      <InstallCTA />
      <Footer />
    </div>
  );
}
