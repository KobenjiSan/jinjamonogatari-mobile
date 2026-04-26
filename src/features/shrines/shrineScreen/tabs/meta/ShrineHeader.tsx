import React from "react";
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
import TagPill from "../../../../../shared/components/TagPill";
import { font } from "../../../../../shared/styles/typography";
import type { ShrinePreviewModel } from "../../mappers/shrine.mappers";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useRouter } from "expo-router";
import Octicons from "@expo/vector-icons/Octicons";
import { g } from "../../../../../shared/styles/global";
import { t } from "../../../../../shared/styles/text";
import { colors, spacing } from "../../../../../shared/styles/tokens";
import BookmarkButton from "../../../../../shared/components/BookmarkButton";
import { usePressScale } from "../../../../../shared/gestures/usePressScale";
import { useTheme } from "../../../../../shared/theme/useTheme";

type Props = {
  shrine: ShrinePreviewModel;
  insetsTop: number;
  onHeaderLayout: (e: any) => void;
};

export default function ShrineHeader({
  shrine,
  insetsTop,
  onHeaderLayout,
}: Props) {
  const theme = useTheme();
  const fallbackImage = require("../../../../../../assets/images/placeholder.png");

  const router = useRouter();
  const onBack = () => {
    if (router.canGoBack()) {
      router.back();
    } else {
      router.replace("/"); 
    }
  };

  const backPress = usePressScale(0.9);
  const sharePress = usePressScale(0.9);

  return (
    <View onLayout={onHeaderLayout}>
      {/* top spacer */}
      <View
        style={{
          backgroundColor: colors.white,
          height: insetsTop + spacing.sm,
        }}
      />

      {/* HERO */}
      <View style={styles.heroWrap}>
        {/* Back */}
        <Pressable
          onPress={onBack}
          {...backPress.handlers}
          hitSlop={10}
          style={styles.backButton}
        >
          <Animated.View style={{ transform: [{ scale: backPress.scale }] }}>
            <View
              style={[
                g.iconBtnCircle,
                { backgroundColor: theme.colors.backOverlayBg },
              ]}
            >
              <Ionicons
                name="chevron-back"
                size={22}
                color={theme.colors.backIconColor}
              />
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
      <View style={styles.introOverlay}>
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
                    backgroundColor={theme.colors.headerActions}
                    textColor={colors.white}
                  />
                ))}
              </ScrollView>
            )}
          </View>

          {/* ACTIONS */}
          <View style={styles.actions}>
            <Pressable
              {...sharePress.handlers}
              hitSlop={8}
              onPress={() => console.log(`Shared Shrine ${shrine.name_en}`)}
            >
              <Animated.View style={{ transform: [{ scale: sharePress.scale }] }}>
                <View
                  style={[
                    g.iconBtnCircle,
                    { backgroundColor: theme.colors.headerActions },
                  ]}
                >
                  <Octicons name="share" size={18} color="white" />
                </View>
              </Animated.View>
            </Pressable>

            <BookmarkButton
              shrineId={shrine.shrine_id}
              size={18}
              color="white"
              downTo={0.9}
              containerStyle={[
                g.iconBtnCircle,
                { backgroundColor: theme.colors.headerActions },
              ]}
            />
          </View>
        </View>
      </View>
    </View>
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