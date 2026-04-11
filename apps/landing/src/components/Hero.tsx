import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import TinderCard from "react-tinder-card";
import { CHROME_STORE_URL, FIREFOX_STORE_URL } from "../constants";

interface MockTab {
  id: number;
  title: string;
  domain: string;
  path: string;
  age: string;
  color: string;
  accentBg: string;
  action: "left" | "right";
}

const MOCK_TABS: MockTab[] = [
  { id: 1, title: "How to center a div in CSS", domain: "stackoverflow.com", path: "/questions/356809", age: "3 weeks ago", color: "#F48024", accentBg: "hsl(27, 45%, 94%)", action: "left" },
  { id: 2, title: "React 19: What's New", domain: "react.dev", path: "/blog/react-19", age: "2 days ago", color: "#61DAFB", accentBg: "hsl(193, 45%, 94%)", action: "right" },
  { id: 3, title: "Best pizza places nearby", domain: "google.com", path: "/search?q=best+pizza", age: "1 month ago", color: "#4285F4", accentBg: "hsl(217, 45%, 94%)", action: "left" },
  { id: 4, title: "Tailwind CSS Documentation", domain: "tailwindcss.com", path: "/docs/installation", age: "5 min ago", color: "#06B6D4", accentBg: "hsl(185, 45%, 94%)", action: "right" },
  { id: 5, title: "GitHub: CytSoftware/decluttr", domain: "github.com", path: "/CytSoftware/decluttr", age: "Just now", color: "#333333", accentBg: "hsl(0, 0%, 93%)", action: "right" },
];

type CardRef = { swipe: (dir: string) => Promise<void> };

