/**
 * Shrine data mappers
 *
 * This file contains pure transformation functions that convert raw shrine
 * data (from fixtures or API responses) into UI-friendly models used by
 * mobile screens and components.
 *
 * Why this exists:
 * - Keeps data-shaping logic out of route files and screen components
 * - Allows the data source to change (test.json → ASP.NET API)
 *   without rewriting UI code
 * - Centralizes assumptions about how shrine images and metadata
 *   are combined for display
 *
 * These functions:
 * - Have no side effects
 * - Do not perform network requests
 * - Can be reused by list, map, and saved-shrines features
 */

export type Shrine = {
  shrine_id: number;
  slug: string;
  name_en?: string | null;
  name_jp?: string | null;
  shrine_desc?: string | null;
  img_id?: number | null;
};

export type ShrineImage = {
  img_id: number;
  img_source: string;
};

export type ShrineCardModel = Shrine & {
  imageUrl?: string | null;
};

export function toShrineCardModels(
  shrines: Shrine[],
  images: ShrineImage[]
): ShrineCardModel[] {
  const imagesById = new Map<number, string>(
    images.map((img) => [img.img_id, img.img_source])
  );

  return shrines.map((s) => ({
    ...s,
    imageUrl: s.img_id ? imagesById.get(s.img_id) ?? null : null,
  }));
}

export type Tag = {
  tag_id: number;
  title_en: string;
  title_jp?: string | null;
};

export type ShrineTag = {
  shrine_id: number;
  tag_id: number;
};

export type ShrinePreviewModel = ShrineCardModel & {
  tags: Tag[];
};

export function toShrinePreviewModels(
  shrines: Shrine[],
  images: ShrineImage[],
  tags: Tag[],
  shrineTags: ShrineTag[]
): ShrinePreviewModel[] {
  const imagesById = new Map<number, string>(
    images.map((img) => [img.img_id, img.img_source])
  );

  const tagsById = new Map<number, Tag>(tags.map((t) => [t.tag_id, t]));

  const tagIdsByShrineId = new Map<number, number[]>();
  for (const st of shrineTags) {
    const arr = tagIdsByShrineId.get(st.shrine_id) ?? [];
    arr.push(st.tag_id);
    tagIdsByShrineId.set(st.shrine_id, arr);
  }

  return shrines.map((s) => {
    const imageUrl = s.img_id ? imagesById.get(s.img_id) ?? null : null;
    const tagIds = tagIdsByShrineId.get(s.shrine_id) ?? [];
    const shrineTagsResolved = tagIds
      .map((id) => tagsById.get(id))
      .filter(Boolean) as Tag[];

    return {
      ...s,
      imageUrl,
      tags: shrineTagsResolved,
    };
  });
}