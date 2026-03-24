export function Footer() {
  return (
    <footer className="border-t border-border py-8 px-6">
      <div className="max-w-5xl mx-auto flex items-center justify-between text-sm text-text-muted">
        <span>&copy; {new Date().getFullYear()} CytSoftware. All rights reserved.</span>
        <div className="flex items-center gap-4">
          <a href="#" className="hover:text-text-secondary transition-colors">
            GitHub
          </a>
          <a href="#" className="hover:text-text-secondary transition-colors">
            Privacy
          </a>
        </div>
      </div>
    </footer>
  );
}
