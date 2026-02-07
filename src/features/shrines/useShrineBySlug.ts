/**
 * Shrine detail selector (fixture-backed)
 *
 * This module acts as a thin adapter between raw fixture data
 * and the UI-facing shrine detail model.
 *
 * Important:
 * - This is NOT a true data hook yet (no async, no caching)
 * - It exists to mirror the eventual API-based selector
 * - The calling screens should not care where the data comes from
 *
 * When the backend is live:
 * - The JSON import will be replaced by an API response
 * - The mapping call will remain unchanged
 */

import data from "../../../app/_data/test.json";
import {
  toShrineDetailModels,
  type ShrineDetailModel,
  type Shrine,
  type ShrineImage,
  type Tag,
  type ShrineTag,
  type Kami,
  type ShrineKami,
  type Citation,
  type KamiCitation,
  type History,
  type HistoryCitation,
  type Folklore,
  type FolkloreCitation,
} from "./mappers";

/**
 * Returns a fully-hydrated shrine detail model by slug.
 *
 * Current behavior:
 * - Loads data from local fixtures
 * - Resolves all relationships via mappers
 * - Performs an in-memory lookup
 *
 * Future behavior (unchanged API):
 * - Fetch shrine data from backend
 * - Pass response into the same mapper
 * - Preserve identical return shape for UI consumers
 */
export function useShrineBySlug(slug: string): ShrineDetailModel | null {
  /**
   * Extract individual tables from fixture data.
   * Each table mirrors a database table or API resource.
   *
   * Defensive defaults (?? []) allow partial fixtures
   * during development without breaking the app.
   */
  const shrines: Shrine[] = (data as any).shrines ?? [];
  const images: ShrineImage[] = (data as any).images ?? [];
  const tags: Tag[] = (data as any).tags ?? [];
  const shrineTags: ShrineTag[] = (data as any).shrine_tags ?? [];

  const kami: Kami[] = (data as any).kami ?? [];
  const shrineKami: ShrineKami[] = (data as any).shrine_kami ?? [];

  const citations: Citation[] = (data as any).citations ?? [];
  const kamiCitations: KamiCitation[] = (data as any).kami_citations ?? [];

  const history: History[] = (data as any).history ?? [];
  const historyCitations: HistoryCitation[] =
    (data as any).history_citations ?? [];

  const folklore: Folklore[] = (data as any).folklore ?? [];
  const folkloreCitations: FolkloreCitation[] =
    (data as any).folklore_citations ?? [];

  /**
   * Perform a full data composition pass.
   * This produces UI-ready shrine detail models
   * with images, tags, kami, history, and citations resolved.
   */
  const details = toShrineDetailModels(
    shrines,
    images,
    tags,
    shrineTags,
    kami,
    shrineKami,
    citations,
    kamiCitations,
    history,
    historyCitations,
    folklore,
    folkloreCitations,
  );

  /**
   * Select a single shrine by its stable slug.
   * Returning null keeps the UI explicit about
   * missing or invalid routes.
   */
  return details.find((s) => s.slug === slug) ?? null;
}
