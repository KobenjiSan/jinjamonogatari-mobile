import React, { useMemo } from "react";
import {
  View,
  StyleSheet,
  Platform,
  StatusBar,
  Text,
  ScrollView,
} from "react-native";
// import { useEtiquetteGuide } from "../../features/etiquette/useEtiquetteGuide";
import { useEtiquetteGuideApi } from "./useEtiquetteGuideApi";
import GlanceCard from "./components/GlanceCard";
import { colors, spacing } from "../../shared/styles/tokens";
import HighlightCard from "./components/HighlightCard";
import { font } from "../../shared/styles/typography";
import GuideAccordionCard from "./components/GuideAccordionCard";
import { g } from "../../shared/styles/global";
import { t } from "../../shared/styles/text";

const TOP_PADDING =
  Platform.OS === "android" ? (StatusBar.currentHeight ?? 0) : 44;

const LIST_BOTTOM_SPACER = 96;

export default function EtiquetteScreen() {
  // const { guide, isEmpty } = useEtiquetteGuide();
  const { guide, isEmpty, isLoading, error } = useEtiquetteGuideApi();

  const highlight = useMemo(() => {
    const highlights = guide?.highlights ?? [];
    if (!highlights.length) return null;

    return highlights[0];
  }, [guide?.highlights]);

  const highlightNormalized = useMemo(() => {
    if (!highlight) return null;
    return {
      title: highlight.title_long ?? "Untitled",
      description: highlight.summary ?? "",
      steps: highlight.steps ?? [],
    };
  }, [highlight]);

  if (isLoading) {
    return (
      <View style={[styles.container, styles.content]}>
        <View style={styles.titleArea}>
          <Text style={[styles.title, { fontFamily: font.title }]}>
            Shrine Etiquette
          </Text>
        </View>
        <Text style={[t.body, t.center, t.muted]}>Loading…</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={[styles.container, styles.content]}>
        <View style={styles.titleArea}>
          <Text style={[styles.title, { fontFamily: font.title }]}>
            Shrine Etiquette
          </Text>
        </View>
        <Text style={[t.body, t.center]}>API Error:</Text>
        <Text style={[t.body, t.center, t.muted]}>{error}</Text>
      </View>
    );
  }
  if (isEmpty) {
    return (
      <View style={[styles.container, styles.content]}>
        <View style={styles.titleArea}>
          <Text style={[styles.title, { fontFamily: font.title }]}>
            Shrine Etiquette
          </Text>
        </View>
        <Text style={[t.body, t.center, t.muted]}>
          We Aplogize! The Etiquette Guide is not available.
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.titleArea}>
          <Text style={[styles.title, { fontFamily: font.title }]}>
            Shrine Etiquette
          </Text>
        </View>

        {/* AT A GLANCE */}
        <View style={{ marginTop: 16 }}>
          <Text style={[styles.h2, { fontFamily: font.title }]}>
            At a Glance
          </Text>
          <View style={styles.glance}>
            {guide.atAGlance.map((item) => (
              <GlanceCard
                key={item.topic_id}
                icon_key={item.icon_key}
                icon_set={item.icon_set}
                title={item.title_short}
              />
            ))}
          </View>
        </View>

        {/* HIGHLIGHT */}
        <View style={styles.section}>
          {highlightNormalized && (
            <HighlightCard
              title={highlightNormalized.title}
              description={highlightNormalized.description}
              steps={highlightNormalized.steps}
            />
          )}
        </View>

        {/* FULL GUIDE */}
        <View style={styles.section}>
          <Text style={[styles.h2, { fontFamily: font.title }]}>
            Full Etiquette Guide
          </Text>
          <View style={[styles.accordion, g.cardNoPadding]}>
            {guide.fullGuide.map((item) => (
              <GuideAccordionCard key={item.topic_id} item={item} />
            ))}
          </View>
        </View>
      </ScrollView>
      <View style={styles.footerSpacer} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: {
    paddingTop: TOP_PADDING,
    paddingHorizontal: 16,
    paddingBottom: 24,
  },

  titleArea: {
    alignItems: "center",
    marginTop: spacing.lg,
  },

  title: {
    fontSize: 24,
    lineHeight: 28,
    color: colors.gray600,
  },

  h1: { fontSize: 24, marginBottom: 12 },
  h2: { fontSize: 18, marginBottom: 8 },

  glance: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    gap: spacing.md,
  },

  section: {
    marginTop: 36,
  },

  accordion: {},

  block: {
    paddingVertical: 10,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },

  topicTitle: { fontSize: 16, marginBottom: 4 },
  topicSummary: { fontSize: 14, opacity: 0.8, marginBottom: 6 },

  stepRow: { marginTop: 10 },

  stepImage: {
    width: "100%",
    height: 160,
    borderRadius: 12,
    marginBottom: 8,
  },

  stepText: { fontSize: 14, lineHeight: 20, marginBottom: 6 },

  imageMeta: { fontSize: 12, opacity: 0.8, marginBottom: 2 },
  citeHint: { fontSize: 12, opacity: 0.7 },
  footerSpacer: {
    height: LIST_BOTTOM_SPACER,
  },
});
