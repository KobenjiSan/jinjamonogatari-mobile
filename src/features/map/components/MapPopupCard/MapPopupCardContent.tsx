import React, { ReactNode } from "react";
import {
  View,
  Image,
  StyleSheet,
  Text,
  Pressable,
  Animated,
} from "react-native";
import type { ShrinePreviewModel } from "../../../shrines/mappers";
import { FontAwesome, FontAwesome6 } from "@expo/vector-icons";
import { font } from "../../../../shared/styles/typography";
import TagPill, { Tag } from "../../../shrines/components/TagPill";
import { usePressScale } from "./usePressScale";

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

type Props = {
  shrine: ShrinePreviewModel;
  onClose: () => void;
  children?: ReactNode;
};

export default function MapPopupCardContent({ shrine, onClose, children }: Props) {
  const fallbackImage = require("../../../../../assets/images/placeholder.png");

  const bookmarkPress = usePressScale(0.9);
  const viewPress = usePressScale(0.95);
  const directionPress = usePressScale(0.95);
  const closePress = usePressScale(0.9);

  return (
    <View>
      <View style={styles.imageWrapper}>
        <Image
          source={shrine.imageUrl ? { uri: shrine.imageUrl } : fallbackImage}
          style={styles.image}
          resizeMode="cover"
        />

        <AnimatedPressable
          {...closePress.handlers}
          onPress={onClose}
          hitSlop={10}
          style={[
            styles.closeButton,
            { transform: [{ scale: closePress.scale }] },
          ]}
        >
          <Text style={styles.close}>✕</Text>
        </AnimatedPressable>
      </View>

      <View style={styles.body}>
        <View style={styles.headerRow}>
          <Text
            style={[styles.title, { fontFamily: font.title }]}
            numberOfLines={1}
            ellipsizeMode="tail"
          >
            {shrine.name_en ?? "Unnamed Shrine"}
          </Text>

          <AnimatedPressable
            {...bookmarkPress.handlers}
            hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
            onPress={() => console.log(`Saved Shrine ${shrine.name_en}`)}
            style={{ transform: [{ scale: bookmarkPress.scale }] }}
          >
            <FontAwesome name="bookmark-o" size={26} color="black" />
          </AnimatedPressable>
        </View>

        {shrine.name_jp ? (
          <Text style={[styles.jpName, { fontFamily: font.title }]}>
            {shrine.name_jp}
          </Text>
        ) : null}

        {Array.isArray((shrine as any).tags) && (shrine as any).tags.length > 0 ? (
          <View style={styles.tagsRow}>
            {(shrine as any).tags.map((tag: Tag) => (
              <TagPill
                key={tag.tag_id}
                tag={tag}
                style={styles.tagPill}
                textStyle={styles.tagPillText}
              />
            ))}
          </View>
        ) : null}

        <Text
          style={[styles.desc, { fontFamily: font.strong }]}
          numberOfLines={4}
          ellipsizeMode="tail"
        >
          {shrine.shrine_desc}
        </Text>
      </View>

      <View style={styles.footer}>
        <AnimatedPressable
          {...directionPress.handlers}
          hitSlop={8}
          onPress={() => console.log(`distance button clicked (${shrine.name_en})`)}
          style={[
            styles.distanceButton,
            { transform: [{ scale: directionPress.scale }] },
          ]}
        >
          <FontAwesome6 name="location-dot" size={18} color="#111" />
          <Text style={styles.distanceButtonText}>85 m • Directions</Text>
        </AnimatedPressable>

        <AnimatedPressable
          {...viewPress.handlers}
          hitSlop={8}
          onPress={() => console.log(`Viewed Shrine ${shrine.name_en}`)}
          style={[
            styles.viewButton,
            { transform: [{ scale: viewPress.scale }] },
          ]}
        >
          <Text style={styles.viewButtonText}>View Shrine</Text>
        </AnimatedPressable>
      </View>

      {children ? <View style={styles.content}>{children}</View> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  imageWrapper: {
    position: "relative",
  },

  image: {
    width: "100%",
    height: 250,
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
  },

  closeButton: {
    position: "absolute",
    top: 12,
    right: 12,
    zIndex: 10,
    backgroundColor: "rgba(255, 255, 255, 0.86)",
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
  },

  close: {
    color: "#000000",
    fontSize: 14,
    fontWeight: "900",
  },

  body: {
    paddingVertical: 6,
    paddingHorizontal: 14,
  },

  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
  },

  title: {
    fontSize: 20,
    flex: 1,
  },

  jpName: {
    fontSize: 18,
    opacity: 0.85,
  },

  tagsRow: {
    flexDirection: "row",
    flexWrap: "nowrap",
    overflow: "hidden",
    gap: 6,
    marginTop: 12,
    marginBottom: 6,
  },

  tagPill: {
    flexShrink: 1,
    maxWidth: "40%",
  },

  tagPillText: {
    flexShrink: 1,
  },

  desc: {
    fontSize: 13,
    lineHeight: 18,
    color: "#8b8b8b",
  },

  footer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    gap: 12,
    paddingHorizontal: 14,
    paddingBottom: 14,
    paddingTop: 2,
  },

  distanceButton: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    backgroundColor: "#FFFFFF",
    borderWidth: 2,
    borderColor: "#111111",
    borderRadius: 8,
    paddingVertical: 9,
    paddingHorizontal: 12,

    shadowColor: "#000",
    shadowOpacity: 0.12,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 3 },
    elevation: 3,
  },

  distanceButtonText: {
    fontSize: 15,
    color: "#111111",
  },

  viewButton: {
    backgroundColor: "#111111",
    borderRadius: 8,
    paddingVertical: 11,
    paddingHorizontal: 16,
    alignItems: "center",
    justifyContent: "center",
  },

  viewButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "700",
  },

  content: {
    marginTop: 8,
  },
});
