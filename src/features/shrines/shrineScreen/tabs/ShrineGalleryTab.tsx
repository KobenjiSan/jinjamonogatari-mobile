import React, { useEffect, useMemo, useState } from "react";
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
import type { ShrineDetailModel } from "../../mappers";
import { g } from "../../../../shared/styles/global";
import { t } from "../../../../shared/styles/text";
import { colors, spacing, radius } from "../../../../shared/styles/tokens";

const openLink = async (url?: string | null) => {
  if (!url) return;
  try {
    const supported = await Linking.canOpenURL(url);
    if (supported) await Linking.openURL(url);
  } catch {}
};

type Props = {
  shrine: ShrineDetailModel;
};

export default function ShrineGalleryTab({ shrine }: Props) {
  const fallbackImage = require("../../../../../assets/images/placeholder-vertical.jpg");
  const gallery = shrine.gallery ?? [];

  const { height: winH } = useWindowDimensions();

  const [ratiosById, setRatiosById] = useState<Record<number, number>>({});
  const [stageWidth, setStageWidth] = useState(0);
  const [selectedId, setSelectedId] = useState<number | null>(null);

  const selected = useMemo(
    () => gallery.find((g) => g.img_id === selectedId) ?? null,
    [gallery, selectedId],
  );

  useEffect(() => {
    gallery.forEach((img) => {
      if (!img.imageUrl || ratiosById[img.img_id]) return;
      Image.getSize(
        img.imageUrl,
        (w, h) => setRatiosById((p) => ({ ...p, [img.img_id]: w / h })),
        () => setRatiosById((p) => ({ ...p, [img.img_id]: 1 })),
      );
    });
  }, [gallery]);

  const { left, right } = useMemo(() => {
    const L: any[] = [],
      R: any[] = [];
    gallery.forEach((img, i) => (i % 2 ? R : L).push(img));
    return { left: L, right: R };
  }, [gallery]);

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

  const closeModal = () => setSelectedId(null);

  const renderThumb = (img: any) => (
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

  return (
    <View style={styles.container}>
      <View style={styles.columns}>
        <View style={styles.col}>{left.map(renderThumb)}</View>
        <View style={styles.col}>{right.map(renderThumb)}</View>
      </View>
      <View style={{ height: 400 }} />

      <Modal visible={!!selected} transparent animationType="fade">
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
              <View
                onLayout={(e) => setStageWidth(e.nativeEvent.layout.width)}
                style={styles.imageStage}
              >
                <Image
                  source={
                    selected?.imageUrl
                      ? { uri: selected.imageUrl }
                      : fallbackImage
                  }
                  resizeMode="contain"
                  style={{
                    width: "100%",
                    aspectRatio:
                      (selected && ratiosById[selected.img_id]) ?? 0.75,
                    maxHeight: stageWidth ? stageWidth * (4 / 3) : undefined,
                  }}
                />
              </View>

              {selected?.title && (
                <Text
                  style={[
                    t.body,
                    { fontFamily: font.title, marginTop: spacing.md },
                  ]}
                >
                  {selected.title}
                </Text>
              )}

              {selected?.desc && (
                <Text style={[t.body, t.muted]}>{selected.desc}</Text>
              )}

              {selected?.imageCitation?.url && (
                <View style={styles.citationBlock}>
                  <Text style={t.body}>Sources</Text>
                  <Text style={t.meta}>
                    • {selected.imageCitation.title ?? "Image Source"}
                  </Text>

                  {selected.imageCitation.author && (
                    <Text style={t.meta}>
                      By {selected.imageCitation.author}
                    </Text>
                  )}

                  <Pressable
                    onPress={() => openLink(selected.imageCitation!.url!)}
                  >
                    <Text style={[t.meta, t.link]}>
                      {selected.imageCitation.url}
                    </Text>
                  </Pressable>
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

  citationBlock: {
    marginTop: spacing.md,
    gap: 4,
  },
});
