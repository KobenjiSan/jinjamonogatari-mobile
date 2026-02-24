import type { ShrinePreviewModel } from "../mappers/previewPopup.mapper";

const previewCache = new Map<string, ShrinePreviewModel>();

export function getPreviewFromCache(slug: string): ShrinePreviewModel | null {
  return previewCache.get(slug) ?? null;
}

export function setPreviewInCache(slug: string, preview: ShrinePreviewModel): void {
  previewCache.set(slug, preview);
}

export function clearPreviewCache(): void {
  previewCache.clear();
}