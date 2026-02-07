import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  LayoutChangeEvent,
  Animated,
} from "react-native";
import { g } from "../../../../shared/styles/global";
import { t } from "../../../../shared/styles/text";
import {
  colors,
  spacing,
  radius,
  fontSize,
} from "../../../../shared/styles/tokens";

type Props<T extends readonly string[]> = {
  tabs: T;
  activeTab: T[number];
  onChange: (tab: T[number]) => void;
};

type TabLayout = { x: number; width: number };

export default function ShrineTabBar<T extends readonly string[]>({
  tabs,
  activeTab,
  onChange,
}: Props<T>) {
  const [layouts, setLayouts] = useState<Record<string, TabLayout>>({});

  const translateX = useRef(new Animated.Value(0)).current;
  const indicatorW = useRef(new Animated.Value(0)).current;

  const activeLayout = useMemo(() => {
    return layouts[String(activeTab)];
  }, [layouts, activeTab]);

  useEffect(() => {
    if (!activeLayout) return;

    Animated.parallel([
      Animated.spring(translateX, {
        toValue: activeLayout.x,
        useNativeDriver: false,
        speed: 20,
        bounciness: 6,
      }),
      Animated.spring(indicatorW, {
        toValue: activeLayout.width,
        useNativeDriver: false,
        speed: 20,
        bounciness: 6,
      }),
    ]).start();
  }, [activeLayout, translateX, indicatorW]);

  const onTabLayout =
    (tab: string) =>
    (e: LayoutChangeEvent): void => {
      const { x, width } = e.nativeEvent.layout;

      setLayouts((prev) => {
        const existing = prev[tab];
        if (existing && existing.x === x && existing.width === width)
          return prev;
        return { ...prev, [tab]: { x, width } };
      });
    };

  return (
    <View style={styles.wrap}>
      <View style={[g.rowBetween, styles.tabBar]}>
        {tabs.map((tab) => {
          const active = tab === activeTab;

          return (
            <Pressable
              key={tab}
              onPress={() => onChange(tab)}
              onLayout={onTabLayout(String(tab))}
              style={styles.tabItem}
              hitSlop={10}
            >
              <Text
                style={[
                  t.title,
                  styles.tabText,
                  active && styles.tabTextActive,
                ]}
              >
                {tab}
              </Text>
            </Pressable>
          );
        })}
      </View>

      {/* Baseline */}
      <View style={styles.track} />

      {/* Indicator */}
      <Animated.View
        style={[
          styles.indicator,
          {
            width: indicatorW,
            transform: [{ translateX }],
          },
        ]}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    position: "relative",
    marginBottom: spacing.md,
    paddingHorizontal: spacing.xs,
  },

  tabBar: {
    paddingBottom: spacing.sm,
  },

  tabItem: {
    alignItems: "center",
  },

  tabText: {
    fontSize: fontSize.xxl,
    color: colors.gray500,
  },

  tabTextActive: {
    color: colors.black,
  },

  track: {
    height: 1,
    backgroundColor: colors.gray300,
    width: "100%",
  },

  indicator: {
    position: "absolute",
    left: spacing.xs,
    bottom: 0,
    height: 2,
    backgroundColor: colors.black,
    borderRadius: radius.sm,
  },
});
