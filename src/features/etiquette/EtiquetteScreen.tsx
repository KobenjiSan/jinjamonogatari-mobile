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
import { spacing } from "../../shared/styles/tokens";
import HighlightCard from "./components/HighlightCard";
import { font } from "../../shared/styles/typography";
import GuideAccordionCard from "./components/GuideAccordionCard";
import { g } from "../../shared/styles/global";
import { t } from "../../shared/styles/text";

import FontAwesome5 from "@expo/vector-icons/FontAwesome5";
import FontAwesome6 from "@expo/vector-icons/FontAwesome6";
import { useTheme } from "../../shared/theme/useTheme";

const TOP_PADDING =
  Platform.OS === "android"
    ? (StatusBar.currentHeight ?? 0)
    : Platform.OS === "web"
      ? 16
      : 44;

const LIST_BOTTOM_SPACER = Platform.OS === "web" ? 68 : 96;

export default function EtiquetteScreen() {
  const theme = useTheme();
  const { guide, isEmpty, isLoading, error } = useEtiquetteGuideApi();

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
      <View
        style={[
          styles.container,
          styles.content,
          { backgroundColor: theme.colors.bgApp },
        ]}
      >
        <View style={styles.titleArea}>
          <Text
            style={[
              styles.title,
              { fontFamily: font.title, color: theme.colors.textSecondary },
            ]}
          >
            Shrine Etiquette
          </Text>
        </View>
        <Text style={[t.body, t.center, { color: theme.colors.textMuted }]}>
          Loading…
        </Text>
      </View>
    );
  }

  if (error) {
    return (
      <View
        style={[
          styles.container,
          styles.content,
          { backgroundColor: theme.colors.bgApp },
        ]}
      >
        <View style={styles.titleArea}>
          <Text
            style={[
              styles.title,
              { fontFamily: font.title, color: theme.colors.textSecondary },
            ]}
          >
            Shrine Etiquette
          </Text>
        </View>
        <Text style={[t.body, t.center, { color: theme.colors.textPrimary }]}>
          API Error:
        </Text>
        <Text style={[t.body, t.center, { color: theme.colors.textMuted }]}>
          {error}
        </Text>
      </View>
    );
  }

  if (isEmpty) {
    return (
      <View
        style={[
          styles.container,
          styles.content,
          { backgroundColor: theme.colors.bgApp },
        ]}
      >
        <View style={styles.titleArea}>
          <Text
            style={[
              styles.title,
              { fontFamily: font.title, color: theme.colors.textSecondary },
            ]}
          >
            Shrine Etiquette
          </Text>
        </View>
        <Text style={[t.body, t.center, { color: theme.colors.textMuted }]}>
          We Aplogize! The Etiquette Guide is not available.
        </Text>
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.bgApp }]}>
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.titleArea}>
          <Text
            style={[
              styles.title,
              { fontFamily: font.title, color: theme.colors.textSecondary },
            ]}
          >
            Shrine Etiquette
          </Text>
        </View>

        {/* AT A GLANCE */}
        <View style={{ marginTop: 16 }}>
          <Text
            style={[
              styles.h2,
              { fontFamily: font.title, color: theme.colors.textPrimary },
            ]}
          >
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
          <Text
            style={[
              styles.h2,
              { fontFamily: font.title, color: theme.colors.textPrimary },
            ]}
          >
            Full Etiquette Guide
          </Text>
          <View
            style={[
              styles.accordion,
              g.cardNoPadding,
              {
                backgroundColor: theme.colors.bgCard,
                shadowColor: theme.colors.overlayDark,
              },
            ]}
          >
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
        <Pressable style={styles.modalRoot} onPress={closeModal}>
          <Pressable
            style={[
              styles.sheet,
              {
                backgroundColor: theme.colors.bgCard,
                shadowColor: theme.colors.overlayDark,
              },
            ]}
            onPress={(e) => e.stopPropagation()}
          >
            <Pressable
              style={[
                styles.closeButton,
                { backgroundColor: theme.colors.overlayLight },
              ]}
              onPress={closeModal}
              hitSlop={12}
            >
              <Text
                style={[
                  t.body,
                  { color: theme.colors.textPrimary },
                  styles.closeText,
                ]}
              >
                ✕
              </Text>
            </Pressable>

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
                    color={theme.colors.textPrimary}
                  />
                </View>
              )}

              {/* Long Title */}
              <Text
                style={[
                  t.title,
                  { fontFamily: font.title, color: theme.colors.textPrimary },
                  t.center,
                ]}
              >
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
                    { fontFamily: font.body, color: theme.colors.textPrimary },
                  ]}
                >
                  {selectedGlance.summary}
                </Text>
              )}

              {/* Nudge */}
              <View style={styles.readMoreWrap}>
                <Text
                  style={[t.small, t.center, { color: theme.colors.textMuted }]}
                >
                  Read more in Full Guide
                </Text>
              </View>
            </ScrollView>
          </Pressable>
        </Pressable>
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

  // ---- Modal styles ----
  modalRoot: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.55)",
    justifyContent: "center",
    alignItems: "center",
    padding: spacing.lg,
  },

  sheet: {
    width: "100%",
    maxHeight: "75%",
    borderRadius: 16,
    overflow: "hidden",

    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 6,
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
