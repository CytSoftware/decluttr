import { useState, useRef, useMemo, useCallback, useEffect } from "react";
import TinderCard from "react-tinder-card";

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
  {
    id: 1,
    title: "How to center a div in CSS",
    domain: "stackoverflow.com",
    path: "/questions/356809",
    age: "3 weeks ago",
    color: "#F48024",
    accentBg: "hsl(27, 45%, 92%)",
    action: "left",
  },
  {
    id: 2,
    title: "React 19 — What's New",
    domain: "react.dev",
    path: "/blog/react-19",
    age: "2 days ago",
    color: "#61DAFB",
    accentBg: "hsl(193, 45%, 92%)",
    action: "right",
  },
  {
    id: 3,
    title: "Best pizza places nearby",
    domain: "google.com",
    path: "/search?q=best+pizza",
    age: "1 month ago",
    color: "#4285F4",
    accentBg: "hsl(217, 45%, 92%)",
    action: "left",
  },
  {
    id: 4,
    title: "Tailwind CSS Documentation",
    domain: "tailwindcss.com",
    path: "/docs/installation",
    age: "5 min ago",
    color: "#06B6D4",
    accentBg: "hsl(185, 45%, 92%)",
    action: "right",
  },
  {
    id: 5,
    title: "GitHub — CytSoftware/decluttr",
    domain: "github.com",
    path: "/CytSoftware/decluttr",
    age: "Just now",
    color: "#333333",
    accentBg: "hsl(0, 0%, 93%)",
    action: "right",
  },
];

type CardRef = { swipe: (dir: string) => Promise<void> };

