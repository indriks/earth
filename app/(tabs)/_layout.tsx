import { Tabs, useLocalSearchParams, useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { Text } from "react-native";

import { TabBarIcon } from "@/components/navigation/TabBarIcon";
import { Colors } from "@/constants/Colors";

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: "#B2854B",
        tabBarInactiveTintColor: "#344164", // Dimmed color for inactive tabs
        tabBarStyle: {
          backgroundColor: "#070A1E", // Dark background for the tab bar
          borderTopColor: "#141D37", // Slightly lighter border color
        },
        headerShown: false,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Home",
          tabBarIcon: ({ color, focused }) => (
            <TabBarIcon
              name={focused ? "search" : "search-outline"}
              color={color}
            />
          ),
        }}
      />

      <Tabs.Screen
        name="bookmarks"
        options={{
          title: "Bookmarks",
          tabBarIcon: ({ color, focused }) => (
            <TabBarIcon
              name={focused ? "bookmark" : "bookmark-outline"}
              color={color}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: "Settings",
          tabBarIcon: ({ color, focused }) => (
            <TabBarIcon
              name={focused ? "settings" : "settings-outline"}
              color={color}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="country/[id]"
        options={{
          href: null,
          headerShown: true,
          headerTitle: () => <CountryHeader />,
          headerLeft: () => <BackButton />,
        }}
      />
    </Tabs>
  );
}

function CountryHeader() {
  const { countryName } = useLocalSearchParams<{ countryName: string }>();
  return (
    <Text style={{ fontSize: 18, fontWeight: "bold" }}>
      {countryName || "Country"}
    </Text>
  );
}

function BackButton() {
  const router = useRouter();
  return (
    <Ionicons
      name="arrow-back"
      size={24}
      color="#B2854B"
      style={{ marginLeft: 10 }}
      onPress={() => router.back()}
    />
  );
}
