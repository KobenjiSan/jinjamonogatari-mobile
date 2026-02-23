import { useEffect, useState } from "react";
import { fetchEtiquetteTopics } from "./api/client";
import { toEtiquetteGuideModel, type EtiquetteGuideModel } from "./mappers";

const EMPTY_GUIDE: EtiquetteGuideModel = {
  atAGlance: [],
  highlights: [],
  fullGuide: [],
};

export function useEtiquetteGuideApi(): {
  guide: EtiquetteGuideModel;
  isEmpty: boolean;
  isLoading: boolean;
  error: string | null;
} {
  const [guide, setGuide] = useState<EtiquetteGuideModel>(EMPTY_GUIDE);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    (async () => {
      try {
        setIsLoading(true);
        setError(null);

        const apiTopics = await fetchEtiquetteTopics();
        const mapped = toEtiquetteGuideModel(apiTopics);

        if (!cancelled) setGuide(mapped);
      } catch (e: any) {
        if (!cancelled) {
          setGuide(EMPTY_GUIDE);
          setError(e?.message ?? "Failed to load etiquette");
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
    guide,
    isEmpty: guide.fullGuide.length === 0,
    isLoading,
    error,
  };
}