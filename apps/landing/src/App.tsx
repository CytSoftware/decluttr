import { Navbar } from "./components/Navbar";
import { Hero } from "./components/Hero";
import { HowItWorks } from "./components/HowItWorks";
import { Features } from "./components/Features";
import { InstallCTA } from "./components/InstallCTA";
import { Footer } from "./components/Footer";
import { useGitHubStars } from "./hooks/useGitHubStars";

export function App() {
  const stars = useGitHubStars();

  return (
    <div className="min-h-screen bg-background">
      <Navbar stars={stars} />
      <Hero />
      <HowItWorks />
      <Features />
      <InstallCTA stars={stars} />
      <Footer />
    </div>
  );
}
