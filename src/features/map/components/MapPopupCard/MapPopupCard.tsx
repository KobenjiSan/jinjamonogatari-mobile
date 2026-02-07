import React, { ReactNode } from "react";
import { View, StyleSheet, Pressable, Animated } from "react-native";
import type { ShrinePreviewModel } from "../../../shrines/mappers";
import MapPopupCardContent from "./MapPopupCardContent";
import type { LatLon } from "../../../../shared/distance";
import { g } from "../../../../shared/styles/global";
import { colors, spacing, radius } from "../../../../shared/styles/tokens";

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
      {/* Backdrop */}
      <Animated.View
        style={[
          StyleSheet.absoluteFillObject,
          styles.backdrop,
          { opacity: backdropAnim },
        ]}
      >
        <Pressable style={{ flex: 1 }} onPress={onClose} />
      </Animated.View>

      {/* Popup Card */}
      <Animated.View
        style={[
          g.cardNoPadding,
          styles.card,
          {
            opacity: fadeAnim,
            transform: [{ translateY: slideYAnim }],
            bottom: spacing.lg + bottomOffset,
          },
        ]}
      >
        <MapPopupCardContent
          shrine={shrine}
          userLocation={userLocation}
          onClose={onClose}
        >
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
    left: spacing.lg,
    right: spacing.lg,

    backgroundColor: colors.white,
    borderRadius: radius.lg,

    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 6,
  },
});
