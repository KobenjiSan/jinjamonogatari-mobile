import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { t } from "../../shared/styles/text"; 
import { spacing } from "../../shared/styles/tokens";
import CitationItem, { Citation } from "./CitationItem";

type Props = {
  citations: Citation[];
  title?: string;
};

export default function CitationBlock({ citations, title = "Sources" }: Props) {
  if (!citations.length) return null;

  return (
    <View style={styles.citationBlock}>
      <Text style={t.body}>{title}</Text>

      {citations.map((c, idx) => (
        <CitationItem
          key={(c.cite_id ?? `${c.title}-${idx}`) as any}
          citation={c}
        />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  citationBlock: {
    marginTop: spacing.md,
    gap: 4,
  },
});
