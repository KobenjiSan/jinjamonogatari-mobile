import React from "react";
import { Tabs } from "expo-router";

export default function TabLayout() {
  return (
    <Tabs screenOptions={{ headerShown: false }}>
      <Tabs.Screen name="index" options={{ title: "Map" }} />
      <Tabs.Screen name="list" options={{ title: "List" }} />
      <Tabs.Screen name="etiquette" options={{ title: "Etiquette" }} />
      <Tabs.Screen name="profile" options={{ title: "Profile" }} />
    </Tabs>
  );
}