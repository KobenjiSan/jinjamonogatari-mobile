import React, { useMemo, useRef } from "react";
import { View, Text, StyleSheet, ScrollView, Image } from "react-native";
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

  // Bottom sheet snap points
  const snapPoints = useMemo(() => ["46%", "99%"], []);
  const sheetRef = useRef<BottomSheet>(null);

  if (!shrine) {
    return (
      <View style={styles.center}>
        <Text>Shrine not found: {slug}</Text>
      </View>
    );
  }

  const fallbackImage = require("../../../assets/images/placeholder.png");

  return (
    <View style={styles.container}>
      {/* --- Background Layer (behind sheet) --- */}
      <View style={{ backgroundColor: "#fff", height: insets.top + 8 }} />
      <View style={styles.heroWrap}>

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

      <View style={styles.introOverlay}>
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
          {Array.isArray((shrine as any).tags) &&
          (shrine as any).tags.length > 0 ? (
            <View style={styles.tagsRow}>
              {(shrine as any).tags.map((tag: any) => (
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
          <View>
            {/* TODO: Tab Group */}
          </View>

          <View>
            {/* TODO: Navigation Group */}
          </View>

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
  },
  jpName: {
    color: "#fff",
    fontSize: 22,
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
