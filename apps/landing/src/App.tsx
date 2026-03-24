import { Navbar } from "./components/Navbar";
import { Hero } from "./components/Hero";
import { HowItWorks } from "./components/HowItWorks";
import { Features } from "./components/Features";
import { InstallCTA } from "./components/InstallCTA";
import { Footer } from "./components/Footer";

export function App() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <Hero />
      <HowItWorks />
      <Features />
      <InstallCTA />
      <Footer />
    </div>
  );
}
