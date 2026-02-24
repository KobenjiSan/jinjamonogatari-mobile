const API_BASE = process.env.EXPO_PUBLIC_API_BASE;

async function getJson<T>(path: string): Promise<T> {
  if (!API_BASE) throw new Error("EXPO_PUBLIC_API_BASE is not set");

  const res = await fetch(`${API_BASE}${path}`);
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`GET ${path} failed (${res.status}): ${text}`);
  }

  return (await res.json()) as T;
}

/* =========================
 * API DTOs (match C#)
 * ========================= */

export type CitationApi = {
  citeId: number;
  title?: string | null;
  author?: string | null;
  url?: string | null;
  year?: number | null;
};

export type ImageCitedApi = {
  imageUrl?: string | null;
  citation?: CitationApi | null;
};

export type KamiReadApi = {
  kamiId: number;
  nameEn?: string | null;
  nameJp?: string | null;
  desc?: string | null;
  image?: ImageCitedApi | null;
  citations: CitationApi[];
};

/* =========================
 * Request
 * ========================= */

// GET /api/shrines/{slug}/kami
export async function fetchShrineKamiBySlug(slug: string): Promise<KamiReadApi[]> {
  return getJson<KamiReadApi[]>(`/api/shrines/${encodeURIComponent(slug)}/kami`);
}