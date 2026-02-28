import type { LatLon } from "./distance";

export type LocationMode =
  | "real_jp"
  | "not_in_japan"
  | "fake_static"
  | "fake_dynamic";

export const LOCATION_MODE: LocationMode = "fake_static";

export const JAPAN_BOUNDS: [[number, number], [number, number]] = [
  [128.0, 28.0],   // [minLon, minLat]
  [148.0, 45.75],  // [maxLon, maxLat]
];

export const TEST_USERS = {
  base: { lat: 35.0122, lon: 135.7702 },
  kyotoStation: { lat: 34.9855, lon: 135.7586 },
  arashiyama: { lat: 35.0094, lon: 135.6668 },
  osaka: { lat: 34.6937, lon: 135.5023 },
  shrineGate: { lat: 35.0070, lon: 135.7743 },
  oneStreetOver: { lat: 35.0069, lon: 135.7752 },
} satisfies Record<string, LatLon>;

export const ACTIVE_TEST_USER: LatLon = TEST_USERS.oneStreetOver;

export function isInJapan(loc: LatLon): boolean {
  const [[minLon, minLat], [maxLon, maxLat]] = JAPAN_BOUNDS;
  return (
    loc.lon >= minLon &&
    loc.lon <= maxLon &&
    loc.lat >= minLat &&
    loc.lat <= maxLat
  );
}

export const KYOTO_ANCHOR: LatLon = TEST_USERS.shrineGate;