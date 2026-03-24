export function Hero() {
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

        {/* Mock card preview */}
        <div className="mt-12 relative mx-auto w-[340px]">
          {/* Stack effect - back cards */}
          <div className="absolute inset-0 bg-surface rounded-2xl shadow-card transform rotate-3 scale-[0.95] translate-y-2 opacity-60" />
          <div className="absolute inset-0 bg-surface rounded-2xl shadow-card transform -rotate-2 scale-[0.97] translate-y-1 opacity-80" />

          {/* Front card */}
          <div className="relative bg-surface rounded-2xl shadow-card-hover overflow-hidden">
            <div className="h-[180px] bg-gradient-to-br from-blue-50 to-blue-100 flex items-center justify-center">
              <div className="text-4xl text-primary/30">&#127760;</div>
            </div>
            <div className="p-5 space-y-2">
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded bg-primary/20" />
                <span className="font-medium text-sm text-text-primary">
                  That article you saved 3 weeks ago
                </span>
              </div>
              <span className="text-xs text-text-muted block">
                example.com &middot; 21 days ago
              </span>
            </div>

            {/* Swipe indicators */}
            <div className="absolute top-4 left-4 px-3 py-1 rounded-lg border-2 border-close text-close font-bold text-sm -rotate-12 opacity-40">
              CLOSE
            </div>
            <div className="absolute top-4 right-4 px-3 py-1 rounded-lg border-2 border-keep text-keep font-bold text-sm rotate-12 opacity-40">
              KEEP
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
