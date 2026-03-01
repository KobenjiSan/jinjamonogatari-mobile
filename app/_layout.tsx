import React from "react";
import { Stack } from "expo-router";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { useFonts } from "expo-font";
import { View } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";

import { AuthProvider, useAuth } from "../src/core/auth/AuthProvider";
import { CollectionIdsProvider } from "../src/features/collection/api/collectionIds.store";
import CollectionIdsBootstrap from "../src/features/collection/api/CollectionIdsBootstrap";

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
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider initialMetrics={null}>
        <AuthProvider>
          <AuthedApp />
        </AuthProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}

function AuthedApp() {
  const { authReady } = useAuth();

  // Block router until auth restoration finishes
  if (!authReady) {
    return <View style={{ flex: 1, backgroundColor: "black" }} />;
  }

  return (
    <CollectionIdsProvider>
      <CollectionIdsBootstrap />
      <Stack
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: "black" },
        }}
      />
    </CollectionIdsProvider>
  );
}