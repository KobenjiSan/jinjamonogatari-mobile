import { Linking, Platform } from "react-native";

export type LatLon = { lat: number; lon: number };

type OpenDirectionsArgs = {
  lat: number;
  lon: number;
  label?: string;
  origin?: LatLon | null;
};

/**
 * Opens directions in Google Maps.
 * If origin is provided, routes from that origin instead of the device's current location.
 */
export async function openDirectionsToShrine({
  lat,
  lon,
  label,
  origin,
}: OpenDirectionsArgs) {
  if (!Number.isFinite(lat) || !Number.isFinite(lon)) {
    console.warn("openDirectionsToShrine: invalid destination", { lat, lon });
    return;
  }

  const destination = `${lat},${lon}`;

  const hasOrigin =
    !!origin &&
    Number.isFinite(origin.lat) &&
    Number.isFinite(origin.lon);

  const originStr = hasOrigin ? `${origin!.lat},${origin!.lon}` : null;

  const encodedDestination = encodeURIComponent(destination);
  const encodedOrigin = originStr ? encodeURIComponent(originStr) : "";

  // Native schemes
  const nativeUrl =
    Platform.OS === "ios"
      ? hasOrigin
        // iOS Google Maps
        ? `comgooglemaps://?saddr=${originStr}&daddr=${destination}&directionsmode=walking`
        : `comgooglemaps://?daddr=${destination}&directionsmode=walking`
      : hasOrigin
        // Android google.navigation
        ? `google.navigation:q=${destination}&origin=${originStr}&mode=w`
        : `google.navigation:q=${destination}&mode=w`;

  // Fallback
  const webUrl = hasOrigin
    ? `https://www.google.com/maps/dir/?api=1&origin=${encodedOrigin}&destination=${encodedDestination}&travelmode=walking`
    : `https://www.google.com/maps/dir/?api=1&destination=${encodedDestination}&travelmode=walking`;

  try {
    const canOpenNative = await Linking.canOpenURL(nativeUrl);
    if (canOpenNative) {
      await Linking.openURL(nativeUrl);
      return;
    }

    await Linking.openURL(webUrl);
  } catch (err) {
    console.warn("openDirectionsToShrine: failed to open maps", err);
  }
}