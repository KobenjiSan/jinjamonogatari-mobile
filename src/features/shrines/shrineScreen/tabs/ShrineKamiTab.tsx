import React from "react";
import { View, Text, StyleSheet, Image } from "react-native";
import { font } from "../../../../shared/styles/typography";
import type { ShrineDetailModel } from "../../mappers";
import { g } from "../../../../shared/styles/global";
import { t } from "../../../../shared/styles/text";
import { colors, spacing, radius } from "../../../../shared/styles/tokens";

import CitationBlock from "../../../../shared/components/CitationBlock";
import type { Citation as AppCitation } from "../../../../shared/components/CitationItem";
import ImageCitationOverlay from "../../../../shared/components/ImageCitationOverlay";

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
          {kami.map((k) => {
            const mappedCitations: AppCitation[] = (k.citations ?? []).map(
              (c) => ({
                cite_id: c.cite_id,
                title: c.title,
                url: c.url ?? null,
                author: c.author ?? null,
                year: c.year ?? null,
              }),
            );

            return (
              <View key={k.kami_id}>
                {/* KAMI IMAGE CARD */}
                <View style={styles.kamiCard}>
                  <View style={styles.kamiImgContainer}>
                    <Image
                      source={k.imageUrl ? { uri: k.imageUrl } : fallbackImage}
                      style={styles.kamiImg}
                      resizeMode="cover"
                    />

                    {/* citation overlay */}
                    <ImageCitationOverlay citation={k.imageCitation} />
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

                  <CitationBlock citations={mappedCitations} />
                </View>

                <View style={styles.track} />
              </View>
            );
          })}
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

  track: {
    marginVertical: spacing.xl,
    height: 1,
    backgroundColor: colors.gray300,
    width: "100%",
  },
});
