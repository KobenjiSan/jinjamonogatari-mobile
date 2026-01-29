import { Stack } from "expo-router";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { useFonts } from "expo-font";
import { View } from "react-native";

export default function RootLayout() {
  const [fontsLoaded] = useFonts({
    "NotoSerifJP-Regular": require("../assets/fonts/NotoSerifJP-Regular.ttf"),
    "NotoSerifJP-Bold": require("../assets/fonts/NotoSerifJP-Bold.ttf"),
    "NotoSerifJP-Black": require("../assets/fonts/NotoSerifJP-Black.ttf"),
  });

  // Prevent rendering screens with missing fonts
  if (!fontsLoaded) {
    return <View style={{ flex: 1, backgroundColor: "black" }} />;
  }

  return (
    <SafeAreaProvider initialMetrics={null}>
      <Stack
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: "black" },
        }}
      />
    </SafeAreaProvider>
  );
}
