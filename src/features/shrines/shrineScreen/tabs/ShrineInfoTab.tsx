import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { font } from "../../../../shared/styles/typography";
import type { ShrinePreviewModel } from "../../mappers";

type Props = {
  shrine: ShrinePreviewModel;
};

export default function ShrineInfoTab({ shrine }: Props) {
  return (
    <View style={styles.container}>
      <View>{/* TODO: Navigation Group */}</View>

      {/* Description */}
      <View style={styles.card}>
        <Text style={[styles.cardTitle, { fontFamily: font.title }]}>
          Description
        </Text>
        <Text style={[styles.desc, { fontFamily: font.body }]}>
          {shrine.shrine_desc ?? "No description yet."}
        </Text>
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

  desc: {
    marginTop: 6,
    fontSize: 13,
    lineHeight: 20,
  },
});
