import { StyleSheet } from "react-native";
import { fontSize, colors } from "./tokens";

export const t = StyleSheet.create({
  title: {
    fontSize: fontSize.xl,
    lineHeight: 24,
  },

  hero: {
    fontSize: fontSize.hero,
    lineHeight: 28,
  },

  body: {
    fontSize: fontSize.md,
    lineHeight: 20,
  },

  small: {
    fontSize: fontSize.sm,
    lineHeight: 14,
  },

  meta: {
    fontSize: fontSize.xs,
    lineHeight: 12,
    opacity: 0.7,
  },

  center: {
    textAlign: "center",
  },

  muted: {
    color: colors.textMuted,
  },

  secondary: {
    color: colors.textSecondary,
  },

  link: {
    color: colors.link,
    textDecorationLine: "underline",
  },

  white: {
    color: colors.white,
  },

  primary: {
    color: colors.textPrimary,
  },
});
