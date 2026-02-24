import type { ShrineMapPointApi } from "../clients/shrinePoints.client";

export type MapMarkerModel = {
  id: number;
  lat: number;
  lon: number;
  slug: string;
};

export function toMapMarkerModels(
  points: ShrineMapPointApi[],
): MapMarkerModel[] {
  return (points ?? []).map((p) => ({
    id: p.shrineId,
    lat: p.lat,
    lon: p.lon,
    slug: p.slug,
  }));
}

export function toSlugById(points: ShrineMapPointApi[]): Map<number, string> {
  return new Map<number, string>((points ?? []).map((p) => [p.shrineId, p.slug]));
}