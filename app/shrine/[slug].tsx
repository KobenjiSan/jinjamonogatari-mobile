import { View, Text } from "react-native";
import { useLocalSearchParams } from "expo-router";
import ShrineScreen from "../../src/features/shrines/shrineScreen/ShrineScreen";

export default function ShrineRoute() {
  const { slug } = useLocalSearchParams<{ slug: string }>();

  if (!slug || typeof slug !== "string") {
    return (
      <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
        <Text>Missing shrine slug.</Text>
      </View>
    );
  }

  return <ShrineScreen slug={slug} />;
}