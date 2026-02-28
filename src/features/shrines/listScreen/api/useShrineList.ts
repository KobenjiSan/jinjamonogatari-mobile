import { useCallback, useEffect, useRef, useState } from "react";
import { fetchShrineListView } from "./shrineList.client";
import { toShrineCardModels, type ShrineCardModel } from "./shrineList.mapper";
import type { LatLon } from "../../../../shared/location/distance";

export function useShrineList(
  userLocation: LatLon | null,
  q: string
): {
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

      const api = await fetchShrineListView(
        userLocation?.lat ?? null,
        userLocation?.lon ?? null,
        q
      );
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
  }, [userLocation?.lat, userLocation?.lon, q]);

  useEffect(() => {
    let cancelled = false;
    const mySeq = ++reqSeq.current;

    // debounce search
    const t = setTimeout(() => {
      (async () => {
        try {
          setIsLoading(true);
          setError(null);

          const api = await fetchShrineListView(
            userLocation?.lat ?? null,
            userLocation?.lon ?? null,
            q
          );
          const mapped = toShrineCardModels(api);

          if (cancelled) return;
          if (mySeq !== reqSeq.current) return;
          setShrines(mapped);
        } catch (e: any) {
          if (cancelled) return;
          if (mySeq !== reqSeq.current) return;

          setShrines([]);
          setError(e?.message ?? "Failed to load shrines");
        } finally {
          if (cancelled) return;
          if (mySeq !== reqSeq.current) return;
          setIsLoading(false);
        }
      })();
    }, 250);

    return () => {
      cancelled = true;
      clearTimeout(t);
    };
  }, [userLocation?.lat, userLocation?.lon, q]);

  return {
    shrines,
    isEmpty: shrines.length === 0,
    isLoading,
    error,
    refresh,
  };
}