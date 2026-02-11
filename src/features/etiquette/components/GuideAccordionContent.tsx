// GuideAccordionContent.tsx
import React, { useEffect, useMemo, useRef, useState } from "react";
import { View, Text, StyleSheet, Animated, Easing, Image } from "react-native";

import { t } from "../../../shared/styles/text";
import { colors, spacing, radius } from "../../../shared/styles/tokens";

import CitationBlock from "../../../shared/components/CitationBlock";
import type { Citation as AppCitation } from "../../../shared/components/CitationItem";
import ImageCitationOverlay from "../../../shared/components/ImageCitationOverlay";

export type Citation = {
  cite_id: number;
  title: string;
  author?: string | null;
  url?: string | null;
  year?: number | null;
  notes?: string | null;
};

export type AccordionStep = {
  step_id: string | number;
  step_order: number;
  text: string;
  imageUrl?: string | null;
  imageTitle?: string | null;
  imageCitation?: {
    url?: string | null;
    author?: string | null;
    title?: string | null;
  } | null;
};

export type GuideItem = {
  topic_id: string | number;
  title_long: string;
  title_short: string;
  summary?: string | null;
  steps?: AccordionStep[] | null;
  citations?: Citation[] | null;
};

type GuideAccordionContentProps = {
  item: GuideItem;
  isOpen: boolean;
  durationMs?: number;
};

export default function GuideAccordionContent({
  item,
  isOpen,
  durationMs = 360,
}: GuideAccordionContentProps) {
  const steps = useMemo(() => item.steps ?? [], [item.steps]);
  const citations = useMemo(() => item.citations ?? [], [item.citations]);

  const mappedCitations: AppCitation[] = useMemo(
    () =>
      citations.map((c) => ({
        cite_id: c.cite_id,
        title: c.title,
        url: c.url ?? null,
        author: c.author ?? null,
        year: c.year ?? null,
      })),
    [citations],
  );

  const [contentHeight, setContentHeight] = useState(0);

  // progress is controlled by parent state (isOpen)
  const progress = useRef(new Animated.Value(isOpen ? 1 : 0)).current;

  const height = Animated.multiply(progress, contentHeight);
  const opacity = progress.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 1],
  });
  const translateY = progress.interpolate({
    inputRange: [0, 1],
    outputRange: [-6, 0],
  });

  useEffect(() => {
    Animated.timing(progress, {
      toValue: isOpen ? 1 : 0,
      duration: durationMs,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: false,
    }).start();
  }, [isOpen, durationMs, progress]);

  return (
    <Animated.View style={[styles.bodyClip, { height }]}>
      <Animated.View
        style={[styles.body, { opacity, transform: [{ translateY }] }]}
        onLayout={(e) => {
          const h = e.nativeEvent.layout.height;
          // Keep the max measured height so collapse/expand is stable
          if (h > contentHeight) setContentHeight(h);
        }}
      >
        {!!item.summary && (
          <Text style={[t.body, t.primary, styles.summary]}>
            {item.summary}
          </Text>
        )}

        {!!steps.length && (
          <View style={styles.stepsWrap}>
            {steps.map((s) => (
              <View key={s.step_id} style={styles.stepCard}>
                {!!s.imageUrl && (
                  <View style={styles.stepImageWrap}>
                    <Image
                      source={{ uri: s.imageUrl }}
                      style={styles.stepImage}
                      resizeMode="cover"
                    />
                    <ImageCitationOverlay citation={s.imageCitation} />
                  </View>
                )}

                <Text style={[t.body, styles.stepText]}>
                  {s.step_order}. {s.text}
                </Text>
              </View>
            ))}
          </View>
        )}

        <CitationBlock citations={mappedCitations} />
      </Animated.View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  bodyClip: {
    overflow: "hidden",
    backgroundColor: colors.gray100,
  },

  body: {
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.lg,
    paddingTop: spacing.sm,
    gap: spacing.sm,
    backgroundColor: colors.gray100,
  },

  summary: {
    marginBottom: spacing.xs,
  },

  stepsWrap: {
    gap: spacing.sm,
  },

  stepCard: {
    backgroundColor: colors.white,
    borderRadius: radius.sm,
    padding: spacing.sm,
    gap: spacing.xs,

    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 2,
    elevation: 1,
  },

  stepImageWrap: {
    position: "relative",
    width: "100%",
    borderRadius: radius.sm,
    overflow: "hidden",
  },

  stepImage: {
    width: "100%",
    aspectRatio: 1,
    borderRadius: radius.sm,
  },

  stepText: {
    lineHeight: 20,
  },
});
