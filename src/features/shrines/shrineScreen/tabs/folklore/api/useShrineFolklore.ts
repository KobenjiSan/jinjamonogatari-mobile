import { useEffect, useState } from "react";
import { fetchShrineFolkloreBySlug } from "./shrineFolklore.client";
import { toFolkloreModels, type FolkloreModel } from "./shrineFolklore.mapper";

/** slug -> mapped folklore list */
const folkloreCache = new Map<string, FolkloreModel[]>();

export function useShrineFolkloreApi(
  slug: string | null,
  enabled: boolean,
): {
  folklore: FolkloreModel[];
  isLoading: boolean;
  error: string | null;
} {
  const [folklore, setFolklore] = useState<FolkloreModel[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    if (!slug || !enabled) {
      setIsLoading(false);
      setError(null);
      return;
    }

    const cached = folkloreCache.get(slug);
    if (cached) {
      setFolklore(cached);
      setIsLoading(false);
      setError(null);
      return;
    }

    (async () => {
      try {
        setIsLoading(true);
        setError(null);

        const api = await fetchShrineFolkloreBySlug(slug);
        const mapped = toFolkloreModels(api);

        folkloreCache.set(slug, mapped);

        if (!cancelled) setFolklore(mapped);
      } catch (e: any) {
        if (!cancelled) {
          setFolklore([]);
          setError(e?.message ?? "Failed to load folklore");
        }
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [slug, enabled]);

  return { folklore, isLoading, error };
}