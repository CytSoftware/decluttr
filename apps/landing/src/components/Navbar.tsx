import { useEffect, useState } from "react";
import { GITHUB_REPO_URL } from "../constants";

const NAV_LINKS = [
  { href: "#how-it-works", label: "How it works" },
  { href: "#features", label: "Features" },
  { href: "#faq", label: "FAQ" },
];

export function Navbar({ stars }: { stars: number | null }) {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open]);

  const close = () => setOpen(false);

  return (
    <nav aria-label="Primary" className="fixed top-0 left-0 right-0 bg-white/85 backdrop-blur-lg border-b border-[#30B8B0]/10 z-50">
      <div className="max-w-6xl mx-auto px-6 h-14 flex items-center justify-between gap-6">
        <a href="/" className="flex items-center gap-2 shrink-0">
          <img src="/decluttr-icon-only.svg" alt="" className="h-7" />
          <img src="/decluttr-wordmark.svg" alt="Decluttr" className="h-4 hidden sm:block" />
        </a>

        <div className="hidden md:flex items-center gap-8 text-sm font-medium text-gray-600">
          {NAV_LINKS.map((link) => (
            <a key={link.href} href={link.href} className="hover:text-gray-900 transition-colors">
              {link.label}
            </a>
          ))}
        </div>

        <div className="hidden md:flex items-center gap-3">
          <a
            href={GITHUB_REPO_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-gray-400 hover:text-gray-700 transition-colors text-sm"
            aria-label="View Decluttr on GitHub"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
              <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844a9.59 9.59 0 012.504.337c1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.02 10.02 0 0022 12.017C22 6.484 17.522 2 12 2z" />
            </svg>
            {stars !== null && (
              <span className="text-xs font-medium text-gray-400">{stars.toLocaleString()}</span>
            )}
          </a>
          <a
            href="#install"
            className="px-4 py-1.5 rounded-lg bg-[#30B8B0] text-white text-sm font-semibold hover:bg-[#28A09A] transition-colors"
          >
            Install
          </a>
        </div>

        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          className="md:hidden w-10 h-10 -mr-2 flex items-center justify-center text-gray-700 hover:text-gray-900"
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
          aria-controls="mobile-menu"
        >
          {open ? (
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="M18 6L6 18M6 6l12 12" /></svg>
          ) : (
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="M3 6h18M3 12h18M3 18h18" /></svg>
          )}
        </button>
      </div>

      {open && (
        <div
          id="mobile-menu"
          className="md:hidden absolute top-14 inset-x-0 bg-white border-b border-gray-100 shadow-lg"
        >
          <div className="px-6 py-6 flex flex-col gap-1">
            {NAV_LINKS.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={close}
                className="px-2 py-3 text-base font-medium text-gray-700 hover:text-gray-900 border-b border-gray-100 last:border-0"
              >
                {link.label}
              </a>
            ))}
            <div className="flex items-center gap-3 pt-4 mt-2 border-t border-gray-100">
              <a
                href={GITHUB_REPO_URL}
                target="_blank"
                rel="noopener noreferrer"
                onClick={close}
                className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg border border-gray-200 text-gray-700 text-sm font-semibold hover:bg-gray-50"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                  <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844a9.59 9.59 0 012.504.337c1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.02 10.02 0 0022 12.017C22 6.484 17.522 2 12 2z" />
                </svg>
                GitHub{stars !== null && ` · ${stars.toLocaleString()}`}
              </a>
              <a
                href="#install"
                onClick={close}
                className="flex-1 inline-flex items-center justify-center px-4 py-2.5 rounded-lg bg-[#30B8B0] text-white text-sm font-semibold hover:bg-[#28A09A]"
              >
                Install
              </a>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
