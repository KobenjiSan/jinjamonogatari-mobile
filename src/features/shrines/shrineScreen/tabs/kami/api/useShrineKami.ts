import { useEffect, useState } from "react";
import { fetchShrineKamiBySlug } from "./shrineKami.client";
import { toKamiModels, type KamiModel } from "./shrineKami.mapper";

/** Simple module-level cache: slug -> mapped kami list */
const kamiCache = new Map<string, KamiModel[]>();

export function useShrineKamiApi(
  slug: string | null,
  enabled: boolean,
): {
  kami: KamiModel[];
  isLoading: boolean;
  error: string | null;
} {
  const [kami, setKami] = useState<KamiModel[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    // Reset when not active / no slug
    if (!slug || !enabled) {
      setIsLoading(false);
      setError(null);
      // keep current kami in state (so tab switching doesn't blank UI)
      return;
    }
    
    const cached = kamiCache.get(slug);
    if (cached) {
      setKami(cached);
      setIsLoading(false);
      setError(null);
      return;
    }

    (async () => {
      try {
        setIsLoading(true);
        setError(null);

        const api = await fetchShrineKamiBySlug(slug);
        const mapped = toKamiModels(api);

        kamiCache.set(slug, mapped);

        if (!cancelled) setKami(mapped);
      } catch (e: any) {
        if (!cancelled) {
          setKami([]);
          setError(e?.message ?? "Failed to load kami");
        }
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [slug, enabled]);

  return { kami, isLoading, error };
}