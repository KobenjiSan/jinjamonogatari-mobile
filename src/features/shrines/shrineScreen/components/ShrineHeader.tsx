import React, { useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  Pressable,
  Animated,
  ScrollView,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import TagPill from "../../components/TagPill";
import { font } from "../../../../shared/styles/typography";
import type { ShrinePreviewModel } from "../../mappers";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useRouter } from "expo-router";
import Octicons from "@expo/vector-icons/Octicons";
import { FontAwesome } from "@expo/vector-icons";

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

  const router = useRouter();
  const onBack = () => router.back();

  const bookmarkScale = useRef(new Animated.Value(1)).current;
  const shareScale = useRef(new Animated.Value(1)).current;
  const backScale = useRef(new Animated.Value(1)).current;

  const makePressHandlers = (val: Animated.Value, downTo = 0.9) => ({
    onPressIn: () =>
      Animated.spring(val, { toValue: downTo, useNativeDriver: true }).start(),
    onPressOut: () =>
      Animated.spring(val, { toValue: 1, useNativeDriver: true }).start(),
  });

  const bookmarkHandlers = makePressHandlers(bookmarkScale, 0.9);
  const shareHandlers = makePressHandlers(shareScale, 0.9);
  const backHandlers = makePressHandlers(backScale, 0.9);

  return (
    <>
      {/* top white spacer */}
      <View style={{ backgroundColor: "#fff", height: insetsTop + 8 }} />

      {/* Hero */}
      <View style={styles.heroWrap} onLayout={onHeroLayout}>
        {/* Back Button */}
        <Pressable
          onPress={onBack}
          {...backHandlers}
          hitSlop={10}
          style={styles.backButton}
        >
          <Animated.View style={{ transform: [{ scale: backScale }] }}>
            <View style={styles.backButtonBg}>
              <Ionicons name="chevron-back" size={22} color="#000" />
            </View>
          </Animated.View>
        </Pressable>

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

        <View style={styles.tagsAndActionsRow}>
          {/* LEFT: Tags */}
          <View style={styles.tagsWrap}>
            {shrine.tags?.length > 0 ? (
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.tagsRow}
              >
                {shrine.tags.map((tag) => (
                  <TagPill
                    key={tag.tag_id}
                    tag={tag}
                    backgroundColor="#505050"
                    textColor="#fff"
                  />
                ))}
              </ScrollView>
            ) : null}
          </View>

          {/* RIGHT: Share / Save */}
          <View style={styles.actions}>
            <Pressable
              {...shareHandlers}
              hitSlop={8}
              onPress={() => console.log(`Shared Shrine ${shrine.name_en}`)}
            >
              <Animated.View style={{ transform: [{ scale: shareScale }] }}>
                <View style={styles.actionBtn}>
                  <Octicons name="share" size={18} color="#fff" />
                </View>
              </Animated.View>
            </Pressable>

            <Pressable
              {...bookmarkHandlers}
              hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
              onPress={() => console.log(`Saved Shrine ${shrine.name_en}`)}
            >
              <Animated.View style={{ transform: [{ scale: bookmarkScale }] }}>
                <View style={styles.actionBtn}>
                  <FontAwesome name="bookmark-o" size={18} color="#fff" />
                </View>
              </Animated.View>
            </Pressable>
          </View>
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
    alignItems: "center",
    gap: 8,
    marginTop: 10,
    marginBottom: 14,
  },

  backButton: {
    position: "absolute",
    top: 12,
    left: 12,
    zIndex: 50,
  },

  backButtonBg: {
    backgroundColor: "rgba(255, 255, 255, 0.86)",
    borderRadius: 999,
    width: 34,
    height: 34,
    alignItems: "center",
    justifyContent: "center",

    // subtle shadow
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 2,
    elevation: 2,
  },

  tagsAndActionsRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 12,
  },

  tagsWrap: {
    flex: 1,
    minWidth: 0,
  },

  actions: {
    flexShrink: 0,
    flexDirection: "row",
    gap: 10,
  },

  actionBtn: {
    width: 36,
    height: 36,
    borderRadius: 999,
    backgroundColor: "#505050",
    alignItems: "center",
    justifyContent: "center",
  },
});
