import React, { useCallback, useEffect, useRef, useState } from "react";
import { View, StyleSheet, Animated } from "react-native";
import { WebView } from "react-native-webview";
import { buildMapHtml } from "./mapWebView/htmlTemplate";
import type { WebViewMessageEvent } from "react-native-webview";
import MapPopupCard from "./components/MapPopupCard/MapPopupCard";
import { useMapFixtureData } from "./useMapFixtureData";

const kyotoLat = 35.0116;
const kyotoLng = 135.7681;

const MAPTILER_KEY = process.env.EXPO_PUBLIC_MAPTILER_KEY;

if (!MAPTILER_KEY) {
  throw new Error("Missing EXPO_PUBLIC_MAPTILER_KEY");
}

const mapTilerKey: string = MAPTILER_KEY;

type MapWebViewEvent =
  | { type: "MARKER_PRESS"; shrineId: number }
  | { type: string; [key: string]: any };

export default function MapView() {
  const { markers, shrinesById } = useMapFixtureData();

  // Separate "content" from "visibility"
  const [selectedShrineId, setSelectedShrineId] = useState<number | null>(null);
  const [isOpen, setIsOpen] = useState(false);

  const slideY = useRef(new Animated.Value(80)).current;
  const fade = useRef(new Animated.Value(0)).current;
  const backdrop = useRef(new Animated.Value(0)).current;

  const html = buildMapHtml({
    apiKey: mapTilerKey,
    center: { lat: kyotoLat, lng: kyotoLng },
    zoom: 14,
    markers,
  });

  const selectedShrine =
  selectedShrineId != null ? shrinesById.get(selectedShrineId) ?? null : null;

  // Animate whenever open/close changes
  useEffect(() => {
    // Stop any in-flight animations so we don't get stuck mid-state
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
      // After closing animation completes, clear the selected shrine
      if (finished && !isOpen) {
        setSelectedShrineId(null);
      }
    });
  }, [isOpen, fade, slideY, backdrop]);

  const openPopup = useCallback((shrineId: number) => {
    // Set content first, then open (so the card has a title immediately)
    setSelectedShrineId(shrineId);
    setIsOpen(true);
  }, []);

  const closePopup = useCallback(() => {
    // Close first (animate out). Content clears after animation completes.
    setIsOpen(false);
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
  // (selectedShrineId stays until close animation finishes)
  const shouldRenderOverlay = selectedShrineId != null || isOpen;

  return (
    <View style={styles.container}>
      <WebView
        originWhitelist={["*"]}
        source={{ html }}
        javaScriptEnabled
        domStorageEnabled
        onMessage={onMessage}
      />

      {selectedShrine && (
  <MapPopupCard
    isOpen={shouldRenderOverlay}
    fadeAnim={fade}
    slideYAnim={slideY}
    backdropAnim={backdrop}
    shrine={selectedShrine}
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
