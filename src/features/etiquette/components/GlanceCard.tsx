import React from "react";
import { Text, StyleSheet, Animated, Pressable } from "react-native";
import { g } from "../../../shared/styles/global";
import { t } from "../../../shared/styles/text";
import { colors, spacing } from "../../../shared/styles/tokens";
import { font } from "../../../shared/styles/typography";

import FontAwesome5 from "@expo/vector-icons/FontAwesome5";
import FontAwesome6 from "@expo/vector-icons/FontAwesome6";

import { usePressScale } from "../../../shared/gestures/usePressScale";

type GlanceCardProps = {
  icon_key: string;
  icon_set: "fa5" | "fa6";
  title: string;
  onPress?: () => void;
};

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

const GlanceCard = ({ icon_key, icon_set, title, onPress }: GlanceCardProps) => {
  const Icon = icon_set === "fa6" ? FontAwesome6 : FontAwesome5;

  const { scale, handlers } = usePressScale(0.94);

  return (
    <AnimatedPressable
      {...handlers}
      onPress={onPress}
      style={[
        g.card,
        styles.card,
        {
          transform: [{ scale }],
        },
      ]}
    >
      <Icon name={icon_key as any} size={28} color={colors.textPrimary} />

      <Text style={[t.small, { fontFamily: font.strong }]} numberOfLines={1}>
        {title}
      </Text>
    </AnimatedPressable>
  );
};

export default GlanceCard;

const styles = StyleSheet.create({
  card: {
    flexDirection: "column",
    alignItems: "center",
    gap: spacing.md,
    width: "30%",
    paddingHorizontal: spacing.sm,
  },
});