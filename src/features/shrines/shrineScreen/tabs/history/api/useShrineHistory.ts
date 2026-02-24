import { useEffect, useState } from "react";
import { fetchShrineHistoryBySlug } from "./shrineHistory.client";
import { toHistoryModels, type HistoryModel } from "./shrineHistory.mapper";

/** slug -> mapped history list */
const historyCache = new Map<string, HistoryModel[]>();

export function useShrineHistoryApi(
  slug: string | null,
  enabled: boolean,
): {
  history: HistoryModel[];
  isLoading: boolean;
  error: string | null;
} {
  const [history, setHistory] = useState<HistoryModel[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    if (!slug || !enabled) {
      setIsLoading(false);
      setError(null);
      return;
    }

    const cached = historyCache.get(slug);
    if (cached) {
      setHistory(cached);
      setIsLoading(false);
      setError(null);
      return;
    }

    (async () => {
      try {
        setIsLoading(true);
        setError(null);

        const api = await fetchShrineHistoryBySlug(slug);
        const mapped = toHistoryModels(api);

        historyCache.set(slug, mapped);

        if (!cancelled) setHistory(mapped);
      } catch (e: any) {
        if (!cancelled) {
          setHistory([]);
          setError(e?.message ?? "Failed to load history");
        }
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [slug, enabled]);

  return { history, isLoading, error };
}