import { useEffect, useState } from "react";
import { toEtiquetteGuideModel, type EtiquetteGuideModel } from "./mappers";
import { fetchEtiquetteTopics } from "./api/client";
import { apiToRaw } from "./api/adapter";

export function useEtiquetteGuideApi(): {
  guide: EtiquetteGuideModel;
  isEmpty: boolean;
  isLoading: boolean;
  error: string | null;
} {
  const [guide, setGuide] = useState<EtiquetteGuideModel>({
    atAGlance: [],
    highlights: [],
    fullGuide: [],
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    (async () => {
      try {
        setIsLoading(true);
        setError(null);

        const apiTopics = await fetchEtiquetteTopics();
        const { topics, steps, images, citations, etiquetteCitations } =
          apiToRaw(apiTopics);

        const mapped = toEtiquetteGuideModel(
          topics,
          steps,
          images,
          citations,
          etiquetteCitations,
        );

        if (!cancelled) setGuide(mapped);
      } catch (e: any) {
        if (!cancelled) setError(e?.message ?? "Failed to load etiquette");
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
