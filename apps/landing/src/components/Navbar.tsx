export function Navbar() {
  return (
    <nav className="fixed top-0 left-0 right-0 bg-surface/80 backdrop-blur-md border-b border-border z-50">
      <div className="max-w-5xl mx-auto px-6 h-14 flex items-center justify-between">
        <a href="/" className="text-lg font-bold text-text-primary">
          Decluttr
        </a>
        <a
          href="#install"
          className="px-4 py-1.5 rounded-lg bg-primary text-white text-sm font-medium hover:bg-primary-dark transition-colors"
        >
          Install
        </a>
      </div>
    </nav>
  );
}
