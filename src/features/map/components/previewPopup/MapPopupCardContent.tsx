import React, { ReactNode, useState } from "react";
import {
  View,
  Image,
  StyleSheet,
  Text,
  Pressable,
  Animated,
  ScrollView,
} from "react-native";
import type { ShrinePreviewModel } from "../../../shrines/shrineScreen/mappers/shrine.mappers";
import { FontAwesome6 } from "@expo/vector-icons";
import { font } from "../../../../shared/styles/typography";
import TagPill, { Tag } from "../../../../shared/components/TagPill";
import { usePressScale } from "../../../../shared/gestures/usePressScale";
import { useRouter } from "expo-router";
import { g } from "../../../../shared/styles/global";
import { t } from "../../../../shared/styles/text";
import { spacing, radius } from "../../../../shared/styles/tokens";
import BookmarkButton from "../../../../shared/components/BookmarkButton";
import { formatDistance, LatLon } from "../../../../shared/location/distance";
import { openDirectionsToShrine } from "../../../../shared/location/openDirections";
import { useTheme } from "../../../../shared/theme/useTheme";

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

type Props = {
  shrine: ShrinePreviewModel;
  onClose: () => void;
  origin: LatLon | null;
  children?: ReactNode;
};

export default function MapPopupCardContent({
  shrine,
  onClose,
  origin,
  children,
}: Props) {
  const theme = useTheme();
  const fallbackImage = require("../../../../../assets/images/placeholder.png");

  const router = useRouter();

  const viewPress = usePressScale(0.95);
  const directionPress = usePressScale(0.95);
  const closePress = usePressScale(0.9);

  const [isDirectionsLoading, setIsDirectionsLoading] = useState(false);

  const distanceLabel =
    typeof (shrine as any).distance_meters === "number"
      ? formatDistance((shrine as any).distance_meters)
      : null;

  const onDirections = async () => {
    if (isDirectionsLoading) return;

    const { lat, lon } = shrine;

    if (typeof lat !== "number" || typeof lon !== "number") {
      console.warn("MapPopupCardContent: shrine missing lat/lon", {
        shrine_id: shrine.shrine_id,
        slug: shrine.slug,
        lat,
        lon,
      });
      return;
    }

    try {
      setIsDirectionsLoading(true);

      await openDirectionsToShrine({
        lat,
        lon,
        label: shrine.name_en ?? shrine.name_jp ?? "Shrine",
        origin,
      });
    } finally {
      setTimeout(() => setIsDirectionsLoading(false), 600);
    }
  };

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
            { backgroundColor: theme.colors.overlayLight },
            { transform: [{ scale: closePress.scale }] },
          ]}
        >
          <Text
            style={[
              t.body,
              { color: theme.colors.textPrimary },
              styles.closeText,
            ]}
          >
            ✕
          </Text>
        </AnimatedPressable>
      </View>

      <View style={styles.body}>
        <View style={styles.headerRow}>
          <Text
            style={[
              t.hero,
              { color: theme.colors.textPrimary },
              { fontFamily: font.title },
              styles.title,
            ]}
            numberOfLines={1}
            ellipsizeMode="tail"
          >
            {shrine.name_en ?? "Unnamed Shrine"}
          </Text>

          <BookmarkButton
            shrineId={shrine.shrine_id}
            size={26}
            color={theme.colors.textPrimary}
            downTo={0.9}
          />
        </View>

        {shrine.name_jp ? (
          <Text
            style={[
              t.title,
              { fontFamily: font.title, color: theme.colors.textSecondary },
              styles.jpName,
            ]}
          >
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
          style={[
            t.body,
            { color: theme.colors.textMuted },
            { fontFamily: font.strong },
            styles.desc,
          ]}
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
          onPress={onDirections}
          disabled={isDirectionsLoading}
          style={[
            styles.distanceButton,
            {
              backgroundColor: theme.colors.bgCard,
              borderColor: theme.colors.textPrimary,
              shadowColor: theme.colors.buttonPrimaryBg,
            },
            isDirectionsLoading && { opacity: 0.6 },
            { transform: [{ scale: directionPress.scale }] },
          ]}
        >
          <FontAwesome6
            name="location-dot"
            size={18}
            color={theme.colors.textPrimary}
          />
          <Text
            style={[
              t.body,
              { color: theme.colors.textPrimary },
              styles.distanceButtonText,
            ]}
          >
            {isDirectionsLoading
              ? "Opening…"
              : distanceLabel
                ? `${distanceLabel} • Directions`
                : "Directions"}
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
            { backgroundColor: theme.colors.buttonPrimaryBg },
            { transform: [{ scale: viewPress.scale }] },
          ]}
        >
          <Text
            style={[
              t.body,
              { color: theme.colors.buttonPrimaryText },
              styles.viewButtonText,
            ]}
          >
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
    borderWidth: 2,
    borderRadius: radius.md,
    paddingVertical: 9,
    paddingHorizontal: spacing.md,

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
