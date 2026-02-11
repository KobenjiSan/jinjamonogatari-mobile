import React from "react";
import { View, Text, StyleSheet, Image } from "react-native";
import { g } from "../../../shared/styles/global";
import { t } from "../../../shared/styles/text";
import { colors, spacing, radius } from "../../../shared/styles/tokens";
import { font } from "../../../shared/styles/typography";

type Step = {
  step_id: string | number;
  step_order: number;
  text: string;
  imageUrl?: string | null;
  imageTitle?: string | null;
  imageCitation?: { title?: string | null } | null;
};

type HighlightCardProps = {
  title: string;
  description?: string;
  steps: Step[];
};

const HighlightCard = ({ title, description, steps }: HighlightCardProps) => {
  return (
    <View style={[g.card, styles.card]}>
      {/* TITLE */}
      <Text style={[t.title, { fontFamily: font.strong }]}>{title}</Text>

      {/* DESCRIPTION */}
      {!!description && (
        <Text style={[t.body, t.secondary, styles.desc]}>{description}</Text>
      )}

      {/* STEPS */}
      <View style={styles.stepsWrap}>
        {steps.map((s) => (
          <View key={s.step_id} style={styles.stepCard}>
            <Text style={[t.small, styles.stepText]}>
              {s.step_order}. {s.text}
            </Text>
          </View>
        ))}
      </View>
    </View>
  );
};

export default HighlightCard;

const styles = StyleSheet.create({
  card: {
    gap: spacing.sm,
  },

  desc: {
    marginTop: spacing.xs,
  },

  stepsWrap: {
    gap: spacing.sm,
    marginTop: spacing.sm,
  },

  stepCard: {
    backgroundColor: colors.gray100,
    padding: spacing.sm,
    borderRadius: radius.sm,
    gap: spacing.xs,
  },

  stepText: {
    lineHeight: 20,
  },
});
