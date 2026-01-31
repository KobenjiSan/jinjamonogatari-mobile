import { useMemo } from "react";
import type { LatLon } from "./distance";

export type UserLocationStatus = "ready" | "loading" | "denied" | "error";

// Dev toggle
const USE_FAKE_LOCATION = true;

// Test User Locations
export const TEST_USERS = {
  base: { lat: 35.0122, lon: 135.7702 },
  kyotoStation: { lat: 34.9855, lon: 135.7586 },
  arashiyama: { lat: 35.0094, lon: 135.6668 },
  osaka: { lat: 34.6937, lon: 135.5023 },
  shrineGate: { lat: 35.0070, lon: 135.7743 },
  oneStreetOver: { lat: 35.0069, lon: 135.7752 },
} satisfies Record<string, LatLon>;

const ACTIVE_TEST_USER: LatLon = TEST_USERS.oneStreetOver;

export function useUserLocation(): {
  location: LatLon | null;
  status: UserLocationStatus;
} {
  const location = useMemo(
    () => (USE_FAKE_LOCATION ? ACTIVE_TEST_USER : null),
    []
  );

  return {
    location,
    status: "ready",
  };
}