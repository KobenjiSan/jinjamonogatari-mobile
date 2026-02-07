import React from "react";
import { Text, View, StyleSheet, ViewStyle, TextStyle } from "react-native";
import { g } from "../../../shared/styles/global";
import { t } from "../../../shared/styles/text";
import { colors, spacing, radius } from "../../../shared/styles/tokens";

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
  backgroundColor = "#dadada",
  textColor = colors.black,
  style,
  textStyle,
}) => {
  const en = (tag.title_en ?? "").trim();
  const jp = (tag.title_jp ?? "").trim();

  const label = en && jp ? `${en} - ${jp}` : en || jp || "Tag";

  return (
    <View
      style={[
        g.pill,
        { backgroundColor },
        style,
      ]}
      accessibilityRole="text"
      accessibilityLabel={label}
    >
      <Text
        style={[
          t.small,
          styles.text,
          { color: textColor },
          textStyle,
        ]}
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