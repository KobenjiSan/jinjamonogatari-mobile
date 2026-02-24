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

export type ShrineMapPointApi = {
  shrineId: number;
  slug: string;
  lat: number;
  lon: number;
};

/* =========================
 * Requests
 * ========================= */

export async function fetchShrineMapPoints(): Promise<
  ShrineMapPointApi[]
> {
  return getJson<ShrineMapPointApi[]>("/api/shrines/map");
}