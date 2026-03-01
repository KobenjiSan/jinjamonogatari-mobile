import React, { ReactNode } from "react";
import { View, StyleSheet, Pressable, Animated } from "react-native";
import type { ShrinePreviewModel } from "../../../shrines/shrineScreen/mappers/shrine.mappers";
import MapPopupCardContent from "./MapPopupCardContent";
import { g } from "../../../../shared/styles/global";
import { spacing, radius } from "../../../../shared/styles/tokens";
import type { LatLon } from "../../../../shared/location/distance";
import { useTheme } from "../../../../shared/theme/useTheme";

type MapPopupCardProps = {
  isOpen: boolean;

  fadeAnim: Animated.Value;
  slideYAnim: Animated.Value;
  backdropAnim: Animated.Value;

  shrine: ShrinePreviewModel;
  onClose: () => void;

  origin: LatLon | null;

  bottomOffset?: number;
  children?: ReactNode;
};

export default function MapPopupCard({
  isOpen,
  fadeAnim,
  slideYAnim,
  backdropAnim,
  shrine,
  onClose,
  origin,
  bottomOffset = 0,
  children,
}: MapPopupCardProps) {
  const theme = useTheme();

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
            backgroundColor: theme.colors.bgCard,
            opacity: fadeAnim,
            transform: [{ translateY: slideYAnim }],
            bottom: spacing.lg + bottomOffset,
          },
        ]}
      >
        <MapPopupCardContent shrine={shrine} onClose={onClose} origin={origin}>
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

    borderRadius: radius.lg,

    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 6,
  },
});
