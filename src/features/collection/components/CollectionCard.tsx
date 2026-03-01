import React from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  Pressable,
  ScrollView,
} from "react-native";
import { t } from "../../../shared/styles/text";
import { spacing, radius } from "../../../shared/styles/tokens";
import { font } from "../../../shared/styles/typography";
import BookmarkButton from "../../../shared/components/BookmarkButton";
import TagPill, { Tag } from "../../../shared/components/TagPill";
import type { CollectionShrineCardModel } from "../api/collection.mapper";
import { FontAwesome6 } from "@expo/vector-icons";
import { formatDistance } from "../../../shared/location/distance";
import { useTheme } from "../../../shared/theme/useTheme";

type Props = {
  shrine: CollectionShrineCardModel;
  onPress: () => void;
};

export default function CollectionCard({ shrine, onPress }: Props) {
  const theme = useTheme();
  const fallbackImage = require("../../../../assets/images/placeholder.png");

  const title = shrine.name_en ?? "Unnamed Shrine";

  const distanceLabel =
    typeof shrine.distance_meters === "number"
      ? formatDistance(shrine.distance_meters)
      : "—";

  const tags = Array.isArray(shrine.tags)
    ? (shrine.tags as unknown as Tag[])
    : [];

  return (
    <Pressable
      onPress={onPress}
      style={[
        styles.card,
        {
          backgroundColor: theme.colors.bgCard,
          borderColor: theme.colors.border,
        },
      ]}
    >
      <View style={styles.row}>
        <View style={styles.imgLocationBlock}>
          <Image
            source={shrine.image_url ? { uri: shrine.image_url } : fallbackImage}
            style={[
              styles.image,
              {
                backgroundColor: theme.colors.bgApp,
              },
            ]}
            resizeMode="cover"
          />

          <View style={styles.locationArea}>
            <FontAwesome6
              name="location-dot"
              size={20}
              color={theme.colors.textSecondary}
            />
            <Text
              style={[
                t.body,
                { fontFamily: font.title },
                styles.locationText,
                { color: theme.colors.textSecondary },
              ]}
            >
              {distanceLabel}
            </Text>
          </View>
        </View>

        <View style={styles.meta}>
          <View style={styles.headerRow}>
            <Text
              style={[
                t.title,
                { fontFamily: font.title },
                styles.title,
                { color: theme.colors.textPrimary },
              ]}
              numberOfLines={1}
              ellipsizeMode="tail"
            >
              {title}
            </Text>

            <BookmarkButton
              shrineId={shrine.shrine_id}
              size={22}
              color={theme.colors.textPrimary}
              downTo={0.92}
            />
          </View>

          {shrine.name_jp ? (
            <Text
              style={[
                { fontFamily: font.title },
                styles.jp,
                { color: theme.colors.textMuted },
              ]}
            >
              {shrine.name_jp}
            </Text>
          ) : null}

          {Array.isArray((shrine as any).tags) && (shrine as any).tags.length > 0 ? (
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
                  textStyle={styles.tagText}
                />
              ))}
            </ScrollView>
          ) : null}

          {shrine.shrine_desc ? (
            <Text
              style={[
                t.body,
                styles.desc,
                { color: theme.colors.textMuted, fontFamily: font.body },
              ]}
              numberOfLines={2}
            >
              {shrine.shrine_desc}
            </Text>
          ) : null}
        </View>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    borderWidth: 1,
    borderRadius: radius.lg ?? 14,
    padding: spacing.md,
  },

  row: {
    flexDirection: "row",
    gap: spacing.md,
    alignItems: "flex-start",
  },

  image: {
    width: 86,
    height: 86,
    borderRadius: radius.md,
  },

  meta: {
    flex: 1,
    minHeight: 86,
  },

  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm,
  },

  title: {
    flex: 1,
    lineHeight: 22,
  },

  jp: {
    marginTop: 2,
    opacity: 0.85,
  },

  tagsRow: {
    flexDirection: "row",
    flexWrap: "nowrap",
    gap: 6,
    marginTop: spacing.sm,
    alignItems: "center",
  },

  tagsScroll: {
    overflow: "hidden",
  },

  tagPill: {
    flexShrink: 0,
  },

  tagText: {
    flexShrink: 0,
  },

  moreTags: {
    marginLeft: 2,
  },

  desc: {
    marginTop: spacing.sm,
    fontSize: 13,
    lineHeight: 18,
  },

  locationText: {
    marginLeft: spacing.xs,
  },

  imgLocationBlock: {
    height: "100%",
    flexDirection: "column",
    alignContent: "space-between",
    gap: 6,
  },

  locationArea: {
    flexDirection: "row",
    justifyContent: "center",
  },
});