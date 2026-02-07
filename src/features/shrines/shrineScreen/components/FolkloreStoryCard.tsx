import React, { useMemo, useRef, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  Pressable,
  Linking,
  Animated,
  Easing,
} from "react-native";
import { font } from "../../../../shared/styles/typography";
import { g } from "../../../../shared/styles/global";
import { t } from "../../../../shared/styles/text";
import { colors, spacing, radius } from "../../../../shared/styles/tokens";

const openLink = async (url?: string | null) => {
  if (!url) return;

  try {
    const supported = await Linking.canOpenURL(url);
    if (!supported) {
      console.warn("Unsupported URL:", url);
      return;
    }
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
  const [panelContentHeight, setPanelContentHeight] = useState(0);

  const progress = useRef(new Animated.Value(0)).current;

  const panelHeight = useMemo(() => {
    return progress.interpolate({
      inputRange: [0, 1],
      outputRange: [0, panelContentHeight || 0],
    });
  }, [progress, panelContentHeight]);

  const panelOpacity = useMemo(() => {
    return progress.interpolate({
      inputRange: [0, 0.15, 1],
      outputRange: [0, 1, 1],
    });
  }, [progress]);

  const panelTranslateY = useMemo(() => {
    return progress.interpolate({
      inputRange: [0, 1],
      outputRange: [-8, 0],
    });
  }, [progress]);

  const openPanel = () => {
    if (isOpen) return;
    setIsOpen(true);

    Animated.timing(progress, {
      toValue: 1,
      duration: 260,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: false,
    }).start();
  };

  const closePanel = () => {
    if (!isOpen) return;
    setIsOpen(false);

    Animated.timing(progress, {
      toValue: 0,
      duration: 220,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: false,
    }).start();
  };

  const togglePanel = () => {
    if (isOpen) closePanel();
    else openPanel();
  };

  return (
    <View style={styles.storyContainer}>
      {/* MAIN card */}
      <Pressable onPress={togglePanel}>
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

          <View style={styles.toggleHintBlock}>
            <Text
              style={[t.meta, styles.toggleHintText, { fontFamily: font.body }]}
            >
              {isOpen ? "Tap to close story" : "Tap to read story"}
            </Text>
          </View>
        </View>
      </Pressable>

      {/* HIDDEN MEASURER */}
      <View
        style={styles.storyPanelMeasurer}
        pointerEvents="none"
        onLayout={(e) => {
          const h = e.nativeEvent.layout.height;
          if (h > 0 && h !== panelContentHeight) setPanelContentHeight(h);
        }}
      >
        <View style={[g.card, styles.card, styles.storyCard]}>
          <Text style={[t.body, styles.storyText, { fontFamily: font.body }]}>
            {story}
          </Text>

          {citations.length > 0 && (
            <View style={styles.citationBlock}>
              <Text style={[t.body, styles.citationHeader]}>Sources</Text>

              {citations.map((c) => (
                <View key={c.cite_id} style={styles.citationItem}>
                  <Text style={[t.meta, styles.citationText]}>
                    • {c.title}
                    {c.year ? ` (${c.year})` : ""}
                  </Text>

                  {c.author && <Text style={t.meta}>By {c.author}</Text>}

                  {c.url && <Text style={[t.meta, t.link]}>{c.url}</Text>}
                </View>
              ))}
            </View>
          )}

          <View style={styles.closeHintBlock}>
            <Text
              style={[t.meta, styles.toggleHintText, { fontFamily: font.body }]}
            >
              Tap to close story
            </Text>
          </View>
        </View>
      </View>

      {/* STORY PANEL */}
      <Animated.View
        style={[
          styles.storyPanelOuter,
          {
            height: panelHeight,
            opacity: panelOpacity,
            transform: [{ translateY: panelTranslateY }],
          },
        ]}
        pointerEvents={isOpen ? "auto" : "none"}
      >
        <View>
          <Pressable onPress={closePanel}>
            <View style={[g.card, styles.card, styles.storyCard]}>
              <Text
                style={[t.body, styles.storyText, { fontFamily: font.body }]}
              >
                {story}
              </Text>

              {citations.length > 0 && (
                <View style={styles.citationBlock}>
                  <Text style={[t.body, styles.citationHeader]}>Sources</Text>

                  {citations.map((c) => (
                    <View key={c.cite_id} style={styles.citationItem}>
                      <Text style={[t.meta, styles.citationText]}>
                        • {c.title}
                        {c.year ? ` (${c.year})` : ""}
                      </Text>

                      {c.author && <Text style={t.meta}>By {c.author}</Text>}

                      {c.url && (
                        <Pressable
                          onPress={(e) => {
                            e.stopPropagation();
                            openLink(c.url ?? null);
                          }}
                        >
                          <Text style={[t.meta, t.link, styles.citationLink]}>
                            {c.url}
                          </Text>
                        </Pressable>
                      )}
                    </View>
                  ))}
                </View>
              )}

              <View style={styles.closeHintBlock}>
                <Text
                  style={[
                    t.meta,
                    styles.toggleHintText,
                    { fontFamily: font.body },
                  ]}
                >
                  Tap to close story
                </Text>
              </View>
            </View>
          </Pressable>
        </View>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  storyContainer: {
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

  toggleHintBlock: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.xs,
  },

  toggleHintText: {
    letterSpacing: 0.4,
    lineHeight: 14,
    textAlign: "center",
    opacity: 0.8,
  },

  storyPanelOuter: {
    overflow: "hidden",
    zIndex: -1,
    marginTop: -6,
  },

  storyPanelMeasurer: {
    position: "absolute",
    left: 0,
    right: 0,
    top: "100%",
    opacity: 0,
    zIndex: -1,
  },

  storyCard: {
    borderTopLeftRadius: 0,
    borderTopRightRadius: 0,
  },

  storyText: {
    lineHeight: 20,
    paddingVertical: spacing.sm,
  },

  citationBlock: {
    gap: 4,
    paddingTop: 2,
  },

  citationHeader: {
    opacity: 0.8,
  },

  citationItem: {
    gap: 2,
  },

  citationText: {
    lineHeight: 12,
  },

  citationLink: {
    textDecorationLine: "underline",
  },

  closeHintBlock: {
    paddingTop: spacing.lg,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.xs,
  },
});
