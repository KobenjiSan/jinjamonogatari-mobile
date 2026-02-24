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

// Matches GalleryListItemDto
export type GalleryListItemApi = {
  imgId: number;
  imageUrl: string;
};

/* =========================
 * Request
 * ========================= */

// GET /api/shrines/{slug}/gallery
export async function fetchShrineGalleryBySlug(
  slug: string,
): Promise<GalleryListItemApi[]> {
  return getJson<GalleryListItemApi[]>(
    `/api/shrines/${encodeURIComponent(slug)}/gallery`,
  );
}