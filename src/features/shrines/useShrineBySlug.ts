import data from "../../../app/_data/test.json";
import {
  toShrineDetailModels,
  type ShrineDetailModel,
  type Shrine,
  type ShrineImage,
  type Tag,
  type ShrineTag,
  type Kami,
  type ShrineKami,
  type Citation,
  type KamiCitation,
} from "./mappers";

export function useShrineBySlug(slug: string): ShrineDetailModel | null {
  const shrines: Shrine[] = (data as any).shrines ?? [];
  const images: ShrineImage[] = (data as any).images ?? [];
  const tags: Tag[] = (data as any).tags ?? [];
  const shrineTags: ShrineTag[] = (data as any).shrine_tags ?? [];

  const kami: Kami[] = (data as any).kami ?? [];
  const shrineKami: ShrineKami[] = (data as any).shrine_kami ?? [];

  const citations: Citation[] = (data as any).citations ?? [];
  const kamiCitations: KamiCitation[] = (data as any).kami_citations ?? [];

  const details = toShrineDetailModels(
    shrines,
    images,
    tags,
    shrineTags,
    kami,
    shrineKami,
    citations,
    kamiCitations,
  );

  return details.find((s) => s.slug === slug) ?? null;
}