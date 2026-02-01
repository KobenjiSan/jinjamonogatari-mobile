import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { font } from "../../../../shared/styles/typography";
import type { ShrinePreviewModel } from "../../mappers";

type Props = {
  shrine: ShrinePreviewModel;
};

export default function ShrineKamiTab({ shrine }: Props) {
  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <Text style={[styles.cardTitle, { fontFamily: font.title }]}>Kami</Text>
      </View>
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
    fontSize: 16,
    fontWeight: "900",
    letterSpacing: 0.6,
  },
});
