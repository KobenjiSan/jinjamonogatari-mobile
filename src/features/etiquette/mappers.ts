import type { EtiquetteTopicApi } from "./api/client";

export type IconSet = "fa5" | "fa6";

export type Citation = {
  cite_id: number;
  title: string;
  author?: string | null;
  url?: string | null;
  year?: number | null;
};

export type EtiquetteStepModel = {
  step_id: number;
  step_order: number;
  text: string;

  image_url: string | null;
  image_citation: Citation | null;
};

export type EtiquetteTopicModel = {
  topic_id: number;
  slug: string;

  title_long: string;
  title_short: string;
  summary: string;

  icon_key: string;
  icon_set: IconSet;

  show_in_glance: boolean;
  show_as_highlight: boolean;
  glance_order: number;
  guide_order: number;

  steps: EtiquetteStepModel[];
  citations: Citation[];
};

export type EtiquetteGuideModel = {
  atAGlance: EtiquetteTopicModel[];
  highlights: EtiquetteTopicModel[];
  fullGuide: EtiquetteTopicModel[];
};

/* =========
 * Helpers
 * ========= */

const DEFAULT_ICON_KEY = "torii-gate";

function normalizeIconSet(v: string | null | undefined): IconSet {
  return v === "fa6" ? "fa6" : "fa5";
}

type CitationApiLike = {
  citeId: number;
  title?: string | null;
  author?: string | null;
  url?: string | null;
  year?: number | null;
};

function toCitation(c: CitationApiLike): Citation {
  return {
    cite_id: c.citeId,
    title: c.title ?? "",
    author: c.author ?? null,
    url: c.url ?? null,
    year: c.year ?? null,
  };
}

const byNumber = <T>(get: (x: T) => number) => (a: T, b: T) => get(a) - get(b);

const byTitleLong = (a: EtiquetteTopicModel, b: EtiquetteTopicModel) =>
  a.title_long.localeCompare(b.title_long);

/* =========================
 * Main Mapper: API → Guide
 * ========================= */

export function toEtiquetteGuideModel(
  apiTopics: EtiquetteTopicApi[],
): EtiquetteGuideModel {
  const topicModels: EtiquetteTopicModel[] = apiTopics.map((t) => {
    const steps: EtiquetteStepModel[] = (t.steps ?? [])
      .slice()
      .sort(byNumber((s) => s.stepOrder))
      .map((s) => ({
        step_id: s.stepId,
        step_order: s.stepOrder,
        text: s.text ?? "",
        image_url: s.image?.imageUrl ?? null,
        image_citation: s.image?.citation ? toCitation(s.image.citation) : null,
      }));

    const citations: Citation[] = (t.citations ?? []).map(toCitation);

    return {
      topic_id: t.topicId,
      slug: t.slug,

      title_long: t.titleLong ?? "Untitled",
      title_short: t.titleShort ?? "Untitled",
      summary: t.summary ?? "",

      icon_key: t.iconKey ?? DEFAULT_ICON_KEY,
      icon_set: normalizeIconSet(t.iconSet),

      show_in_glance: t.showInGlance,
      show_as_highlight: t.showAsHighlight,
      glance_order: t.glanceOrder,
      guide_order: t.guideOrder,

      steps,
      citations,
    };
  });

  const fullGuide = topicModels
    .slice()
    .sort(
      (a, b) =>
        byNumber<EtiquetteTopicModel>((x) => x.guide_order)(a, b) ||
        byTitleLong(a, b),
    );

  const atAGlance = topicModels
    .filter((t) => t.show_in_glance === true)
    .slice()
    .sort(
      (a, b) =>
        byNumber<EtiquetteTopicModel>((x) => x.glance_order)(a, b) ||
        byNumber<EtiquetteTopicModel>((x) => x.guide_order)(a, b) ||
        byTitleLong(a, b),
    );

  const highlights = topicModels
    .filter((t) => t.show_as_highlight === true)
    .slice()
    .sort(
      (a, b) =>
        byNumber<EtiquetteTopicModel>((x) => x.guide_order)(a, b) ||
        byTitleLong(a, b),
    );

  return { atAGlance, highlights, fullGuide };
}