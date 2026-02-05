import React from "react";
import { View, Text, StyleSheet, Image } from "react-native";
import { font } from "../../../../shared/styles/typography";
import type { ShrineDetailModel } from "../../mappers";
import { Pressable, Linking } from "react-native";

const openLink = async (url?: string | null) => {
  if (!url) return;

  try {
    const supported = await Linking.canOpenURL(url);
    if (!supported) {
      console.warn("Unsupported URL:", url);
      return;
    }
    await Linking.openURL(url);
  } catch (err) {
    console.warn("Failed to open URL:", url, err);
  }
};

type Props = {
  shrine: ShrineDetailModel;
};

export default function ShrineKamiTab({ shrine }: Props) {
  const fallbackImage = require("../../../../../assets/images/placeholder-vertical.jpg");
  const kami = shrine.kami ?? [];

  return (
    <View style={styles.container}>
      {kami.length === 0 ? (
        <>
          <View style={styles.card}>
            <Text style={styles.emptyText}>
              No kami have been linked to this shrine yet.
            </Text>
          </View>
          <View style={{height: 600}}></View>
        </>
      ) : (
        <View>
          {kami.map((k) => (
            <View key={k.kami_id}>
              <View style={styles.kamiCard}>
                <View style={styles.kamiImgContainer}>
                  <Image
                    source={k.imageUrl ? { uri: k.imageUrl } : fallbackImage}
                    style={styles.kamiImg}
                    resizeMode="cover"
                  />

                  {k.imageCitation?.url && (
                    <Pressable
                      style={styles.imageCreditOverlay}
                      onPress={() => openLink(k.imageCitation?.url)}
                    >
                      <Text style={styles.imageCreditText}>
                        {k.imageCitation.author ?? k.imageCitation.title}
                      </Text>
                    </Pressable>
                  )}
                </View>
                <View style={styles.kamiTitle}>
                  <Text style={[styles.kamiNameEN, { fontFamily: font.title }]}>
                    {k.name_en ?? "Unnamed kami"}
                  </Text>
                  <Text
                    style={[styles.kamiNameJP, { fontFamily: font.strong }]}
                  >
                    {k.name_jp ? `${k.name_jp}` : ""}
                  </Text>
                </View>
              </View>

              <View style={styles.card}>
                <Text style={[styles.cardTitle, { fontFamily: font.title }]}>
                  Who They Are
                </Text>
                {k.desc ? (
                  <Text style={[styles.kamiDesc, { fontFamily: font.body }]}>
                    {k.desc}
                  </Text>
                ) : null}

                {k.citations.length > 0 && (
                  <View style={styles.citationBlock}>
                    <Text style={styles.citationHeader}>Sources</Text>

                    {k.citations.map((c) => (
                      <View key={c.cite_id} style={styles.citationItem}>
                        <Text style={styles.citationText}>
                          • {c.title}
                          {c.year ? ` (${c.year})` : ""}
                        </Text>

                        {c.author && (
                          <Text style={styles.citationMeta}>By {c.author}</Text>
                        )}

                        {c.url && (
                          <Pressable onPress={() => openLink(c.url)}>
                            <Text style={styles.citationLink}>{c.url}</Text>
                          </Pressable>
                        )}
                      </View>
                    ))}
                  </View>
                )}
              </View>
              <View style={styles.track} />
            </View>
          ))}
        </View>
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
    backgroundColor: "#fff",
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,

    // iOS
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 2,

    // Android
    elevation: 2,
  },

  cardTitle: {
    fontSize: 18,
    lineHeight: 24,
    letterSpacing: 0.6,
  },

  kamiCard: {
    backgroundColor: "#fff",
    borderRadius: 8,
    paddingHorizontal: 4,
    paddingVertical: 4,

    // iOS
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 2,

    // Android
    elevation: 2,

    marginBottom: 12,
  },

  kamiImgContainer: {
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
    borderRadius: 6,
    aspectRatio: 3 / 4,
  },

  kamiImg: {
    width: "100%",
    aspectRatio: 3 / 4,
    borderRadius: 6,
  },

  emptyText: {
    fontSize: 14,
    opacity: 0.7,
    lineHeight: 20,
    textAlign: "center"
  },

  kamiTitle: {
    paddingTop: 12,
    paddingBottom: 8,
    alignItems: "center",
  },

  kamiNameEN: {
    fontSize: 18,
    lineHeight: 20,
    paddingBottom: 6,
  },
  kamiNameJP: {
    fontSize: 18,
    lineHeight: 20,
    color: "#0000009d",
  },

  kamiDesc: {
    fontSize: 14,
    lineHeight: 20,
  },

  track: {
    marginVertical: 36,
    height: 1,
    backgroundColor: "#d0d0d0",
    width: "100%",
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
