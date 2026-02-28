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

// GET /api/shrines/list-view?lat=...&lon=...&q=...
export async function fetchShrineListView(
  lat?: number | null,
  lon?: number | null,
  q?: string | null
): Promise<ShrineCard[]> {
  const params = new URLSearchParams();

  if (typeof lat === "number" && typeof lon === "number") {
    params.set("lat", String(lat));
    params.set("lon", String(lon));
  }

  const trimmed = (q ?? "").trim();
  if (trimmed.length > 0) {
    params.set("q", trimmed);
  }

  const qs = params.toString();
  return getJson<ShrineCard[]>(`/api/shrines/list-view${qs ? `?${qs}` : ""}`);
}