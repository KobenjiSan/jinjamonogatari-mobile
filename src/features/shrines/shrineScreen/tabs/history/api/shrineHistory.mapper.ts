import type {
  CitationApi,
  HistoryReadApi,
  ImageCitedApi,
} from "./shrineHistory.client";

export type CitationModel = {
  cite_id: number;
  title: string;
  author: string | null;
  url: string | null;
  year: number | null;
};

export type HistoryModel = {
  history_id: number;

  // keep string so your existing UI that expects string dates won't break
  event_date: string;

  sort_order: number;
  title: string;
  information: string | null;

  imageUrl: string | null;
  imageCitation: CitationModel | null;

  citations: CitationModel[];
};

function toCitationModel(c: CitationApi): CitationModel {
  return {
    cite_id: c.citeId,
    title: c.title ?? "",
    author: c.author ?? null,
    url: c.url ?? null,
    year: c.year ?? null,
  };
}

function toImageParts(img: ImageCitedApi | null | undefined): {
  imageUrl: string | null;
  imageCitation: CitationModel | null;
} {
  return {
    imageUrl: img?.imageUrl ?? null,
    imageCitation: img?.citation ? toCitationModel(img.citation) : null,
  };
}

export function toHistoryModels(api: HistoryReadApi[]): HistoryModel[] {
  return (api ?? [])
    .map((h) => {
      const img = toImageParts(h.image);

      return {
        history_id: h.historyId,
        event_date: h.eventDate, // "YYYY-MM-DD"
        sort_order: h.sortOrder,
        title: h.title,
        information: h.information ?? null,

        imageUrl: img.imageUrl,
        imageCitation: img.imageCitation,

        citations: (h.citations ?? []).map(toCitationModel),
      };
    })
    .sort((a, b) => a.sort_order - b.sort_order);
}