export function Stats() {
  return (
    <section className="relative -mt-16 z-10 px-6">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-2xl shadow-[0_4px_32px_rgba(0,0,0,0.08)] border border-gray-100 grid grid-cols-3 divide-x divide-gray-100">
          <div className="py-8 px-4 text-center">
            <div className="text-3xl sm:text-4xl font-extrabold text-[#30B8B0]">&lt;60s</div>
            <p className="text-sm text-gray-500 mt-1">to clean 50 tabs</p>
          </div>
          <div className="py-8 px-4 text-center">
            <div className="text-3xl sm:text-4xl font-extrabold text-[#30B8B0]">3</div>
            <p className="text-sm text-gray-500 mt-1">swipe directions</p>
          </div>
          <div className="py-8 px-4 text-center">
            <div className="text-3xl sm:text-4xl font-extrabold text-[#30B8B0]">0</div>
            <p className="text-sm text-gray-500 mt-1">data collected</p>
          </div>
        </div>
      </div>
    </section>
  );
}
