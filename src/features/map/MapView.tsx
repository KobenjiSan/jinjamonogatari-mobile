import React, { useCallback, useEffect, useRef, useState } from "react";
import { View, StyleSheet, Animated } from "react-native";
import { WebView } from "react-native-webview";
import type { WebViewMessageEvent } from "react-native-webview";

import { buildMapHtml } from "./mapWebView/htmlTemplate";
import MapPopupCard from "./components/MapPopupCard/MapPopupCard";
import { useMapFixtureData } from "./useMapFixtureData";
import { useUserLocation } from "../../shared/useUserLocation";
import { useMarkerIcons } from "./useMarkerIcons";

const DEFAULT_CENTER = { lat: 35.0116, lng: 135.7681 }; // Kyoto

const MAPTILER_KEY = process.env.EXPO_PUBLIC_MAPTILER_KEY;

if (!MAPTILER_KEY) {
  throw new Error("Missing EXPO_PUBLIC_MAPTILER_KEY");
}

const mapTilerKey: string = MAPTILER_KEY;

type MapWebViewEvent =
  | { type: "MARKER_PRESS"; shrineId: number }
  | { type: string; [key: string]: any };

export default function MapView() {
  // Data hooks
  const { markers, shrinesById } = useMapFixtureData();
  const { location: userLocation } = useUserLocation();
  const markerIcons = useMarkerIcons();

  // Selection + popup state
  const [selectedShrineId, setSelectedShrineId] = useState<number | null>(null);
  const [isOpen, setIsOpen] = useState(false);

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

  const selectedShrine =
    selectedShrineId != null ? shrinesById.get(selectedShrineId) ?? null : null;

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
      }
    });
  }, [isOpen, fade, slideY, backdrop]);

  const openPopup = useCallback((shrineId: number) => {
    setSelectedShrineId(shrineId);
    setIsOpen(true);
  }, []);

  const closePopup = useCallback(() => {
    setIsOpen(false);

    webRef.current?.postMessage(
      JSON.stringify({ type: "CLEAR_SELECTED_SHRINE" })
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
    [openPopup]
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