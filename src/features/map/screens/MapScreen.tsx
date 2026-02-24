import React, { useCallback, useEffect, useRef, useState } from "react";
import { View, StyleSheet, Animated } from "react-native";
import { WebView } from "react-native-webview";
import type { WebViewMessageEvent } from "react-native-webview";

import { buildMapHtml } from "../components/mapView/htmlTemplate";
import MapPopupCard from "../components/previewPopup/MapPopupCard";
import { useMapShrinePointsApi } from "../api/hooks/useMapShrinePoints";
import { useShrinePreviewApi } from "../api/hooks/useShrinePreview";
import { useUserLocation } from "../../../shared/useUserLocation";
import { useMarkerIcons } from "../api/hooks/useMarkerIcons";
import { useBottomTabBarHeight } from "@react-navigation/bottom-tabs";

const DEFAULT_CENTER = { lat: 35.0116, lng: 135.7681 }; // Kyoto

const MAPTILER_KEY = process.env.EXPO_PUBLIC_MAPTILER_KEY;

if (!MAPTILER_KEY) {
  throw new Error("Missing EXPO_PUBLIC_MAPTILER_KEY");
}

const mapTilerKey: string = MAPTILER_KEY;

type MapWebViewEvent =
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
  const { preview: selectedShrine } = useShrinePreviewApi(selectedSlug);

  // Anim values (must always run, no early returns above this)
  const slideY = useRef(new Animated.Value(80)).current;
  const fade = useRef(new Animated.Value(0)).current;
  const backdrop = useRef(new Animated.Value(0)).current;
  const webRef = useRef<WebView>(null);

  const initialCenter = userLocation
    ? { lat: userLocation.lat, lng: userLocation.lon }
    : DEFAULT_CENTER;

  // Build HTML only when icons are ready (prevents hook-order bugs)
  const html = markerIcons
    ? buildMapHtml({
        apiKey: mapTilerKey,
        center: initialCenter,
        zoom: 15,
        markers,
        userLocation: userLocation ?? undefined,
        markerIcons,
      })
    : null;

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

    webRef.current?.postMessage(
      JSON.stringify({ type: "CLEAR_SELECTED_SHRINE" }),
    );
  }, []);

  const onMessage = useCallback(
    (event: WebViewMessageEvent) => {
      try {
        const msg = JSON.parse(event.nativeEvent.data) as MapWebViewEvent;

        if (msg.type === "MARKER_PRESS") {
          openPopup(msg.shrineId);
        }
      } catch (err) {
        console.log("WebView message parse failed:", err);
      }
    },
    [openPopup],
  );

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

      {selectedShrine && (
        <MapPopupCard
          isOpen={shouldRenderOverlay}
          fadeAnim={fade}
          slideYAnim={slideY}
          backdropAnim={backdrop}
          shrine={selectedShrine}
          userLocation={userLocation}
          onClose={closePopup}
          bottomOffset={tabBarHeight}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "transparent",
  },
});
