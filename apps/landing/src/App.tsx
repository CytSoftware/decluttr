import { Route, Routes } from "react-router-dom";
import { Navbar } from "./components/Navbar";
import { Footer } from "./components/Footer";
import { Landing } from "./pages/Landing";
import { BlogList } from "./pages/BlogList";
import { BlogPost } from "./pages/BlogPost";
import { useGitHubStars } from "./hooks/useGitHubStars";

export function App() {
  const stars = useGitHubStars();

  return (
    <div className="min-h-screen bg-white overflow-x-hidden flex flex-col">
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-[100] focus:px-4 focus:py-2 focus:rounded-lg focus:bg-[#30B8B0] focus:text-white focus:font-semibold focus:shadow-lg"
      >
        Skip to content
      </a>
      <Navbar stars={stars} />
      <div className="flex-1">
        <Routes>
          <Route path="/" element={<Landing stars={stars} />} />
          <Route path="/blog" element={<BlogList />} />
          <Route path="/blog/:slug" element={<BlogPost />} />
        </Routes>
      </div>
      <Footer />
    </div>
  );
}
