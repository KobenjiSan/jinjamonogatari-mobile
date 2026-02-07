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
import { g } from "../../../../shared/styles/global";
import { t } from "../../../../shared/styles/text";
import { colors, spacing, radius } from "../../../../shared/styles/tokens";

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

  const bookmarkHandlers = makePressHandlers(bookmarkScale);
  const shareHandlers = makePressHandlers(shareScale);
  const backHandlers = makePressHandlers(backScale);

  return (
    <>
      {/* top spacer */}
      <View
        style={{
          backgroundColor: colors.white,
          height: insetsTop + spacing.sm,
        }}
      />

      {/* HERO */}
      <View style={styles.heroWrap} onLayout={onHeroLayout}>
        {/* Back */}
        <Pressable
          onPress={onBack}
          {...backHandlers}
          hitSlop={10}
          style={styles.backButton}
        >
          <Animated.View style={{ transform: [{ scale: backScale }] }}>
            <View style={[g.iconBtnCircle, g.iconBtnOverlay]}>
              <Ionicons name="chevron-back" size={22} color="black" />
            </View>
          </Animated.View>
        </Pressable>

        <Image
          source={shrine.imageUrl ? { uri: shrine.imageUrl } : fallbackImage}
          style={styles.hero}
          resizeMode="cover"
        />

        <LinearGradient
          pointerEvents="none"
          colors={["rgba(255,255,255,1)", "rgba(255,255,255,0)"]}
          locations={[0, 1]}
          style={styles.topFade}
        />

        <LinearGradient
          pointerEvents="none"
          colors={["rgba(0,0,0,0)", "rgba(0,0,0,1)"]}
          locations={[0, 1]}
          style={styles.bottomFade}
        />
      </View>

      {/* INTRO */}
      <View style={styles.introOverlay} onLayout={onIntroLayout}>
        <Text
          style={[t.hero, t.white, { fontFamily: font.title }]}
          numberOfLines={1}
          ellipsizeMode="tail"
        >
          {shrine.name_en ?? "Unnamed Shrine"}
        </Text>

        {shrine.name_jp && (
          <Text style={[t.hero, t.white, { fontFamily: font.strong }]}>
            {shrine.name_jp}
          </Text>
        )}

        <View style={styles.tagsAndActionsRow}>
          {/* TAGS */}
          <View style={styles.tagsWrap}>
            {shrine.tags?.length > 0 && (
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
                    textColor={colors.white}
                  />
                ))}
              </ScrollView>
            )}
          </View>

          {/* ACTIONS */}
          <View style={styles.actions}>
            <Pressable
              {...shareHandlers}
              hitSlop={8}
              onPress={() => console.log(`Shared Shrine ${shrine.name_en}`)}
            >
              <Animated.View style={{ transform: [{ scale: shareScale }] }}>
                <View style={[g.iconBtnCircle, { backgroundColor: "#505050" }]}>
                  <Octicons name="share" size={18} color="white" />
                </View>
              </Animated.View>
            </Pressable>

            <Pressable
              {...bookmarkHandlers}
              hitSlop={8}
              onPress={() => console.log(`Saved Shrine ${shrine.name_en}`)}
            >
              <Animated.View style={{ transform: [{ scale: bookmarkScale }] }}>
                <View style={[g.iconBtnCircle, { backgroundColor: "#505050" }]}>
                  <FontAwesome name="bookmark-o" size={18} color="white" />
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
    paddingHorizontal: spacing.lg,
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
    gap: spacing.sm,
    marginTop: 10,
    marginBottom: spacing.md,
  },

  backButton: {
    position: "absolute",
    top: spacing.md,
    left: spacing.md,
    zIndex: 50,
  },

  tagsAndActionsRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: spacing.md,
  },

  tagsWrap: {
    flex: 1,
    minWidth: 0,
  },

  actions: {
    flexDirection: "row",
    gap: spacing.sm,
  },
});
