// MapScreen.tsx
import React, { useCallback, useEffect, useRef, useState } from "react";
import { View, StyleSheet, Animated, Pressable, Text } from "react-native";
import { WebView } from "react-native-webview";
import type { WebViewMessageEvent } from "react-native-webview";

import { buildMapHtml } from "../components/mapView/htmlTemplate";
import MapPopupCard from "../components/previewPopup/MapPopupCard";
import { useMapShrinePointsApi } from "../api/hooks/useMapShrinePoints";
import { useShrinePreview } from "../api/hooks/useShrinePreview";
import { useUserLocation } from "../../../shared/location/useUserLocation";
import { useMarkerIcons } from "../api/hooks/useMarkerIcons";
import { useBottomTabBarHeight } from "@react-navigation/bottom-tabs";

const DEFAULT_CENTER = { lat: 35.0116, lng: 135.7681 }; // Kyoto

const MAPTILER_KEY = process.env.EXPO_PUBLIC_MAPTILER_KEY;
if (!MAPTILER_KEY) throw new Error("Missing EXPO_PUBLIC_MAPTILER_KEY");
const mapTilerKey: string = MAPTILER_KEY;

type MapWebViewEvent =
  | { type: "MAP_READY" }
  | { type: "MARKER_PRESS"; shrineId: number }
  | { type: string; [key: string]: any };

