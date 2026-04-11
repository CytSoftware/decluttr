const steps = [
  {
    number: "1",
    title: "Open Decluttr",
    description: "One click pulls every open tab across every window into a single deck. Pinned and system tabs get skipped automatically.",
    image: "/screenshots/decluttr-swipe-screen.png",
    alt: "Decluttr swipe deck showing 34 tabs ready to review",
    align: "left" as const,
  },
  {
    number: "2",
    title: "Swipe to decide",
    description: "Left closes, right keeps, up saves for later. Use arrow keys for speed. Stale tabs come first so the easy calls come first.",
    image: "/screenshots/decluttr-swipe-close.png",
    alt: "Tab being swiped left with a red CLOSE badge in the Decluttr tab manager extension",
    align: "right" as const,
  },
  {
    number: "3",
    title: "Confirm and move on",
    description: "A summary shows everything you closed, kept, or saved. Rescue anything before confirming. Saved tabs sit in a clean, domain-grouped list.",
    image: "/screenshots/decluttr-saved-tabs.png",
    alt: "Saved Tabs page in Decluttr grouped by domain, the save-for-later view of the tab manager",
    align: "left" as const,
  },
];

export function HowItWorks() {
  return (
    <section id="how-it-works" aria-labelledby="how-it-works-heading" className="scroll-mt-20 py-28 px-6 bg-gray-50/50">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-20">
          <h2 id="how-it-works-heading" className="text-3xl sm:text-4xl font-extrabold text-gray-900 tracking-tight">
            Three swipes from chaos to clean
          </h2>
          <p className="mt-3 text-gray-500 text-lg">No setup, no menus, no filing cabinets.</p>
        </div>

        <div className="space-y-20 lg:space-y-28">
          {steps.map((step) => (
            <div
              key={step.number}
              className={`grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-center ${step.align === "right" ? "lg:[&>*:first-child]:order-2" : ""}`}
            >
              <div>
                <div className="inline-flex items-center justify-center w-11 h-11 rounded-full bg-[#30B8B0] text-white font-extrabold text-base shadow-lg shadow-[#30B8B0]/30 mb-5">
                  {step.number}
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-3">{step.title}</h3>
                <p className="text-[15px] text-gray-500 leading-relaxed max-w-md">{step.description}</p>
              </div>

              <figure className="relative mx-auto w-full max-w-[520px]">
                <div className="absolute -inset-3 bg-[#30B8B0]/10 rounded-3xl blur-xl" aria-hidden="true" />
                <div className="relative rounded-2xl overflow-hidden shadow-[0_18px_60px_rgba(0,0,0,0.12)] ring-1 ring-gray-200 bg-white">
                  <div className="h-7 bg-gray-100 flex items-center gap-1.5 px-3 border-b border-gray-200">
                    <span className="w-2.5 h-2.5 rounded-full bg-[#FF5F57]" />
                    <span className="w-2.5 h-2.5 rounded-full bg-[#FEBC2E]" />
                    <span className="w-2.5 h-2.5 rounded-full bg-[#28C840]" />
                  </div>
                  <img
                    src={step.image}
                    alt={step.alt}
                    width="1040"
                    height="663"
                    loading="lazy"
                    decoding="async"
                    className="block w-full h-auto"
                  />
                </div>
              </figure>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
