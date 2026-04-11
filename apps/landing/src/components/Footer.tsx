import {
  GITHUB_REPO_URL,
  SUPPORT_EMAIL,
  PRIVACY_URL,
  CHROME_STORE_URL,
  FIREFOX_STORE_URL,
} from "../constants";

export function Footer() {
  return (
    <footer role="contentinfo" className="bg-[#1A2A3A] py-10 px-6">
      <div className="max-w-5xl mx-auto flex flex-col items-center gap-4 text-sm text-gray-400">
        <p className="text-xs text-gray-500 tracking-wide uppercase">
          Open source &middot; MIT licensed &middot; Made by CytSoftware
        </p>
        <div className="w-full flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <img src="/decluttr-icon-only.svg" alt="" className="h-5 opacity-60" />
            <span>&copy; {new Date().getFullYear()} CytSoftware</span>
          </div>
          <nav aria-label="Footer" className="flex items-center gap-5 flex-wrap justify-center">
            <a href={CHROME_STORE_URL} target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">Chrome</a>
            <a href={FIREFOX_STORE_URL} target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">Firefox</a>
            <a href={GITHUB_REPO_URL} target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">GitHub</a>
            <a href="#faq" className="hover:text-white transition-colors">FAQ</a>
            <a href={PRIVACY_URL} target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">Privacy</a>
            <a href={`mailto:${SUPPORT_EMAIL}`} className="hover:text-white transition-colors">{SUPPORT_EMAIL}</a>
          </nav>
        </div>
      </div>
    </footer>
  );
}
