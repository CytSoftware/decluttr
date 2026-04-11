import { GITHUB_REPO_URL } from "../constants";

export function StarCTA({ stars }: { stars: number | null }) {
  return (
    <section aria-labelledby="star-cta-heading" className="py-24 px-6 bg-gradient-to-b from-white via-gray-50 to-white">
      <div className="max-w-3xl mx-auto text-center">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#f0b429]/10 text-[#b58100] text-xs font-semibold tracking-wide uppercase mb-5">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
            <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
          </svg>
          Open source
        </div>

        <h2 id="star-cta-heading" className="text-3xl sm:text-4xl font-extrabold text-gray-900 tracking-tight leading-tight">
          If Decluttr saved your tabs,
          <br />
          <span className="text-[#1A2A3A]">save us a star.</span>
        </h2>
        <p className="mt-4 text-gray-500 text-base sm:text-lg max-w-xl mx-auto">
          Decluttr is free and built in the open. A GitHub star is the fastest way to say thanks and help more people find it.
        </p>

        <a
          href={GITHUB_REPO_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-8 inline-flex items-stretch rounded-xl overflow-hidden bg-gray-900 text-white shadow-lg shadow-gray-900/20 hover:shadow-xl hover:shadow-gray-900/30 hover:-translate-y-0.5 transition-all"
          aria-label={stars !== null ? `Star Decluttr on GitHub, currently ${stars} stars` : "Star Decluttr on GitHub"}
        >
          <span className="inline-flex items-center gap-2.5 px-6 py-4 font-semibold text-base">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
              <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844a9.59 9.59 0 012.504.337c1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.02 10.02 0 0022 12.017C22 6.484 17.522 2 12 2z" />
            </svg>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" className="text-[#f0b429]" aria-hidden="true">
              <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
            </svg>
            Star on GitHub
          </span>
          <span className="inline-flex items-center px-6 py-4 bg-white text-gray-900 font-extrabold text-base tabular-nums border-l border-gray-900/20 min-w-[4rem] justify-center">
            {stars !== null ? stars.toLocaleString() : "–"}
          </span>
        </a>

        <p className="mt-6 text-xs text-gray-400">
          Live count from GitHub &middot; Updates on every page load
        </p>
      </div>
    </section>
  );
}
