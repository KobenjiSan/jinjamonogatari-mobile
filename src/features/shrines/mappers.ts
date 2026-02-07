/**
 * Shrine data mappers
 *
 * This file contains pure transformation functions that convert raw shrine
 * data (from fixtures or API responses) into UI-friendly models used by
 * mobile screens and components.
 *
 * Design principles:
 * - No side effects (pure functions only)
 * - No network access
 * - No UI concerns (layout, styling, rendering)
 *
 * Why this layer exists:
 * - Keeps data-shaping logic out of routes and screens
 * - Allows data sources to change (fixtures → ASP.NET API)
 *   without rewriting UI code
 * - Centralizes assumptions about how related shrine data
 *   (images, tags, kami, citations, history) are composed
 *
 * These mappers are reused by:
 * - Shrine list screens
 * - Map previews
 * - Shrine detail pages
 * - Saved / bookmarked shrine features
 */

/**
 * Type guard used to safely filter out null / undefined values
 * when resolving foreign-key relationships.
 */
function isDefined<T>(v: T | null | undefined): v is T {
  return v !== null && v !== undefined;
}

/* ============================================================================
 * Core Tables (Raw Data Shapes)
 * ============================================================================
 * These types mirror the database / API layer.
 * They intentionally allow nulls and partial data.
 */

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
  img_id?: number | null; // Foreign key → ShrineImage
};

export type ShrineImage = {
  img_id: number;
  img_source: string; // URL or asset path
  cite_id?: number | null; // Foreign key → Citation
};

export type Citation = {
  cite_id: number;
  title: string;
  author?: string | null;
  url?: string | null;
  year?: number | null;
  notes?: string | null;
};

/* ============================================================================
 * Tags (Many-to-Many)
 * ============================================================================
 */

export type Tag = {
  tag_id: number;
  title_en: string;
  title_jp?: string | null;
};

export type ShrineTag = {
  shrine_id: number;
  tag_id: number;
};

/* ============================================================================
 * Kami (Many-to-Many with Citations)
 * ============================================================================
 */

export type Kami = {
  kami_id: number;
  name_en?: string | null;
  name_jp?: string | null;
  img_id?: number | null; // Optional image
  desc?: string | null;
};

export type ShrineKami = {
  shrine_id: number;
  kami_id: number;
};

export type KamiCitation = {
  kami_id: number;
  cite_id: number;
};

/**
 * UI-ready Kami model.
 * Includes resolved image URL and all associated citations.
 */
export type KamiModel = Kami & {
  imageUrl?: string | null;
  citations: Citation[];
  imageCitation: Citation | null;
};

/* ============================================================================
 * History (Ordered Timeline with Citations)
 * ============================================================================
 */

export type History = {
  history_id: number;
  shrine_id: number;
  event_date: string;
  sort_order: number; // Controls timeline ordering
  title: string;
  information?: string | null;
  img_id?: number | null;
};

export type HistoryCitation = {
  history_id: number;
  cite_id: number;
};

/**
 * UI-ready History model.
 * Includes resolved image URL and citations.
 */
export type HistoryModel = History & {
  imageUrl?: string | null;
  imageCitation: Citation | null;
  citations: Citation[];
};

/* ============================================================================
 * Folklore (Stories with Citations)
 * ============================================================================
 */

export type Folklore = {
  folklore_id: number;
  shrine_id: number;
  title: string;
  story: string;
  img_id?: number | null;
};

export type FolkloreCitation = {
  folklore_id: number;
  cite_id: number;
};

export type FolkloreModel = Folklore & {
  imageUrl?: string | null;
  imageCitation: Citation | null;
  citations: Citation[];
};

/* ============================================================================
 * View Models (UI-Facing Shapes)
 * ============================================================================
 */

export type ShrineCardModel = Shrine & {
  imageUrl?: string | null;
};

export type ShrinePreviewModel = ShrineCardModel & {
  tags: Tag[];
};

export type ShrineDetailModel = ShrinePreviewModel & {
  kami: KamiModel[];
  history: HistoryModel[];
  folklore: FolkloreModel[];
};

/* ============================================================================
 * Card Mapper
 * ============================================================================
 * Used by list and grid views where only basic shrine info is needed.
 */

export function toShrineCardModels(
  shrines: Shrine[],
  images: ShrineImage[],
): ShrineCardModel[] {
  // Pre-index images for O(1) lookup by img_id
  const imagesById = new Map<number, string>(
    images.map((img) => [img.img_id, img.img_source]),
  );

  return shrines.map((s) => ({
    ...s,
    // Resolve hero image if one exists
    imageUrl: s.img_id ? (imagesById.get(s.img_id) ?? null) : null,
  }));
}

/* ============================================================================
 * Preview Mapper
 * ============================================================================
 * Used by list + filter screens where tags are displayed.
 */

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

  // shrine_id → [tag_id...]
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
      .filter(isDefined);

    return {
      ...s,
      imageUrl,
      tags: shrineTagsResolved,
    };
  });
}

/* ============================================================================
 * Detail Mapper
 * ============================================================================
 * Used by shrine detail screens.
 * Fully resolves images, tags, kami, history, and citations.
 */

