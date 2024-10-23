import React, { useState, useCallback } from "react";
import {
  StyleSheet,
  FlatList,
  TouchableOpacity,
  View,
  Image,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Link } from "expo-router";
import { useFocusEffect } from "@react-navigation/native";

import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";

interface CountryDetail {
  name: {
    common: string;
  };
  cca2: string;
  cca3: string;
  region: string;
  flags: {
    png: string;
  };
}

export default function BookmarksScreen() {
  const [bookmarks, setBookmarks] = useState<CountryDetail[]>([]);

  const loadBookmarks = useCallback(async () => {
    try {
      const storedBookmarks = await AsyncStorage.getItem("bookmarks");
      if (storedBookmarks) {
        setBookmarks(JSON.parse(storedBookmarks));
      }
    } catch (error) {
      console.error("Error loading bookmarks:", error);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      loadBookmarks();
    }, [loadBookmarks])
  );

  function renderCountryItem({ item }: { item: CountryDetail }) {
    return (
      <Link href={`/country/${item.cca3}`} asChild>
        <TouchableOpacity>
          <View style={styles.countryItemContainer}>
            <View style={styles.countryFlagContainer}>
              <Image
                source={{ uri: item.flags.png }}
                style={styles.countryFlag}
              />
            </View>
            <View style={styles.countryInfoContainer}>
              <ThemedText style={styles.title}>{item.name.common}</ThemedText>
              <ThemedText style={styles.countryItem}>{item.region}</ThemedText>
            </View>
          </View>
        </TouchableOpacity>
      </Link>
    );
  }

  return (
    <ThemedView style={styles.container}>
      <ThemedText style={styles.header}>Bookmarks</ThemedText>
      {bookmarks.length > 0 ? (
        <FlatList
          data={bookmarks}
          keyExtractor={(item) => item.cca3}
          renderItem={renderCountryItem}
          style={styles.countryList}
        />
      ) : (
        <ThemedText style={styles.emptyMessage}>
          No bookmarked countries yet.
        </ThemedText>
      )}
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "rgba(1,2,4,1)",
    padding: 20,
  },
  header: {
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 20,
  },
  countryList: {
    flex: 1,
  },
  countryItemContainer: {
    borderWidth: 1,
    borderColor: "#111E44",
    borderRadius: 15,
    marginBottom: 10,
    backgroundColor: "#030713",
    flexDirection: "row",
    padding: 20,
  },
  countryInfoContainer: {
    flex: 1,
  },
  countryFlagContainer: {
    width: 48,
    height: 48,
    borderRadius: 10,
    overflow: "hidden",
    marginRight: 20,
  },
  countryFlag: {
    width: 48,
    height: 48,
  },
  countryItem: {
    fontSize: 22,
    color: "white",
    opacity: 0.3,
  },
  title: {
    fontSize: 32,
    fontWeight: "200",
    color: "white",
  },
  emptyMessage: {
    fontSize: 18,
    textAlign: "center",
    marginTop: 50,
  },
});
