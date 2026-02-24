import { useEffect, useState } from "react";
import { fetchShrineMetaBySlug } from "./shrineMeta.client";
import { toShrineMetaModel, type ShrineMetaModel } from "./shrineMeta.mapper";

export function useShrineMetaApi(slug: string | null): {
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

        const api = await fetchShrineMetaBySlug(slug);
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
  }, [slug]);

  return { meta, isLoading, error };
}