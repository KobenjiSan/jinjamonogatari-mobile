import React from "react";
import { View, Text, StyleSheet, Image } from "react-native";
import { font } from "../../../../../shared/styles/typography";
import { useShrineKamiApi } from "./api/useShrineKami";
import { g } from "../../../../../shared/styles/global";
import { t } from "../../../../../shared/styles/text";
import { spacing, radius } from "../../../../../shared/styles/tokens";

import CitationBlock from "../../../../../shared/components/CitationBlock";
import type { Citation as AppCitation } from "../../../../../shared/components/CitationItem";
import ImageCitationOverlay from "../../../../../shared/components/ImageCitationOverlay";
import { useTheme } from "../../../../../shared/theme/useTheme";

type Props = {
  slug: string;
  enabled: boolean;
};

export default function ShrineKamiTab({ slug, enabled }: Props) {
  const theme = useTheme();
  const fallbackImage = require("../../../../../../assets/images/placeholder-vertical.jpg");
  const { kami, isLoading, error } = useShrineKamiApi(slug, enabled);

  return (
    <View style={styles.container}>
      {isLoading && (
        <View
          style={[
            g.card,
            { backgroundColor: theme.colors.bgCard, shadowColor: theme.colors.overlayDark },
          ]}
        >
          <Text style={[t.body, t.center, { color: theme.colors.textMuted }]}>
            Loading kami...
          </Text>
        </View>
      )}

      {!!error && (
        <View
          style={[
            g.card,
            { backgroundColor: theme.colors.bgCard, shadowColor: theme.colors.overlayDark },
          ]}
        >
          <Text style={[t.body, t.center, { color: theme.colors.textMuted }]}>
            {error}
          </Text>
        </View>
      )}

      {!isLoading && !error && kami.length === 0 ? (
        <>
          <View
            style={[
              g.card,
              { backgroundColor: theme.colors.bgCard, shadowColor: theme.colors.overlayDark },
            ]}
          >
            <Text style={[t.body, t.center, { color: theme.colors.textMuted }]}>
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
              })
            );

            return (
              <View key={k.kami_id}>
                {/* KAMI IMAGE CARD */}
                <View
                  style={[
                    styles.kamiCard,
                    { backgroundColor: theme.colors.bgCard, shadowColor: theme.colors.overlayDark },
                  ]}
                >
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
                        { fontFamily: font.title, color: theme.colors.textPrimary },
                        styles.kamiNameEN,
                      ]}
                    >
                      {k.name_en ?? "Unnamed kami"}
                    </Text>

                    <Text
                      style={[
                        t.title,
                        { fontFamily: font.strong, color: theme.colors.textSecondary },
                        styles.kamiNameJP,
                      ]}
                    >
                      {k.name_jp ?? ""}
                    </Text>
                  </View>
                </View>

                {/* DESCRIPTION CARD */}
                <View
                  style={[
                    g.card,
                    { backgroundColor: theme.colors.bgCard, shadowColor: theme.colors.overlayDark },
                  ]}
                >
                  <Text
                    style={[
                      t.title,
                      { fontFamily: font.title, color: theme.colors.textPrimary },
                      styles.cardTitle,
                    ]}
                  >
                    Who They Are
                  </Text>

                  {k.desc && (
                    <Text
                      style={[
                        t.body,
                        { fontFamily: font.body, marginTop: 6, color: theme.colors.textPrimary },
                      ]}
                    >
                      {k.desc}
                    </Text>
                  )}

                  <CitationBlock citations={mappedCitations} />
                </View>

                <View
                  style={[
                    styles.track,
                    { backgroundColor: theme.colors.border },
                  ]}
                />
              </View>
            );
          })}
        </View>
      )}
      <View style={{ height: 250 }} />
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

  kamiNameJP: {},

  cardTitle: {
    letterSpacing: 0.6,
  },

  track: {
    marginVertical: spacing.xl,
    height: 1,
    width: "100%",
  },
});