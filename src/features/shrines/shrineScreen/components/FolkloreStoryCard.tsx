import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  Pressable,
  Linking,
  Modal,
  ScrollView,
  useWindowDimensions,
} from "react-native";
import { font } from "../../../../shared/styles/typography";
import { g } from "../../../../shared/styles/global";
import { t } from "../../../../shared/styles/text";
import { colors, spacing, radius } from "../../../../shared/styles/tokens";

const openLink = async (url?: string | null) => {
  if (!url) return;

  try {
    const supported = await Linking.canOpenURL(url);
    if (!supported) return;
    await Linking.openURL(url);
  } catch (err) {
    console.warn("Failed to open URL:", url, err);
  }
};

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

            {imageCitation?.url && (
              <Pressable
                style={g.imageCreditOverlay}
                onPress={(e) => {
                  e.stopPropagation();
                  openLink(imageCitation.url ?? null);
                }}
                hitSlop={8}
              >
                <Text style={[t.meta, t.white]}>
                  {imageCitation.author ?? imageCitation.title}
                </Text>
              </Pressable>
            )}
          </View>

          <View style={styles.titleBlock}>
            <Text style={[t.title, styles.title, { fontFamily: font.title }]}>
              {title}
            </Text>
          </View>

          <View style={styles.tapHintBlock}>
            <Text
              style={[t.meta, styles.tapHintText, { fontFamily: font.body }]}
            >
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
        {/* Backdrop */}
        <Pressable style={styles.backdrop} onPress={closeModal} />

        {/* CENTER WRAPPER */}
        <View style={styles.centerWrap}>
          <View style={[styles.sheet, { maxHeight: winH * 0.75 }]}>
            {/* X button */}
            <View style={styles.closeRow}>
              <Pressable
                style={styles.closeButton}
                onPress={closeModal}
                hitSlop={12}
              >
                <Text style={[t.body, t.primary, styles.closeText]}>✕</Text>
              </Pressable>
            </View>

            {/* content */}
            <ScrollView
              contentContainerStyle={styles.sheetContent}
              showsVerticalScrollIndicator
            >
              <Text style={[t.title, { fontFamily: font.title }]}>{title}</Text>

              <Text
                style={[t.body, styles.storyText, { fontFamily: font.body }]}
              >
                {story}
              </Text>

              {/* Citations */}
              {citations.length > 0 && (
                <View style={styles.citationBlock}>
                  <Text style={t.body}>Sources</Text>

                  {citations.map((c) => (
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

  // modal
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

  citationBlock: {
    marginTop: spacing.md,
    gap: 4,
  },

  citationItem: {
    gap: 2,
  },
});
