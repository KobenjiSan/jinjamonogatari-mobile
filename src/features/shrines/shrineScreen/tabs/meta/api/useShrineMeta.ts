import { useEffect, useState } from "react";
import { fetchShrineMetaBySlug } from "./shrineMeta.client";
import { toShrineMetaModel, type ShrineMetaModel } from "./shrineMeta.mapper";
import type { LatLon } from "../../../../../../shared/distance";

export function useShrineMetaApi(
  slug: string | null,
  userLocation: LatLon | null
) : {
  meta: ShrineMetaModel | null;
  isLoading: boolean;
  error: string | null;
} {
  const [meta, setMeta] = useState<ShrineMetaModel | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    if (!slug) {
      setMeta(null);
      setIsLoading(false);
      setError(null);
      return;
    }

    (async () => {
      try {
        setIsLoading(true);
        setError(null);

        const api = await fetchShrineMetaBySlug(
          slug,
          userLocation?.lat ?? null,
          userLocation?.lon ?? null
        );
        const mapped = toShrineMetaModel(api);

        if (!cancelled) setMeta(mapped);
      } catch (e: any) {
        if (!cancelled) {
          setMeta(null);
          setError(e?.message ?? "Failed to load shrine metadata");
        }
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [slug, userLocation?.lat, userLocation?.lon]);

  return { meta, isLoading, error };
}