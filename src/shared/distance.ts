export type LatLon = { lat: number; lon: number };

const EARTH_RADIUS_M = 6371000;

function toRad(deg: number) {
  return (deg * Math.PI) / 180;
}

export function haversineMeters(a: LatLon, b: LatLon): number {
  const dLat = toRad(b.lat - a.lat);
  const dLon = toRad(b.lon - a.lon);

  const lat1 = toRad(a.lat);
  const lat2 = toRad(b.lat);

  const sinDLat = Math.sin(dLat / 2);
  const sinDLon = Math.sin(dLon / 2);

  const h =
    sinDLat * sinDLat +
    Math.cos(lat1) * Math.cos(lat2) * sinDLon * sinDLon;

  const c = 2 * Math.atan2(Math.sqrt(h), Math.sqrt(1 - h));
  return EARTH_RADIUS_M * c;
}

export function formatDistance(meters: number): string {
  if (!Number.isFinite(meters)) return "—";

  if (meters < 1000) {
    // round to nearest 10m for cleaner look
    const rounded = Math.max(0, Math.round(meters / 10) * 10);
    return `${rounded} m`;
  }

  const km = meters / 1000;
  return `${km.toFixed(1)} km`;
}

export function getDistanceLabel(
  userLocation: LatLon | null,
  shrineLat?: number | null,
  shrineLon?: number | null
): string | null {
  if (!userLocation) return null;
  if (typeof shrineLat !== "number" || typeof shrineLon !== "number") return null;

  const meters = haversineMeters(userLocation, { lat: shrineLat, lon: shrineLon });
  return formatDistance(meters);
}