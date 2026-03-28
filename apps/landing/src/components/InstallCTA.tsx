import { GITHUB_REPO_URL } from "../constants";

export function InstallCTA({ stars }: { stars: number | null }) {
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
          {/* Chrome */}
          <a
            href="#"
            className="inline-flex items-center gap-2.5 px-6 py-3 rounded-xl bg-text-primary text-white font-medium hover:bg-gray-800 transition-colors shadow-md"
          >
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="currentColor"
            >
              <path d="M12 0C8.21 0 4.831 1.757 2.632 4.501l3.953 6.848A5.454 5.454 0 0 1 12 6.545h10.691A12 12 0 0 0 12 0zM1.931 5.47A11.943 11.943 0 0 0 0 12c0 6.012 4.42 10.991 10.189 11.864l3.953-6.847a5.45 5.45 0 0 1-6.865-2.29zm13.342 2.166a5.446 5.446 0 0 1 1.45 7.09l.002.001h-.002l-3.952 6.848c.404.026.813.042 1.228.042 6.627 0 12-5.373 12-12 0-1.006-.124-1.983-.357-2.917zM12 16.364a4.364 4.364 0 1 1 0-8.728 4.364 4.364 0 0 1 0 8.728Z" />
            </svg>
            Chrome Web Store
          </a>
          {/* Firefox */}
          <a
            href="#"
            className="inline-flex items-center gap-2.5 px-6 py-3 rounded-xl bg-[#FF7139] text-white font-medium hover:bg-[#e5652f] transition-colors shadow-md"
          >
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="currentColor"
            >
              <path d="M21.634 8.583c-.497-1.236-1.469-2.63-2.29-3.25.49 1.12.754 2.332.79 3.56.023.625-.073 1.254-.278 1.854-.063.185-.14.365-.224.54-.204.404-.45.785-.73 1.14a6.482 6.482 0 0 1-4.72 2.573 6.342 6.342 0 0 1-3.098-.475c-.062-.03-.122-.063-.18-.098-.06-.034-.116-.07-.17-.108l-.024-.017c-1.1-.706-1.846-1.82-2.084-3.08a4.668 4.668 0 0 1 .094-2.07c.14-.517.38-1 .705-1.42-.507.26-.97.606-1.367 1.025A5.69 5.69 0 0 0 7.052 10.5c-.143.63-.178 1.28-.103 1.923.108.958.46 1.87 1.02 2.652a6.14 6.14 0 0 0 2.195 1.87c.86.447 1.81.695 2.78.725.97.03 1.935-.18 2.815-.615a6.037 6.037 0 0 0 2.165-1.8 6.483 6.483 0 0 0 1.19-2.685c.088-.498.12-1.004.098-1.508.064-1.22-.194-2.44-.75-3.537l-.002-.003a9.14 9.14 0 0 0-.193-.37 4.762 4.762 0 0 0-1.096-1.4c.348.14.678.327.98.556A11.878 11.878 0 0 1 23.834 12c0 6.523-5.29 11.813-11.813 11.813S.208 18.523.208 12 5.498.188 12.02.188c1.973 0 3.862.49 5.55 1.38a11.94 11.94 0 0 1 4.064 3.636v.002c-.002-.002 0-.002 0 0a12.632 12.632 0 0 0-.714-1.072 11.77 11.77 0 0 0-2.51-2.558A11.773 11.773 0 0 0 12.021 0C5.384 0 .02 5.364.02 12s5.364 12 12 12c6.637 0 12-5.364 12-12 0-1.19-.173-2.363-.51-3.493z" />
            </svg>
            Firefox Add-ons
          </a>
        </div>
        {/* Star on GitHub */}
        <a
          href={GITHUB_REPO_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl border border-border text-text-primary font-medium hover:bg-gray-50 transition-colors"
        >
          <svg
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="currentColor"
            className="text-yellow-500"
          >
            <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
          </svg>
          Star on GitHub
          {stars !== null && (
            <span className="text-xs font-medium bg-gray-100 text-text-secondary px-2 py-0.5 rounded-full">
              {stars.toLocaleString()}
            </span>
          )}
        </a>
        <p className="text-xs text-text-muted">
          Coming soon to Chrome Web Store and Firefox Add-ons
        </p>
      </div>
    </section>
  );
}
