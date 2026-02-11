import React from "react";
import { View, Text, StyleSheet, Pressable, Linking } from "react-native";
import { t } from "../../shared/styles/text"; 

export type Citation = {
  cite_id?: number | string; // allow flexible ids across models
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
  return (
    <View style={styles.citationItem}>
      <Text style={t.meta}>
        • {citation.title}
        {citation.year ? ` (${citation.year})` : ""}
      </Text>

      {citation.author && <Text style={t.meta}>By {citation.author}</Text>}

      {citation.url && (
        <Pressable onPress={() => openLink(citation.url)}>
          <Text style={[t.meta, t.link]}>{citation.url}</Text>
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
