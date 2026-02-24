const API_BASE = process.env.EXPO_PUBLIC_API_BASE;

async function getJson<T>(path: string): Promise<T> {
  if (!API_BASE) {
    throw new Error("EXPO_PUBLIC_API_BASE is not set");
  }

  const res = await fetch(`${API_BASE}${path}`);

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`GET ${path} failed (${res.status}): ${text}`);
  }

  return (await res.json()) as T;
}

/* =========================
 * API DTOs (match your C#)
 * ========================= */

export type TagApi = {
  tagId: number;
  titleEn: string;
  titleJp?: string | null;
};

export type ShrinePreviewApi = {
  shrineId: number;
  slug: string;
  nameEn?: string | null;
  nameJp?: string | null;
  imageUrl?: string | null;
  shrineDesc?: string | null;
  tags: TagApi[];
};

/* =========================
 * Requests
 * ========================= */

// GET /api/shrines/map/{slug}
export async function fetchShrinePreviewBySlug(
  slug: string,
): Promise<ShrinePreviewApi> {
  return getJson<ShrinePreviewApi>(`/api/shrines/map/${encodeURIComponent(slug)}`);
}