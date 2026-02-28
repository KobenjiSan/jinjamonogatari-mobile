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

export type ShrinePreview = {
  shrineId: number;
  slug: string;
  lat?: number | null;
  lon?: number | null;
  nameEn?: string | null;
  nameJp?: string | null;
  imageUrl?: string | null;
  shrineDesc?: string | null;
  distanceMeters?: number | null;
  tags: TagApi[];
};

/* =========================
 * Requests
 * ========================= */

// GET /api/shrines/map/{slug}?lat=...&lon=...
export async function fetchShrinePreviewBySlug(
  slug: string,
  lat?: number | null,
  lon?: number | null
): Promise<ShrinePreview> {
  const qs =
    typeof lat === "number" && typeof lon === "number"
      ? `?lat=${encodeURIComponent(lat)}&lon=${encodeURIComponent(lon)}`
      : "";

  return getJson<ShrinePreview>(
    `/api/shrines/map/${encodeURIComponent(slug)}${qs}`
  );
}