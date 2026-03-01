import React from "react";
import { Text, View, StyleSheet, ViewStyle, TextStyle } from "react-native";
import { g } from "../styles/global";
import { t } from "../styles/text";
import { spacing, radius } from "../styles/tokens";
import { useTheme } from "../theme/useTheme";

export type Tag = {
  tag_id: number;
  title_en: string;
  title_jp?: string | null;
  created_at?: string;
  updated_at?: string;
};

type TagPillProps = {
  tag: Tag;
  backgroundColor?: string;
  textColor?: string;
  style?: ViewStyle;
  textStyle?: TextStyle;
};

const TagPill: React.FC<TagPillProps> = ({
  tag,
  backgroundColor,
  textColor,
  style,
  textStyle,
}) => {
  const theme = useTheme();

  const en = (tag.title_en ?? "").trim();
  const jp = (tag.title_jp ?? "").trim();

  const label = en && jp ? `${en} - ${jp}` : en || jp || "Tag";

  const pillBg = backgroundColor ?? theme.colors.tagBg;
  const pillText = textColor ?? theme.colors.tagText;

  return (
    <View
      style={[g.pill, { backgroundColor: pillBg }, style]}
      accessibilityRole="text"
      accessibilityLabel={label}
    >
      <Text
        style={[t.small, styles.text, { color: pillText }, textStyle]}
        numberOfLines={1}
      >
        {label}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  text: {
    lineHeight: 14,
  },
});

export default TagPill;