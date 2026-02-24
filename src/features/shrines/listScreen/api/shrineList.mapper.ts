import type { ShrineCard } from "./shrineList.client";

export type ShrineCardModel = {
  shrine_id: number;
  slug: string;
  name_en: string | null;
  name_jp: string | null;
  imageUrl: string | null;
};

export function toShrineCardModels(api: ShrineCard[]): ShrineCardModel[] {
  return (api ?? []).map((s) => ({
    shrine_id: s.shrineId,
    slug: s.slug,
    name_en: s.nameEn ?? null,
    name_jp: s.nameJp ?? null,
    imageUrl: s.imageUrl ?? null,
  }));
}