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
import { colors, spacing, radius } from "../../../../shared/styles/tokens";

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
          <View style={g.card}>
            <Text style={[t.body, t.center, t.muted]}>
              No kami have been linked to this shrine yet.
            </Text>
          </View>

          <View style={{ height: 600 }} />
        </>
      ) : (
        <View>
          {kami.map((k) => (
            <View key={k.kami_id}>
              {/* KAMI IMAGE CARD */}
              <View style={styles.kamiCard}>
                <View style={styles.kamiImgContainer}>
                  <Image
                    source={k.imageUrl ? { uri: k.imageUrl } : fallbackImage}
                    style={styles.kamiImg}
                    resizeMode="cover"
                  />

                  {k.imageCitation?.url && (
                    <Pressable
                      style={g.imageCreditOverlay}
                      onPress={() => openLink(k.imageCitation?.url)}
                    >
                      <Text style={[t.meta, t.white]}>
                        {k.imageCitation.author ?? k.imageCitation.title}
                      </Text>
                    </Pressable>
                  )}
                </View>

                <View style={styles.kamiTitle}>
                  <Text
                    style={[
                      t.title,
                      { fontFamily: font.title },
                      styles.kamiNameEN,
                    ]}
                  >
                    {k.name_en ?? "Unnamed kami"}
                  </Text>

                  <Text
                    style={[
                      t.title,
                      { fontFamily: font.strong },
                      styles.kamiNameJP,
                    ]}
                  >
                    {k.name_jp ?? ""}
                  </Text>
                </View>
              </View>

              {/* DESCRIPTION CARD */}
              <View style={g.card}>
                <Text
                  style={[
                    t.title,
                    { fontFamily: font.title },
                    styles.cardTitle,
                  ]}
                >
                  Who They Are
                </Text>

                {k.desc && (
                  <Text
                    style={[t.body, { fontFamily: font.body, marginTop: 6 }]}
                  >
                    {k.desc}
                  </Text>
                )}

                {k.citations.length > 0 && (
                  <View style={styles.citationBlock}>
                    <Text style={[t.body]}>Sources</Text>

                    {k.citations.map((c) => (
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
    gap: spacing.lg,
    paddingTop: spacing.md,
  },

  kamiCard: {
    ...g.card,
    paddingHorizontal: spacing.xs,
    paddingVertical: spacing.xs,
    marginBottom: spacing.md,
  },

  kamiImgContainer: {
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
    borderRadius: radius.sm,
    aspectRatio: 3 / 4,
  },

  kamiImg: {
    width: "100%",
    aspectRatio: 3 / 4,
    borderRadius: radius.sm,
  },

  kamiTitle: {
    paddingTop: spacing.md,
    paddingBottom: spacing.sm,
    alignItems: "center",
  },

  kamiNameEN: {
    paddingBottom: spacing.xs,
  },

  kamiNameJP: {
    color: colors.textSecondary,
  },

  cardTitle: {
    letterSpacing: 0.6,
  },

  citationBlock: {
    marginTop: spacing.md,
    gap: 4,
  },

  citationItem: {
    gap: 2,
  },

  track: {
    marginVertical: spacing.xl,
    height: 1,
    backgroundColor: colors.gray300,
    width: "100%",
  },
});
