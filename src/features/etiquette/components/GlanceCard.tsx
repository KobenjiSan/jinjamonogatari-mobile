import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { g } from "../../../shared/styles/global";
import { t } from "../../../shared/styles/text";
import { colors, spacing } from "../../../shared/styles/tokens";
import { font } from "../../../shared/styles/typography";

import FontAwesome5 from "@expo/vector-icons/FontAwesome5";
import FontAwesome6 from "@expo/vector-icons/FontAwesome6";

type GlanceCardProps = {
  icon_key: string;
  icon_set: "fa5" | "fa6";
  title: string;
};

const GlanceCard = ({ icon_key, icon_set, title }: GlanceCardProps) => {
  const Icon = icon_set === "fa6" ? FontAwesome6 : FontAwesome5;

  return (
    <View style={[g.card, styles.card]}>
      <Icon name={icon_key as any} size={28} color={colors.textPrimary} />

      <View style={styles.textWrap}>
        <Text style={[t.small, { fontFamily: font.strong }]} numberOfLines={1}>
          {title}
        </Text>
      </View>
    </View>
  );
};

export default GlanceCard;

const styles = StyleSheet.create({
  card: {
    flexDirection: "column",
    alignItems: "center",
    gap: spacing.md,
    width: "30%",
    paddingHorizontal: spacing.sm,
  },

  textWrap: {
    gap: 2,
    alignItems: "center",
  },
});
