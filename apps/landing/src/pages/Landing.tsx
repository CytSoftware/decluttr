import { Hero } from "../components/Hero";
import { TrustStrip } from "../components/TrustStrip";
import { HowItWorks } from "../components/HowItWorks";
import { Features } from "../components/Features";
import { Comparison } from "../components/Comparison";
import { OpenSource } from "../components/OpenSource";
import { StarCTA } from "../components/StarCTA";
import { FAQ } from "../components/FAQ";
import { InstallCTA } from "../components/InstallCTA";

export function Landing({ stars }: { stars: number | null }) {
  return (
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
  );
}
