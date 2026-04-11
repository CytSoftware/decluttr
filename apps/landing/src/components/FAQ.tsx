const faqs = [
  {
    q: "Is Decluttr free?",
    a: "Yes. Decluttr is MIT-licensed open source. No trial, no paywall, no account. Install from the Chrome Web Store or Firefox Add-ons and start swiping.",
  },
  {
    q: "Does Decluttr collect any of my data?",
    a: "No. Zero telemetry, zero analytics, zero external requests. Every tab, every saved item, and every preference stays in your browser's local storage. You can audit the full source on GitHub.",
  },
  {
    q: "What happens when I close a tab?",
    a: "Nothing is permanent until you confirm. Swipe left and the tab is queued for closing; you have a full undo stack and a session summary screen that lets you rescue anything you second-guessed.",
  },
  {
    q: "Does Decluttr work on Firefox? How is it different from Chrome tab groups?",
    a: "Yes, Decluttr ships on both Chrome (MV3) and Firefox (MV2). Unlike Chrome tab groups, Firefox containers, or built-in tab search, Decluttr isn't a filing cabinet. It's a triage tool that forces fast decisions on which tabs still deserve to stay open.",
  },
  {
    q: "Where are my saved tabs stored?",
    a: "In your browser's local extension storage, grouped by domain. Nothing syncs to any server. Uninstall the extension and the data goes with it.",
  },
];

export function FAQ() {
  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a },
    })),
  };

  return (
    <section id="faq" className="scroll-mt-20 py-28 px-6 bg-white">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-14">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 tracking-tight">Questions people ask</h2>
          <p className="mt-3 text-gray-500 text-lg">Quick answers before you install.</p>
        </div>

        <div className="space-y-3">
          {faqs.map((f) => (
            <details
              key={f.q}
              className="group rounded-2xl border border-gray-200 bg-white open:bg-gray-50 transition-colors [&[open]>summary>svg]:rotate-180"
            >
              <summary className="flex items-center justify-between gap-6 cursor-pointer list-none px-6 py-5">
                <h3 className="text-base sm:text-lg font-semibold text-gray-900">{f.q}</h3>
                <svg
                  className="flex-shrink-0 text-gray-400 transition-transform duration-200"
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                >
                  <polyline points="6 9 12 15 18 9" />
                </svg>
              </summary>
              <div className="px-6 pb-5 -mt-1 text-gray-600 leading-relaxed">{f.a}</div>
            </details>
          ))}
        </div>

        <p className="text-center text-sm text-gray-400 mt-10">
          Still curious? Read the source on{" "}
          <a
            href="https://github.com/CytSoftware/decluttr"
            target="_blank"
            rel="noopener noreferrer"
            className="text-[#30B8B0] font-semibold hover:underline"
          >
            GitHub
          </a>
          .
        </p>
      </div>

      <script
        type="application/ld+json"
        // eslint-disable-next-line react/no-danger
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />
    </section>
  );
}
