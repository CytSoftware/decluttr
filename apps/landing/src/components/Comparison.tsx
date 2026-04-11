const ArchiveIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <rect x="2" y="3" width="20" height="5" rx="1" />
    <path d="M4 8v11a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8" />
    <line x1="10" y1="12" x2="14" y2="12" />
  </svg>
);

const GridIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <rect x="3" y="3" width="7" height="7" rx="1" />
    <rect x="14" y="3" width="7" height="7" rx="1" />
    <rect x="3" y="14" width="7" height="7" rx="1" />
    <rect x="14" y="14" width="7" height="7" rx="1" />
  </svg>
);

const ClockIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <circle cx="12" cy="12" r="10" />
    <polyline points="12 6 12 12 16 14" />
  </svg>
);

const alternatives = [
  {
    name: "Session savers",
    example: "OneTab, Session Buddy",
    issue: "Dumps tabs into a list. Frees memory, but never helps you decide.",
    Icon: ArchiveIcon,
    tilt: "-rotate-2",
  },
  {
    name: "Workspace organizers",
    example: "Workona, Toby",
    issue: "Requires setting up workspaces first. You need a system before it helps.",
    Icon: GridIcon,
    tilt: "rotate-1",
  },
  {
    name: "Auto-closers",
    example: "Tab Wrangler",
    issue: "Closes tabs without asking. Fast, but sometimes you lose something you needed.",
    Icon: ClockIcon,
    tilt: "-rotate-1",
  },
];

const decluttrWins = [
  "Swipe to decide, no lists or menus",
  "Undo and rescue before anything closes",
  "Works across all windows at once",
  "No setup, no accounts, no config",
];

export function Comparison() {
  return (
    <section aria-labelledby="comparison-heading" className="py-28 px-6 overflow-hidden">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <h2 id="comparison-heading" className="text-3xl sm:text-4xl font-extrabold text-gray-900 tracking-tight">
            Not another tab manager
          </h2>
          <p className="text-gray-500 text-center max-w-xl mx-auto mt-4 text-lg">
            Most tools hide, group, or auto-kill your tabs. Decluttr makes you decide &mdash; fast.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-10 lg:gap-16 items-center">
          {/* Left: 'swiped' alternatives */}
          <div className="lg:col-span-3 space-y-6">
            {alternatives.map(({ name, example, issue, Icon, tilt }) => (
              <div
                key={name}
                className={`group relative bg-white rounded-2xl p-6 pl-24 border border-gray-100 shadow-[0_6px_24px_rgba(26,42,58,0.06)] transform ${tilt} hover:rotate-0 hover:scale-[1.01] transition-all duration-300`}
              >
                <span className="absolute top-5 left-6 inline-block px-3 py-1 rounded-lg border-[2.5px] border-rose-400 text-rose-500 font-extrabold text-[11px] tracking-wide -rotate-[8deg] bg-white/90 shadow-sm">
                  CLOSE
                </span>
                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0 w-10 h-10 rounded-xl bg-gray-100 text-gray-400 flex items-center justify-center group-hover:bg-gray-200 transition-colors">
                    <Icon />
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-baseline gap-2 flex-wrap">
                      <h3 className="font-bold text-gray-900 text-base">{name}</h3>
                      <span className="text-xs text-gray-400 font-medium">{example}</span>
                    </div>
                    <p className="text-sm text-gray-500 mt-1.5 leading-relaxed">{issue}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Right: 'kept' Decluttr card */}
          <div className="lg:col-span-2 relative">
            <div className="absolute -inset-4 bg-[#30B8B0]/20 rounded-[32px] blur-2xl" aria-hidden="true" />
            <div className="relative bg-[#30B8B0] rounded-2xl p-8 text-white shadow-[0_24px_60px_rgba(48,184,176,0.35)] transform rotate-[1.5deg]">
              <span className="absolute top-5 right-5 inline-block px-3 py-1 rounded-lg border-[2.5px] border-white text-white font-extrabold text-[11px] tracking-wide rotate-[8deg] bg-[#30B8B0]">
                KEEP
              </span>
              <div className="flex items-center gap-2 mb-4">
                <img src="/decluttr-icon-only.svg" alt="" className="h-7" />
                <span className="font-extrabold text-xl">Decluttr</span>
              </div>
              <p className="text-white/90 leading-relaxed mb-5">
                You make the call on every tab, one at a time. Fast enough to not feel like work, safe enough to never lose anything.
              </p>
              <ul className="space-y-2.5 text-sm">
                {decluttrWins.map((line) => (
                  <li key={line} className="flex items-start gap-2">
                    <svg
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="3"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="mt-0.5 flex-shrink-0"
                      aria-hidden="true"
                    >
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                    <span className="text-white/90">{line}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
