import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { g } from "../../../shared/styles/global";
import { t } from "../../../shared/styles/text";
import { spacing, radius } from "../../../shared/styles/tokens";
import { font } from "../../../shared/styles/typography";
import { useTheme } from "../../../shared/theme/useTheme";

type Step = {
  step_id: string | number;
  step_order: number;
  text: string;
};

type HighlightCardProps = {
  title: string;
  description?: string;
  steps: Step[];
};

const HighlightCard = ({ title, description, steps }: HighlightCardProps) => {
  const theme = useTheme();

  return (
    <View
      style={[
        g.card,
        styles.card,
        {
          backgroundColor: theme.colors.bgCard,
          shadowColor: theme.colors.overlayDark,
        },
      ]}
    >
      {/* TITLE */}
      <Text
        style={[
          t.title,
          { fontFamily: font.strong, color: theme.colors.textPrimary },
        ]}
      >
        {title}
      </Text>

      {/* DESCRIPTION */}
      {!!description && (
        <Text
          style={[t.body, styles.desc, { color: theme.colors.textSecondary }]}
        >
          {description}
        </Text>
      )}

      {/* STEPS */}
      <View style={styles.stepsWrap}>
        {steps.map((s) => (
          <View
            key={s.step_id}
            style={[styles.stepCard, { backgroundColor: theme.colors.bgApp }]}
          >
            <Text
              style={[
                t.small,
                styles.stepText,
                { color: theme.colors.textPrimary },
              ]}
            >
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
    padding: spacing.sm,
    borderRadius: radius.sm,
    gap: spacing.xs,
  },

  stepText: {
    lineHeight: 20,
  },
});
