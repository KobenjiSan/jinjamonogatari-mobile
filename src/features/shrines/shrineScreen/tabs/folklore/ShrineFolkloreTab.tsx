import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, Pressable } from "react-native";
import { useShrineFolkloreApi } from "./api/useShrineFolklore";
import FolkloreStoryCard from "./components/FolkloreStoryCard";
import Feather from "@expo/vector-icons/Feather";
import { font } from "../../../../../shared/styles/typography";
import { g } from "../../../../../shared/styles/global";
import { t } from "../../../../../shared/styles/text";
import { spacing, radius } from "../../../../../shared/styles/tokens";
import { useTheme } from "../../../../../shared/theme/useTheme";

type Props = {
  slug: string;
  enabled: boolean;
};

export default function ShrineFolkloreTab({ slug, enabled }: Props) {
  const theme = useTheme();
  const fallbackImage = require("../../../../../../assets/images/placeholder-vertical.jpg");
  const { folklore, isLoading, error } = useShrineFolkloreApi(slug, enabled);

  const [index, setIndex] = useState(0);

  const hasFolklore = folklore.length > 0;
  const hasMultiple = folklore.length > 1;

  useEffect(() => {
    if (!hasFolklore) {
      setIndex(0);
      return;
    }
    setIndex((prev) => Math.min(prev, folklore.length - 1));
  }, [hasFolklore, folklore.length]);

  const current = hasFolklore ? folklore[index] : null;

  const goPrev = () => {
    if (!hasFolklore) return;
    setIndex((prev) => (prev - 1 + folklore.length) % folklore.length);
  };

  const goNext = () => {
    if (!hasFolklore) return;
    setIndex((prev) => (prev + 1) % folklore.length);
  };

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
            Loading folklore...
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

      {!isLoading && !error && !hasFolklore ? (
        <>
          <View
            style={[
              g.card,
              { backgroundColor: theme.colors.bgCard, shadowColor: theme.colors.overlayDark },
            ]}
          >
            <Text style={[t.body, t.center, { color: theme.colors.textMuted }]}>
              No folklore has been added for this shrine yet.
            </Text>
          </View>

          <View style={{ height: 600 }} />
        </>
      ) : (
        <View style={{ gap: spacing.sm }}>
          {current && (
            <FolkloreStoryCard
              title={current.title}
              imageUrl={current.imageUrl}
              imageCitation={current.imageCitation}
              story={current.story}
              citations={current.citations}
              fallbackImage={fallbackImage}
            />
          )}

          {/* Controls */}
          {hasMultiple ? (
            <>
              <View style={[g.rowBetween, { paddingTop: spacing.xl }]}>
                <Pressable onPress={goPrev} style={styles.navBtn} hitSlop={8}>
                  <Feather
                    name="circle"
                    size={20}
                    color={theme.colors.textMuted}
                  />
                  <Text
                    style={[
                      t.small,
                      { fontFamily: font.body, opacity: 0.85, color: theme.colors.textPrimary },
                    ]}
                  >
                    Prev
                  </Text>
                </Pressable>

                <Text style={[t.small, { color: theme.colors.textMuted }]}>
                  {index + 1} / {folklore.length}
                </Text>

                <Pressable onPress={goNext} style={styles.navBtn} hitSlop={8}>
                  <Feather
                    name="circle"
                    size={20}
                    color={theme.colors.textMuted}
                  />
                  <Text
                    style={[
                      t.small,
                      { fontFamily: font.body, opacity: 0.85, color: theme.colors.textPrimary },
                    ]}
                  >
                    Next
                  </Text>
                </Pressable>
              </View>

              <View style={[styles.track, { backgroundColor: theme.colors.border }]} />
            </>
          ) : (
            <View style={{ height: 150 }} />
          )}
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

  navBtn: {
    paddingHorizontal: spacing.md,
    paddingBottom: spacing.sm,
    borderRadius: radius.md,
    alignItems: "center",
  },

  track: {
    marginVertical: spacing.xl,
    height: 1,
    width: "100%",
  },
});