import React, { useRef, useMemo } from "react";
import { View, Text, StyleSheet, Pressable, Animated } from "react-native";
import { font } from "../../../../shared/styles/typography";
import type { ShrinePreviewModel } from "../../mappers";
import { FontAwesome6 } from "@expo/vector-icons";
import { getDistanceLabel } from "../../../../shared/distance";
import { useUserLocation } from "../../../../shared/useUserLocation";
import FontAwesome5 from "@expo/vector-icons/FontAwesome5";

type Props = {
  shrine: ShrinePreviewModel;
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
        <Text style={styles.label}>{label}</Text>
        <Text style={styles.value}>{value ?? "Not available"}</Text>
      </View>

      {showDivider && <View style={styles.divider} />}
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
      <View style={styles.navigation}>
        <View style={styles.locationRow}>
          <FontAwesome6 name="location-dot" size={18} color="#000" />
          <Text style={[styles.locationText, { fontFamily: font.title }]}>
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
            <View style={styles.directionButton}>
              <FontAwesome5 name="directions" size={24} color="white" />
              <Text
                style={[
                  styles.directionButtonText,
                  { fontFamily: font.strong },
                ]}
              >
                Directions
              </Text>
            </View>
          </Animated.View>
        </Pressable>
      </View>

      {/* Description */}
      <View style={styles.card}>
        <Text style={[styles.cardTitle, { fontFamily: font.title }]}>
          Description
        </Text>
        <Text style={[styles.desc, { fontFamily: font.body }]}>
          {shrine.shrine_desc ?? "No description yet."}
        </Text>
      </View>

      {/* INFORMATION CARD */}
      <View style={styles.card}>
        <Text style={[styles.cardTitle, { fontFamily: font.title }]}>
          Information
        </Text>

        <InfoRow label="Address" value={address} />
        <InfoRow label="Phone" value={phone} />
        <InfoRow label="Email" value={email} />
        <InfoRow label="Website" value={website} showDivider={false} />
      </View>

      {/* Possibly add Event (much later) */}

      {/* Add disclaimer box */}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 16,
  },

  card: {
    backgroundColor: "#fff",
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,

    // iOS
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 2,

    // Android
    elevation: 2,
  },

  cardTitle: {
    fontSize: 20,
    fontWeight: "900",
    letterSpacing: 0.6,
  },

  desc: {
    marginTop: 6,
    fontSize: 13,
    lineHeight: 20,
  },

  navigation: {
    paddingVertical: 8,
    flexDirection: "row",
    alignItems: "center",
  },

  locationRow: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#d8d8d8",
    paddingHorizontal: 12,
    borderRadius: 8,
    marginRight: 12,
    height: "100%",
  },

  locationText: {
    color: "#000000",
    fontSize: 16,
    marginLeft: 4,
  },

  directionButton: {
    flex: 1,
    flexDirection: "row",
    gap: 8,
    backgroundColor: "#111111",
    borderRadius: 8,
    paddingVertical: 11,
    paddingHorizontal: 16,
    alignItems: "center",
    justifyContent: "center",
  },

  directionButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "700",
    textAlign: "center",
  },

  label: {
    fontSize: 12,
    color: "#666",
    marginTop: 6,
  },

  value: {
    fontSize: 14,
    color: "#111",
  },

  infoRow: {
    paddingVertical: 4,
  },

  divider: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: "#d8d8d8",
  },
});
