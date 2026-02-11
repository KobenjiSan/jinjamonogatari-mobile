/**
 * Etiquette guide selector (fixture-backed)
 *
 * Thin adapter between raw fixture data and UI-facing etiquette models.
 *
 * Important:
 * - NOT a true hook yet (no async, no caching)
 * - Mirrors the eventual API-based selector
 * - Screens should not care where the data comes from
 *
 * Future behavior (unchanged API):
 * - Fetch etiquette data from backend
 * - Pass response into the same mapper
 * - Preserve identical return shape for UI consumers
 */

import data from "../../../app/_data/test.json";
import {
  toEtiquetteGuideModel,
  type EtiquetteGuideModel,
  type EtiquetteTopic,
  type EtiquetteStep,
  type Image,
  type Citation,
  type EtiquetteCitation,
} from "./mappers";

export function useEtiquetteGuide(): {
  guide: EtiquetteGuideModel;
  isEmpty: boolean;
} {
  const topics: EtiquetteTopic[] = (data as any).etiquette_topics ?? [];
  const steps: EtiquetteStep[] = (data as any).etiquette_steps ?? [];
  const images: Image[] = (data as any).images ?? [];
  const citations: Citation[] = (data as any).citations ?? [];
  const etiquetteCitations: EtiquetteCitation[] =
    (data as any).etiquette_citations ?? [];

  const guide = toEtiquetteGuideModel(
    topics,
    steps,
    images,
    citations,
    etiquetteCitations,
  );

  return { guide, isEmpty: guide.fullGuide.length === 0 };
}
