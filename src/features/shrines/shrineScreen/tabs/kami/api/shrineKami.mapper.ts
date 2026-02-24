import type { CitationApi, ImageCitedApi, KamiReadApi } from "./shrineKami.client";

export type CitationModel = {
  cite_id: number;
  title: string;
  author: string | null;
  url: string | null;
  year: number | null;
};

export type KamiModel = {
  kami_id: number;
  name_en: string | null;
  name_jp: string | null;
  desc: string | null;

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

function toImageCitation(img: ImageCitedApi | null | undefined): {
  imageUrl: string | null;
  imageCitation: CitationModel | null;
} {
  return {
    imageUrl: img?.imageUrl ?? null,
    imageCitation: img?.citation ? toCitationModel(img.citation) : null,
  };
}

export function toKamiModels(api: KamiReadApi[]): KamiModel[] {
  return (api ?? []).map((k) => {
    const img = toImageCitation(k.image);

    return {
      kami_id: k.kamiId,
      name_en: k.nameEn ?? null,
      name_jp: k.nameJp ?? null,
      desc: k.desc ?? null,

      imageUrl: img.imageUrl,
      imageCitation: img.imageCitation,

      citations: (k.citations ?? []).map(toCitationModel),
    };
  });
}