export function Features() {
  return (
    <section className="py-28 px-6 bg-[#30B8B0]">
      <div className="max-w-5xl mx-auto">
        <h2 className="text-3xl sm:text-4xl font-extrabold text-white text-center mb-14">
          What's inside
        </h2>

        {/* Bento grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {/* Large card */}
          <div className="sm:col-span-2 bg-white rounded-2xl p-7">
            <h3 className="text-lg font-bold text-gray-900 mb-2">Every window, one deck</h3>
            <p className="text-gray-500 leading-relaxed">
              Tabs from all your browser windows get merged into a single swipe session. Each card tells you which window it's from so you never lose context. No more switching between windows trying to figure out what's where.
            </p>
          </div>

          {/* Tall card - keyboard shortcuts */}
          <div className="row-span-2 bg-white rounded-2xl p-7 flex flex-col justify-between">
            <div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">Keyboard-first</h3>
              <p className="text-gray-500 leading-relaxed mb-6">
                Blaze through your tabs without touching the mouse.
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

          <div className="bg-white rounded-2xl p-7">
            <h3 className="text-lg font-bold text-gray-900 mb-2">Stale tabs first</h3>
            <p className="text-gray-500 leading-relaxed">
              Sorts by last accessed. The tabs you forgot about weeks ago show up first. Easy to close.
            </p>
          </div>

          <div className="bg-white rounded-2xl p-7">
            <h3 className="text-lg font-bold text-gray-900 mb-2">Duplicate detection</h3>
            <p className="text-gray-500 leading-relaxed">
              Finds tabs pointing to the same URL and flags them. Keep one, close the rest.
            </p>
          </div>

          <div className="bg-white rounded-2xl p-7">
            <h3 className="text-lg font-bold text-gray-900 mb-2">Undo any swipe</h3>
            <p className="text-gray-500 leading-relaxed">
              Swiped too fast? Bring the last card back instantly. Full undo stack until you confirm.
            </p>
          </div>

          {/* Wide card */}
          <div className="sm:col-span-2 bg-white rounded-2xl p-7">
            <h3 className="text-lg font-bold text-gray-900 mb-2">Save for later</h3>
            <p className="text-gray-500 leading-relaxed">
              Not ready to close it but don't need it open? Swipe up. Saved tabs are stored locally in your browser and grouped by domain. Reopen them anytime.
            </p>
          </div>

          <div className="bg-white rounded-2xl p-7">
            <h3 className="text-lg font-bold text-gray-900 mb-2">Session summary</h3>
            <p className="text-gray-500 leading-relaxed">
              After swiping, see exactly what you closed, kept, and saved. Rescue any tab before confirming.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
