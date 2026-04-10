const steps = [
  {
    number: "1",
    title: "Click the toolbar icon",
    description: "Decluttr collects every open tab across all your browser windows into a single deck. Pinned tabs and browser pages are automatically skipped.",
    align: "left" as const,
  },
  {
    number: "2",
    title: "Swipe through the deck",
    description: "Left to close, right to keep, up to save for later. Use keyboard arrows for speed. The stalest tabs surface first so the easy calls come first.",
    align: "right" as const,
  },
  {
    number: "3",
    title: "Review and confirm",
    description: "A summary shows everything you're about to close vs. keep. Changed your mind? Rescue any tab with one click. Nothing closes until you say so.",
    align: "left" as const,
  },
];

export function HowItWorks() {
  return (
    <section id="how-it-works" className="py-28 px-6">
      <div className="max-w-3xl mx-auto">
        <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 text-center mb-20">
          How it works
        </h2>

        <div className="relative">
          {/* Vertical line */}
          <div className="absolute left-1/2 top-0 bottom-0 w-px bg-[#30B8B0]/20 hidden md:block" />

          <div className="space-y-16 md:space-y-20">
            {steps.map((step) => (
              <div key={step.number} className={`md:flex items-center gap-12 ${step.align === "right" ? "md:flex-row-reverse" : ""}`}>
                {/* Content side */}
                <div className={`flex-1 ${step.align === "right" ? "md:text-left" : "md:text-right"}`}>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">{step.title}</h3>
                  <p className="text-[15px] text-gray-500 leading-relaxed">{step.description}</p>
                </div>

                {/* Center circle */}
                <div className="hidden md:flex w-14 h-14 rounded-full bg-[#30B8B0] text-white items-center justify-center font-extrabold text-lg flex-shrink-0 shadow-lg shadow-[#30B8B0]/30 relative z-10">
                  {step.number}
                </div>

                {/* Spacer for the other side */}
                <div className="flex-1 hidden md:block" />

                {/* Mobile number */}
                <div className="md:hidden w-10 h-10 rounded-full bg-[#30B8B0] text-white flex items-center justify-center font-bold text-sm mb-3 mt-6">
                  {step.number}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
