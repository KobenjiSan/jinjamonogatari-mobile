import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  Pressable,
  Modal,
  ScrollView,
  useWindowDimensions,
} from "react-native";
import { font } from "../../../../shared/styles/typography";
import { g } from "../../../../shared/styles/global";
import { t } from "../../../../shared/styles/text";
import { colors, spacing, radius } from "../../../../shared/styles/tokens";

import CitationBlock from "../../../../shared/components/CitationBlock";
import type { Citation as AppCitation } from "../../../../shared/components/CitationItem";
import ImageCitationOverlay from "../../../../shared/components/ImageCitationOverlay";

export type FolkloreCitation = {
  cite_id: number;
  title: string;
  url?: string | null;
  author?: string | null;
  year?: number | null;
};

export type ImageCitation = {
  url?: string | null;
  author?: string | null;
  title?: string | null;
};

type Props = {
  title: string;
  imageUrl?: string | null;
  imageCitation?: ImageCitation | null;
  story: string;
  citations: FolkloreCitation[];
  fallbackImage: any;
};

export default function FolkloreStoryCard({
  title,
  imageUrl,
  imageCitation,
  story,
  citations,
  fallbackImage,
}: Props) {
  const [isOpen, setIsOpen] = useState(false);
  const { height: winH } = useWindowDimensions();

  const closeModal = () => setIsOpen(false);
  const openModal = () => setIsOpen(true);

  const mappedCitations: AppCitation[] = citations.map((c) => ({
    cite_id: c.cite_id,
    title: c.title,
    url: c.url ?? null,
    author: c.author ?? null,
    year: c.year ?? null,
  }));

  return (
    <View style={styles.container}>
      {/* MAIN card */}
      <Pressable onPress={openModal}>
        <View style={[g.card, styles.card]}>
          <View style={styles.imgContainer}>
            <Image
              source={imageUrl ? { uri: imageUrl } : fallbackImage}
              style={styles.img}
              resizeMode="cover"
            />

            {/* citation overlay */}
            <ImageCitationOverlay citation={imageCitation} />
            
          </View>

          <View style={styles.titleBlock}>
            <Text style={[t.title, styles.title, { fontFamily: font.title }]}>
              {title}
            </Text>
          </View>

          <View style={styles.tapHintBlock}>
            <Text style={[t.meta, styles.tapHintText, { fontFamily: font.body }]}>
              Tap to read story
            </Text>
          </View>
        </View>
      </Pressable>

      {/* MODAL */}
      <Modal
        visible={isOpen}
        transparent
        animationType="fade"
        onRequestClose={closeModal}
      >
        <Pressable style={styles.backdrop} onPress={closeModal} />

        <View style={styles.centerWrap}>
          <View style={[styles.sheet, { maxHeight: winH * 0.75 }]}>
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
              <Text style={[t.title, { fontFamily: font.title }]}>{title}</Text>

              <Text style={[t.body, styles.storyText, { fontFamily: font.body }]}>
                {story}
              </Text>

              <CitationBlock citations={mappedCitations} />
            </ScrollView>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: "relative",
    width: "100%",
  },

  card: {
    borderRadius: radius.md,
  },

  imgContainer: {
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
    borderRadius: radius.sm,
    aspectRatio: 3 / 4,
    marginTop: spacing.xs,
  },

  img: {
    width: "100%",
    aspectRatio: 3 / 4,
    borderRadius: radius.sm,
  },

  titleBlock: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.xl,
  },

  title: {
    letterSpacing: 0.4,
    lineHeight: 24,
    textAlign: "center",
  },

  tapHintBlock: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.xs,
  },

  tapHintText: {
    letterSpacing: 0.4,
    lineHeight: 14,
    textAlign: "center",
    opacity: 0.8,
  },

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
    backgroundColor: colors.white,
    borderRadius: radius.lg,
    overflow: "hidden",
    paddingBottom: spacing.md,

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
    padding: spacing.md,
    paddingBottom: spacing.xl,
    gap: spacing.sm,
  },

  storyText: {
    lineHeight: 20,
  },
});
