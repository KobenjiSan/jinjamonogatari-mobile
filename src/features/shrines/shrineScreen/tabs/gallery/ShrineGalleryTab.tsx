import React, { useEffect, useMemo, useState } from "react";
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
import { font } from "../../../../../shared/styles/typography";
import { g } from "../../../../../shared/styles/global";
import { t } from "../../../../../shared/styles/text";
import { colors, spacing, radius } from "../../../../../shared/styles/tokens";

import CitationBlock from "../../../../../shared/components/CitationBlock";
import type { Citation as AppCitation } from "../../../../../shared/components/CitationItem";

import { useShrineGalleryApi } from "./api/gallery/useShrineGallery";
import { useImageByIdApi } from "./api/images/useImageById";

type Props = {
  slug: string;
  enabled: boolean;
};

export default function ShrineGalleryTab({ slug, enabled }: Props) {
  const fallbackImage = require("../../../../../../assets/images/placeholder-vertical.jpg");

  const { images: gallery, isLoading, error } = useShrineGalleryApi(
    slug,
    enabled,
  );

  const { height: winH } = useWindowDimensions();

  const [ratiosById, setRatiosById] = useState<Record<number, number>>({});
  const [stageWidth, setStageWidth] = useState(0);
  const [selectedId, setSelectedId] = useState<number | null>(null);

  // Thumbnail item
  const selectedThumb = useMemo(
    () => gallery.find((g) => g.img_id === selectedId) ?? null,
    [gallery, selectedId],
  );

  // Full image details (title/desc/citation), cached by hook
  const {
    image: selectedFull,
    isLoading: isImageLoading,
    error: imageError,
  } = useImageByIdApi(selectedId, selectedId != null);

  // Precompute aspect ratios from THUMB urls (fast)
  useEffect(() => {
    gallery.forEach((img) => {
      if (!img.imageUrl || ratiosById[img.img_id]) return;

      Image.getSize(
        img.imageUrl,
        (w, h) => setRatiosById((p) => ({ ...p, [img.img_id]: w / h })),
        () => setRatiosById((p) => ({ ...p, [img.img_id]: 1 })),
      );
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [gallery]);

  const { left, right } = useMemo(() => {
    const L: typeof gallery = [];
    const R: typeof gallery = [];
    gallery.forEach((img, i) => (i % 2 ? R : L).push(img));
    return { left: L, right: R };
  }, [gallery]);

  const closeModal = () => setSelectedId(null);

  const modalAspectRatio =
  selectedId != null && typeof ratiosById[selectedId] === "number"
    ? ratiosById[selectedId]
    : 0.75;

  const renderThumb = (img: (typeof gallery)[number]) => (
    <Pressable key={img.img_id} onPress={() => setSelectedId(img.img_id)}>
      <Image
        source={img.imageUrl ? { uri: img.imageUrl } : fallbackImage}
        style={{
          width: "100%",
          borderRadius: radius.md,
          aspectRatio: ratiosById[img.img_id] ?? 1,
        }}
      />
    </Pressable>
  );

  // Citation block uses FULL image details
  const selectedImageCitation: AppCitation[] =
    selectedFull?.citation?.url
      ? [
          {
            cite_id: selectedFull.citation.cite_id,
            title: selectedFull.citation.title ?? "Image Source",
            author: selectedFull.citation.author ?? null,
            url: selectedFull.citation.url ?? null,
            year: selectedFull.citation.year ?? null,
          },
        ]
      : [];

  // Loading / error / empty states
  if (isLoading) {
    return (
      <View style={styles.container}>
        <View style={g.card}>
          <Text style={[t.body, t.center, t.muted]}>Loading gallery...</Text>
        </View>
        <View style={{ height: 600 }} />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.container}>
        <View style={g.card}>
          <Text style={[t.body, t.center, t.muted]}>{error}</Text>
        </View>
        <View style={{ height: 600 }} />
      </View>
    );
  }

  if (gallery.length === 0) {
    return (
      <View style={styles.container}>
        <View style={g.card}>
          <Text style={[t.body, t.center, t.muted]}>
            No gallery images are available for this shrine yet.
          </Text>
        </View>
        <View style={{ height: 600 }} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.columns}>
        <View style={styles.col}>{left.map(renderThumb)}</View>
        <View style={styles.col}>{right.map(renderThumb)}</View>
      </View>

      <View style={{ height: 400 }} />

      <Modal visible={selectedId != null} transparent animationType="fade">
        {/* backdrop */}
        <Pressable style={styles.backdrop} onPress={closeModal} />

        {/* CENTER WRAPPER */}
        <View style={styles.centerWrap}>
          <View style={[styles.sheet, { maxHeight: winH * 0.85 }]}>
            {/* X button */}
            <View style={styles.closeRow}>
              <Pressable style={styles.closeButton} onPress={closeModal}>
                <Text style={[t.body, t.primary]}>✕</Text>
              </Pressable>
            </View>

            {/* content */}
            <ScrollView
              contentContainerStyle={styles.sheetContent}
              showsVerticalScrollIndicator
            >
              {/* status */}
              {isImageLoading && (
                <Text style={[t.small, t.muted, { marginBottom: spacing.sm }]}>
                  Loading image details...
                </Text>
              )}

              {!!imageError && (
                <Text style={[t.small, t.muted, { marginBottom: spacing.sm }]}>
                  {imageError}
                </Text>
              )}

              <View
                onLayout={(e) => setStageWidth(e.nativeEvent.layout.width)}
                style={styles.imageStage}
              >
                <Image
                  source={
                    selectedFull?.imageUrl
                      ? { uri: selectedFull.imageUrl }
                      : selectedThumb?.imageUrl
                        ? { uri: selectedThumb.imageUrl }
                        : fallbackImage
                  }
                  resizeMode="contain"
                  style={{
                    width: "100%",
                    aspectRatio: modalAspectRatio,
                    maxHeight: stageWidth ? stageWidth * (4 / 3) : undefined,
                  }}
                />
              </View>

              {selectedFull?.title && (
                <Text
                  style={[
                    t.body,
                    { fontFamily: font.title, marginTop: spacing.md },
                  ]}
                >
                  {selectedFull.title}
                </Text>
              )}

              {selectedFull?.desc && (
                <Text style={[t.body, t.muted]}>{selectedFull.desc}</Text>
              )}

              {/* Citations */}
              <CitationBlock citations={selectedImageCitation} />
            </ScrollView>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { gap: spacing.lg, paddingTop: spacing.md },

  columns: { flexDirection: "row", gap: spacing.md },
  col: { flex: 1, gap: spacing.md },

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
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 6,
    paddingVertical: spacing.sm,
  },

  closeRow: {
    height: 28,
    alignItems: "flex-end",
    justifyContent: "center",
    paddingHorizontal: spacing.md,
  },

  closeButton: {
    position: "absolute",
    right: spacing.sm,
    zIndex: 10,
    width: 28,
    height: 28,
    alignItems: "center",
    justifyContent: "center",
  },

  sheetContent: {
    paddingHorizontal: spacing.md,
    paddingBottom: spacing.xl,
  },

  imageStage: {
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
  },
});