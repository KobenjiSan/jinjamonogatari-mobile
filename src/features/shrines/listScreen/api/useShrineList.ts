import { useEffect, useState } from "react";
import { fetchShrineListView } from "./shrineList.client";
import { toShrineCardModels, type ShrineCardModel } from "./shrineList.mapper";

export function useShrineListApi(): {
  shrines: ShrineCardModel[];
  isEmpty: boolean;
  isLoading: boolean;
  error: string | null;
} {
  const [shrines, setShrines] = useState<ShrineCardModel[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    (async () => {
      try {
        setIsLoading(true);
        setError(null);

        const api = await fetchShrineListView();
        const mapped = toShrineCardModels(api);

        if (!cancelled) setShrines(mapped);
      } catch (e: any) {
        if (!cancelled) {
          setShrines([]);
          setError(e?.message ?? "Failed to load shrines");
        }
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, []);

  return {
    shrines,
    isEmpty: shrines.length === 0,
    isLoading,
    error,
  };
}