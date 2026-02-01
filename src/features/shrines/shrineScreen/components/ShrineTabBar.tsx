import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  LayoutChangeEvent,
  Animated,
} from "react-native";

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
  // Store measured x/width for each tab by label
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
        useNativeDriver: false, // width can't use native driver
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
        // avoid state churn if unchanged
        if (existing && existing.x === x && existing.width === width)
          return prev;
        return { ...prev, [tab]: { x, width } };
      });
    };

  return (
    <View style={styles.wrap}>
      <View style={styles.tabBar}>
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
              <Text style={[styles.tabText, active && styles.tabTextActive]}>
                {tab}
              </Text>
            </Pressable>
          );
        })}
      </View>

      {/* Baseline track */}
      <View style={styles.track} />

      {/* Sliding indicator */}
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
    marginBottom: 12,
    paddingHorizontal: 4,
  },

  tabBar: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingBottom: 10, 
  },

  tabItem: {
    alignItems: "center",
  },

  tabText: {
    fontSize: 20,
    color: "#888",
  },

  tabTextActive: {
    color: "#000",
    fontWeight: "700",
  },

  track: {
    height: 1,
    backgroundColor: "#d0d0d0",
    width: "100%",
  },

  indicator: {
    position: "absolute",
    left: 4,
    bottom: 0,
    height: 2,
    backgroundColor: "#000",
    borderRadius: 2,
  },
});
