import React from "react";
import { View } from "react-native";
import { Tabs } from "expo-router";
import Feather from "@expo/vector-icons/Feather";
import FontAwesome5 from "@expo/vector-icons/FontAwesome5";
import FontAwesome6 from "@expo/vector-icons/FontAwesome6";

const ICON_SIZE = 32;
const BOX = 48;

function TabIcon({ children }: { children: React.ReactNode }) {
  return (
    <View
      style={{
        width: BOX,
        height: BOX,
        alignItems: "center",
        justifyContent: "center",
        overflow: "visible",
      }}
    >
      {children}
    </View>
  );
}

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarShowLabel: false,

        tabBarStyle: {
          position: "absolute",
          left: 0,
          right: 0,
          bottom: 0,

          height: 96,
          paddingTop: 12,
          paddingBottom: 18,

          backgroundColor: "white",

          // rounded top corners
          borderTopLeftRadius: 22,
          borderTopRightRadius: 22,

          borderTopWidth: 0,

          // shadow (iOS)
          shadowColor: "#000",
          shadowOffset: { width: 0, height: -6 },
          shadowOpacity: 0.25,
          shadowRadius: 10,

          // shadow (Android)
          elevation: 18,
        },

        tabBarItemStyle: {
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          tabBarIcon: ({ focused }) => (
            <TabIcon>
              <Feather
                name="map"
                size={ICON_SIZE}
                color={focused ? "black" : "#00000050"}
              />
            </TabIcon>
          ),
        }}
      />

      <Tabs.Screen
        name="list"
        options={{
          tabBarIcon: ({ focused }) => (
            <TabIcon>
              <FontAwesome5
                name="list-alt"
                size={ICON_SIZE}
                color={focused ? "black" : "#00000050"}
              />
            </TabIcon>
          ),
        }}
      />

      <Tabs.Screen
        name="etiquette"
        options={{
          tabBarIcon: ({ focused }) => (
            <TabIcon>
              <FontAwesome6
                name="hands-praying"
                size={ICON_SIZE}
                color={focused ? "black" : "#00000050"}
              />
            </TabIcon>
          ),
        }}
      />

      <Tabs.Screen
        name="profile"
        options={{
          tabBarIcon: ({ focused }) => (
            <TabIcon>
              <FontAwesome5
                name="user-circle"
                size={ICON_SIZE}
                color={focused ? "black" : "#00000050"}
              />
            </TabIcon>
          ),
        }}
      />
    </Tabs>
  );
}
