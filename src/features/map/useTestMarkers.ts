import data from "../../../app/_data/test.json";

export type MapMarker = {
  id: number;
  title: string;
  lat: number;
  lon: number;
};

export function useTestMarkers(): MapMarker[] {
  const shrines = (data as any).shrines ?? [];

  return shrines
    .filter((s: any) => typeof s.lat === "number" && typeof s.lon === "number")
    .map((s: any) => ({
      id: s.shrine_id,
      title: s.name_en ?? "Unnamed Shrine",
      lat: s.lat,
      lon: s.lon,
    }));
}