export function toShrineDetailModels(
  shrines: Shrine[],
  images: ShrineImage[],
  tags: Tag[],
  shrineTags: ShrineTag[],
  kami: Kami[],
  shrineKami: ShrineKami[],
  citations: Citation[],
  kamiCitations: KamiCitation[],
  history: History[],
  historyCitations: HistoryCitation[],
  folklore: Folklore[],
  folkloreCitations: FolkloreCitation[],
): ShrineDetailModel[] {
  /**
   * Pre-index all lookup tables to avoid nested loops.
   * This keeps runtime predictable and readable.
   */

  // img_id → ShrineImage (includes cite_id)
  const imagesById = new Map<number, ShrineImage>(
    images.map((img) => [img.img_id, img]),
  );

  const tagsById = new Map<number, Tag>(tags.map((t) => [t.tag_id, t]));

  const citationsById = new Map<number, Citation>(
    citations.map((c) => [c.cite_id, c]),
  );

  // shrine_id → [tag_id...]
  const tagIdsByShrineId = new Map<number, number[]>();
  for (const st of shrineTags) {
    const arr = tagIdsByShrineId.get(st.shrine_id) ?? [];
    arr.push(st.tag_id);
    tagIdsByShrineId.set(st.shrine_id, arr);
  }

  // kami_id → Kami
  const kamiById = new Map<number, Kami>(kami.map((k) => [k.kami_id, k]));

  // shrine_id → [kami_id...]
  const kamiIdsByShrineId = new Map<number, number[]>();
  for (const sk of shrineKami) {
    const arr = kamiIdsByShrineId.get(sk.shrine_id) ?? [];
    arr.push(sk.kami_id);
    kamiIdsByShrineId.set(sk.shrine_id, arr);
  }

  // kami_id → [cite_id...]
  const citeIdsByKamiId = new Map<number, number[]>();
  for (const kc of kamiCitations) {
    const arr = citeIdsByKamiId.get(kc.kami_id) ?? [];
    arr.push(kc.cite_id);
    citeIdsByKamiId.set(kc.kami_id, arr);
  }

  // shrine_id → [history...]
  const historyByShrineId = new Map<number, History[]>();
  for (const h of history) {
    const arr = historyByShrineId.get(h.shrine_id) ?? [];
    arr.push(h);
    historyByShrineId.set(h.shrine_id, arr);
  }

  // history_id → [cite_id...]
  const citeIdsByHistoryId = new Map<number, number[]>();
  for (const hc of historyCitations) {
    const arr = citeIdsByHistoryId.get(hc.history_id) ?? [];
    arr.push(hc.cite_id);
    citeIdsByHistoryId.set(hc.history_id, arr);
  }

  // shrine_id → [folklore...]
  const folkloreByShrineId = new Map<number, Folklore[]>();
  for (const f of folklore) {
    const arr = folkloreByShrineId.get(f.shrine_id) ?? [];
    arr.push(f);
    folkloreByShrineId.set(f.shrine_id, arr);
  }

  // folklore_id → [cite_id...]
  const citeIdsByFolkloreId = new Map<number, number[]>();
  for (const fc of folkloreCitations) {
    const arr = citeIdsByFolkloreId.get(fc.folklore_id) ?? [];
    arr.push(fc.cite_id);
    citeIdsByFolkloreId.set(fc.folklore_id, arr);
  }

  return shrines.map((s) => {
    // Resolve shrine hero image
    const shrineImg = s.img_id ? imagesById.get(s.img_id) : undefined;
    const imageUrl = shrineImg?.img_source ?? null;

    // Resolve tags
    const tagIds = tagIdsByShrineId.get(s.shrine_id) ?? [];
    const shrineTagsResolved = tagIds
      .map((id) => tagsById.get(id))
      .filter(isDefined);

    // Resolve kami (with images + citations)
    const kamiIds = kamiIdsByShrineId.get(s.shrine_id) ?? [];
    const shrineKamiResolved: KamiModel[] = kamiIds
      .map((id) => kamiById.get(id))
      .filter(isDefined)
      .map((k) => {
        const img = k.img_id ? imagesById.get(k.img_id) : undefined;

        return {
          ...k,
          imageUrl: img?.img_source ?? null,
          imageCitation: img?.cite_id
            ? (citationsById.get(img.cite_id) ?? null)
            : null,
          citations: (citeIdsByKamiId.get(k.kami_id) ?? [])
            .map((cid) => citationsById.get(cid))
            .filter(isDefined),
        };
      });

    // Resolve history timeline (ordered)
    const shrineHistoryResolved: HistoryModel[] = (
      historyByShrineId.get(s.shrine_id) ?? []
    )
      .sort((a, b) => a.sort_order - b.sort_order)
      .map((h) => {
        const img = h.img_id ? imagesById.get(h.img_id) : undefined;

        return {
          ...h,
          imageUrl: img?.img_source ?? null,
          imageCitation: img?.cite_id
            ? (citationsById.get(img.cite_id) ?? null)
            : null,
          citations: (citeIdsByHistoryId.get(h.history_id) ?? [])
            .map((cid) => citationsById.get(cid))
            .filter(isDefined),
        };
      });

    // Resolve folklore stories
    const shrineFolkloreResolved: FolkloreModel[] = (
      folkloreByShrineId.get(s.shrine_id) ?? []
    )
      .sort((a, b) => a.folklore_id - b.folklore_id)
      .map((f) => {
        const img = f.img_id ? imagesById.get(f.img_id) : undefined;

        return {
          ...f,
          imageUrl: img?.img_source ?? null,
          imageCitation: img?.cite_id
            ? (citationsById.get(img.cite_id) ?? null)
            : null,
          citations: (citeIdsByFolkloreId.get(f.folklore_id) ?? [])
            .map((cid) => citationsById.get(cid))
            .filter(isDefined),
        };
      });

    return {
      ...s,
      imageUrl,
      tags: shrineTagsResolved,
      kami: shrineKamiResolved,
      history: shrineHistoryResolved,
      folklore: shrineFolkloreResolved,
    };
  });
}
