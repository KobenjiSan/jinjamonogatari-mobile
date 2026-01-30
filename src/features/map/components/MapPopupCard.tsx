import React, { ReactNode, useRef } from "react";
import {
  View,
  Image,
  StyleSheet,
  Text,
  Pressable,
  Animated,
} from "react-native";
import type { ShrinePreviewModel } from "../../shrines/mappers";
import { FontAwesome, FontAwesome6 } from "@expo/vector-icons";
import { font } from "../../../shared/styles/typography";

type MapPopupCardProps = {
  /** Whether the popup is currently open (drives animation externally) */
  isOpen: boolean;

  /** Animated values controlled by parent (MapView) */
  fadeAnim: Animated.Value;
  slideYAnim: Animated.Value;
  backdropAnim: Animated.Value;

  /** Title to display (for now) */
  shrine: ShrinePreviewModel;
  /** Called when user taps outside or presses close */
  onClose: () => void;

  /** Future content (image, distance, buttons, etc.) */
  children?: ReactNode;
};

export default function MapPopupCard({
  isOpen,
  fadeAnim,
  slideYAnim,
  backdropAnim,
  shrine,
  onClose,
  children,
}: MapPopupCardProps) {
  if (!isOpen) return null;

  const fallbackImage = require("../../../../assets/images/placeholder.png");
  const bookmarkScale = useRef(new Animated.Value(1)).current;
  const viewScale = useRef(new Animated.Value(1)).current;

  const makePressHandlers = (val: Animated.Value, downTo = 0.9) => ({
    onPressIn: () =>
      Animated.spring(val, { toValue: downTo, useNativeDriver: true }).start(),
    onPressOut: () =>
      Animated.spring(val, { toValue: 1, useNativeDriver: true }).start(),
  });

  const bookmarkHandlers = makePressHandlers(bookmarkScale, 0.9);
  const viewHandlers = makePressHandlers(viewScale, 0.95);

  return (
    <>
      {/* Dimmed backdrop */}
      <Animated.View
        style={[
          StyleSheet.absoluteFillObject,
          styles.backdrop,
          { opacity: backdropAnim },
        ]}
      >
        <Pressable style={{ flex: 1 }} onPress={onClose} />
      </Animated.View>

      {/* Bottom popup card */}
      <Animated.View
        style={[
          styles.card,
          {
            opacity: fadeAnim,
            transform: [{ translateY: slideYAnim }],
          },
        ]}
      >
        <View style={styles.innerCard}>
          <View>
            {/* Make this view allow for the X to be at the top right corner over the image */}
            <Image
              source={
                shrine.imageUrl ? { uri: shrine.imageUrl } : fallbackImage
              }
              style={styles.image}
              resizeMode="cover"
            />

            <Pressable onPress={onClose} hitSlop={10}>
              <Text style={styles.close}>✕</Text>
            </Pressable>
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
              <Pressable
                {...bookmarkHandlers}
                hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                onPress={() => console.log(`Saved Shrine ${shrine.name_en}`)}
              >
                <Animated.View
                  style={{ transform: [{ scale: bookmarkScale }] }}
                >
                  <FontAwesome name="bookmark-o" size={24} color="black" />
                </Animated.View>
              </Pressable>
            </View>

            {shrine.name_jp ? (
              <Text style={[styles.jpName, { fontFamily: font.strong }]}>
                {shrine.name_jp}
              </Text>
            ) : null}
          </View>

            {/* Tags need to be placed here, they should iterate over all the tags that are assigned to this card,
            however it should not allow for tags to exceed 1 line or overflow off the card */}

            {/* Update this text to cut off after 4 lines and make it lighter */}
          <Text style={styles.desc}>{shrine.shrine_desc}</Text>

          <View style={styles.footer}>
            {/* Update these to both be buttons and fix design according to specs */}
            <View style={styles.locationRow}>
              <FontAwesome6 name="location-dot" size={18} color="#666" />
              <Text style={[styles.locationText, { fontFamily: font.title }]}>
                85 m {/* ADD DISTANCE VARIABLE HERE LATER */}
              </Text>
            </View>
            <Pressable
              {...viewHandlers}
              hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
              onPress={() => console.log(`Viewed Shrine ${shrine.name_en}`)}
            >
              <Animated.View style={{ transform: [{ scale: viewScale }] }}>
                <View style={styles.viewButton}>
                  <Text
                    style={[styles.viewButtonText, { fontFamily: font.strong }]}
                  >
                    View Shrine
                  </Text>
                </View>
              </Animated.View>
            </Pressable>
          </View>
        </View>

        {/* Custom content goes here */}
        {children ? <View style={styles.content}>{children}</View> : null}
      </Animated.View>
    </>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    backgroundColor: "rgba(0,0,0,0.45)",
  },

  card: {
    position: "absolute",
    bottom: 16,
    left: 16,
    right: 16,

    backgroundColor: "#fff",
    borderRadius: 12,

    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 6,
  },

  innerCard: {},

  image: {
    width: "100%",
    height: 250,
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
  },

  header: {
    flexDirection: "row",
    alignItems: "center",
  },

  close: {
    fontSize: 18,
    paddingHorizontal: 6,
  },

  content: {
    marginTop: 8,
  },

  body: {
    paddingVertical: 4,
    paddingHorizontal: 8,
  },

  desc: {},

  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
  },

  title: {
    fontSize: 18,
    flex: 1,
  },

  jpName: {
    fontSize: 18,
    opacity: 0.85,
  },

  footer: {
    padding: 8,
    flexDirection: "row",
    justifyContent: "space-between",
  },

  viewButton: {
    borderColor: "#000",
    opacity: 0.85,
    borderWidth: 1,
    borderRadius: 6,
    padding: 4,
  },

  viewButtonText: {
    fontSize: 14,
  },

  locationRow: {
    flexDirection: "row",
    alignItems: "center",
  },

  locationText: {
    color: "#666",
    fontSize: 16,
    marginLeft: 4,
  },
});
