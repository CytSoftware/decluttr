import { useEffect, useState } from "react";
import { Helmet } from "react-helmet-async";
import { Link, useParams } from "react-router-dom";
import { getPost, ghostConfigured, type GhostPost } from "../lib/ghost";

type Status = "loading" | "ready" | "not_found" | "error";

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export function BlogPost() {
  const { slug = "" } = useParams();
  const [status, setStatus] = useState<Status>("loading");
  const [post, setPost] = useState<GhostPost | null>(null);

  useEffect(() => {
    if (!ghostConfigured) {
      setStatus("not_found");
      return;
    }
    setStatus("loading");
    let cancelled = false;
    getPost(slug)
      .then((data) => {
        if (cancelled) return;
        if (!data) {
          setStatus("not_found");
          return;
        }
        setPost(data);
        setStatus("ready");
      })
      .catch(() => {
        if (cancelled) return;
        setStatus("error");
      });
    return () => {
      cancelled = true;
    };
  }, [slug]);

  useEffect(() => {
    if (status === "ready") window.scrollTo(0, 0);
  }, [status]);

  if (status === "loading") {
    return (
      <main id="main" className="min-h-screen bg-white pt-28 pb-24 px-6">
        <div className="max-w-3xl mx-auto space-y-6">
          <div className="h-10 bg-gray-100 rounded animate-pulse w-3/4" />
          <div className="h-4 bg-gray-100 rounded animate-pulse w-1/3" />
          <div className="aspect-[16/9] bg-gray-100 rounded-2xl animate-pulse" />
          <div className="space-y-3">
            <div className="h-4 bg-gray-100 rounded animate-pulse" />
            <div className="h-4 bg-gray-100 rounded animate-pulse" />
            <div className="h-4 bg-gray-100 rounded animate-pulse w-5/6" />
          </div>
        </div>
      </main>
    );
  }

  if (status === "not_found" || status === "error") {
    const isError = status === "error";
    return (
      <main id="main" className="min-h-screen bg-white pt-28 pb-24 px-6">
        <Helmet>
          <title>{isError ? "Something went wrong" : "Post not found"} — Decluttr</title>
          <meta name="robots" content="noindex" />
        </Helmet>
        <div className="max-w-2xl mx-auto text-center">
          <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 tracking-tight">
            {isError ? "Something went wrong" : "Post not found"}
          </h1>
          <p className="mt-4 text-gray-500">
            {isError
              ? "We couldn't load this article right now. Please try again in a moment."
              : "The article you're looking for doesn't exist or may have moved."}
          </p>
          <Link
            to="/blog"
            className="inline-flex items-center gap-1.5 mt-8 px-5 py-2.5 rounded-lg bg-[#30B8B0] text-white text-sm font-semibold hover:bg-[#28A09A] transition-colors"
          >
            ← Back to blog
          </Link>
        </div>
      </main>
    );
  }

  if (!post) return null;

  const canonical = `https://getdecluttr.app/blog/${post.slug}`;
  const ogImage = post.feature_image ?? "https://getdecluttr.app/og-image-1200x630.png";

  return (
    <main id="main" className="min-h-screen bg-white pt-28 pb-24 px-6">
      <Helmet>
        <title>{post.title} — Decluttr</title>
        <meta name="description" content={post.excerpt} />
        <link rel="canonical" href={canonical} />
        <meta property="og:type" content="article" />
        <meta property="og:title" content={post.title} />
        <meta property="og:description" content={post.excerpt} />
        <meta property="og:url" content={canonical} />
        <meta property="og:image" content={ogImage} />
        <meta property="article:published_time" content={post.published_at} />
        {post.updated_at && (
          <meta property="article:modified_time" content={post.updated_at} />
        )}
        {post.primary_author && (
          <meta property="article:author" content={post.primary_author.name} />
        )}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={post.title} />
        <meta name="twitter:description" content={post.excerpt} />
        <meta name="twitter:image" content={ogImage} />
        <script type="application/ld+json">{JSON.stringify({
          "@context": "https://schema.org",
          "@type": "BlogPosting",
          headline: post.title,
          description: post.excerpt,
          image: ogImage,
          datePublished: post.published_at,
          dateModified: post.updated_at || post.published_at,
          author: post.primary_author
            ? { "@type": "Person", name: post.primary_author.name }
            : undefined,
          publisher: {
            "@type": "Organization",
            name: "CytSoftware",
            logo: {
              "@type": "ImageObject",
              url: "https://getdecluttr.app/decluttr-icon-only.svg",
            },
          },
          mainEntityOfPage: { "@type": "WebPage", "@id": canonical },
        })}</script>
      </Helmet>

      <article className="max-w-3xl mx-auto">
        <Link
          to="/blog"
          className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-[#30B8B0] font-medium mb-8"
        >
          ← Back to blog
        </Link>

        <header className="mb-10">
          <h1 className="text-4xl sm:text-5xl font-extrabold text-gray-900 tracking-tight leading-[1.1]">
            {post.title}
          </h1>
          <div className="mt-5 flex flex-wrap items-center gap-3 text-sm text-gray-500">
            {post.primary_author && (
              <>
                <span className="flex items-center gap-2">
                  {post.primary_author.profile_image && (
                    <img
                      src={post.primary_author.profile_image}
                      alt=""
                      className="w-7 h-7 rounded-full object-cover"
                    />
                  )}
                  <span className="font-medium text-gray-700">
                    {post.primary_author.name}
                  </span>
                </span>
                <span aria-hidden="true">·</span>
              </>
            )}
            <time dateTime={post.published_at}>{formatDate(post.published_at)}</time>
            {post.reading_time > 0 && (
              <>
                <span aria-hidden="true">·</span>
                <span>{post.reading_time} min read</span>
              </>
            )}
          </div>
        </header>

        {post.feature_image && (
          <figure className="mb-10 -mx-6 sm:mx-0">
            <img
              src={post.feature_image}
              alt={post.feature_image_alt ?? ""}
              className="w-full aspect-[16/9] object-cover sm:rounded-2xl"
            />
          </figure>
        )}

        <div
          className="ghost-content"
          /* eslint-disable-next-line react/no-danger */
          dangerouslySetInnerHTML={{ __html: post.html }}
        />

        {post.tags && post.tags.length > 0 && (
          <div className="mt-12 pt-8 border-t border-gray-200 flex flex-wrap gap-2">
            {post.tags.map((tag) => (
              <span
                key={tag.slug}
                className="inline-flex items-center px-3 py-1 rounded-full bg-gray-100 text-xs font-medium text-gray-600"
              >
                #{tag.name}
              </span>
            ))}
          </div>
        )}
      </article>
    </main>
  );
}
