import type {
  CitationApi,
  FolkloreReadApi,
  ImageCitedApi,
} from "./shrineFolklore.client";

export type CitationModel = {
  cite_id: number;
  title: string;
  author: string | null;
  url: string | null;
  year: number | null;
};

export type FolkloreModel = {
  folklore_id: number;
  title: string;
  story: string; // your fixture model used `story`, so keep it
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

export function toFolkloreModels(api: FolkloreReadApi[]): FolkloreModel[] {
  return (api ?? []).map((f) => {
    const img = toImageParts(f.image);

    return {
      folklore_id: f.folkloreId,
      title: f.title,
      story: f.information, // API field "information" -> UI "story"
      imageUrl: img.imageUrl,
      imageCitation: img.imageCitation,
      citations: (f.citations ?? []).map(toCitationModel),
    };
  });
}