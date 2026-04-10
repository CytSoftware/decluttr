import { useState, useRef, useMemo, useCallback, useEffect } from "react";
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
  { id: 1, title: "How to center a div in CSS", domain: "stackoverflow.com", path: "/questions/356809", age: "3 weeks ago", color: "#F48024", accentBg: "hsl(27, 45%, 92%)", action: "left" },
  { id: 2, title: "React 19 — What's New", domain: "react.dev", path: "/blog/react-19", age: "2 days ago", color: "#61DAFB", accentBg: "hsl(193, 45%, 92%)", action: "right" },
  { id: 3, title: "Best pizza places nearby", domain: "google.com", path: "/search?q=best+pizza", age: "1 month ago", color: "#4285F4", accentBg: "hsl(217, 45%, 92%)", action: "left" },
  { id: 4, title: "Tailwind CSS Documentation", domain: "tailwindcss.com", path: "/docs/installation", age: "5 min ago", color: "#06B6D4", accentBg: "hsl(185, 45%, 92%)", action: "right" },
  { id: 5, title: "GitHub — CytSoftware/decluttr", domain: "github.com", path: "/CytSoftware/decluttr", age: "Just now", color: "#333333", accentBg: "hsl(0, 0%, 93%)", action: "right" },
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

  const handleSwipe = useCallback((dir: string, tab: MockTab) => {
    setGone((prev) => new Set(prev).add(tab.id));
    setDragging(null);
  }, []);

  const handleCardLeftScreen = useCallback(() => {
    setGone((prev) => {
      if (prev.size >= MOCK_TABS.length) {
        setTimeout(() => { setGone(new Set()); setWobbleKey((k) => k + 1); }, 800);
      }
      return prev;
    });
  }, []);

  useEffect(() => {
    if (userInteracted || visibleTabs.length === 0 || !topTab) return;
    const wobbleTimer = setTimeout(() => setWobbleKey((k) => k + 1), 1500);
    autoSwipeTimer.current = setTimeout(() => {
      const ref = refs.current.get(topTab.id);
      if (ref) ref.swipe(topTab.action);
    }, 3000);
    return () => { clearTimeout(wobbleTimer); clearTimeout(autoSwipeTimer.current); };
  }, [visibleTabs.length, topTab, userInteracted, gone]);

  const onUserInteract = useCallback(() => { if (!userInteracted) setUserInteracted(true); }, [userInteracted]);

  const swipeManual = useCallback((dir: "left" | "right") => {
    onUserInteract();
    if (visibleTabs.length === 0) return;
    const top = visibleTabs[visibleTabs.length - 1];
    const ref = refs.current.get(top.id);
    if (ref) ref.swipe(dir);
  }, [visibleTabs, onUserInteract]);

  return (
    <section className="relative pt-28 pb-36 px-6 bg-[#30B8B0] overflow-hidden">
      {/* Large faded circle */}
      <div className="absolute -top-40 -right-40 w-[600px] h-[600px] rounded-full bg-white/[0.06]" />
      <div className="absolute -bottom-20 -left-20 w-[300px] h-[300px] rounded-full bg-white/[0.04]" />

      <div className="relative max-w-6xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-6 text-center lg:text-left">
            <h1 className="text-5xl sm:text-6xl font-extrabold text-white leading-[1.08] tracking-tight">
              Swipe your
              <br />tabs into
              <br />shape
            </h1>
            <p className="text-lg text-white/80 leading-relaxed max-w-md mx-auto lg:mx-0">
              A card deck of every open tab. Left to close, right to keep.
              Clean up 50 tabs in under a minute.
            </p>
            <div className="flex flex-col sm:flex-row items-center lg:items-start gap-3 pt-1">
              <a href={CHROME_STORE_URL} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2.5 px-7 py-3.5 rounded-full bg-white text-[#1A2A3A] font-semibold text-[15px] hover:shadow-xl hover:scale-[1.02] transition-all shadow-lg shadow-black/10">
                <img src="/icons8-chrome-48.png" alt="" width="20" height="20" />
                Add to Chrome
              </a>
              <a href={FIREFOX_STORE_URL} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2.5 px-7 py-3.5 rounded-full bg-white/15 text-white font-semibold text-[15px] border border-white/20 hover:bg-white/25 transition-all backdrop-blur-sm">
                <img src="/firefox.png" alt="" width="20" height="20" className="rounded-full" />
                Add to Firefox
              </a>
            </div>
            <p className="text-sm text-white/50">Free &middot; Open source &middot; No account</p>
          </div>

          <div className="flex flex-col items-center" onPointerDown={onUserInteract}>
            <div className="relative w-[320px] sm:w-[380px] h-[340px] select-none">
              {visibleTabs.map((tab, i) => {
                const ri = visibleTabs.length - 1 - i;
                const isTop = ri === 0;
                return (
                  <TinderCard key={tab.id} ref={(ref: CardRef | null) => { if (ref) refs.current.set(tab.id, ref); }} onSwipe={(dir: string) => handleSwipe(dir, tab)} onSwipeRequirementFulfilled={(dir: string) => setDragging({ id: tab.id, dir })} onSwipeRequirementUnfulfilled={() => setDragging(null)} onCardLeftScreen={handleCardLeftScreen} preventSwipe={["up", "down"]} flickOnSwipe className="absolute inset-0">
                    <div className={`w-full h-[300px] transition-transform duration-300 ${isTop ? "animate-wobble" : ""}`} key={isTop ? wobbleKey : undefined} style={{ transform: `scale(${1 - ri * 0.04}) translateY(${ri * 12}px)`, zIndex: visibleTabs.length - ri, pointerEvents: isTop ? "auto" : "none" }}>
                      <div className="w-full h-full bg-white rounded-3xl shadow-[0_12px_48px_rgba(0,0,0,0.15)] overflow-hidden cursor-grab active:cursor-grabbing relative">
                        <div className="h-[150px] flex flex-col items-center justify-center gap-2.5" style={{ backgroundColor: tab.accentBg }}>
                          <div className="w-14 h-14 rounded-2xl shadow-lg flex items-center justify-center text-white font-bold text-xl" style={{ backgroundColor: tab.color }}>{tab.domain[0].toUpperCase()}</div>
                          <span className="text-xs text-gray-500 font-medium">{tab.domain}</span>
                        </div>
                        <div className="p-5 space-y-2">
                          <h3 className="font-semibold text-base text-gray-900 leading-snug line-clamp-2">{tab.title}</h3>
                          <p className="text-xs text-gray-400 font-mono truncate">{tab.domain}{tab.path}</p>
                          <div className="flex items-center gap-1.5 text-xs text-gray-400">
                            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10" /><path d="M12 6v6l4 2" /></svg>
                            {tab.age}
                          </div>
                        </div>
                        {isTop && (<>
                          <div className="absolute top-5 left-5 px-4 py-1.5 rounded-xl border-[3px] border-rose-500 text-rose-500 font-extrabold text-lg -rotate-12 transition-opacity duration-150" style={{ opacity: dragging?.id === tab.id && dragging?.dir === "left" ? 1 : 0 }}>CLOSE</div>
                          <div className="absolute top-5 right-5 px-4 py-1.5 rounded-xl border-[3px] border-emerald-500 text-emerald-500 font-extrabold text-lg rotate-12 transition-opacity duration-150" style={{ opacity: dragging?.id === tab.id && dragging?.dir === "right" ? 1 : 0 }}>KEEP</div>
                        </>)}
                      </div>
                    </div>
                  </TinderCard>
                );
              })}
              {visibleTabs.length === 0 && (
                <div className="absolute inset-0 flex flex-col items-center justify-center text-white/60 gap-2">
                  <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" /></svg>
                  <span className="text-sm font-semibold">All clean!</span>
                </div>
              )}
            </div>
            <div className="flex items-center justify-center gap-8 mt-6">
              <button onClick={() => swipeManual("left")} className="w-14 h-14 rounded-full bg-white/20 text-white flex items-center justify-center hover:bg-white/30 transition-colors active:scale-90 backdrop-blur-sm" aria-label="Close">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="M18 6L6 18M6 6l12 12" /></svg>
              </button>
              <span className="text-xs text-white/50 font-medium tracking-wide uppercase">Try it</span>
              <button onClick={() => swipeManual("right")} className="w-14 h-14 rounded-full bg-white/20 text-white flex items-center justify-center hover:bg-white/30 transition-colors active:scale-90 backdrop-blur-sm" aria-label="Keep">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><polyline points="20 6 9 17 4 12" /></svg>
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
