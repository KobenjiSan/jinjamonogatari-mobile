import type { ShrinePreviewApi, TagApi } from "../clients/shrinePreview.client";

export type TagModel = {
  tag_id: number;
  title_en: string;
  title_jp: string | null;
};

export type ShrinePreviewModel = {
  shrine_id: number;
  slug: string;
  name_en: string | null;
  name_jp: string | null;
  imageUrl: string | null;
  shrine_desc: string | null;
  tags: TagModel[];
};

function toTagModel(t: TagApi): TagModel {
  return {
    tag_id: t.tagId,
    title_en: t.titleEn,
    title_jp: t.titleJp ?? null,
  };
}

export function toShrinePreviewModel(p: ShrinePreviewApi): ShrinePreviewModel {
  return {
    shrine_id: p.shrineId,
    slug: p.slug,
    name_en: p.nameEn ?? null,
    name_jp: p.nameJp ?? null,
    imageUrl: p.imageUrl ?? null,
    shrine_desc: p.shrineDesc ?? null,
    tags: (p.tags ?? []).map(toTagModel),
  };
}