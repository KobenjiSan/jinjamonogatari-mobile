import { StyleSheet } from "react-native";
import { colors, spacing, radius } from "./tokens";

export const g = StyleSheet.create({
  /* ---------- LAYOUT ---------- */

  row: {
    flexDirection: "row",
  },

  rowCenter: {
    flexDirection: "row",
    alignItems: "center",
  },

  rowBetween: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  center: {
    alignItems: "center",
    justifyContent: "center",
  },

  fill: {
    flex: 1,
  },

  /* ---------- CARDS ---------- */

  card: {
    backgroundColor: colors.white,
    borderRadius: radius.md,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,

    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 2,
    elevation: 2,
  },

  cardNoPadding: {
    backgroundColor: colors.white,
    borderRadius: radius.md,

    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 2,
    elevation: 2,
  },

  /* ---------- BUTTONS ---------- */

  btnPrimary: {
    backgroundColor: colors.textPrimary,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
    borderRadius: radius.md,
    alignItems: "center",
    justifyContent: "center",
  },

  btnOutline: {
    borderWidth: 1,
    borderColor: colors.black,
    borderRadius: radius.md,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    alignItems: "center",
    justifyContent: "center",
  },

  iconBtnCircle: {
    width: 36,
    height: 36,
    borderRadius: radius.round,
    alignItems: "center",
    justifyContent: "center",
  },

  iconBtnOverlay: {
    backgroundColor: colors.overlayLight,
  },

  /* ---------- PILLS ---------- */

  pill: {
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: radius.sm,
    alignSelf: "flex-start",
  },

  /* ---------- IMAGES ---------- */

  imageCover: {
    width: "100%",
  },

  imageRounded: {
    borderRadius: radius.md,
  },

  imageCreditOverlay: {
    position: "absolute",
    bottom: 6,
    right: 6,
    backgroundColor: colors.overlayDark,
    paddingHorizontal: spacing.xs,
    paddingVertical: 2,
    borderRadius: 4,
  },

  /* ---------- DIVIDERS ---------- */

  divider: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: colors.gray300,
  },
});
