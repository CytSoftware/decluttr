import { GITHUB_REPO_URL, PRIVACY_URL } from "../constants";

export function OpenSource({ stars }: { stars: number | null }) {
  return (
    <section aria-labelledby="opensource-heading" className="py-28 px-6 bg-gray-50">
      <div className="max-w-5xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left - big statement */}
          <div>
            <div className="inline-block px-3 py-1 rounded-full bg-[#30B8B0]/10 text-[#30B8B0] text-xs font-semibold mb-4 tracking-wide uppercase">
              Open source
            </div>
            <h2 id="opensource-heading" className="text-3xl sm:text-4xl font-extrabold text-gray-900 mb-4 leading-tight tracking-tight">
              MIT-licensed.
              <br />
              Zero telemetry.
              <br />
              Yours to fork.
            </h2>
            <p className="text-gray-500 leading-relaxed mb-6 max-w-md text-lg">
              Every line ships on GitHub. No accounts, no servers, no tracking. Audit it, build it, fork it.
            </p>
            <div className="flex items-center gap-4">
              <a
                href={GITHUB_REPO_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-gray-900 text-white text-sm font-semibold hover:bg-gray-800 transition-colors"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844a9.59 9.59 0 012.504.337c1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.02 10.02 0 0022 12.017C22 6.484 17.522 2 12 2z" />
                </svg>
                View on GitHub
                {stars !== null && (
                  <span className="bg-white/20 px-2 py-0.5 rounded-full text-xs">{stars.toLocaleString()}</span>
                )}
              </a>
              <a href={PRIVACY_URL} target="_blank" rel="noopener noreferrer" className="text-sm text-gray-400 hover:text-[#30B8B0] transition-colors">
                Privacy policy
              </a>
            </div>
          </div>

          {/* Right - checklist card */}
          <div className="bg-white rounded-2xl p-8 shadow-[0_4px_32px_rgba(0,0,0,0.06)] border border-gray-100">
            <h3 className="font-bold text-gray-900 mb-6 text-lg">The privacy checklist</h3>
            {[
              "No data collection of any kind",
              "No external network requests",
              "No accounts or sign-up",
              "No analytics or telemetry",
              "All storage is local to your browser",
              "MIT license, do whatever you want",
            ].map((item) => (
              <div key={item} className="flex items-center gap-3 py-3 border-b border-gray-50 last:border-0">
                <div className="w-6 h-6 rounded-full bg-[#30B8B0]/10 flex items-center justify-center flex-shrink-0">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#30B8B0" strokeWidth="3" strokeLinecap="round">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                </div>
                <span className="text-[15px] text-gray-700">{item}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
