import React from "react";
import {
  Pressable,
  Text,
  Linking,
  StyleSheet,
  ViewStyle,
  TextStyle,
} from "react-native";
import { g } from "../styles/global";
import { t } from "../styles/text";

type Citation = {
  title?: string | null;
  author?: string | null;
  url?: string | null;
};

type Props = {
  citation?: Citation | null;
  label?: string | null;
  containerStyle?: ViewStyle;
  textStyle?: TextStyle;
  onPressOverride?: (url: string) => void;
};

async function openLink(url: string) {
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
}

export default function ImageCitationOverlay({
  citation,
  label,
  containerStyle,
  textStyle,
  onPressOverride,
}: Props) {
  const url = citation?.url ?? null;
  if (!url) return null;

  const displayText = label ?? citation?.author ?? citation?.title ?? null;
  if (!displayText) return null;

  const handlePress = () => {
    if (onPressOverride) return onPressOverride(url);
    void openLink(url);
  };

  return (
    <Pressable
      style={[g.imageCreditOverlay, styles.defaultPosition, containerStyle]}
      onPress={handlePress}
      accessibilityRole="link"
      accessibilityLabel={`Open citation: ${displayText}`}
      hitSlop={8}
    >
      <Text style={[t.meta, t.white, textStyle]} numberOfLines={1}>
        {displayText}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  defaultPosition: {
    position: "absolute",
    right: 8,
    bottom: 8,
  },
});
