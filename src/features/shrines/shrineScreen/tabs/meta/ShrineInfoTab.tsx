import React, { useRef, useMemo, useState } from "react";
import { View, Text, StyleSheet, Pressable, Animated } from "react-native";
import { font } from "../../../../../shared/styles/typography";
import type { ShrineDetailModel } from "../../mappers/shrine.mappers";
import { FontAwesome6 } from "@expo/vector-icons";
import FontAwesome5 from "@expo/vector-icons/FontAwesome5";
import { g } from "../../../../../shared/styles/global";
import { t } from "../../../../../shared/styles/text";
import { colors, spacing, radius } from "../../../../../shared/styles/tokens";
import { formatDistance } from "../../../../../shared/location/distance";
import { openDirectionsToShrine } from "../../../../../shared/location/openDirections";
import type { LatLon } from "../../../../../shared/location/distance";

type Props = {
  shrine: ShrineDetailModel;
  origin: LatLon | null;
};

function InfoRow({
  label,
  value,
  showDivider = true,
}: {
  label: string;
  value?: string | null;
  showDivider?: boolean;
}) {
  return (
    <>
      <View style={styles.infoRow}>
        <Text style={[t.small, t.secondary]}>{label}</Text>
        <Text style={[t.body, t.primary]}>{value ?? "Not available"}</Text>
      </View>

      {showDivider && <View style={g.divider} />}
    </>
  );
}

export default function ShrineInfoTab({ shrine, origin }: Props) {
  const directionScale = useRef(new Animated.Value(1)).current;

  const makePressHandlers = (val: Animated.Value, downTo = 0.9) => ({
    onPressIn: () =>
      Animated.spring(val, { toValue: downTo, useNativeDriver: true }).start(),
    onPressOut: () =>
      Animated.spring(val, { toValue: 1, useNativeDriver: true }).start(),
  });

  const directionHandlers = makePressHandlers(directionScale, 0.95);

  const [isDirectionsLoading, setIsDirectionsLoading] = useState(false);

  const distanceLabel =
    typeof shrine.distance_meters === "number"
      ? formatDistance(shrine.distance_meters)
      : null;

  const onDirections = async () => {
    if (isDirectionsLoading) return;

    const { lat, lon } = shrine;

    if (typeof lat !== "number" || typeof lon !== "number") {
      console.warn("ShrineInfoTab: shrine missing lat/lon", {
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

  const address = useMemo(() => {
    if (shrine.address_raw) return shrine.address_raw;

    const parts = [
      shrine.locality,
      shrine.ward,
      shrine.city,
      shrine.prefecture,
      shrine.postal_code,
      shrine.country,
    ].filter(Boolean);

    return parts.length ? parts.join(", ") : null;
  }, [shrine]);

  const phone = shrine.phone_number;
  const email = shrine.email;
  const website = shrine.website;

  return (
    <View style={styles.container}>
      {/* NAVIGATION */}
      <View style={[g.rowCenter, styles.navigation]}>
        <View style={styles.locationRow}>
          <FontAwesome6 name="location-dot" size={18} color="black" />
          <Text
            style={[
              t.body,
              t.primary,
              { fontFamily: font.title, marginLeft: 4 },
            ]}
          >
            {distanceLabel ?? "—"}
          </Text>
        </View>

        <Pressable
          {...directionHandlers}
          style={{ flex: 1, opacity: isDirectionsLoading ? 0.65 : 1 }}
          disabled={isDirectionsLoading}
          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
          onPress={onDirections}
        >
          <Animated.View style={{ transform: [{ scale: directionScale }] }}>
            <View style={[g.btnPrimary, g.rowCenter, styles.directionBtnFix]}>
              <FontAwesome5 name="directions" size={24} color="white" />
              <Text style={[t.body, t.white, { fontFamily: font.strong }]}>
                {isDirectionsLoading ? "Opening…" : "Directions"}
              </Text>
            </View>
          </Animated.View>
        </Pressable>
      </View>

      {/* DESCRIPTION */}
      <View style={g.card}>
        <Text style={[t.hero, { fontFamily: font.title }]}>Description</Text>

        <Text style={[t.body, { marginTop: 6, fontFamily: font.body }]}>
          {shrine.shrine_desc ?? "No description yet."}
        </Text>
      </View>

      {/* INFORMATION */}
      <View style={g.card}>
        <Text style={[t.hero, { fontFamily: font.title }]}>Information</Text>

        <InfoRow label="Address" value={address} />
        <InfoRow label="Phone" value={phone} />
        <InfoRow label="Email" value={email} />
        <InfoRow label="Website" value={website} showDivider={false} />
      </View>
      <View style={{ height: 300 }} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: spacing.lg,
  },

  navigation: {
    paddingVertical: spacing.sm,
  },

  locationRow: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.gray300,
    paddingHorizontal: spacing.md,
    borderRadius: radius.md,
    marginRight: spacing.md,
    height: "100%",
  },

  directionBtnFix: {
    gap: 8,
  },

  infoRow: {
    paddingVertical: 4,
  },
});
