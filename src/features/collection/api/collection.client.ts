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

// GET /api/users/me/collection/cards
export async function getShrineCollectionCards(
  lat?: number | null,
  lon?: number | null
) {
  const qs =
    typeof lat === "number" && typeof lon === "number"
      ? `?lat=${encodeURIComponent(lat)}&lon=${encodeURIComponent(lon)}`
      : "";

  const res = await apiFetch(`${BASE}/cards${qs}`);
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