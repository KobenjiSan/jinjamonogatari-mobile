import React from "react";
import { View, Text, StyleSheet, Pressable, Linking } from "react-native";
import { t } from "../../shared/styles/text";
import { useTheme } from "../../shared/theme/useTheme";

export type Citation = {
  cite_id?: number | string;
  title: string;
  url?: string | null;
  author?: string | null;
  year?: number | null;
};

const openLink = async (url?: string | null) => {
  if (!url) return;

  try {
    const supported = await Linking.canOpenURL(url);
    if (!supported) return;
    await Linking.openURL(url);
  } catch (err) {
    console.warn("Failed to open URL:", url, err);
  }
};

type Props = {
  citation: Citation;
};

export default function CitationItem({ citation }: Props) {
  const theme = useTheme();

  return (
    <View style={styles.citationItem}>
      <Text style={[t.meta, { color: theme.colors.textMuted }]}>
        • {citation.title}
        {citation.year ? ` (${citation.year})` : ""}
      </Text>

      {citation.author && (
        <Text style={[t.meta, { color: theme.colors.textMuted }]}>
          By {citation.author}
        </Text>
      )}

      {citation.url && (
        <Pressable onPress={() => openLink(citation.url)}>
          <Text style={[t.meta, { color: theme.colors.link, textDecorationLine: "underline" }]}>
            {citation.url}
          </Text>
        </Pressable>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  citationItem: {
    gap: 2,
  },
});