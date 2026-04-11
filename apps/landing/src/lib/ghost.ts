export interface GhostAuthor {
  name: string;
  slug: string;
  profile_image: string | null;
}

export interface GhostTag {
  name: string;
  slug: string;
}

export interface GhostPost {
  id: string;
  slug: string;
  title: string;
  html: string;
  excerpt: string;
  feature_image: string | null;
  feature_image_alt: string | null;
  published_at: string;
  updated_at: string;
  reading_time: number;
  primary_author?: GhostAuthor;
  tags?: GhostTag[];
}

const GHOST_URL = import.meta.env.VITE_GHOST_URL;
const GHOST_KEY = import.meta.env.VITE_GHOST_CONTENT_API_KEY;
const GHOST_TAG = import.meta.env.VITE_GHOST_TAG ?? "decluttr";

export const ghostConfigured = Boolean(GHOST_URL && GHOST_KEY);

async function ghostFetch(path: string): Promise<any | null> {
  if (!ghostConfigured) return null;
  const separator = path.includes("?") ? "&" : "?";
  const url = `${GHOST_URL}/ghost/api/content/${path}${separator}key=${GHOST_KEY}`;
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Ghost API error: ${res.status}`);
  return res.json();
}

export async function getPosts(): Promise<GhostPost[]> {
  const data = await ghostFetch(
    `posts/?filter=tag:${encodeURIComponent(GHOST_TAG)}&include=tags,authors&fields=id,slug,title,excerpt,feature_image,feature_image_alt,published_at,updated_at,reading_time&order=published_at%20desc&limit=all`
  );
  return data?.posts ?? [];
}

export async function getPost(slug: string): Promise<GhostPost | null> {
  const data = await ghostFetch(
    `posts/slug/${encodeURIComponent(slug)}/?include=tags,authors`
  );
  return data?.posts?.[0] ?? null;
}
