import React from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  Pressable,
  Linking,
} from "react-native";
import { font } from "../../../../shared/styles/typography";
import type { ShrineDetailModel } from "../../mappers";
import { g } from "../../../../shared/styles/global";
import { t } from "../../../../shared/styles/text";
import { spacing, radius } from "../../../../shared/styles/tokens";

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
  shrine: ShrineDetailModel;
};

export default function ShrineHistoryTab({ shrine }: Props) {
  const fallbackImage = require("../../../../../assets/images/placeholder-vertical.jpg");

  const history = [...(shrine.history ?? [])].sort(
    (a, b) => a.sort_order - b.sort_order,
  );

  return (
    <View style={styles.container}>
      {history.length === 0 ? (
        <>
          <View style={g.card}>
            <Text style={[t.body, t.center, t.muted]}>
              No historical records are available for this shrine yet.
            </Text>
          </View>

          <View style={{ height: 600 }} />
        </>
      ) : (
        history.map((h, index) => (
          <View key={h.history_id} style={[g.card, styles.card]}>
            {/* Timeline spine */}
            <View style={styles.timeline}>
              <View style={styles.dot} />
              {index !== history.length - 1 && <View style={styles.line} />}
            </View>

            {/* Content */}
            <View style={styles.content}>
              <Text style={[t.body, t.secondary, styles.historyDate]}>
                {new Date(h.event_date).getFullYear()}
              </Text>

              <Text
                style={[t.title, { fontFamily: font.title }, styles.cardTitle]}
              >
                {h.title}
              </Text>

              {h.information && (
                <Text style={[t.body, { fontFamily: font.body, marginTop: 4 }]}>
                  {h.information}
                </Text>
              )}

              {h.imageUrl && (
                <View style={styles.imageCard}>
                  <Image
                    source={h.imageUrl ? { uri: h.imageUrl } : fallbackImage}
                    style={styles.image}
                    resizeMode="cover"
                  />

                  {h.imageCitation?.url && (
                    <Pressable
                      style={g.imageCreditOverlay}
                      onPress={() => openLink(h.imageCitation?.url)}
                    >
                      <Text style={[t.meta, t.white]}>
                        {h.imageCitation.author ?? h.imageCitation.title}
                      </Text>
                    </Pressable>
                  )}
                </View>
              )}

              {h.citations.length > 0 && (
                <View style={styles.citationBlock}>
                  <Text style={t.body}>Sources</Text>

                  {h.citations.map((c) => (
                    <View key={c.cite_id} style={styles.citationItem}>
                      <Text style={t.meta}>
                        • {c.title}
                        {c.year ? ` (${c.year})` : ""}
                      </Text>

                      {c.author && <Text style={t.meta}>By {c.author}</Text>}

                      {c.url && (
                        <Pressable onPress={() => openLink(c.url)}>
                          <Text style={[t.meta, t.link]}>{c.url}</Text>
                        </Pressable>
                      )}
                    </View>
                  ))}
                </View>
              )}
            </View>
          </View>
        ))
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: spacing.lg,
    paddingTop: spacing.md,
  },

  card: {
    position: "relative",
  },

  timeline: {
    position: "absolute",
    left: spacing.md,
    top: spacing.md,
    bottom: spacing.md,
    alignItems: "center",
  },

  dot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: "#333",
    marginTop: 6,
  },

  line: {
    width: 2,
    flex: 1,
    backgroundColor: "#ccc",
    marginTop: 4,
  },

  content: {
    paddingLeft: 20,
  },

  historyDate: {
    marginBottom: 4,
  },

  cardTitle: {
    letterSpacing: 0.6,
  },

  imageCard: {
    marginTop: spacing.sm,
    borderRadius: radius.md,
    overflow: "hidden",
  },

  image: {
    width: "100%",
    aspectRatio: 4 / 3,
    borderRadius: radius.sm,
  },

  citationBlock: {
    marginTop: spacing.md,
    gap: 4,
  },

  citationItem: {
    gap: 2,
  },
});
