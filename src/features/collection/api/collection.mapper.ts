import type {
  ShrinePreviewDto,
  TagDto,
} from "./collection.client";

export type CollectionTagModel = {
  tag_id: number;
  title_en: string;
  title_jp?: string | null;
};

export type CollectionShrineCardModel = {
  shrine_id: number;
  slug: string;
  name_en?: string | null;
  name_jp?: string | null;
  image_url?: string | null;
  shrine_desc?: string | null;
  distance_meters: number | null; 
  tags: CollectionTagModel[];
};

export function mapTagDtoToModel(dto: TagDto): CollectionTagModel {
  return {
    tag_id: dto.tagId,
    title_en: dto.titleEn,
    title_jp: dto.titleJp ?? null,
  };
}

export function mapShrinePreviewDtoToCollectionCardModel(
  dto: ShrinePreviewDto
): CollectionShrineCardModel {
  return {
    shrine_id: dto.shrineId,
    slug: dto.slug,
    name_en: dto.nameEn ?? null,
    name_jp: dto.nameJp ?? null,
    image_url: dto.imageUrl ?? null,
    shrine_desc: dto.shrineDesc ?? null,
    distance_meters: dto.distanceMeters ?? null,
    tags: Array.isArray(dto.tags) ? dto.tags.map(mapTagDtoToModel) : [],
  };
}