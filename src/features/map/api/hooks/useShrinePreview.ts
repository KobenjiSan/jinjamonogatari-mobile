import { useEffect, useState } from "react";
import { fetchShrinePreviewBySlug } from "../clients/shrinePreview.client";
import { toShrinePreviewModel, type ShrinePreviewModel } from "../mappers/previewPopup.mapper";
import { getPreviewFromCache, setPreviewInCache } from "../state/previewCache";
import type { LatLon } from "../../../../shared/distance"; 

export function useShrinePreview(slug: string | null, userLocation: LatLon | null): {
  preview: ShrinePreviewModel | null;
  isLoading: boolean;
  error: string | null;
} {
  const [preview, setPreview] = useState<ShrinePreviewModel | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    if (!slug) {
      setPreview(null);
      setIsLoading(false);
      setError(null);
      return;
    }

    const cacheKey =
      typeof userLocation?.lat === "number" && typeof userLocation?.lon === "number"
        ? `${slug}@${userLocation.lat.toFixed(5)},${userLocation.lon.toFixed(5)}`
        : slug;

    const cached = getPreviewFromCache(cacheKey);
    if (cached) {
      setPreview(cached);
      setIsLoading(false);
      setError(null);
      return;
    }

    (async () => {
      try {
        setIsLoading(true);
        setError(null);

        const api = await fetchShrinePreviewBySlug(
          slug,
          userLocation?.lat ?? null,
          userLocation?.lon ?? null
        );

        const mapped = toShrinePreviewModel(api);

        setPreviewInCache(cacheKey, mapped);

        if (!cancelled) setPreview(mapped);
      } catch (e: any) {
        if (!cancelled) {
          setPreview(null);
          setError(e?.message ?? "Failed to load shrine preview");
        }
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [slug, userLocation?.lat, userLocation?.lon]);

  return { preview, isLoading, error };
}