import { useCallback, useEffect, useRef, useState } from "react";
import { getShrineCollectionCards } from "./collection.client";
import {
  CollectionShrineCardModel,
  mapShrinePreviewDtoToCollectionCardModel,
} from "./collection.mapper";
import type { LatLon } from "../../../shared/location/distance";

type Status = "idle" | "loading" | "error";

export function useCollectionCards(userLocation: LatLon | null) {
  const [cards, setCards] = useState<CollectionShrineCardModel[]>([]);
  const [status, setStatus] = useState<Status>("idle");
  const [error, setError] = useState<string | null>(null);

  // prevents late responses overwriting new state (same pattern you used)
  const reqSeq = useRef(0);

  const refresh = useCallback(async () => {
    const mySeq = ++reqSeq.current;
    setStatus("loading");
    setError(null);

    try {
      const res = await getShrineCollectionCards(
        userLocation?.lat ?? null,
        userLocation?.lon ?? null
      );
      if (mySeq !== reqSeq.current) return;

      const mapped =
        Array.isArray(res?.cards) ? res.cards.map(mapShrinePreviewDtoToCollectionCardModel) : [];

      setCards(mapped);
      setStatus("idle");
    } catch (e: any) {
      if (mySeq !== reqSeq.current) return;

      setStatus("error");
      setError(e?.message ?? "Failed to load saved shrines");
      setCards([]);
    }
  }, [userLocation?.lat, userLocation?.lon]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  return {
    cards,
    status,
    error,
    isLoading: status === "loading",
    isEmpty: status === "idle" && !error && cards.length === 0,
    refresh,
  };
}