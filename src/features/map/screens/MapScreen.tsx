import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  View,
  StyleSheet,
  Animated,
  Pressable,
  Text,
  StatusBar,
  Platform,
} from "react-native";
import { useRouter } from "expo-router";
import { WebView } from "react-native-webview";
import type { WebViewMessageEvent } from "react-native-webview";

import { buildMapHtml } from "../components/mapView/htmlTemplate";
import MapPopupCard from "../components/previewPopup/MapPopupCard";
import { useMapShrinePointsApi } from "../api/hooks/useMapShrinePoints";
import { useShrinePreview } from "../api/hooks/useShrinePreview";
import { useUserLocation } from "../../../shared/location/useUserLocation";
import { useMarkerIcons } from "../api/hooks/useMarkerIcons";
import { useBottomTabBarHeight } from "@react-navigation/bottom-tabs";
import SearchBar from "../../../shared/components/SearchBar";
import { spacing } from "../../../shared/styles/tokens";
import { useTheme } from "../../../shared/theme/useTheme";

import MapViewWeb from "../components/mapView/MapViewWeb";

const TOP_PADDING =
  Platform.OS === "android" ? (StatusBar.currentHeight ?? 0) : Platform.OS === "web" ? 16 : 44;

const DEFAULT_CENTER = { lat: 35.0116, lng: 135.7681 }; // Kyoto

const MAPTILER_KEY = process.env.EXPO_PUBLIC_MAPTILER_KEY;
if (!MAPTILER_KEY) throw new Error("Missing EXPO_PUBLIC_MAPTILER_KEY");
const mapTilerKey: string = MAPTILER_KEY;

const LIGHT_STYLE_ID = "019c2031-d766-7298-bdc2-c88076ef2f99";
const DARK_STYLE_ID = "dataviz-dark";

function mapTilerStyleUrl(styleId: string) {
  return `https://api.maptiler.com/maps/${styleId}/style.json`;
}

type MapWebViewEvent =
  | { type: "MAP_READY" }
  | { type: "MARKER_PRESS"; shrineId: number }
  | { type: string; [key: string]: any };

export default function MapScreen() {
  const theme = useTheme();
  const router = useRouter();
  const [mapQuery, setMapQuery] = useState("");

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

const styleUrl = useMemo(() => {
  return theme.mode === "dark"
    ? mapTilerStyleUrl(DARK_STYLE_ID)
    : mapTilerStyleUrl(LIGHT_STYLE_ID);
}, [theme.mode]);

  // IMPORTANT:
  // Build HTML WITHOUT userLocation so WebView does NOT reload on GPS updates.
  const html = markerIcons
    ? buildMapHtml({
        apiKey: mapTilerKey,
        mapStyleUrl: styleUrl,
        center: DEFAULT_CENTER,
        zoom: 15,
        markers,
        userLocation: undefined,
        markerIcons,
      })
    : null;

  // If WebView reloads (e.g., hot reload), reset readiness so re-send location
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
    setSelectedShrineId(null);

    sendToMap({ type: "CLEAR_SELECTED_SHRINE" });
  }, [sendToMap]);

  const onMessage = useCallback(
    (event: WebViewMessageEvent) => {
      try {
        const msg = JSON.parse(event.nativeEvent.data) as MapWebViewEvent;

        if (msg.type === "MAP_READY") {
          setMapReady(true);

          sendToMap({ type: followOn ? "FOLLOW_ON" : "FOLLOW_OFF" });

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
      {/* {html ? (
        <WebView
          ref={webRef}
          originWhitelist={["*"]}
          source={{ html }}
          javaScriptEnabled
          domStorageEnabled
          onMessage={onMessage}
        />
      ) : (
        <View style={styles.container} />
      )} */}

      <MapViewWeb
        apiKey={mapTilerKey}
        markers={markers}
        markerIcons={markerIcons}
        onMarkerPress={openPopup}
        selectedShrineId={selectedShrineId}
        userLocation={userLocation}
        followOn={followOn}
        mapStyleUrl={styleUrl}
      />

      <View style={styles.searchOverlay} pointerEvents="box-none">
        <View style={styles.searchInner}>
          <SearchBar
            value={mapQuery}
            onChangeText={setMapQuery}
            placeholder="Search shrines..."
            onPress={() =>
              router.push({
                pathname: "/(tabs)/list",
                params: { q: mapQuery },
              })
            }
            onClear={() => setMapQuery("")}
          />
        </View>
      </View>

      {/* Track / Follow button */}
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
          origin={userLocation}
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
    backgroundColor: "rgba(0, 0, 0, 0.71)",
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

  searchOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
  },

  searchInner: {
    paddingTop: TOP_PADDING + spacing.md,
    paddingHorizontal: 20,
  },
});
