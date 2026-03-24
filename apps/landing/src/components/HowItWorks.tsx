const steps = [
  {
    number: "1",
    title: "Click the icon",
    description: "Hit the Decluttr icon in your toolbar to start a session.",
    icon: (
      <svg
        width="32"
        height="32"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="text-primary"
      >
        <rect x="3" y="3" width="18" height="18" rx="2" />
        <path d="M15 3v18" />
        <path d="M9 15l3-3 3 3" />
      </svg>
    ),
  },
  {
    number: "2",
    title: "Swipe through tabs",
    description:
      "Swipe left to close, right to keep. Use keyboard shortcuts for speed.",
    icon: (
      <svg
        width="32"
        height="32"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="text-primary"
      >
        <path d="M5 12h14" />
        <path d="M12 5l7 7-7 7" />
      </svg>
    ),
  },
  {
    number: "3",
    title: "Confirm & done",
    description:
      "Review your choices, rescue any tabs you changed your mind about, and confirm.",
    icon: (
      <svg
        width="32"
        height="32"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="text-primary"
      >
        <path d="M20 6L9 17l-5-5" />
      </svg>
    ),
  },
];

export function HowItWorks() {
  return (
    <section id="how-it-works" className="py-20 px-6">
      <div className="max-w-4xl mx-auto">
        <h2 className="text-3xl font-bold text-text-primary text-center mb-12">
          How it works
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {steps.map((step) => (
            <div
              key={step.number}
              className="text-center space-y-3"
            >
              <div className="w-16 h-16 mx-auto rounded-2xl bg-primary/5 flex items-center justify-center">
                {step.icon}
              </div>
              <div className="text-xs font-bold text-primary uppercase tracking-wider">
                Step {step.number}
              </div>
              <h3 className="text-lg font-semibold text-text-primary">
                {step.title}
              </h3>
              <p className="text-sm text-text-secondary leading-relaxed">
                {step.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
