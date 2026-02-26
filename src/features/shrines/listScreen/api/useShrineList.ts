import { useCallback, useEffect, useRef, useState } from "react";
import { fetchShrineListView } from "./shrineList.client";
import { toShrineCardModels, type ShrineCardModel } from "./shrineList.mapper";
import type { LatLon } from "../../../../shared/distance";

export function useShrineList(userLocation: LatLon | null): {
  shrines: ShrineCardModel[];
  isEmpty: boolean;
  isLoading: boolean;
  error: string | null;
  refresh: () => Promise<void>;
} {
  const [shrines, setShrines] = useState<ShrineCardModel[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // prevents late responses from overwriting state after refresh/unmount
  const reqSeq = useRef(0);

  const refresh = useCallback(async () => {
    const mySeq = ++reqSeq.current;

    try {
      setIsLoading(true);
      setError(null);

      const api = await fetchShrineListView(userLocation?.lat ?? null, userLocation?.lon ?? null);
      const mapped = toShrineCardModels(api);

      if (mySeq !== reqSeq.current) return;
      setShrines(mapped);
    } catch (e: any) {
      if (mySeq !== reqSeq.current) return;

      setShrines([]);
      setError(e?.message ?? "Failed to load shrines");
    } finally {
      if (mySeq !== reqSeq.current) return;
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    let cancelled = false;

    (async () => {
      try {
        setIsLoading(true);
        setError(null);

        const api = await fetchShrineListView(userLocation?.lat ?? null, userLocation?.lon ?? null);
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
      reqSeq.current++; // invalidate any in-flight refresh
    };
  }, [userLocation?.lat, userLocation?.lon]);

  return {
    shrines,
    isEmpty: shrines.length === 0,
    isLoading,
    error,
    refresh,
  };
}