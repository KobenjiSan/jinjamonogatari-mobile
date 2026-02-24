import { useEffect, useState } from "react";
import { fetchShrineGalleryBySlug } from "./shrineGallery.client";
import {
  toGalleryListItemModels,
  type GalleryListItemModel,
} from "./shrineGallery.mapper";

/** slug -> mapped gallery thumbnails */
const galleryCache = new Map<string, GalleryListItemModel[]>();

export function useShrineGalleryApi(
  slug: string | null,
  enabled: boolean,
): {
  images: GalleryListItemModel[];
  isLoading: boolean;
  error: string | null;
} {
  const [images, setImages] = useState<GalleryListItemModel[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    if (!slug || !enabled) {
      setIsLoading(false);
      setError(null);
      return;
    }

    const cached = galleryCache.get(slug);
    if (cached) {
      setImages(cached);
      setIsLoading(false);
      setError(null);
      return;
    }

    (async () => {
      try {
        setIsLoading(true);
        setError(null);

        const api = await fetchShrineGalleryBySlug(slug);
        const mapped = toGalleryListItemModels(api);

        galleryCache.set(slug, mapped);

        if (!cancelled) setImages(mapped);
      } catch (e: any) {
        if (!cancelled) {
          setImages([]);
          setError(e?.message ?? "Failed to load gallery");
        }
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [slug, enabled]);

  return { images, isLoading, error };
}