export function Hero() {
  const [gone, setGone] = useState<Set<number>>(() => new Set());
  const [dragging, setDragging] = useState<{
    id: number;
    dir: string;
  } | null>(null);
  const [userInteracted, setUserInteracted] = useState(false);
  const [wobbleKey, setWobbleKey] = useState(0);

  const refs = useRef<Map<number, CardRef>>(new Map());
  const autoSwipeTimer = useRef<ReturnType<typeof setTimeout>>();

  const visibleTabs = useMemo(
    () => MOCK_TABS.filter((t) => !gone.has(t.id)),
    [gone]
  );

  const topTab = visibleTabs.length > 0 ? visibleTabs[visibleTabs.length - 1] : null;

  const handleSwipe = useCallback((dir: string, tab: MockTab) => {
    setGone((prev) => new Set(prev).add(tab.id));
    setDragging(null);
  }, []);

  const handleCardLeftScreen = useCallback(() => {
    setGone((prev) => {
      if (prev.size >= MOCK_TABS.length) {
        // Reset after a brief pause so the empty state flashes
        setTimeout(() => {
          setGone(new Set());
          setWobbleKey((k) => k + 1);
        }, 800);
      }
      return prev;
    });
  }, []);

  // Auto-swipe loop when user hasn't interacted
  useEffect(() => {
    if (userInteracted || visibleTabs.length === 0 || !topTab) return;

    // Wobble first, then auto-swipe
    const wobbleTimer = setTimeout(() => {
      setWobbleKey((k) => k + 1);
    }, 1500);

    autoSwipeTimer.current = setTimeout(() => {
      const ref = refs.current.get(topTab.id);
      if (ref) ref.swipe(topTab.action);
    }, 3000);

    return () => {
      clearTimeout(wobbleTimer);
      clearTimeout(autoSwipeTimer.current);
    };
  }, [visibleTabs.length, topTab, userInteracted, gone]);

  // Stop auto-swipe once user interacts
  const onUserInteract = useCallback(() => {
    if (!userInteracted) setUserInteracted(true);
  }, [userInteracted]);

  const swipeManual = useCallback(
    (dir: "left" | "right") => {
      onUserInteract();
      if (visibleTabs.length === 0) return;
      const top = visibleTabs[visibleTabs.length - 1];
      const ref = refs.current.get(top.id);
      if (ref) ref.swipe(dir);
    },
    [visibleTabs, onUserInteract]
  );

  return (
    <section className="pt-32 pb-20 px-6">
      <div className="max-w-3xl mx-auto text-center space-y-6">
        <h1 className="text-5xl sm:text-6xl font-bold text-text-primary leading-tight tracking-tight">
          Declutter your browser
          <br />
          <span className="text-primary">in seconds.</span>
        </h1>
        <p className="text-lg text-text-secondary max-w-xl mx-auto leading-relaxed">
          Swipe left to close. Swipe right to keep. That&apos;s it. A
          Tinder-style UI for managing your open tabs across all windows.
        </p>
        <div className="flex items-center justify-center gap-4 pt-2">
          <a
            href="#install"
            className="px-6 py-3 rounded-xl bg-primary text-white font-medium hover:bg-primary-dark transition-colors shadow-md"
          >
            Install Free
          </a>
          <a
            href="#how-it-works"
            className="px-6 py-3 rounded-xl bg-gray-100 text-text-primary font-medium hover:bg-gray-200 transition-colors"
          >
            See how it works
          </a>
        </div>

        {/* Interactive swipe deck */}
        <div
          className="mt-12 relative mx-auto w-[320px] sm:w-[360px] h-[320px] select-none"
          onPointerDown={onUserInteract}
        >
          {visibleTabs.map((tab, i) => {
            const reverseIndex = visibleTabs.length - 1 - i;
            const isTop = reverseIndex === 0;

            return (
              <TinderCard
                key={tab.id}
                ref={(ref: CardRef | null) => {
                  if (ref) refs.current.set(tab.id, ref);
                }}
                onSwipe={(dir: string) => handleSwipe(dir, tab)}
                onSwipeRequirementFulfilled={(dir: string) =>
                  setDragging({ id: tab.id, dir })
                }
                onSwipeRequirementUnfulfilled={() => setDragging(null)}
                onCardLeftScreen={handleCardLeftScreen}
                preventSwipe={["up", "down"]}
                flickOnSwipe
                className="absolute inset-0"
              >
                <div
                  className={`w-full h-[280px] transition-transform duration-300 ${isTop ? "animate-wobble" : ""}`}
                  key={isTop ? wobbleKey : undefined}
                  style={{
                    transform: `scale(${1 - reverseIndex * 0.04}) translateY(${reverseIndex * 10}px)`,
                    zIndex: visibleTabs.length - reverseIndex,
                    pointerEvents: isTop ? "auto" : "none",
                  }}
                >
                  <div className="w-full h-full bg-surface rounded-2xl shadow-card-hover overflow-hidden cursor-grab active:cursor-grabbing relative">
                    {/* Header */}
                    <div
                      className="h-[140px] flex flex-col items-center justify-center gap-2"
                      style={{ backgroundColor: tab.accentBg }}
                    >
                      <div
                        className="w-12 h-12 rounded-xl shadow-md flex items-center justify-center text-white font-bold text-lg"
                        style={{ backgroundColor: tab.color }}
                      >
                        {tab.domain[0].toUpperCase()}
                      </div>
                      <span className="text-xs text-text-muted font-medium">
                        {tab.domain}
                      </span>
                    </div>

                    {/* Content */}
                    <div className="p-4 space-y-2">
                      <h3 className="font-semibold text-[15px] text-text-primary leading-snug line-clamp-2">
                        {tab.title}
                      </h3>
                      <p className="text-xs text-text-muted font-mono truncate">
                        {tab.domain}
                        {tab.path}
                      </p>
                      <div className="flex items-center gap-1.5 text-[11px] text-text-muted">
                        <svg
                          width="12"
                          height="12"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                        >
                          <circle cx="12" cy="12" r="10" />
                          <path d="M12 6v6l4 2" />
                        </svg>
                        {tab.age}
                      </div>
                    </div>

                    {/* Swipe overlays */}
                    {isTop && (
                      <>
                        <div
                          className="absolute top-4 left-4 px-4 py-1.5 rounded-lg border-2 border-close text-close font-bold text-lg -rotate-12 transition-opacity duration-150"
                          style={{
                            opacity:
                              dragging?.id === tab.id &&
                              dragging?.dir === "left"
                                ? 1
                                : 0,
                          }}
                        >
                          CLOSE
                        </div>
                        <div
                          className="absolute top-4 right-4 px-4 py-1.5 rounded-lg border-2 border-keep text-keep font-bold text-lg rotate-12 transition-opacity duration-150"
                          style={{
                            opacity:
                              dragging?.id === tab.id &&
                              dragging?.dir === "right"
                                ? 1
                                : 0,
                          }}
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

          {/* Empty state */}
          {visibleTabs.length === 0 && (
            <div className="absolute inset-0 flex flex-col items-center justify-center text-text-muted gap-2">
              <svg
                width="32"
                height="32"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
              >
                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                <polyline points="22 4 12 14.01 9 11.01" />
              </svg>
              <span className="text-sm font-medium">All done!</span>
            </div>
          )}
        </div>

        {/* Swipe buttons */}
        <div className="flex items-center justify-center gap-6">
          <button
            onClick={() => swipeManual("left")}
            className="w-12 h-12 rounded-full border-2 border-close/30 text-close flex items-center justify-center hover:bg-close/5 transition-colors active:scale-95"
            aria-label="Close"
          >
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
            >
              <path d="M18 6L6 18M6 6l12 12" />
            </svg>
          </button>
          <span className="text-xs text-text-muted">
            Swipe or tap to try
          </span>
          <button
            onClick={() => swipeManual("right")}
            className="w-12 h-12 rounded-full border-2 border-keep/30 text-keep flex items-center justify-center hover:bg-keep/5 transition-colors active:scale-95"
            aria-label="Keep"
          >
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
            >
              <polyline points="20 6 9 17 4 12" />
            </svg>
          </button>
        </div>
      </div>
    </section>
  );
}
