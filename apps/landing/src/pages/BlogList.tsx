import { useEffect, useState } from "react";
import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import { getPosts, ghostConfigured, type GhostPost } from "../lib/ghost";

type Status = "loading" | "ready" | "error";

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

export function BlogList() {
  const [status, setStatus] = useState<Status>("loading");
  const [posts, setPosts] = useState<GhostPost[]>([]);

  useEffect(() => {
    if (!ghostConfigured) {
      setStatus("ready");
      setPosts([]);
      return;
    }
    let cancelled = false;
    getPosts()
      .then((data) => {
        if (cancelled) return;
        setPosts(data);
        setStatus("ready");
      })
      .catch(() => {
        if (cancelled) return;
        setStatus("error");
      });
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <main id="main" className="min-h-screen bg-white pt-28 pb-24 px-6">
      <Helmet>
        <title>Blog — Decluttr</title>
        <meta
          name="description"
          content="Tips, updates, and writing from the Decluttr team on browser productivity, tab overload, and open source."
        />
        <link rel="canonical" href="https://getdecluttr.app/blog" />
        <meta property="og:title" content="Decluttr Blog" />
        <meta
          property="og:description"
          content="Tips, updates, and writing from the Decluttr team."
        />
        <meta property="og:url" content="https://getdecluttr.app/blog" />
        <meta property="og:type" content="website" />
        <meta name="twitter:title" content="Decluttr Blog" />
        <meta
          name="twitter:description"
          content="Tips, updates, and writing from the Decluttr team."
        />
      </Helmet>

      <div className="max-w-5xl mx-auto">
        <header className="text-center mb-14">
          <h1 className="text-4xl sm:text-5xl font-extrabold text-gray-900 tracking-tight">
            Blog
          </h1>
          <p className="mt-3 text-gray-500 text-lg max-w-2xl mx-auto">
            Tips, updates, and writing from the Decluttr team on browser
            productivity and the fight against tab overload.
          </p>
        </header>

        {status === "loading" && (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {[0, 1, 2].map((i) => (
              <div
                key={i}
                className="rounded-2xl border border-gray-200 bg-gray-50 h-80 animate-pulse"
              />
            ))}
          </div>
        )}

        {status === "error" && (
          <p className="text-center text-gray-500">
            We couldn't load the blog right now. Please try again in a moment.
          </p>
        )}

        {status === "ready" && posts.length === 0 && (
          <div className="text-center py-16">
            <p className="text-gray-500 text-lg">
              No posts yet. Check back soon.
            </p>
            <Link
              to="/"
              className="inline-flex items-center gap-1.5 mt-6 text-sm font-semibold text-[#30B8B0] hover:underline"
            >
              ← Back home
            </Link>
          </div>
        )}

        {status === "ready" && posts.length > 0 && (
          <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {posts.map((post) => (
              <li key={post.id}>
                <Link
                  to={`/blog/${post.slug}`}
                  className="group block h-full rounded-2xl border border-gray-200 bg-white overflow-hidden hover:border-[#30B8B0]/60 hover:shadow-lg transition-all"
                >
                  {post.feature_image ? (
                    <div className="aspect-[16/9] bg-gray-100 overflow-hidden">
                      <img
                        src={post.feature_image}
                        alt={post.feature_image_alt ?? ""}
                        loading="lazy"
                        className="w-full h-full object-cover group-hover:scale-[1.02] transition-transform duration-300"
                      />
                    </div>
                  ) : (
                    <div className="aspect-[16/9] bg-gradient-to-br from-[#EDF4F8] to-[#30B8B0]/10" />
                  )}
                  <div className="p-6 flex flex-col gap-3">
                    <h2 className="text-lg font-semibold text-gray-900 leading-snug group-hover:text-[#30B8B0] transition-colors line-clamp-2">
                      {post.title}
                    </h2>
                    {post.excerpt && (
                      <p className="text-sm text-gray-500 leading-relaxed line-clamp-3">
                        {post.excerpt}
                      </p>
                    )}
                    <div className="flex items-center gap-3 text-xs text-gray-400 mt-auto pt-2">
                      <time dateTime={post.published_at}>
                        {formatDate(post.published_at)}
                      </time>
                      {post.reading_time > 0 && (
                        <>
                          <span aria-hidden="true">·</span>
                          <span>{post.reading_time} min read</span>
                        </>
                      )}
                    </div>
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </div>
    </main>
  );
}
