import type { GalleryListItemApi } from "./shrineGallery.client";

export type GalleryListItemModel = {
  img_id: number;
  imageUrl: string;
};

export function toGalleryListItemModels(
  api: GalleryListItemApi[],
): GalleryListItemModel[] {
  return (api ?? []).map((i) => ({
    img_id: i.imgId,
    imageUrl: i.imageUrl,
  }));
}