import React, { useRef, useMemo } from "react";
import { View, Text, StyleSheet, Pressable, Animated } from "react-native";
import { font } from "../../../../shared/styles/typography";
import type { ShrineDetailModel } from "../../mappers";
import { FontAwesome6 } from "@expo/vector-icons";
import { getDistanceLabel } from "../../../../shared/distance";
import { useUserLocation } from "../../../../shared/useUserLocation";
import FontAwesome5 from "@expo/vector-icons/FontAwesome5";
import { g } from "../../../../shared/styles/global";
import { t } from "../../../../shared/styles/text";
import { colors, spacing, radius } from "../../../../shared/styles/tokens";

type Props = {
  shrine: ShrineDetailModel;
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

export default function ShrineInfoTab({ shrine }: Props) {
  const directionScale = useRef(new Animated.Value(1)).current;

  const makePressHandlers = (val: Animated.Value, downTo = 0.9) => ({
    onPressIn: () =>
      Animated.spring(val, { toValue: downTo, useNativeDriver: true }).start(),
    onPressOut: () =>
      Animated.spring(val, { toValue: 1, useNativeDriver: true }).start(),
  });

  const directionHandlers = makePressHandlers(directionScale, 0.95);

  const { location: userLocation } = useUserLocation();
  const distanceLabel = getDistanceLabel(userLocation, shrine.lat, shrine.lon);

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
          style={{ flex: 1 }}
          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
          onPress={() =>
            console.log(`Directions button clicked (${shrine.name_en})`)
          }
        >
          <Animated.View style={{ transform: [{ scale: directionScale }] }}>
            <View style={[g.btnPrimary, g.rowCenter, styles.directionBtnFix]}>
              <FontAwesome5 name="directions" size={24} color="white" />
              <Text style={[t.body, t.white, { fontFamily: font.strong }]}>
                Directions
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