export default function MapScreen() {
  const tabBarHeight = useBottomTabBarHeight();

  // Data hooks
  const { markers, slugById } = useMapShrinePointsApi();
  const { location: userLocation } = useUserLocation();
  const markerIcons = useMarkerIcons();

  // Selection + popup state
  const [selectedShrineId, setSelectedShrineId] = useState<number | null>(null);
  const [isOpen, setIsOpen] = useState(false);

  const [selectedSlug, setSelectedSlug] = useState<string | null>(null);
  const { preview: selectedShrine } = useShrinePreview(
    selectedSlug,
    userLocation,
  );

  // Anim values (must always run, no early returns above this)
  const slideY = useRef(new Animated.Value(80)).current;
  const fade = useRef(new Animated.Value(0)).current;
  const backdrop = useRef(new Animated.Value(0)).current;

  const webRef = useRef<WebView>(null);

  // Gate messaging until WebView signals ready
  const [mapReady, setMapReady] = useState(false);
  const lastLocRef = useRef<typeof userLocation>(null);

  // Follow toggle for camera tracking
  const [followOn, setFollowOn] = useState(true);

  const sendToMap = useCallback((msg: any) => {
    webRef.current?.postMessage(JSON.stringify(msg));
  }, []);

  // IMPORTANT:
  // Build HTML WITHOUT userLocation so WebView does NOT reload on GPS updates.
  const html = markerIcons
    ? buildMapHtml({
        apiKey: mapTilerKey,
        center: DEFAULT_CENTER,
        zoom: 15,
        markers,
        userLocation: undefined,
        markerIcons,
      })
    : null;

  // If WebView reloads (e.g., hot reload), reset readiness so we re-send location
  useEffect(() => {
    setMapReady(false);
  }, [html]);

  // Track last known location
  useEffect(() => {
    lastLocRef.current = userLocation ?? null;
  }, [userLocation]);

  // Push user location updates into the WebView (no reload, no camera reset)
  useEffect(() => {
    if (!mapReady) return;
    if (!userLocation) return;

    sendToMap({
      type: "USER_LOCATION_UPDATE",
      lat: userLocation.lat,
      lon: userLocation.lon,
    });
  }, [mapReady, userLocation, sendToMap]);

  // Animate whenever open/close changes
  useEffect(() => {
    slideY.stopAnimation();
    fade.stopAnimation();
    backdrop.stopAnimation();

    Animated.parallel([
      Animated.timing(fade, {
        toValue: isOpen ? 1 : 0,
        duration: 180,
        useNativeDriver: true,
      }),
      Animated.timing(slideY, {
        toValue: isOpen ? 0 : 80,
        duration: 220,
        useNativeDriver: true,
      }),
      Animated.timing(backdrop, {
        toValue: isOpen ? 1 : 0,
        duration: 180,
        useNativeDriver: true,
      }),
    ]).start(({ finished }) => {
      if (finished && !isOpen) {
        setSelectedShrineId(null);
        setSelectedSlug(null);
      }
    });
  }, [isOpen, fade, slideY, backdrop]);

  const openPopup = useCallback(
    (shrineId: number) => {
      setSelectedShrineId(shrineId);

      const slug = slugById.get(shrineId) ?? null;
      setSelectedSlug(slug);

      setIsOpen(true);
    },
    [slugById],
  );

  const closePopup = useCallback(() => {
    setIsOpen(false);
    setSelectedSlug(null);

    sendToMap({ type: "CLEAR_SELECTED_SHRINE" });
  }, [sendToMap]);

  const onMessage = useCallback(
    (event: WebViewMessageEvent) => {
      try {
        const msg = JSON.parse(event.nativeEvent.data) as MapWebViewEvent;

        if (msg.type === "MAP_READY") {
          setMapReady(true);

          // Sync follow mode on ready (prevents desync after reloads)
          sendToMap({ type: followOn ? "FOLLOW_ON" : "FOLLOW_OFF" });

          // Immediately show the dot if we already have a location
          const loc = lastLocRef.current;
          if (loc) {
            sendToMap({
              type: "USER_LOCATION_UPDATE",
              lat: loc.lat,
              lon: loc.lon,
            });
          }
          return;
        }

        if (msg.type === "MARKER_PRESS") {
          openPopup(msg.shrineId);
          return;
        }
      } catch (err) {
        console.log("WebView message parse failed:", err);
      }
    },
    [openPopup, sendToMap, followOn],
  );

  const toggleFollow = useCallback(() => {
    setFollowOn((prev) => {
      const next = !prev;

      if (next) {
        // Turn follow back on; if we have a location, also recenter
        if (userLocation) {
          sendToMap({
            type: "RECENTER_USER",
            lat: userLocation.lat,
            lon: userLocation.lon,
          });
        } else {
          sendToMap({ type: "FOLLOW_ON" });
        }
      } else {
        sendToMap({ type: "FOLLOW_OFF" });
      }

      return next;
    });
  }, [sendToMap, userLocation]);

  // Only mount overlay layers while open OR while closing animation is running
  const shouldRenderOverlay = selectedShrineId != null || isOpen;

  return (
    <View style={styles.container}>
      {html ? (
        <WebView
          ref={webRef}
          originWhitelist={["*"]}
          source={{ html }}
          javaScriptEnabled
          domStorageEnabled
          onMessage={onMessage}
        />
      ) : (
        // Placeholder while marker icons load
        <View style={styles.container} />
      )}

      {/* Track / Follow button (big circle, bottom-right, above tab bar) */}
      <Pressable
        onPress={toggleFollow}
        style={({ pressed }) => [
          styles.trackBtn,
          { bottom: tabBarHeight + 18 },
          pressed && { transform: [{ scale: 0.97 }] },
          followOn ? styles.trackBtnOn : styles.trackBtnOff,
        ]}
      >
        <Text style={styles.trackBtnText}>{followOn ? "◎" : "○"}</Text>
      </Pressable>

      {selectedShrine && (
        <MapPopupCard
          isOpen={shouldRenderOverlay}
          fadeAnim={fade}
          slideYAnim={slideY}
          backdropAnim={backdrop}
          shrine={selectedShrine}
          onClose={closePopup}
          bottomOffset={tabBarHeight}
        />
      )}
    </View>
  );
}

const BTN_SIZE = 64;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "transparent",
  },

  trackBtn: {
    position: "absolute",
    right: 16,
    width: BTN_SIZE,
    height: BTN_SIZE,
    borderRadius: BTN_SIZE / 2,
    alignItems: "center",
    justifyContent: "center",
  },

  trackBtnOn: {
    backgroundColor: "rgba(0, 0, 0, 0.95)",
    borderWidth: 2,
    borderColor: "rgba(255,255,255,0.9)",
  },

  trackBtnOff: {
    backgroundColor: "rgba(0,0,0,0.65)",
    borderWidth: 2,
    borderColor: "rgba(255,255,255,0.55)",
  },

  trackBtnText: {
    color: "#fff",
    fontSize: 26,
    fontWeight: "800",
    lineHeight: 28,
  },
});