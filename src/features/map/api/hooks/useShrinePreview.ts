import { useEffect, useState } from "react";
import { fetchShrinePreviewBySlug } from "../clients/shrinePreview.client";
import { toShrinePreviewModel, type ShrinePreviewModel } from "../mappers/previewPopup.mapper";
import { getPreviewFromCache, setPreviewInCache } from "../state/previewCache";

export function useShrinePreviewApi(slug: string | null): {
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

    const cached = getPreviewFromCache(slug);
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

        const api = await fetchShrinePreviewBySlug(slug);
        const mapped = toShrinePreviewModel(api);

        setPreviewInCache(slug, mapped);

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
  }, [slug]);

  return { preview, isLoading, error };
}