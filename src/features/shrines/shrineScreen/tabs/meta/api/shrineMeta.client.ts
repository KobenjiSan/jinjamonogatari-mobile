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

export type AddressApi = {
  addressRaw?: string | null;
  prefecture?: string | null;
  city?: string | null;
  ward?: string | null;
  locality?: string | null;
  postalCode?: string | null;
  country?: string | null;
};

export type TagApi = {
  tagId: number;
  titleEn: string;
  titleJp?: string | null;
};

// Matches ShrineMetaDto
export type ShrineMetaApi = {
  shrineId: number;
  slug: string;

  nameEn?: string | null;
  nameJp?: string | null;
  shrineDesc?: string | null;

  address?: AddressApi | null;

  phoneNumber?: string | null;
  email?: string | null;
  website?: string | null;

  imageUrl?: string | null;

  tags: TagApi[];
};

/* =========================
 * Request
 * ========================= */

// GET /api/shrines/{slug}/meta
export async function fetchShrineMetaBySlug(slug: string): Promise<ShrineMetaApi> {
  return getJson<ShrineMetaApi>(`/api/shrines/${encodeURIComponent(slug)}/meta`);
}