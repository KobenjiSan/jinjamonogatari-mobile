import type { ImageFullApi, CitationApi } from "./shrineImage.client";

/* =========================
 * UI Models
 * ========================= */

export type CitationModel = {
  cite_id: number;
  title: string;
  author: string | null;
  url: string | null;
  year: number | null;
};

export type ImageFullModel = {
  img_id: number;
  imageUrl: string | null;
  title: string | null;
  desc: string | null;
  citation: CitationModel | null;
};

/* =========================
 * Helpers
 * ========================= */

function toCitationModel(c: CitationApi): CitationModel {
  return {
    cite_id: c.citeId,
    title: c.title ?? "",
    author: c.author ?? null,
    url: c.url ?? null,
    year: c.year ?? null,
  };
}

/* =========================
 * MAIN EXPORT
 * ========================= */

export const toImageFullModel = (
  api: ImageFullApi,
): ImageFullModel => ({
  img_id: api.imgId,
  imageUrl: api.imageUrl ?? null,
  title: api.title ?? null,
  desc: api.desc ?? null,
  citation: api.citation ? toCitationModel(api.citation) : null,
});