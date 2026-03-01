import React from "react";
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  Modal,
  ScrollView,
  useWindowDimensions,
} from "react-native";
import { useTheme } from "../../../shared/theme/useTheme";
import { t } from "../../../shared/styles/text";
import { spacing, radius } from "../../../shared/styles/tokens";
import { font } from "../../../shared/styles/typography";
import type { ThemeMode } from "../../../shared/theme/useTheme";

type ThemeOption = {
  key: ThemeMode;
  label: string;
  description: string;
};

const THEME_OPTIONS: ThemeOption[] = [
  { key: "light", label: "Light", description: "Clean and neutral" },
  { key: "sacred", label: "Sacred", description: "Torii vermilion + warmth" },
  { key: "forest", label: "Forest", description: "Cedar green pilgrimage" },
  { key: "indigo", label: "Indigo", description: "Calm scholarly archive" },
  { key: "dark", label: "Dark", description: "System dark baseline" },
  { key: "obsidian", label: "Obsidian", description: "Premium low-glare" },
  { key: "lantern", label: "Lantern", description: "Vermilion night mood" },
  { key: "cedar", label: "Cedar Night", description: "Forest night calm" },
];

type Props = {
  visible: boolean;
  onClose: () => void;
  activeTheme: ThemeMode;
  onSelectTheme: (mode: ThemeMode) => void;
};

export default function ThemeSelectModal({
  visible,
  onClose,
  activeTheme,
  onSelectTheme,
}: Props) {
  const theme = useTheme();
  const { height: winH } = useWindowDimensions();

  function handlePick(mode: ThemeMode) {
    onSelectTheme(mode);
    onClose();
  }

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <Pressable style={styles.backdrop} onPress={onClose} />

      <View style={styles.centerWrap}>
        <View
          style={[
            styles.sheet,
            {
              maxHeight: winH * 0.75,
              backgroundColor: theme.colors.bgCard,
              shadowColor: theme.colors.overlayDark,
            },
          ]}
        >
          {/* Close */}
          <View style={styles.closeRow}>
            <Pressable
              style={[
                styles.closeButton,
                { backgroundColor: theme.colors.overlayLight },
              ]}
              onPress={onClose}
              hitSlop={12}
            >
              <Text
                style={[
                  t.body,
                  styles.closeText,
                  { color: theme.colors.textPrimary },
                ]}
              >
                ✕
              </Text>
            </Pressable>
          </View>

          <ScrollView
            contentContainerStyle={styles.sheetContent}
            showsVerticalScrollIndicator
          >
            <Text
              style={[
                t.title,
                { fontFamily: font.title, color: theme.colors.textPrimary },
              ]}
            >
              Theme
            </Text>

            <Text
              style={[
                t.body,
                { fontFamily: font.body, color: theme.colors.textSecondary },
              ]}
            >
              Pick a look. You can change this anytime.
            </Text>

            <View style={styles.list}>
              {THEME_OPTIONS.map((opt) => {
                const selected = opt.key === activeTheme;

                return (
                  <Pressable
                    key={opt.key}
                    onPress={() => handlePick(opt.key)}
                    style={[
                      styles.row,
                      { borderColor: theme.colors.border },
                      selected && {
                        borderColor: theme.colors.link,
                      },
                    ]}
                  >
                    <View style={styles.left}>
                      <Text
                        style={[
                          t.body,
                          {
                            fontFamily: font.strong,
                            color: theme.colors.textPrimary,
                          },
                        ]}
                      >
                        {opt.label}
                      </Text>
                      <Text
                        style={[
                          t.small,
                          {
                            fontFamily: font.body,
                            color: theme.colors.textMuted,
                            marginTop: 2,
                          },
                        ]}
                      >
                        {opt.description}
                      </Text>
                    </View>

                    {/* Selected dot */}
                    <View style={styles.right}>
                      {selected && (
                        <View
                            style={[
                            styles.previewDot,
                            { backgroundColor: theme.colors.buttonPrimaryBg },
                            ]}
                        />
                      )}
                    </View>
                  </Pressable>
                );
              })}
            </View>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.55)",
  },

  centerWrap: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: spacing.lg,
  },

  sheet: {
    width: "100%",
    borderRadius: radius.lg,
    overflow: "hidden",
    paddingBottom: spacing.md,

    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 6,
  },

  closeRow: {
    height: spacing.md,
    alignItems: "flex-end",
    justifyContent: "center",
    paddingHorizontal: spacing.md,
  },

  closeButton: {
    position: "absolute",
    top: spacing.sm,
    right: spacing.sm,
    zIndex: 10,
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
  },

  closeText: {
    fontSize: 14,
    lineHeight: 16,
  },

  sheetContent: {
    padding: spacing.md,
    paddingBottom: spacing.xl,
    gap: spacing.sm,
  },

  list: {
    marginTop: spacing.sm,
    gap: spacing.sm,
  },

  row: {
    borderWidth: 1,
    borderRadius: radius.md,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.md,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  left: {
    flex: 1,
    minWidth: 0,
    paddingRight: spacing.md,
  },

  right: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm,
  },

  previewDot: {
    width: 12,
    height: 12,
    borderRadius: 999,
  },
});