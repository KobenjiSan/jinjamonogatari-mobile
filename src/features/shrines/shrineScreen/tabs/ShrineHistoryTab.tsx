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
          <View style={styles.card}>
            <Text style={styles.emptyText}>
              No historical records are available for this shrine yet.
            </Text>
          </View>
          <View style={{height: 600}}></View>
        </>
      ) : (
        history.map((h, index) => (
          <View key={h.history_id} style={styles.card}>
            {/* Timeline spine INSIDE card */}
            <View style={styles.timeline}>
              <View style={styles.dot} />
              {index !== history.length - 1 && (
                <View style={styles.line} />
              )}
            </View>

            {/* Card content */}
            <View style={styles.content}>
              <Text style={styles.historyDate}>
                {new Date(h.event_date).getFullYear()}
              </Text>

              <Text style={[styles.cardTitle, { fontFamily: font.title }]}>
                {h.title}
              </Text>

              {h.information && (
                <Text style={[styles.desc, { fontFamily: font.body }]}>
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
                      style={styles.imageCreditOverlay}
                      onPress={() => openLink(h.imageCitation?.url)}
                    >
                      <Text style={styles.imageCreditText}>
                        {h.imageCitation.author ??
                          h.imageCitation.title}
                      </Text>
                    </Pressable>
                  )}
                </View>
              )}

              {h.citations.length > 0 && (
                <View style={styles.citationBlock}>
                  <Text style={styles.citationHeader}>Sources</Text>

                  {h.citations.map((c) => (
                    <View key={c.cite_id} style={styles.citationItem}>
                      <Text style={styles.citationText}>
                        • {c.title}
                        {c.year ? ` (${c.year})` : ""}
                      </Text>

                      {c.author && (
                        <Text style={styles.citationMeta}>
                          By {c.author}
                        </Text>
                      )}

                      {c.url && (
                        <Pressable onPress={() => openLink(c.url)}>
                          <Text style={styles.citationLink}>
                            {c.url}
                          </Text>
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
    gap: 16,
    paddingTop: 12,
  },

  card: {
    position: "relative",
    backgroundColor: "#fff",
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,

    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 2,
    elevation: 2,
  },

  timeline: {
    position: "absolute",
    left: 12,
    top: 12,
    bottom: 12,
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
    paddingLeft: 20, // makes room for timeline INSIDE card
  },

  historyDate: {
    fontSize: 16,
    opacity: 0.6,
    marginBottom: 4,
  },

  cardTitle: {
    fontSize: 18,
    lineHeight: 24,
    letterSpacing: 0.6,
  },

  desc: {
    marginTop: 2,
    fontSize: 14,
    lineHeight: 20,
  },

  imageCard: {
    marginTop: 8,
    borderRadius: 8,
    overflow: "hidden",
  },

  image: {
    width: "100%",
    aspectRatio: 4 / 3,
    borderRadius: 6,
  },

  emptyText: {
    fontSize: 14,
    opacity: 0.7,
    lineHeight: 20,
    textAlign: "center"
  },

  citationBlock: {
    marginTop: 14,
    gap: 4,
  },

  citationHeader: {
    fontWeight: "700",
    fontSize: 14,
    opacity: 0.8,
  },

  citationItem: {
    gap: 0.5,
  },

  citationText: {
    fontSize: 10,
    lineHeight: 12,
  },

  citationMeta: {
    fontSize: 8,
    opacity: 0.7,
  },

  citationLink: {
    fontSize: 8,
    color: "#2a6db0",
  },

  imageCreditOverlay: {
    position: "absolute",
    bottom: 6,
    right: 6,
    backgroundColor: "rgba(0,0,0,0.6)",
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },

  imageCreditText: {
    color: "#fff",
    fontSize: 10,
    lineHeight: 12,
  },
});
