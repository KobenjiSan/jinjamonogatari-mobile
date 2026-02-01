import React from "react";
import { View, Text, StyleSheet, Image } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import TagPill from "../../components/TagPill";
import { font } from "../../../../shared/styles/typography";
import type { ShrinePreviewModel } from "../../mappers";

type Props = {
  shrine: ShrinePreviewModel;
  insetsTop: number;
  onHeroLayout: (e: any) => void;
  onIntroLayout: (e: any) => void;
};

export default function ShrineHeader({
  shrine,
  insetsTop,
  onHeroLayout,
  onIntroLayout,
}: Props) {
  const fallbackImage = require("../../../../../assets/images/placeholder.png");

  return (
    <>
      {/* top white spacer */}
      <View style={{ backgroundColor: "#fff", height: insetsTop + 8 }} />

      {/* Hero */}
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

      {/* Title + Tags */}
      <View style={styles.introOverlay} onLayout={onIntroLayout}>
        <Text
          style={[styles.title, { fontFamily: font.title }]}
          numberOfLines={1}
          ellipsizeMode="tail"
        >
          {shrine.name_en ?? "Unnamed Shrine"}
        </Text>

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
    </>
  );
}

const styles = StyleSheet.create({
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
  tagsRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginTop: 10,
    marginBottom: 14,
  },
});
