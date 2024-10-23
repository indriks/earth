import { Tabs, useLocalSearchParams, useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { Text } from "react-native";
import { useAtom } from "jotai";

import { TabBarIcon } from "@/components/navigation/TabBarIcon";
import { Colors } from "@/constants/Colors";
import { bookmarksAtom } from "@/app/atoms/bookmarkAtom";

export default function TabLayout() {
  const [bookmarks] = useAtom(bookmarksAtom);

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: "#ED991B",
        tabBarInactiveTintColor: "#A2ACCA",
        tabBarStyle: {
          backgroundColor: "#1D2746",
          borderTopColor: "#2A3760",
        },
        headerShown: false,
        tabBarBadgeStyle: {
          backgroundColor: "#ED991B",
          color: "#1D2746",
          borderWidth: 2,
          borderColor: "#1D2746",
          minWidth: 18,
          height: 18,
          fontSize: 12,
          lineHeight: 14,
          borderRadius: 9,
        },
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
          headerShown: true,
          headerStyle: {
            backgroundColor: "#1D2746",
          },
          headerTitle: () => (
            <Text style={{ color: "white", fontSize: 18, fontWeight: "bold" }}>
              Bookmarks
            </Text>
          ),
          tabBarBadge: bookmarks.length > 0 ? bookmarks.length : undefined,
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
          headerStyle: {
            backgroundColor: "#1D2746",
          },
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
    <Text style={{ fontSize: 18, fontWeight: "bold", color: "white" }}>
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
      color="white"
      style={{ marginLeft: 10 }}
      onPress={() => router.back()}
    />
  );
}
