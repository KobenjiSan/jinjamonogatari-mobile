import React, { useMemo, useRef, useState, useCallback, useEffect } from "react";
import { View, Text, StyleSheet, Image, useWindowDimensions } from "react-native";
import { useShrineBySlug } from "./useShrineBySlug";
import BottomSheet, { BottomSheetScrollView } from "@gorhom/bottom-sheet";
import TagPill from "../shrines/components/TagPill";
import { LinearGradient } from "expo-linear-gradient";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { font } from "../../shared/styles/typography";

type Props = {
  slug: string;
};

export default function ShrineScreen({ slug }: Props) {
  const shrine = useShrineBySlug(slug);
  const insets = useSafeAreaInsets();

  const [containerH, setContainerH] = useState(0);
  const [heroH, setHeroH] = useState(0);
  const [introH, setIntroH] = useState(0);

  const onContainerLayout = useCallback((e: any) => {
    setContainerH(Math.round(e.nativeEvent.layout.height));
  }, []);

  const onHeroLayout = useCallback((e: any) => {
    setHeroH(Math.round(e.nativeEvent.layout.height));
  }, []);

  const onIntroLayout = useCallback((e: any) => {
    setIntroH(Math.round(e.nativeEvent.layout.height));
  }, []);

  const snapPoints = useMemo(() => {
    if (containerH === 0 || heroH === 0 || introH === 0) return ["45%", "99%"];

    const aboveH = (insets.top + 8) + heroH + introH;
    let collapsed = Math.round(containerH - aboveH);

    collapsed = Math.max(120, Math.min(collapsed, Math.round(containerH * 0.85)));

    const expanded = Math.round(containerH * 0.99);
    return [collapsed, expanded];
  }, [containerH, heroH, introH, insets.top]);

  const sheetRef = useRef<BottomSheet>(null);

  useEffect(() => {
    if (containerH && heroH && introH) {
      sheetRef.current?.snapToIndex(0);
    }
  }, [containerH, heroH, introH]);

  if (!shrine) {
    return (
      <View style={styles.center}>
        <Text>Shrine not found: {slug}</Text>
      </View>
    );
  }

  const fallbackImage = require("../../../assets/images/placeholder.png");

  return (
    <View style={styles.container} onLayout={onContainerLayout}>
      {/* --- Background Layer (behind sheet) --- */}
      <View style={{ backgroundColor: "#fff", height: insets.top + 8 }} />
      <View style={styles.heroWrap} onLayout={onHeroLayout}>
        {/* TODO: Back Button Top Left Corner */}

        <Image
          source={shrine.imageUrl ? { uri: shrine.imageUrl } : fallbackImage}
          style={styles.hero}
          resizeMode="cover"
        />

        {/* Top fade into white */}
        <LinearGradient
          pointerEvents="none"
          colors={["rgba(255,255,255,1)", "rgba(255,255,255,0)"]}
          locations={[0, 1]}
          style={styles.topFade}
        />

        {/* Bottom fade into black */}
        <LinearGradient
          pointerEvents="none"
          colors={["rgba(0,0,0,0)", "rgba(0,0,0,1)"]}
          locations={[0, 1]}
          style={styles.bottomFade}
        />
      </View>

      <View style={styles.introOverlay} onLayout={onIntroLayout}>
        {/* Title */}
        <Text
          style={[styles.title, { fontFamily: font.title }]}
          numberOfLines={1}
          ellipsizeMode="tail"
        >
          {shrine.name_en ?? "Unnamed Shrine"}
        </Text>
        {/* Japanese Title */}
        {shrine.name_jp ? (
          <Text style={[styles.jpName, { fontFamily: font.strong }]}>
            {shrine.name_jp}
          </Text>
        ) : null}

        <View>
          {/* Tags */}
          {shrine.tags?.length > 0 ? (
            <View style={styles.tagsRow}>
              {shrine.tags.map((tag) => (
                <TagPill
                  key={tag.tag_id}
                  tag={tag}
                  backgroundColor="#505050"
                  textColor="#fff"
                />
              ))}
            </View>
          ) : null}

          {/* TODO: Share and Save Buttons */}
        </View>
      </View>

      {/* --- Bottom Sheet --- */}
      <BottomSheet
        ref={sheetRef}
        index={0} // starts at 50%
        snapPoints={snapPoints}
        enablePanDownToClose={false} // prevents dropping below 50%
        backgroundStyle={styles.sheetBackground}
        handleIndicatorStyle={styles.handleIndicator}
      >
        <BottomSheetScrollView contentContainerStyle={styles.sheetContent}>
          <View>{/* TODO: Tab Group */}</View>

          <View>{/* TODO: Navigation Group */}</View>

          {/* Description */}
          <View style={styles.card}>
            <Text style={[styles.cardTitle, { fontFamily: font.title }]}>
              Description
            </Text>
            <Text style={[styles.desc, { fontFamily: font.body }]}>
              {shrine.shrine_desc ?? "No description yet."}
            </Text>
          </View>

          <View style={{ height: 800 }}>{/* Temp for space holding */}</View>
        </BottomSheetScrollView>
      </BottomSheet>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#000" },
  background: {
    flex: 1,
    paddingTop: 12,
    backgroundColor: "#fff",
  },
  heroWrap: {
    width: "100%",
    position: "relative",
    overflow: "hidden",
  },
  hero: {
    width: "100%",
    aspectRatio: 4 / 3,
  },
  introOverlay: {
    paddingHorizontal: 16,
  },
  title: {
    color: "#fff",
    fontSize: 22,
    lineHeight: 24,
  },
  jpName: {
    color: "#fff",
    fontSize: 22,
    lineHeight: 28,
  },
  topFade: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    height: 65,
  },
  bottomFade: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    height: 90,
  },
  sheetBackground: {
    backgroundColor: "#f0f0f0",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  handleIndicator: { backgroundColor: "#bbb" },
  sheetContent: {
    padding: 16,
    paddingBottom: 32,
  },
  tagsRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginTop: 10,
    marginBottom: 14,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: "900",
    letterSpacing: 0.6,
  },
  desc: { marginTop: 6, fontSize: 12 },
  placeholder: { marginTop: 8, fontSize: 14, lineHeight: 20, color: "#777" },
  center: { flex: 1, alignItems: "center", justifyContent: "center" },
  card: {
    backgroundColor: "#fff",
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,

    // iOS
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 2,

    // Android
    elevation: 2,
  },
});
