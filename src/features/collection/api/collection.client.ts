import { apiFetch } from "../../../core/api/client";

/**
 * Shapes (matching your C# records)
 */
export type GetIsShrineInCollectionResult = {
  isSaved: boolean;
};

export type TagDto = {
  tagId: number;
  titleEn: string;
  titleJp?: string | null;
};

export type ShrinePreviewDto = {
  shrineId: number;
  slug: string;
  nameEn?: string | null;
  nameJp?: string | null;
  imageUrl?: string | null;
  shrineDesc?: string | null;
  distanceMeters?: number | null;
  tags: TagDto[];
};

export type GetShrineCollectionCardsResult = {
  cards: ShrinePreviewDto[];
};

export type GetShrineCollectionIdsResult = {
  shrineIds: number[];
};

/**
 * Endpoints
 */
const BASE = "/api/users/me/collection";

// GET /api/users/me/collection/ids
export async function getShrineCollectionIds() {
  const res = await apiFetch(`${BASE}/ids`);
  return res as GetShrineCollectionIdsResult;
}

// GET /api/users/me/collection/cards?lat=...&lon=...&q=...
export async function getShrineCollectionCards(
  lat?: number | null,
  lon?: number | null,
  q?: string | null
) {
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
  const res = await apiFetch(`${BASE}/cards${qs ? `?${qs}` : ""}`);
  return res as GetShrineCollectionCardsResult;
}

// GET /api/users/me/collection/{shrineId}
export async function isShrineInCollection(shrineId: number) {
  const res = await apiFetch(`${BASE}/${shrineId}`);
  return res as GetIsShrineInCollectionResult;
}

// POST /api/users/me/collection/{shrineId}
export async function addShrineToCollection(shrineId: number) {
  await apiFetch(`${BASE}/${shrineId}`, { method: "POST" });
}

// DELETE /api/users/me/collection/{shrineId}
export async function removeShrineFromCollection(shrineId: number) {
  await apiFetch(`${BASE}/${shrineId}`, { method: "DELETE" });
}