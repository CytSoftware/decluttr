const features = [
  {
    title: "Swipe to decide",
    description:
      "Intuitive Tinder-style card interface. Swipe left to close, right to keep. Use keyboard shortcuts for even faster decisions.",
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="4" width="20" height="16" rx="2" />
        <path d="M7 15l3-3-3-3" />
        <path d="M17 15l-3-3 3-3" />
      </svg>
    ),
  },
  {
    title: "Smart duplicates",
    description:
      "Automatically detects duplicate tabs and groups them together. Keep one, close the rest in a single swipe.",
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <rect x="4" y="4" width="16" height="16" rx="2" />
        <rect x="8" y="2" width="14" height="14" rx="2" />
      </svg>
    ),
  },
  {
    title: "All windows, one deck",
    description:
      "Pulls tabs from every open browser window into a single swipe deck. Stale tabs surface first so you can clean up fast.",
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="3" width="20" height="14" rx="2" />
        <path d="M8 21h8" />
        <path d="M12 17v4" />
      </svg>
    ),
  },
  {
    title: "Safe by default",
    description:
      "Nothing is closed until you confirm. Review your choices on the summary screen. Rescue any tab with one click.",
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
      </svg>
    ),
  },
];

export function Features() {
  return (
    <section className="py-20 px-6 bg-gray-50/50">
      <div className="max-w-4xl mx-auto">
        <h2 className="text-3xl font-bold text-text-primary text-center mb-12">
          Features
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {features.map((feature) => (
            <div
              key={feature.title}
              className="bg-surface rounded-xl p-6 border border-border space-y-3"
            >
              <div className="w-10 h-10 rounded-lg bg-primary/5 flex items-center justify-center text-primary">
                {feature.icon}
              </div>
              <h3 className="text-base font-semibold text-text-primary">
                {feature.title}
              </h3>
              <p className="text-sm text-text-secondary leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
