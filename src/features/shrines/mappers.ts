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
function isDefined<T>(v: T | null | undefined): v is T {
  return v !== null && v !== undefined;
}

export type Shrine = {
  shrine_id: number;
  slug: string;
  lat?: number | null;
  lon?: number | null;
  name_en?: string | null;
  name_jp?: string | null;
  shrine_desc?: string | null;
  address_raw?: string | null;
  prefecture?: string | null;
  city?: string | null;
  ward?: string | null;
  locality?: string | null;
  postal_code?: string | null;
  country?: string | null;
  phone_number?: string | null;
  email?: string | null;
  website?: string | null;
  img_id?: number | null;
};

export type ShrineImage = {
  img_id: number;
  img_source: string;
  cite_id?: number | null;
};

export type ShrineCardModel = Shrine & {
  imageUrl?: string | null;
};

export function toShrineCardModels(
  shrines: Shrine[],
  images: ShrineImage[],
): ShrineCardModel[] {
  const imagesById = new Map<number, string>(
    images.map((img) => [img.img_id, img.img_source]),
  );

  return shrines.map((s) => ({
    ...s,
    imageUrl: s.img_id ? (imagesById.get(s.img_id) ?? null) : null,
  }));
}

export type Citation = {
  cite_id: number;
  title: string;
  author?: string | null;
  url?: string | null;
  year?: number | null;
  notes?: string | null;
};

export type KamiCitation = {
  kami_id: number;
  cite_id: number;
};

export type Tag = {
  tag_id: number;
  title_en: string;
  title_jp?: string | null;
};

export type ShrineTag = {
  shrine_id: number;
  tag_id: number;
};

export type Kami = {
  kami_id: number;
  name_en?: string | null;
  name_jp?: string | null;
  img_id?: number | null;
  desc?: string | null;
};

export type KamiModel = Kami & {
  imageUrl?: string | null;
  citations: Citation[];
  imageCitation: Citation | null;
};

export type ShrineKami = {
  shrine_id: number;
  kami_id: number;
};

export type ShrinePreviewModel = ShrineCardModel & {
  tags: Tag[];
};

export type ShrineDetailModel = ShrinePreviewModel & {
  kami: KamiModel[];
};

export function toShrinePreviewModels(
  shrines: Shrine[],
  images: ShrineImage[],
  tags: Tag[],
  shrineTags: ShrineTag[],
): ShrinePreviewModel[] {
  const imagesById = new Map<number, string>(
    images.map((img) => [img.img_id, img.img_source]),
  );

  const tagsById = new Map<number, Tag>(tags.map((t) => [t.tag_id, t]));

  const tagIdsByShrineId = new Map<number, number[]>();
  for (const st of shrineTags) {
    const arr = tagIdsByShrineId.get(st.shrine_id) ?? [];
    arr.push(st.tag_id);
    tagIdsByShrineId.set(st.shrine_id, arr);
  }

  return shrines.map((s) => {
    const imageUrl = s.img_id ? (imagesById.get(s.img_id) ?? null) : null;
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

export function toShrineDetailModels(
  shrines: Shrine[],
  images: ShrineImage[],
  tags: Tag[],
  shrineTags: ShrineTag[],
  kami: Kami[],
  shrineKami: ShrineKami[],
  citations: Citation[],
  kamiCitations: KamiCitation[],
): ShrineDetailModel[] {
  // images need to keep cite_id, so store the full object
  const imagesById = new Map<number, ShrineImage>(
    images.map((img) => [img.img_id, img]),
  );

  const tagsById = new Map<number, Tag>(tags.map((t) => [t.tag_id, t]));

  const citationsById = new Map<number, Citation>(
    citations.map((c) => [c.cite_id, c]),
  );

  // shrine_id -> [tag_id...]
  const tagIdsByShrineId = new Map<number, number[]>();
  for (const st of shrineTags) {
    const arr = tagIdsByShrineId.get(st.shrine_id) ?? [];
    arr.push(st.tag_id);
    tagIdsByShrineId.set(st.shrine_id, arr);
  }

  // kami_id -> Kami
  const kamiById = new Map<number, Kami>(kami.map((k) => [k.kami_id, k]));

  // shrine_id -> [kami_id...]
  const kamiIdsByShrineId = new Map<number, number[]>();
  for (const sk of shrineKami) {
    const arr = kamiIdsByShrineId.get(sk.shrine_id) ?? [];
    arr.push(sk.kami_id);
    kamiIdsByShrineId.set(sk.shrine_id, arr);
  }

  // kami_id -> [cite_id...]
  const citeIdsByKamiId = new Map<number, number[]>();
  for (const kc of kamiCitations) {
    const arr = citeIdsByKamiId.get(kc.kami_id) ?? [];
    arr.push(kc.cite_id);
    citeIdsByKamiId.set(kc.kami_id, arr);
  }

  return shrines.map((s) => {
    // Shrine hero imageUrl
    const shrineImg = s.img_id ? imagesById.get(s.img_id) : undefined;
    const imageUrl = shrineImg?.img_source ?? null;

    // Tags
    const tagIds = tagIdsByShrineId.get(s.shrine_id) ?? [];
    const shrineTagsResolved = tagIds
      .map((id) => tagsById.get(id))
      .filter(isDefined);

    // Kami (with image + citations)
    const kamiIds = kamiIdsByShrineId.get(s.shrine_id) ?? [];
    const shrineKamiResolved: KamiModel[] = kamiIds
      .map((id) => kamiById.get(id))
      .filter(isDefined)
      .map((k) => {
        // Image for this kami (img_id -> images)
        const img = k.img_id ? imagesById.get(k.img_id) : undefined;
        const kamiImageUrl = img?.img_source ?? null;

        // Citation for the image (images.cite_id -> citations)
        const imageCitation = img?.cite_id
          ? (citationsById.get(img.cite_id) ?? null)
          : null;

        // Citations for the kami (kami_citations -> citations)
        const citeIds = citeIdsByKamiId.get(k.kami_id) ?? [];
        const resolvedKamiCitations = citeIds
          .map((cid) => citationsById.get(cid))
          .filter(isDefined);

        return {
          ...k,
          imageUrl: kamiImageUrl,
          imageCitation,
          citations: resolvedKamiCitations,
        };
      });

    return {
      ...s,
      imageUrl,
      tags: shrineTagsResolved,
      kami: shrineKamiResolved,
    };
  });
}
