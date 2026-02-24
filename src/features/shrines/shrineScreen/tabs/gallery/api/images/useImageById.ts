import { useEffect, useState } from "react";
import { fetchImageById } from "./shrineImage.client";
import {
  toImageFullModel,
  type ImageFullModel,
} from "./shrineImage.mapper";

/**
 * Cache
 * img_id -> full image
 */
const imageCache = new Map<number, ImageFullModel>();

export function useImageByIdApi(
  imageId: number | null,
  enabled: boolean,
): {
  image: ImageFullModel | null;
  isLoading: boolean;
  error: string | null;
} {
  const [image, setImage] = useState<ImageFullModel | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    if (!imageId || !enabled) {
      setImage(null);
      setIsLoading(false);
      setError(null);
      return;
    }

    // cache hit
    const cached = imageCache.get(imageId);
    if (cached) {
      setImage(cached);
      setIsLoading(false);
      setError(null);
      return;
    }

    (async () => {
      try {
        setIsLoading(true);
        setError(null);

        const api = await fetchImageById(imageId);
        const mapped = toImageFullModel(api);

        imageCache.set(imageId, mapped);

        if (!cancelled) setImage(mapped);
      } catch (e: any) {
        if (!cancelled) {
          setImage(null);
          setError(e?.message ?? "Failed to load image");
        }
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [imageId, enabled]);

  return { image, isLoading, error };
}