import React, { ReactNode } from "react";
import { View, StyleSheet, Pressable, Animated } from "react-native";
import type { ShrinePreviewModel } from "../../../shrines/mappers";
import MapPopupCardContent from "./MapPopupCardContent";
import type { LatLon } from "../../../../shared/distance";

type MapPopupCardProps = {
  isOpen: boolean;

  fadeAnim: Animated.Value;
  slideYAnim: Animated.Value;
  backdropAnim: Animated.Value;

  shrine: ShrinePreviewModel;
  userLocation: LatLon | null;
  onClose: () => void;

  bottomOffset?: number;

  children?: ReactNode;
};

export default function MapPopupCard({
  isOpen,
  fadeAnim,
  slideYAnim,
  backdropAnim,
  shrine,
  userLocation,
  onClose,
  bottomOffset = 0,
  children,
}: MapPopupCardProps) {
  if (!isOpen) return null;

  return (
    <>
      {/* Dimmed backdrop */}
      <Animated.View
        style={[
          StyleSheet.absoluteFillObject,
          styles.backdrop,
          { opacity: backdropAnim },
        ]}
      >
        <Pressable style={{ flex: 1 }} onPress={onClose} />
      </Animated.View>

      {/* Bottom popup card */}
      <Animated.View
        style={[
          styles.card,
          {
            opacity: fadeAnim,
            transform: [{ translateY: slideYAnim }],
            bottom: 16 + bottomOffset,
          },
        ]}
      >
        <MapPopupCardContent shrine={shrine} userLocation={userLocation} onClose={onClose}>
          {children}
        </MapPopupCardContent>
      </Animated.View>
    </>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    backgroundColor: "rgba(0,0,0,0.45)",
  },

  card: {
    position: "absolute",
    left: 16,
    right: 16,

    backgroundColor: "#fff",
    borderRadius: 12,

    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 6,
  },
});
