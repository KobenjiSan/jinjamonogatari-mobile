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

// Matches ImageFullDto
export type ImageFullApi = {
  imgId: number;
  imageUrl?: string | null;
  title?: string | null;
  desc?: string | null;
  citation?: CitationApi | null;
};

/* =========================
 * Request
 * ========================= */

// GET /api/shrines/image/{id}
export async function fetchImageById(id: number): Promise<ImageFullApi> {
  return getJson<ImageFullApi>(`/api/shrines/image/${id}`);
}