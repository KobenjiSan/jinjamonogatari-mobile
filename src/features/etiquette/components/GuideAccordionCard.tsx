import React, { useEffect, useRef, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  Animated,
  Easing,
  Platform,
  UIManager,
} from "react-native";
import FontAwesome5 from "@expo/vector-icons/FontAwesome5";

import { t } from "../../../shared/styles/text";
import { spacing, radius } from "../../../shared/styles/tokens";
import { font } from "../../../shared/styles/typography";

import GuideAccordionContent, { type GuideItem } from "./GuideAccordionContent";
import { useTheme } from "../../../shared/theme/useTheme";

if (Platform.OS === "android") {
  UIManager.setLayoutAnimationEnabledExperimental?.(true);
}

type GuideAccordionCardProps = {
  item: GuideItem;
  defaultOpen?: boolean;
  durationMs?: number;
};

export default function GuideAccordionCard({
  item,
  defaultOpen = false,
  durationMs = 360,
}: GuideAccordionCardProps) {
  const theme = useTheme();
  const [open, setOpen] = useState(defaultOpen);

  const progress = useRef(new Animated.Value(defaultOpen ? 1 : 0)).current;
  const rotate = progress.interpolate({
    inputRange: [0, 1],
    outputRange: ["0deg", "180deg"],
  });

  useEffect(() => {
    setOpen(defaultOpen);
    progress.setValue(defaultOpen ? 1 : 0);
  }, [defaultOpen, progress]);

  const toggle = () => {
    const next = !open;
    setOpen(next);

    Animated.timing(progress, {
      toValue: next ? 1 : 0,
      duration: durationMs,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: false,
    }).start();
  };

  return (
    <View style={styles.card}>
      {/* HEADER */}
      <Pressable
        onPress={toggle}
        style={[styles.header, { backgroundColor: "transparent" }]}
        android_ripple={{ color: theme.colors.overlayLight }}
      >
        <View style={styles.headerLeft}>
          <Text
            style={[
              t.title,
              { fontFamily: font.strong, color: theme.colors.textPrimary },
            ]}
            numberOfLines={1}
          >
            {item.title_long ?? "Untitled"}
          </Text>
        </View>

        <Animated.View style={{ transform: [{ rotate }] }}>
          <FontAwesome5
            name="chevron-down"
            size={16}
            color={theme.colors.textSecondary}
          />
        </Animated.View>
      </Pressable>

      {/* CONTENT (controlled) */}
      <GuideAccordionContent
        item={item}
        isOpen={open}
        durationMs={durationMs}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: radius.md,
    overflow: "hidden",
  },

  header: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  headerLeft: {
    flex: 1,
    paddingRight: spacing.md,
  },
});