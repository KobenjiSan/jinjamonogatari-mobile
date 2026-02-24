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

// Matches HistoryReadDto
export type HistoryReadApi = {
  historyId: number;
  eventDate: string; // DateOnly serializes as "YYYY-MM-DD"
  sortOrder: number;
  title: string;
  information?: string | null;
  image?: ImageCitedApi | null;
  citations: CitationApi[];
};

/* =========================
 * Request
 * ========================= */

// GET /api/shrines/{slug}/history
export async function fetchShrineHistoryBySlug(
  slug: string,
): Promise<HistoryReadApi[]> {
  return getJson<HistoryReadApi[]>(
    `/api/shrines/${encodeURIComponent(slug)}/history`,
  );
}