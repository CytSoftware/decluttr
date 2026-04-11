const others = [
  { name: "Session savers", example: "OneTab, Session Buddy", issue: "Dumps tabs into a list. Great for freeing memory, but doesn't help you decide." },
  { name: "Workspace organizers", example: "Workona, Toby", issue: "Requires setting up workspaces first. You need a system before it helps." },
  { name: "Auto-closers", example: "Tab Wrangler", issue: "Closes tabs without asking. Fast, but sometimes you lose something you needed." },
];

export function Comparison() {
  return (
    <section aria-labelledby="comparison-heading" className="py-28 px-6">
      <div className="max-w-5xl mx-auto">
        <h2 id="comparison-heading" className="text-3xl sm:text-4xl font-extrabold text-gray-900 text-center mb-4 tracking-tight">
          Not another tab manager
        </h2>
        <p className="text-gray-500 text-center max-w-xl mx-auto mb-16 text-lg">
          Most tools hide, group, or auto-kill your tabs. Decluttr makes you decide &mdash; fast.
        </p>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 items-start">
          {/* Other tools */}
          <div className="lg:col-span-3 space-y-4">
            {others.map((o) => (
              <div key={o.name} className="flex items-start gap-4 p-5 rounded-xl bg-gray-50 border border-gray-100">
                <div className="w-6 h-6 rounded-full bg-gray-200 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#9CA3AF" strokeWidth="3" strokeLinecap="round">
                    <path d="M5 12h14" />
                  </svg>
                </div>
                <div>
                  <div className="font-bold text-gray-900 text-sm">{o.name} <span className="font-normal text-gray-400">/ {o.example}</span></div>
                  <p className="text-sm text-gray-500 mt-1">{o.issue}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Decluttr */}
          <div className="lg:col-span-2 bg-[#30B8B0] rounded-2xl p-7 text-white shadow-lg shadow-[#30B8B0]/20">
            <div className="flex items-center gap-2 mb-4">
              <img src="/decluttr-icon-only.svg" alt="" className="h-6" />
              <span className="font-bold text-lg">Decluttr</span>
            </div>
            <p className="text-white/90 leading-relaxed mb-4">
              You make the call on every tab, one at a time. Fast enough to not feel like work, safe enough to never lose anything.
            </p>
            <div className="space-y-2.5 text-sm">
              {["Swipe to decide, no lists or menus", "Undo and rescue before anything closes", "Works across all windows at once", "No setup, no accounts, no config"].map((line) => (
                <div key={line} className="flex items-start gap-2">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" className="mt-0.5 flex-shrink-0">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                  <span className="text-white/80">{line}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
