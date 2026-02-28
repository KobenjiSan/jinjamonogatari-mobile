import {
  StyleSheet,
  Pressable,
  Image,
  Text,
  View,
  Animated,
} from "react-native";
import React, { useRef } from "react";
import FontAwesome6 from "@expo/vector-icons/FontAwesome6";
import { font } from "../../../../shared/styles/typography";
import { ShrineCardModel } from "../api/shrineList.mapper";
import { useRouter } from "expo-router";
import { g } from "../../../../shared/styles/global";
import { t } from "../../../../shared/styles/text";
import { colors, spacing, radius } from "../../../../shared/styles/tokens";
import BookmarkButton from "../../../../shared/components/BookmarkButton";
import { usePressScale } from "../../../../shared/gestures/usePressScale";
import { formatDistance } from "../../../../shared/location/distance";

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

const ShrineCard = ({ shrine }: { shrine: ShrineCardModel }) => {
  const fallbackImage = require("../../../../../assets/images/placeholder.png");

  const router = useRouter();

  const cardPress = usePressScale(0.97);
  const viewPress = usePressScale(0.95);

  const distanceLabel =
  typeof shrine.distance_meters === "number"
    ? formatDistance(shrine.distance_meters)
    : "—";

  const goToShrine = () =>
    router.push({
      pathname: "/shrine/[slug]",
      params: { slug: shrine.slug },
    });

  return (
    <AnimatedPressable
      {...cardPress.handlers}
      onPress={goToShrine}
      style={{ transform: [{ scale: cardPress.scale }] }}
    >
      <View style={[g.cardNoPadding, styles.card]}>
        <Image
          source={shrine.imageUrl ? { uri: shrine.imageUrl } : fallbackImage}
          style={styles.image}
          resizeMode="cover"
        />

        <View style={styles.body}>
          <View style={styles.headerRow}>
            <Text
              style={[t.title, { fontFamily: font.title }, styles.title]}
              numberOfLines={1}
              ellipsizeMode="tail"
            >
              {shrine.name_en ?? "Unnamed Shrine"}
            </Text>

            <BookmarkButton
              shrineId={shrine.shrine_id}
              size={24}
              color="black"
              downTo={0.9}
            />
          </View>

          {shrine.name_jp ? (
            <Text style={[t.title, { fontFamily: font.strong }, styles.jpName]}>
              {shrine.name_jp}
            </Text>
          ) : null}
        </View>

        <View style={styles.footer}>
          <View style={g.rowCenter}>
            <FontAwesome6
              name="location-dot"
              size={20}
              color={colors.gray600}
            />
            <Text
              style={[t.body, { fontFamily: font.title }, styles.locationText]}
            >
              {distanceLabel}
            </Text>
          </View>

          <AnimatedPressable
            {...viewPress.handlers}
            hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
            onPress={goToShrine}
            style={{ transform: [{ scale: viewPress.scale }] }}
          >
            <View style={[g.btnOutline, styles.viewButton]}>
              <Text
                style={[
                  t.body,
                  { fontFamily: font.strong },
                  styles.viewButtonText,
                ]}
              >
                View Shrine
              </Text>
            </View>
          </AnimatedPressable>
        </View>
      </View>
    </AnimatedPressable>
  );
};

export default React.memo(
  ShrineCard,
  (prev, next) =>
    prev.shrine.shrine_id === next.shrine.shrine_id &&
    prev.shrine.slug === next.shrine.slug &&
    prev.shrine.name_en === next.shrine.name_en &&
    prev.shrine.name_jp === next.shrine.name_jp &&
    prev.shrine.imageUrl === next.shrine.imageUrl
);

const styles = StyleSheet.create({
  card: {
    paddingHorizontal: 0,
    paddingVertical: 0,
    borderRadius: 10,
  },

  image: {
    width: "100%",
    height: 150,
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
  },

  body: {
    paddingVertical: spacing.xs,
    paddingHorizontal: spacing.sm,
  },

  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  title: {
    flex: 1,
  },

  jpName: {
    opacity: 0.85,
    lineHeight: 28,
  },

  footer: {
    padding: spacing.sm,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  viewButton: {
    borderRadius: radius.sm,
    paddingVertical: 4,
    paddingHorizontal: 8,
  },

  viewButtonText: {
    lineHeight: 22,
  },

  locationText: {
    marginLeft: spacing.xs,
    color: colors.gray600,
  },
});
