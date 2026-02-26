import React, { useMemo, useState } from "react";
import {
  View,
  StyleSheet,
  Platform,
  StatusBar,
  Text,
  ScrollView,
  Modal,
  Pressable,
} from "react-native";
import { useEtiquetteGuideApi } from "./useEtiquetteGuideApi";
import GlanceCard from "./components/GlanceCard";
import { colors, spacing } from "../../shared/styles/tokens";
import HighlightCard from "./components/HighlightCard";
import { font } from "../../shared/styles/typography";
import GuideAccordionCard from "./components/GuideAccordionCard";
import { g } from "../../shared/styles/global";
import { t } from "../../shared/styles/text";

import FontAwesome5 from "@expo/vector-icons/FontAwesome5";
import FontAwesome6 from "@expo/vector-icons/FontAwesome6";

const TOP_PADDING =
  Platform.OS === "android" ? (StatusBar.currentHeight ?? 0) : 44;

const LIST_BOTTOM_SPACER = 96;

export default function EtiquetteScreen() {
  // const { guide, isEmpty } = useEtiquetteGuide();
  const { guide, isEmpty, isLoading, error } = useEtiquetteGuideApi();

  // Modal state for glance items (minimal typing to keep diffs small)
  const [selectedGlance, setSelectedGlance] = useState<any | null>(null);
  const isModalOpen = !!selectedGlance;

  function closeModal() {
    setSelectedGlance(null);
  }

  const SelectedIcon = useMemo(() => {
    if (!selectedGlance) return null;
    return selectedGlance.icon_set === "fa6" ? FontAwesome6 : FontAwesome5;
  }, [selectedGlance]);

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
            {guide.atAGlance.map((item: any) => (
              <GlanceCard
                key={item.topic_id}
                icon_key={item.icon_key}
                icon_set={item.icon_set}
                title={item.title_short}
                onPress={() => setSelectedGlance(item)}
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
            {guide.fullGuide.map((item: any) => (
              <GuideAccordionCard key={item.topic_id} item={item} />
            ))}
          </View>
        </View>
      </ScrollView>

      {/* GLANCE MODAL */}
      <Modal
        visible={isModalOpen}
        transparent
        animationType="fade"
        onRequestClose={closeModal}
      >
        <Pressable style={styles.backdrop} onPress={closeModal} />

        <View style={styles.centerWrap}>
          <View style={styles.sheet}>
            <View style={styles.closeRow}>
              <Pressable
                style={styles.closeButton}
                onPress={closeModal}
                hitSlop={12}
              >
                <Text style={[t.body, t.primary, styles.closeText]}>✕</Text>
              </Pressable>
            </View>

            <ScrollView
              contentContainerStyle={styles.sheetContent}
              showsVerticalScrollIndicator
            >
              {/* Icon */}
              {!!SelectedIcon && (
                <View style={styles.modalIconRow}>
                  <SelectedIcon
                    name={(selectedGlance?.icon_key ?? "") as any}
                    size={34}
                    color={colors.textPrimary}
                  />
                </View>
              )}

              {/* Long Title */}
              <Text style={[t.title, { fontFamily: font.title }, t.center]}>
                {selectedGlance?.title_long ??
                  selectedGlance?.title_short ??
                  "Untitled"}
              </Text>

              {/* Summary */}
              {!!selectedGlance?.summary && (
                <Text
                  style={[
                    t.body,
                    styles.modalBodyText,
                    { fontFamily: font.body },
                  ]}
                >
                  {selectedGlance.summary}
                </Text>
              )}

              {/* Nudge */}
              <View style={styles.readMoreWrap}>
                <Text style={[t.small, t.muted, t.center]}>
                  Read more in Full Guide
                </Text>
              </View>
            </ScrollView>
          </View>
        </View>
      </Modal>

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

  // ---- Modal styles (kept close to your example) ----
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.55)",
  },

  centerWrap: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: spacing.lg,
  },

  sheet: {
    width: "100%",
    maxHeight: "75%",
    backgroundColor: colors.white,
    borderRadius: 16,
    overflow: "hidden",
    // paddingBottom: spacing.md,

    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 6,
  },

  closeRow: {
    height: spacing.md,
    alignItems: "flex-end",
    justifyContent: "center",
    paddingHorizontal: spacing.md,
  },

  closeButton: {
    position: "absolute",
    top: spacing.sm,
    right: spacing.sm,
    zIndex: 10,
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.overlayLight,
  },

  closeText: {
    fontSize: 14,
    lineHeight: 16,
  },

  sheetContent: {
    margin: spacing.md,
    paddingHorizontal: spacing.lg,
    gap: spacing.sm,
  },

  modalIconRow: {
    alignItems: "center",
    justifyContent: "center",
    marginTop: spacing.xs,
    marginBottom: spacing.xs,
  },

  modalBodyText: {
    lineHeight: 20,
  },

  readMoreWrap: {
    marginTop: spacing.md,
    paddingTop: spacing.sm,
  },
});