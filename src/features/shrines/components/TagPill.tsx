import React from "react";
import { Text, View, StyleSheet, ViewStyle, TextStyle } from "react-native";

export type Tag = {
  tag_id: number;
  title_en: string;
  title_jp?: string | null;
  created_at?: string;
  updated_at?: string;
};

type TagPillProps = {
  tag: Tag;
  // Override colors
  backgroundColor?: string;
  textColor?: string;
  // tweak spacing/size without forking the component
  style?: ViewStyle;
  textStyle?: TextStyle;
};

const TagPill: React.FC<TagPillProps> = ({
  tag,
  backgroundColor = "#dadada", // light gray
  textColor = "#000000",
  style,
  textStyle,
}) => {
  const en = (tag.title_en ?? "").trim();
  const jp = (tag.title_jp ?? "").trim();

  const label = en && jp ? `${en} - ${jp}` : en || jp || "Tag";

  return (
    <View
      style={[
        styles.pill,
        { backgroundColor },
        style,
      ]}
      accessibilityRole="text"
      accessibilityLabel={label}
    >
      <Text style={[styles.text, { color: textColor }, textStyle]} numberOfLines={1}>
        {label}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  pill: {
    alignSelf: "flex-start",
    paddingHorizontal: 6,
    paddingVertical: 5,
    borderRadius: 6,
  },
  text: {
    fontSize: 12,
    lineHeight: 14,
    fontWeight: "600",
  },
});

export default TagPill;