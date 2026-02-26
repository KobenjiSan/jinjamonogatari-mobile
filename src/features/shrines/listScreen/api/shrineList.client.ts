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
 * API DTOs
 * ========================= */

// Matches ShrineCardDto
export type ShrineCard = {
  shrineId: number;
  slug: string;
  nameEn?: string | null;
  nameJp?: string | null;
  imageUrl?: string | null;
  distanceMeters?: number | null;
};

/* =========================
 * Requests
 * ========================= */

// GET /api/shrines/list-view?lat=...&lon=...
export async function fetchShrineListView(
  lat?: number | null,
  lon?: number | null
): Promise<ShrineCard[]> {
  const qs =
    typeof lat === "number" && typeof lon === "number"
      ? `?lat=${encodeURIComponent(lat)}&lon=${encodeURIComponent(lon)}`
      : "";

  return getJson<ShrineCard[]>(`/api/shrines/list-view${qs}`);
}