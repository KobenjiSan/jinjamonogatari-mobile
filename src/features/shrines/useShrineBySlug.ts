import data from "../../../app/_data/test.json";
import {
  toShrinePreviewModels,
  type ShrinePreviewModel,
  type Shrine,
  type ShrineImage,
  type Tag,
  type ShrineTag,
} from "./mappers";

export function useShrineBySlug(slug: string): ShrinePreviewModel | null {
  const shrines: Shrine[] = (data as any).shrines ?? [];
  const images: ShrineImage[] = (data as any).images ?? [];
  const tags: Tag[] = (data as any).tags ?? [];
  const shrineTags: ShrineTag[] = (data as any).shrine_tags ?? [];

  const previews = toShrinePreviewModels(shrines, images, tags, shrineTags);
  return previews.find((s) => s.slug === slug) ?? null;
}