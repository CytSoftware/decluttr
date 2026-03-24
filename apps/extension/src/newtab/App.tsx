import { useState } from "react";
import type { DeckState } from "@decluttr/types";

export function App() {
  const [deckState] = useState<DeckState>("loading");

  return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-text-primary">Decluttr</h1>
        <p className="text-text-secondary mt-2">
          {deckState === "loading" && "Preparing your tabs..."}
        </p>
      </div>
    </div>
  );
}
