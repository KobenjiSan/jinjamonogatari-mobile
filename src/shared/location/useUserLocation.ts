import { useEffect, useMemo, useRef, useState } from "react";
import type { LatLon } from "./distance";
import {
  ACTIVE_TEST_USER,
  KYOTO_ANCHOR,
  LOCATION_MODE,
  isInJapan,
} from "./locationConfig";
import * as Location from "expo-location";

export type UserLocationStatus = "ready" | "loading" | "denied" | "error";

export function useUserLocation(): {
  location: LatLon | null;
  status: UserLocationStatus;
} {
  const staticLocation = useMemo(() => {
    if (LOCATION_MODE === "fake_static") return ACTIVE_TEST_USER;
    return null;
  }, []);

  const [location, setLocation] = useState<LatLon | null>(staticLocation);
  const [status, setStatus] = useState<UserLocationStatus>(() => {
    if (LOCATION_MODE === "real_jp" || LOCATION_MODE === "fake_dynamic")
      return "loading";
    return "ready";
  });

  const realAnchorRef = useRef<LatLon | null>(null);

  const lastRealRef = useRef<LatLon | null>(null);

  const watcherRef = useRef<Location.LocationSubscription | null>(null);

  const tickRef = useRef(0);

  const lastEmitRef = useRef(0);
  const lastEmittedLocRef = useRef<LatLon | null>(null);

  function shouldEmit(next: LatLon): boolean {
    const now = Date.now();

    if (now - lastEmitRef.current < 3000) return false;

    const prev = lastEmittedLocRef.current;
    if (prev) {
      const dLat = next.lat - prev.lat;
      const dLon = next.lon - prev.lon;

      const meters = Math.sqrt(dLat * dLat + dLon * dLon) * 111_000;

      if (meters < 10) return false;
    }

    lastEmitRef.current = now;
    lastEmittedLocRef.current = next;
    return true;
  }

  useEffect(() => {
    let cancelled = false;

    function stopWatcher() {
      if (watcherRef.current) {
        watcherRef.current.remove();
        watcherRef.current = null;
      }
    }

    async function start() {
      stopWatcher();

      if (LOCATION_MODE === "fake_static") {
        setLocation(ACTIVE_TEST_USER);
        setStatus("ready");
        return;
      }

      if (LOCATION_MODE === "not_in_japan") {
        setLocation(null);
        setStatus("ready");
        return;
      }

      if (LOCATION_MODE === "real_jp" || LOCATION_MODE === "fake_dynamic") {
        setStatus("loading");

        const perm = await Location.requestForegroundPermissionsAsync();
        if (cancelled) return;

        if (perm.status !== "granted") {
          setLocation(null);
          setStatus("denied");
          return;
        }

        realAnchorRef.current = null;
        lastRealRef.current = null;
        tickRef.current = 0;

        lastEmitRef.current = 0;
        lastEmittedLocRef.current = null;

        watcherRef.current = await Location.watchPositionAsync(
          {
            accuracy: Location.Accuracy.High,
            timeInterval: 1000,
            distanceInterval: 0,
          },
          (pos) => {
            if (cancelled) return;

            const real: LatLon = {
              lat: pos.coords.latitude,
              lon: pos.coords.longitude,
            };

            // console.log("[gps coords]", {
            //   lat: pos.coords.latitude,
            //   lon: pos.coords.longitude,
            //   accuracy: pos.coords.accuracy,
            //   altitudeAccuracy: pos.coords.altitudeAccuracy,
            //   speed: pos.coords.speed,
            //   heading: pos.coords.heading,
            //   timestamp: pos.timestamp,
            // });

            const last = lastRealRef.current;
            if (last && last.lat === real.lat && last.lon === real.lon) {
              return;
            }
            lastRealRef.current = real;

            tickRef.current += 1;

            if (LOCATION_MODE === "real_jp") {
              if (!isInJapan(real)) {
                // console.log(`[real_jp tick ${tickRef.current}] out_of_japan`, {
                //   real,
                // });
                if (shouldEmit({ lat: 0, lon: 0 })) {
                }
                setLocation(null);
                setStatus("ready");
                return;
              }

              // console.log(
              //   `[real_jp tick ${tickRef.current}]`,
              //   new Date().toISOString(),
              //   { real }
              // );

              if (shouldEmit(real)) setLocation(real);
              setStatus("ready");
              return;
            }

            if (LOCATION_MODE === "fake_dynamic") {
              if (!realAnchorRef.current) realAnchorRef.current = real;

              const anchor = realAnchorRef.current;
              const dLat = real.lat - anchor.lat;
              const dLon = real.lon - anchor.lon;

              const kyotoMapped: LatLon = {
                lat: KYOTO_ANCHOR.lat + dLat,
                lon: KYOTO_ANCHOR.lon + dLon,
              };

              // console.log(
              //   `[fake_dynamic tick ${tickRef.current}]`,
              //   new Date().toISOString(),
              //   { real, anchor, mapped: kyotoMapped }
              // );

              if (shouldEmit(kyotoMapped)) setLocation(kyotoMapped);
              setStatus("ready");
              return;
            }
          }
        );

        return;
      }

      // Fallback (shouldn’t happen)
      setLocation(null);
      setStatus("ready");
    }

    start().catch((e) => {
      // console.log("[useUserLocation] error starting watcher", e);
      if (!cancelled) {
        setLocation(null);
        setStatus("error");
      }
    });

    return () => {
      cancelled = true;
      stopWatcher();
    };
  }, []);

  return { location, status };
}