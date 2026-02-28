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

import { colors, spacing, radius } from "../styles/tokens";

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
  const isLauncher = typeof onPress === "function";
  const canEdit = editable ?? !isLauncher;

  const showClear = value.length > 0 && typeof onClear === "function";

  const content = (
    <View style={[styles.root, style]}>
      <Ionicons name="search" size={18} color={colors.gray600} />
      <TextInput
        testID={testID}
        style={[styles.input, inputStyle]}
        placeholder={placeholder}
        placeholderTextColor={colors.gray500}
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
          <Ionicons name="close-circle" size={18} color={colors.gray500} />
        </Pressable>
      ) : null}
    </View>
  );

  if (isLauncher) {
    return (
      <Pressable onPress={onPress} style={({ pressed }) => pressed && styles.pressed}>
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
    backgroundColor: colors.gray100,
    borderWidth: 1,
    borderColor: colors.gray500,
  },

  input: {
    flex: 1,
    fontSize: 15,
    color: colors.gray600,
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