import { View, StyleSheet, Platform, StatusBar, Text } from "react-native";

const TOP_PADDING =
  Platform.OS === "android" ? StatusBar.currentHeight ?? 0 : 44;

export default function Profile() {
  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <Text>Profile</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    paddingTop: TOP_PADDING,
  },
});