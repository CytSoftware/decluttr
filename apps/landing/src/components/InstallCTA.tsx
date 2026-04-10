import { CHROME_STORE_URL, FIREFOX_STORE_URL } from "../constants";

export function InstallCTA() {
  return (
    <section id="install" className="py-28 px-6">
      <div className="max-w-3xl mx-auto">
        <div className="bg-gray-900 rounded-3xl px-8 sm:px-14 py-14 text-center relative overflow-hidden">
          {/* Teal accent glow */}
          <div className="absolute -top-24 -right-24 w-64 h-64 rounded-full bg-[#30B8B0]/20 blur-3xl" />
          <div className="absolute -bottom-16 -left-16 w-48 h-48 rounded-full bg-[#30B8B0]/15 blur-3xl" />

          <div className="relative">
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white mb-4">
              Your tabs aren't going
              <br />to close themselves
            </h2>
            <p className="text-lg text-gray-400 mb-8">
              Install Decluttr and start swiping.
            </p>
            <div className="flex items-center justify-center gap-3 flex-wrap">
              <a
                href={CHROME_STORE_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2.5 px-7 py-3.5 rounded-full bg-[#30B8B0] text-white font-semibold text-[15px] hover:bg-[#28A09A] transition-all shadow-lg shadow-[#30B8B0]/30"
              >
                <img src="/icons8-chrome-48.png" alt="" width="20" height="20" />
                Add to Chrome
              </a>
              <a
                href={FIREFOX_STORE_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2.5 px-7 py-3.5 rounded-full bg-white/10 text-white font-semibold text-[15px] border border-white/10 hover:bg-white/15 transition-all"
              >
                <img src="/firefox.png" alt="" width="20" height="20" className="rounded-full" />
                Add to Firefox
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
