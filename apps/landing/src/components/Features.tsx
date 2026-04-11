export function Features() {
  return (
    <section id="features" aria-labelledby="features-heading" className="scroll-mt-20 py-28 px-6 bg-white">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-14">
          <h2 id="features-heading" className="text-3xl sm:text-4xl font-extrabold text-gray-900 tracking-tight">
            Built for people with too many tabs
          </h2>
          <p className="mt-3 text-gray-500 text-lg">Every feature earns its place.</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <div className="sm:col-span-2 bg-gray-50 rounded-2xl p-7 border border-gray-100">
            <h3 className="text-lg font-bold text-gray-900 mb-2">Every window, one deck</h3>
            <p className="text-gray-500 leading-relaxed">
              Tabs from every browser window merge into a single swipe session. Each card shows which window it came from, so you never lose context.
            </p>
          </div>

          <div className="row-span-2 bg-gray-50 rounded-2xl p-7 border border-gray-100 flex flex-col justify-between">
            <div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">Keyboard-first</h3>
              <p className="text-gray-500 leading-relaxed mb-6">
                Blaze through a deck without touching the mouse.
              </p>
            </div>
            <div className="flex flex-col gap-2.5">
              {[
                { keys: "← →", label: "Close / Keep" },
                { keys: "↑", label: "Save for later" },
                { keys: "U", label: "Undo last" },
                { keys: "⌘Z", label: "Undo last" },
              ].map((k) => (
                <div key={k.keys} className="flex items-center gap-3">
                  <kbd className="px-2.5 py-1 bg-[#30B8B0]/10 rounded-lg text-sm font-mono text-[#1E8A84] font-semibold border border-[#30B8B0]/15 min-w-[48px] text-center">
                    {k.keys}
                  </kbd>
                  <span className="text-sm text-gray-400">{k.label}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-gray-50 rounded-2xl p-7 border border-gray-100">
            <h3 className="text-lg font-bold text-gray-900 mb-2">Stale tabs first</h3>
            <p className="text-gray-500 leading-relaxed">
              Sorted by last accessed. The tabs you forgot about weeks ago surface first, where the easy calls are.
            </p>
          </div>

          <div className="bg-gray-50 rounded-2xl p-7 border border-gray-100">
            <h3 className="text-lg font-bold text-gray-900 mb-2">Undo any swipe</h3>
            <p className="text-gray-500 leading-relaxed">
              Swiped too fast? Pull the last card back instantly. Full undo stack until you confirm the session.
            </p>
          </div>

          <div className="sm:col-span-2 bg-gray-50 rounded-2xl p-7 border border-gray-100">
            <h3 className="text-lg font-bold text-gray-900 mb-2">Save for later</h3>
            <p className="text-gray-500 leading-relaxed">
              Not ready to close it, but don't need it open? Swipe up. Saved tabs live in local storage, grouped by domain, and reopen with one click.
            </p>
          </div>

          <div className="bg-gray-50 rounded-2xl p-7 border border-gray-100">
            <h3 className="text-lg font-bold text-gray-900 mb-2">Session summary</h3>
            <p className="text-gray-500 leading-relaxed">
              Every swipe lands in a final review. Rescue anything you second-guessed before anything actually closes.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
