import React, { ReactNode } from "react";
import {
  View,
  Image,
  StyleSheet,
  Text,
  Pressable,
  Animated,
  ScrollView,
} from "react-native";
import type { ShrinePreviewModel } from "../../../shrines/mappers";
import { FontAwesome, FontAwesome6 } from "@expo/vector-icons";
import { font } from "../../../../shared/styles/typography";
import TagPill, { Tag } from "../../../shrines/components/TagPill";
import { usePressScale } from "./usePressScale";
import type { LatLon } from "../../../../shared/distance";
import { getDistanceLabel } from "../../../../shared/distance";
import { useRouter } from "expo-router";
import { g } from "../../../../shared/styles/global";
import { t } from "../../../../shared/styles/text";
import { colors, spacing, radius } from "../../../../shared/styles/tokens";

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

type Props = {
  shrine: ShrinePreviewModel;
  userLocation: LatLon | null;
  onClose: () => void;
  children?: ReactNode;
};

export default function MapPopupCardContent({
  shrine,
  userLocation,
  onClose,
  children,
}: Props) {
  const fallbackImage = require("../../../../../assets/images/placeholder.png");

  const router = useRouter();

  const bookmarkPress = usePressScale(0.9);
  const viewPress = usePressScale(0.95);
  const directionPress = usePressScale(0.95);
  const closePress = usePressScale(0.9);

  const distanceLabel = getDistanceLabel(userLocation, shrine.lat, shrine.lon);

  return (
    <View>
      <View style={styles.imageWrapper}>
        <Image
          source={shrine.imageUrl ? { uri: shrine.imageUrl } : fallbackImage}
          style={styles.image}
          resizeMode="cover"
        />

        <AnimatedPressable
          {...closePress.handlers}
          onPress={onClose}
          hitSlop={10}
          style={[
            styles.closeButton,
            { transform: [{ scale: closePress.scale }] },
          ]}
        >
          <Text style={[t.body, t.primary, styles.closeText]}>✕</Text>
        </AnimatedPressable>
      </View>

      <View style={styles.body}>
        <View style={styles.headerRow}>
          <Text
            style={[
              t.hero,
              t.primary,
              { fontFamily: font.title },
              styles.title,
            ]}
            numberOfLines={1}
            ellipsizeMode="tail"
          >
            {shrine.name_en ?? "Unnamed Shrine"}
          </Text>

          <AnimatedPressable
            {...bookmarkPress.handlers}
            hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
            onPress={() => console.log(`Saved Shrine ${shrine.name_en}`)}
            style={{ transform: [{ scale: bookmarkPress.scale }] }}
          >
            <FontAwesome name="bookmark-o" size={26} color="black" />
          </AnimatedPressable>
        </View>

        {shrine.name_jp ? (
          <Text style={[t.title, { fontFamily: font.title }, styles.jpName]}>
            {shrine.name_jp}
          </Text>
        ) : null}

        {Array.isArray((shrine as any).tags) &&
        (shrine as any).tags.length > 0 ? (
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.tagsRow}
            style={styles.tagsScroll}
          >
            {(shrine as any).tags.map((tag: Tag) => (
              <TagPill
                key={tag.tag_id}
                tag={tag}
                style={styles.tagPill}
                textStyle={styles.tagPillText}
              />
            ))}
          </ScrollView>
        ) : null}

        <Text
          style={[t.body, t.muted, { fontFamily: font.strong }, styles.desc]}
          numberOfLines={4}
          ellipsizeMode="tail"
        >
          {shrine.shrine_desc}
        </Text>
      </View>

      <View style={styles.footer}>
        <AnimatedPressable
          {...directionPress.handlers}
          hitSlop={8}
          onPress={() =>
            console.log(`distance button clicked (${shrine.name_en})`)
          }
          style={[
            styles.distanceButton,
            { transform: [{ scale: directionPress.scale }] },
          ]}
        >
          <FontAwesome6
            name="location-dot"
            size={18}
            color={colors.textPrimary}
          />
          <Text style={[t.body, t.primary, styles.distanceButtonText]}>
            {distanceLabel ? `${distanceLabel} • Directions` : "Directions"}
          </Text>
        </AnimatedPressable>

        <AnimatedPressable
          {...viewPress.handlers}
          hitSlop={8}
          onPress={() =>
            router.push({
              pathname: "/shrine/[slug]",
              params: { slug: shrine.slug },
            })
          }
          style={[
            g.btnPrimary,
            styles.viewButton,
            { transform: [{ scale: viewPress.scale }] },
          ]}
        >
          <Text style={[t.body, t.white, styles.viewButtonText]}>
            View Shrine
          </Text>
        </AnimatedPressable>
      </View>

      {children ? <View style={styles.content}>{children}</View> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  imageWrapper: {
    position: "relative",
  },

  image: {
    width: "100%",
    height: 250,
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
  },

  closeButton: {
    position: "absolute",
    top: spacing.md,
    right: spacing.md,
    zIndex: 10,
    backgroundColor: colors.overlayLight,
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
  },

  closeText: {
    fontSize: 14,
    lineHeight: 16,
  },

  body: {
    paddingVertical: 6,
    paddingHorizontal: 14,
  },

  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  title: {
    flex: 1,
    lineHeight: 24,
  },

  jpName: {
    lineHeight: 20,
    opacity: 0.85,
  },

  tagsScroll: {
    overflow: "hidden",
  },

  tagsRow: {
    flexDirection: "row",
    flexWrap: "nowrap",
    gap: 6,
    marginTop: spacing.md,
    marginBottom: 6,
    paddingRight: 6,
  },

  tagPill: {
    flexShrink: 0,
    maxWidth: undefined,
  },

  tagPillText: {
    flexShrink: 0,
  },

  desc: {
    fontSize: 13,
    lineHeight: 18,
  },

  footer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    gap: spacing.md,
    paddingHorizontal: 14,
    paddingBottom: 14,
    paddingTop: 2,
  },

  distanceButton: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    backgroundColor: colors.white,
    borderWidth: 2,
    borderColor: colors.textPrimary,
    borderRadius: radius.md,
    paddingVertical: 9,
    paddingHorizontal: spacing.md,

    shadowColor: colors.black,
    shadowOpacity: 0.12,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 3 },
    elevation: 3,
  },

  distanceButtonText: {
    fontSize: 15,
  },

  viewButton: {
    paddingVertical: 11,
    paddingHorizontal: spacing.lg,
    borderRadius: radius.md,
  },

  viewButtonText: {
    fontSize: 16,
  },

  content: {
    marginTop: spacing.sm,
  },
});
