import { useEffect, useState } from "react";
import { fetchShrineMapPoints } from "../clients/shrinePoints.client";
import { toMapMarkerModels, toSlugById, type MapMarkerModel } from "../mappers/shrinePoints.mapper";

export function useMapShrinePointsApi(): {
  markers: MapMarkerModel[];
  slugById: Map<number, string>;
  isEmpty: boolean;
  isLoading: boolean;
  error: string | null;
} {
  const [markers, setMarkers] = useState<MapMarkerModel[]>([]);
  const [slugById, setSlugById] = useState<Map<number, string>>(new Map());
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    (async () => {
      try {
        setIsLoading(true);
        setError(null);

        const apiPoints = await fetchShrineMapPoints();

        const mappedMarkers = toMapMarkerModels(apiPoints);
        const mappedSlugById = toSlugById(apiPoints);

        if (!cancelled) {
          setMarkers(mappedMarkers);
          setSlugById(mappedSlugById);
        }
      } catch (e: any) {
        if (!cancelled) {
          setMarkers([]);
          setSlugById(new Map());
          setError(e?.message ?? "Failed to load shrine map points");
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
    markers,
    slugById,
    isEmpty: markers.length === 0,
    isLoading,
    error,
  };
}