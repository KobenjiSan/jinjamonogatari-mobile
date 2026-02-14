import type {
  EtiquetteTopic,
  EtiquetteStep,
  Citation,
  EtiquetteCitation,
  Image,
} from "../mappers";
import type { EtiquetteTopicApi } from "./client";

export function apiToRaw(
  apiTopics: EtiquetteTopicApi[],
): {
  topics: EtiquetteTopic[];
  steps: EtiquetteStep[];
  citations: Citation[];
  etiquetteCitations: EtiquetteCitation[];
  images: Image[];
} {
  const topics: EtiquetteTopic[] = apiTopics.map((t) => ({
    topic_id: t.topicId,
    slug: t.slug,
    title_long: t.titleLong,
    title_short: t.titleShort,
    summary: t.summary ?? null,
    icon_key: t.iconKey ?? null,
    icon_set: t.iconSet ?? null,
    show_in_glance: t.showInGlance ?? null,
    show_as_highlight: t.showAsHighlight ?? null,
    glance_order: t.glanceOrder ?? null,
    guide_order: t.guideOrder ?? null,
    status: t.status ?? null,
    published_at: t.publishedAt ?? null,
    created_at: t.createdAt ?? null,
    updated_at: t.updatedAt ?? null,
  }));

  const steps: EtiquetteStep[] = apiTopics.flatMap((t) =>
    (t.steps ?? []).map((s) => ({
      step_id: s.stepId,
      topic_id: t.topicId,
      step_order: s.stepOrder,
      text: s.text,
      img_id: s.imageId ?? null,
    })),
  );

  // De-dupe citations across topics
  const citationsById = new Map<number, Citation>();
  for (const t of apiTopics) {
    for (const c of t.citations ?? []) {
      citationsById.set(c.citeId, {
        cite_id: c.citeId,
        title: c.title,
        author: c.author ?? null,
        url: c.url ?? null,
        year: c.year ?? null,
        notes: c.notes ?? null,
      });
    }
  }
  const citations = [...citationsById.values()];

  // Join rows: topic_id + cite_id
  const etiquetteCitations: EtiquetteCitation[] = apiTopics.flatMap((t) =>
    (t.citations ?? []).map((c) => ({
      topic_id: t.topicId,
      cite_id: c.citeId,
      created_at: null,
    })),
  );

  const images: Image[] = [];

  return { topics, steps, citations, etiquetteCitations, images };
}
