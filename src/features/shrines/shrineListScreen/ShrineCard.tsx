import {
  StyleSheet,
  Pressable,
  Image,
  Text,
  View,
  Animated,
} from "react-native";
import React, { useRef } from "react";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import FontAwesome6 from "@expo/vector-icons/FontAwesome6";
import { font } from "../../../shared/styles/typography";
import { ShrineCardModel } from "../mappers";
import type { LatLon } from "../../../shared/distance";
import { getDistanceLabel } from "../../../shared/distance";
import { useRouter } from "expo-router";
import { g } from "../../../shared/styles/global";
import { t } from "../../../shared/styles/text";
import { colors, spacing, radius } from "../../../shared/styles/tokens";

const ShrineCard = ({
  shrine,
  userLocation,
}: {
  shrine: ShrineCardModel;
  userLocation: LatLon | null;
}) => {
  const fallbackImage = require("../../../../assets/images/placeholder.png");

  const router = useRouter();

  const cardScale = useRef(new Animated.Value(1)).current;
  const bookmarkScale = useRef(new Animated.Value(1)).current;
  const viewScale = useRef(new Animated.Value(1)).current;

  const makePressHandlers = (val: Animated.Value, downTo = 0.9) => ({
    onPressIn: () =>
      Animated.spring(val, { toValue: downTo, useNativeDriver: true }).start(),
    onPressOut: () =>
      Animated.spring(val, { toValue: 1, useNativeDriver: true }).start(),
  });

  const cardHandlers = makePressHandlers(cardScale, 0.97);
  const bookmarkHandlers = makePressHandlers(bookmarkScale, 0.9);
  const viewHandlers = makePressHandlers(viewScale, 0.95);

  const distanceLabel = getDistanceLabel(userLocation, shrine.lat, shrine.lon);

  const goToShrine = () =>
    router.push({
      pathname: "/shrine/[slug]",
      params: { slug: shrine.slug },
    });

  return (
    <Pressable {...cardHandlers} onPress={goToShrine}>
      <Animated.View style={{ transform: [{ scale: cardScale }] }}>
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

              <Pressable
                {...bookmarkHandlers}
                hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                onPress={() => console.log(`Saved Shrine ${shrine.name_en}`)}
              >
                <Animated.View
                  style={{ transform: [{ scale: bookmarkScale }] }}
                >
                  <FontAwesome name="bookmark-o" size={24} color="black" />
                </Animated.View>
              </Pressable>
            </View>

            {shrine.name_jp ? (
              <Text
                style={[t.title, { fontFamily: font.strong }, styles.jpName]}
              >
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
                style={[
                  t.body,
                  { fontFamily: font.title },
                  styles.locationText,
                ]}
              >
                {distanceLabel ?? "—"}
              </Text>
            </View>

            <Pressable
              {...viewHandlers}
              hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
              onPress={goToShrine}
            >
              <Animated.View style={{ transform: [{ scale: viewScale }] }}>
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
              </Animated.View>
            </Pressable>
          </View>
        </View>
      </Animated.View>
    </Pressable>
  );
};

export default ShrineCard;

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
