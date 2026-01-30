import data from "../../../app/_data/test.json";
import {
  toShrinePreviewModels,
  type ShrinePreviewModel,
  type Shrine,
  type ShrineImage,
  type Tag,
  type ShrineTag,
} from "../shrines/mappers";

export type MapMarker = {
  id: number;
  lat: number;
  lon: number;
};

export function useMapFixtureData(): {
  markers: MapMarker[];
  shrinesById: Map<number, ShrinePreviewModel>;
} {
  const shrines: Shrine[] = (data as any).shrines ?? [];
  const images: ShrineImage[] = (data as any).images ?? [];
  const tags: Tag[] = (data as any).tags ?? [];
  const shrineTags: ShrineTag[] = (data as any).shrine_tags ?? [];

  const previews = toShrinePreviewModels(shrines, images, tags, shrineTags);

  const shrinesById = new Map<number, ShrinePreviewModel>(
    previews.map((s) => [s.shrine_id, s])
  );

  const markers: MapMarker[] = previews
    .filter((s: any) => typeof (s as any).lat === "number" && typeof (s as any).lon === "number")
    .map((s: any) => ({
      id: s.shrine_id,
      lat: s.lat,
      lon: s.lon,
    }));

  return { markers, shrinesById };
}