import {
  StyleSheet,
  Pressable,
  Image,
  Text,
  View,
  Animated,
} from "react-native";
import React, { useRef } from "react";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import FontAwesome6 from "@expo/vector-icons/FontAwesome6";
import { font } from "../../../shared/styles/typography";
import { ShrineCardModel } from "../mappers";

const ShrineCard = ({ shrine }: { shrine: ShrineCardModel }) => {
  const fallbackImage = require("../../../../assets/images/placeholder.png");
  const cardScale = useRef(new Animated.Value(1)).current;
  const bookmarkScale = useRef(new Animated.Value(1)).current;
  const viewScale = useRef(new Animated.Value(1)).current;

  const makePressHandlers = (val: Animated.Value, downTo = 0.9) => ({
    onPressIn: () =>
      Animated.spring(val, { toValue: downTo, useNativeDriver: true }).start(),
    onPressOut: () =>
      Animated.spring(val, { toValue: 1, useNativeDriver: true }).start(),
  });

  const cardHandlers = makePressHandlers(cardScale, 0.97);
  const bookmarkHandlers = makePressHandlers(bookmarkScale, 0.9);
  const viewHandlers = makePressHandlers(viewScale, 0.95);

  return (
    <Pressable
      {...cardHandlers}
      onPress={() => console.log(`Shrine ${shrine.name_en} Card Clicked`)}
    >
      <Animated.View style={{ transform: [{ scale: cardScale }] }}>
        <View style={styles.card}>
          <Image
            source={shrine.imageUrl ? { uri: shrine.imageUrl } : fallbackImage}
            style={styles.image}
            resizeMode="cover"
          />

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

          <View style={styles.footer}>
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
      </Animated.View>
    </Pressable>
  );
};

export default ShrineCard;

const styles = StyleSheet.create({
  card: {
    borderRadius: 10,
    backgroundColor: "#fff",

    // iOS
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 2,

    // Android
    elevation: 2,
  },

  image: {
    width: "100%",
    height: 150,
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
  },

  body: {
    paddingVertical: 4,
    paddingHorizontal: 8,
  },

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
