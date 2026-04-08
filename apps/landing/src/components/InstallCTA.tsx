import {
  GITHUB_REPO_URL,
  CHROME_STORE_URL,
  FIREFOX_STORE_URL,
} from "../constants";

export function InstallCTA({ stars }: { stars: number | null }) {
  return (
    <section id="install" className="py-20 px-6">
      <div className="max-w-2xl mx-auto text-center space-y-6">
        <h2 className="text-3xl font-bold text-text-primary">
          Ready to declutter?
        </h2>
        <p className="text-text-secondary">
          Free and open source. Available now for Chrome and Firefox.
        </p>
        <div className="flex items-center justify-center gap-4 flex-wrap">
          {/* Chrome */}
          <a
            href={CHROME_STORE_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2.5 px-6 py-3 rounded-xl bg-text-primary text-white font-medium hover:bg-gray-800 transition-colors shadow-md"
          >
            <img src="/icons8-chrome-48.png" alt="" width="20" height="20" />
            Add to Chrome
          </a>
          {/* Firefox */}
          <a
            href={FIREFOX_STORE_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2.5 px-6 py-3 rounded-xl bg-[#FF7139] text-white font-medium hover:bg-[#e5652f] transition-colors shadow-md"
          >
            <img src="/firefox.png" alt="" width="20" height="20" className="rounded-full" />
            Add to Firefox
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
          Free forever. No account required.
        </p>
      </div>
    </section>
  );
}
