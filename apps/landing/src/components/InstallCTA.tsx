export function InstallCTA() {
  return (
    <section id="install" className="py-20 px-6">
      <div className="max-w-2xl mx-auto text-center space-y-6">
        <h2 className="text-3xl font-bold text-text-primary">
          Ready to declutter?
        </h2>
        <p className="text-text-secondary">
          Free and open source. Available for Chrome and Firefox.
        </p>
        <div className="flex items-center justify-center gap-4 flex-wrap">
          <a
            href="#"
            className="inline-flex items-center gap-2.5 px-6 py-3 rounded-xl bg-text-primary text-white font-medium hover:bg-gray-800 transition-colors shadow-md"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
              <circle cx="12" cy="12" r="10" opacity="0.2" />
              <circle cx="12" cy="12" r="4" />
              <path d="M21.17 8H14.68a2 2 0 01-1.7-.97l-.3-.53" fill="none" stroke="currentColor" strokeWidth="1.5" />
            </svg>
            Chrome Web Store
          </a>
          <a
            href="#"
            className="inline-flex items-center gap-2.5 px-6 py-3 rounded-xl bg-[#FF7139] text-white font-medium hover:bg-[#e5652f] transition-colors shadow-md"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2C6.477 2 2 6.477 2 12s4.477 10 10 10 10-4.477 10-10S17.523 2 12 2zm0 18c-4.418 0-8-3.582-8-8s3.582-8 8-8 8 3.582 8 8-3.582 8-8 8z" opacity="0.3" />
              <circle cx="12" cy="12" r="4" />
            </svg>
            Firefox Add-ons
          </a>
        </div>
        <p className="text-xs text-text-muted">
          Coming soon to Chrome Web Store and Firefox Add-ons
        </p>
      </div>
    </section>
  );
}