export function Hero() {
  const [gone, setGone] = useState<Set<number>>(() => new Set());
  const [dragging, setDragging] = useState<{ id: number; dir: string } | null>(null);
  const [userInteracted, setUserInteracted] = useState(false);
  const [wobbleKey, setWobbleKey] = useState(0);
  const refs = useRef<Map<number, CardRef>>(new Map());
  const autoSwipeTimer = useRef<ReturnType<typeof setTimeout>>();

  const visibleTabs = useMemo(() => MOCK_TABS.filter((t) => !gone.has(t.id)), [gone]);
  const topTab = visibleTabs.length > 0 ? visibleTabs[visibleTabs.length - 1] : null;

  const handleSwipe = useCallback((_dir: string, tab: MockTab) => {
    setGone((prev) => new Set(prev).add(tab.id));
    setDragging(null);
  }, []);

  const handleCardLeftScreen = useCallback(() => {
    setGone((prev) => {
      if (prev.size >= MOCK_TABS.length) {
        setTimeout(() => {
          setGone(new Set());
          setWobbleKey((k) => k + 1);
        }, 800);
      }
      return prev;
    });
  }, []);

  useEffect(() => {
    if (userInteracted || visibleTabs.length === 0 || !topTab) return;
    const wobbleTimer = setTimeout(() => setWobbleKey((k) => k + 1), 1500);
    autoSwipeTimer.current = setTimeout(() => {
      const ref = refs.current.get(topTab.id);
      if (ref) void ref.swipe(topTab.action);
    }, 3000);
    return () => {
      clearTimeout(wobbleTimer);
      clearTimeout(autoSwipeTimer.current);
    };
  }, [visibleTabs.length, topTab, userInteracted, gone]);

  const onUserInteract = useCallback(() => {
    if (!userInteracted) setUserInteracted(true);
  }, [userInteracted]);

  const swipeManual = useCallback(
    (dir: "left" | "right") => {
      onUserInteract();
      if (visibleTabs.length === 0) return;
      const top = visibleTabs[visibleTabs.length - 1];
      const ref = refs.current.get(top.id);
      if (ref) void ref.swipe(dir);
    },
    [visibleTabs, onUserInteract],
  );

  return (
    <section className="relative pt-32 pb-24 px-6 bg-[#EDF4F8] overflow-hidden">
      <div className="absolute top-24 left-1/2 -translate-x-1/2 w-[900px] h-[900px] rounded-full bg-white/60 blur-3xl opacity-50" aria-hidden="true" />
      <div className="absolute -top-24 -right-24 w-[420px] h-[420px] rounded-full bg-[#30B8B0]/10 blur-3xl" aria-hidden="true" />
      <div className="absolute -bottom-24 -left-24 w-[420px] h-[420px] rounded-full bg-[#30B8B0]/10 blur-3xl" aria-hidden="true" />

      <div className="relative max-w-4xl mx-auto text-center">
        <h1 className="text-5xl sm:text-6xl lg:text-7xl font-extrabold text-[#1A2A3A] leading-[1.05] tracking-tight">
          Declutter your browser
          <br />
          <span className="text-[#30B8B0]">in seconds.</span>
        </h1>
        <p className="mt-7 text-lg sm:text-xl text-gray-500 leading-relaxed max-w-2xl mx-auto">
          Swipe left to close. Swipe right to keep. That's it. A Tinder-style UI for managing your open tabs across all windows.
        </p>

        <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-3">
          <a
            href={CHROME_STORE_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2.5 px-7 py-3.5 rounded-full bg-[#1A2A3A] text-white font-semibold text-[15px] hover:bg-[#2A3A4A] hover:scale-[1.02] transition-all shadow-lg shadow-[#1A2A3A]/20"
          >
            <img src="/icons8-chrome-48.png" alt="" width="20" height="20" />
            Add to Chrome
          </a>
          <a
            href={FIREFOX_STORE_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2.5 px-7 py-3.5 rounded-full bg-[#FF7139] text-white font-semibold text-[15px] hover:bg-[#E55A1F] hover:scale-[1.02] transition-all shadow-lg shadow-[#FF7139]/25"
          >
            <img src="/firefox.png" alt="" width="20" height="20" className="rounded-full" />
            Add to Firefox
          </a>
        </div>

        <a
          href="#how-it-works"
          className="inline-flex items-center gap-1.5 mt-7 text-sm text-gray-400 hover:text-gray-600 transition-colors"
        >
          See how it works
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="12" y1="5" x2="12" y2="19" />
            <polyline points="19 12 12 19 5 12" />
          </svg>
        </a>

        <div className="mt-14 flex flex-col items-center" onPointerDown={onUserInteract}>
          <div className="relative w-[340px] sm:w-[400px] lg:w-[440px] h-[440px] select-none">
            {visibleTabs.map((tab, i) => {
              const ri = visibleTabs.length - 1 - i;
              const isTop = ri === 0;
              return (
                <TinderCard
                  key={tab.id}
                  ref={(ref: CardRef | null) => {
                    if (ref) refs.current.set(tab.id, ref);
                    else refs.current.delete(tab.id);
                  }}
                  onSwipe={(dir: string) => handleSwipe(dir, tab)}
                  onSwipeRequirementFulfilled={(dir: string) => setDragging({ id: tab.id, dir })}
                  onSwipeRequirementUnfulfilled={() => setDragging(null)}
                  onCardLeftScreen={handleCardLeftScreen}
                  preventSwipe={["up", "down"]}
                  flickOnSwipe
                  className="absolute inset-0"
                >
                  <div
                    className={`w-full h-[400px] transition-transform duration-300 ${isTop ? "animate-wobble" : ""}`}
                    key={isTop ? wobbleKey : undefined}
                    style={{
                      transform: `scale(${1 - ri * 0.04}) translateY(${ri * 14}px)`,
                      zIndex: visibleTabs.length - ri,
                      pointerEvents: isTop ? "auto" : "none",
                    }}
                  >
                    <div className="w-full h-full bg-white rounded-[28px] shadow-[0_24px_80px_rgba(26,42,58,0.15)] border border-gray-100 overflow-hidden cursor-grab active:cursor-grabbing relative">
                      <div className="h-[180px] flex flex-col items-center justify-center gap-3" style={{ backgroundColor: tab.accentBg }}>
                        <div className="w-16 h-16 rounded-2xl shadow-lg flex items-center justify-center text-white font-bold text-2xl" style={{ backgroundColor: tab.color }}>
                          {tab.domain[0].toUpperCase()}
                        </div>
                        <span className="text-xs text-gray-500 font-medium">{tab.domain}</span>
                      </div>
                      <div className="p-6 space-y-2.5">
                        <h2 className="font-semibold text-lg text-gray-900 leading-snug line-clamp-2">{tab.title}</h2>
                        <p className="text-xs text-gray-400 font-mono truncate">{tab.domain}{tab.path}</p>
                        <div className="flex items-center gap-1.5 text-xs text-gray-400 pt-1">
                          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10" /><path d="M12 6v6l4 2" /></svg>
                          {tab.age}
                        </div>
                      </div>
                      {isTop && (
                        <>
                          <div
                            className="absolute top-6 left-6 px-4 py-1.5 rounded-xl border-[3px] border-rose-500 text-rose-500 font-extrabold text-lg -rotate-12 transition-opacity duration-150"
                            style={{ opacity: dragging?.id === tab.id && dragging?.dir === "left" ? 1 : 0 }}
                          >
                            CLOSE
                          </div>
                          <div
                            className="absolute top-6 right-6 px-4 py-1.5 rounded-xl border-[3px] border-emerald-500 text-emerald-500 font-extrabold text-lg rotate-12 transition-opacity duration-150"
                            style={{ opacity: dragging?.id === tab.id && dragging?.dir === "right" ? 1 : 0 }}
                          >
                            KEEP
                          </div>
                        </>
                      )}
                    </div>
                  </div>
                </TinderCard>
              );
            })}

            {visibleTabs.length === 0 && (
              <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 text-gray-400">
                <svg width="42" height="42" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" /></svg>
                <span className="text-sm font-semibold text-gray-600">All clean!</span>
              </div>
            )}
          </div>

          <div className="flex items-center justify-center gap-8 mt-8">
            <button
              onClick={() => swipeManual("left")}
              disabled={visibleTabs.length === 0}
              aria-label="Close tab"
              className="w-14 h-14 rounded-full bg-white text-rose-500 border border-rose-200 shadow-sm flex items-center justify-center hover:border-rose-400 hover:shadow-md transition-all active:scale-90 disabled:opacity-40 disabled:cursor-not-allowed"
            >
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="M18 6L6 18M6 6l12 12" /></svg>
            </button>
            <span className="text-xs text-gray-400 font-medium tracking-wide uppercase">Swipe or tap to try</span>
            <button
              onClick={() => swipeManual("right")}
              disabled={visibleTabs.length === 0}
              aria-label="Keep tab"
              className="w-14 h-14 rounded-full bg-white text-emerald-500 border border-emerald-200 shadow-sm flex items-center justify-center hover:border-emerald-400 hover:shadow-md transition-all active:scale-90 disabled:opacity-40 disabled:cursor-not-allowed"
            >
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg>
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
