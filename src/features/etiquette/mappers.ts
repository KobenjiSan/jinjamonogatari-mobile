/**
 * Etiquette data mappers
 */

function isDefined<T>(v: T | null | undefined): v is T {
  return v !== null && v !== undefined;
}

/* ============================================================================
 * Core Tables (Raw Data Shapes)
 * ============================================================================
 */

export type EtiquetteTopic = {
  topic_id: number;
  slug: string;

  title_long: string;
  title_short: string;

  summary?: string | null;

  icon_key?: string | null;
  icon_set?: string | null;

  show_in_glance?: boolean | null;
  show_as_highlight?: boolean | null;
  glance_order?: number | null;
  guide_order?: number | null;

  status?: string | null;
  published_at?: string | null;
  created_at?: string | null;
  updated_at?: string | null;
};

export type EtiquetteStep = {
  step_id: number;
  topic_id: number;
  step_order: number;
  text: string;
  img_id?: number | null;
};

export type Image = {
  img_id: number;
  img_source: string;
  title?: string | null;
  desc?: string | null;
  cite_id?: number | null;
  created_at?: string | null;
  updated_at?: string | null;
};

export type Citation = {
  cite_id: number;
  title: string;
  author?: string | null;
  url?: string | null;
  year?: number | null;
  notes?: string | null;
};

export type EtiquetteCitation = {
  topic_id: number;
  cite_id: number;
  created_at?: string | null;
};

/* ============================================================================
 * View Models (UI-Facing Shapes)
 * ============================================================================
 */

export type EtiquetteStepModel = EtiquetteStep & {
  imageUrl?: string | null;
  imageTitle?: string | null;
  imageDesc?: string | null;
  imageCitation: Citation | null;
};

export type EtiquetteTopicModel = Omit<
  EtiquetteTopic,
  "icon_key" | "icon_set"
> & {
  icon_key: string;
  icon_set: "fa5" | "fa6";
  steps: EtiquetteStepModel[];
  citations: Citation[];
};

export type EtiquetteGuideModel = {
  atAGlance: EtiquetteTopicModel[];
  highlights: EtiquetteTopicModel[];
  fullGuide: EtiquetteTopicModel[];
};

/* ============================================================================
 * Helpers
 * ============================================================================
 */

const DEFAULT_ICON_SET = "fa5";
const DEFAULT_ICON_KEY = "torii-gate";

function normalizeIconSet(v: string | null | undefined): "fa5" | "fa6" {
  return v === "fa6" ? "fa6" : "fa5";
}

function normalizeIconKey(v: string | null | undefined): string {
  return v ?? DEFAULT_ICON_KEY;
}

function resolveImageModel(
  img: Image | undefined,
  citationsById: Map<number, Citation>,
): Pick<
  EtiquetteStepModel,
  "imageUrl" | "imageTitle" | "imageDesc" | "imageCitation"
> {
  return {
    imageUrl: img?.img_source ?? null,
    imageTitle: img?.title ?? null,
    imageDesc: img?.desc ?? null,
    imageCitation: img?.cite_id
      ? (citationsById.get(img.cite_id) ?? null)
      : null,
  };
}

function normalizeBool(v: boolean | null | undefined): boolean {
  return v === true;
}

const byNullableNumber =
  <T>(get: (x: T) => number | null | undefined) =>
  (a: T, b: T) => {
    const av = get(a);
    const bv = get(b);
    const aIsNull = av === null || av === undefined;
    const bIsNull = bv === null || bv === undefined;
    if (aIsNull && bIsNull) return 0;
    if (aIsNull) return 1;
    if (bIsNull) return -1;
    return av - bv;
  };

/* ============================================================================
 * Guide Mapper
 * ============================================================================
 */

export function toEtiquetteGuideModel(
  topics: EtiquetteTopic[],
  steps: EtiquetteStep[],
  images: Image[],
  citations: Citation[],
  etiquetteCitations: EtiquetteCitation[],
): EtiquetteGuideModel {
  const imagesById = new Map<number, Image>(images.map((i) => [i.img_id, i]));

  const citationsById = new Map<number, Citation>(
    citations.map((c) => [c.cite_id, c]),
  );

  // topic_id → [cite_id...]
  const citeIdsByTopicId = new Map<number, number[]>();
  for (const ec of etiquetteCitations) {
    const arr = citeIdsByTopicId.get(ec.topic_id) ?? [];
    arr.push(ec.cite_id);
    citeIdsByTopicId.set(ec.topic_id, arr);
  }

  // topic_id → [step...]
  const stepsByTopicId = new Map<number, EtiquetteStep[]>();
  for (const s of steps) {
    const arr = stepsByTopicId.get(s.topic_id) ?? [];
    arr.push(s);
    stepsByTopicId.set(s.topic_id, arr);
  }

  const topicModels: EtiquetteTopicModel[] = topics.map((t) => {
    const topicStepModels: EtiquetteStepModel[] = (
      stepsByTopicId.get(t.topic_id) ?? []
    )
      .slice()
      .sort((a, b) => a.step_order - b.step_order)
      .map((step) => {
        const img = step.img_id ? imagesById.get(step.img_id) : undefined;
        return { ...step, ...resolveImageModel(img, citationsById) };
      });

    const topicCitations: Citation[] = (citeIdsByTopicId.get(t.topic_id) ?? [])
      .map((cid) => citationsById.get(cid))
      .filter(isDefined);

    return {
      ...t,
      show_in_glance: normalizeBool(t.show_in_glance),
      show_as_highlight: normalizeBool(t.show_as_highlight),

      // normalized icons
      icon_set: normalizeIconSet(t.icon_set),
      icon_key: normalizeIconKey(t.icon_key),

      steps: topicStepModels,
      citations: topicCitations,
    };
  });

  const byTitleLong = (a: EtiquetteTopicModel, b: EtiquetteTopicModel) =>
    a.title_long.localeCompare(b.title_long);

  const fullGuide = topicModels
    .slice()
    .sort(
      (a, b) =>
        byNullableNumber<EtiquetteTopicModel>((x) => x.guide_order)(a, b) ||
        byTitleLong(a, b),
    );

  const atAGlance = topicModels
    .filter((t) => t.show_in_glance === true)
    .slice()
    .sort(
      (a, b) =>
        byNullableNumber<EtiquetteTopicModel>((x) => x.glance_order)(a, b) ||
        byNullableNumber<EtiquetteTopicModel>((x) => x.guide_order)(a, b) ||
        byTitleLong(a, b),
    );

  const highlights = topicModels
    .filter((t) => t.show_as_highlight === true)
    .slice()
    .sort(
      (a, b) =>
        byNullableNumber<EtiquetteTopicModel>((x) => x.guide_order)(a, b) ||
        byTitleLong(a, b),
    );

  return { atAGlance, highlights, fullGuide };
}
