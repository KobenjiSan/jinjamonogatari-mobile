import React from "react";
import {
  View,
  TextInput,
  StyleSheet,
  Pressable,
  ViewStyle,
  TextStyle,
} from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";

import { spacing, radius } from "../styles/tokens";
import { useTheme } from "../theme/useTheme";

type Props = {
  value?: string;
  onChangeText?: (text: string) => void;

  placeholder?: string;

  onPress?: () => void;

  onClear?: () => void;

  style?: ViewStyle;
  inputStyle?: TextStyle;

  autoFocus?: boolean;
  editable?: boolean;
  testID?: string;
};

export default function SearchBar({
  value = "",
  onChangeText,
  placeholder = "Search",
  onPress,
  onClear,
  style,
  inputStyle,
  autoFocus,
  editable,
  testID,
}: Props) {
  const theme = useTheme();

  const isLauncher = typeof onPress === "function";
  const canEdit = editable ?? !isLauncher;

  const showClear = value.length > 0 && typeof onClear === "function";

  const content = (
    <View
      style={[
        styles.root,
        {
          backgroundColor: theme.colors.inputEditableBg,
          borderColor: theme.colors.border,
        },
        style,
      ]}
    >
      <Ionicons name="search" size={18} color={theme.colors.textSecondary} />
      <TextInput
        testID={testID}
        style={[
          styles.input,
          { color: theme.colors.textPrimary },
          inputStyle,
        ]}
        placeholder={placeholder}
        placeholderTextColor={theme.colors.textMuted}
        value={value}
        onChangeText={onChangeText}
        autoFocus={autoFocus}
        editable={canEdit}
        pointerEvents={isLauncher ? "none" : "auto"} // launcher: let Pressable handle touches
        returnKeyType="search"
        autoCorrect={false}
        autoCapitalize="none"
        clearButtonMode="never"
      />

      {showClear ? (
        <Pressable onPress={onClear} hitSlop={10} style={styles.clearBtn}>
          <Ionicons
            name="close-circle"
            size={18}
            color={theme.colors.textMuted}
          />
        </Pressable>
      ) : null}
    </View>
  );

  if (isLauncher) {
    return (
      <Pressable
        onPress={onPress}
        style={({ pressed }) => pressed && styles.pressed}
      >
        {content}
      </Pressable>
    );
  }

  return content;
}

const styles = StyleSheet.create({
  root: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm,
    paddingHorizontal: spacing.md,
    height: 44,
    borderRadius: radius.xl,
    borderWidth: 1,
  },

  input: {
    flex: 1,
    fontSize: 15,
    paddingVertical: 0,
  },

  clearBtn: {
    marginLeft: spacing.xs,
  },

  pressed: {
    opacity: 0.92,
    transform: [{ scale: 0.995 }],
  },
});