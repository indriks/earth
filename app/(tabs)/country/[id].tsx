import React, { useEffect, useState } from "react";
import {
  StyleSheet,
  View,
  Image,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { ThemedView } from "@/components/ThemedView";
import { ThemedText } from "@/components/ThemedText";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Ionicons } from "@expo/vector-icons";

interface CountryDetail {
  name: {
    common: string;
    official: string;
  };
  capital: string[];
  region: string;
  subregion: string;
  population: number;
  area: number;
  flags: {
    png: string;
  };
  languages: { [key: string]: string };
  currencies: { [key: string]: { name: string; symbol: string } };
}

export default function CountryDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const [country, setCountry] = useState<CountryDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const router = useRouter();

  useEffect(() => {
    async function fetchCountryDetail() {
      try {
        const response = await fetch(
          `https://restcountries.com/v3.1/alpha/${id}`
        );
        if (!response.ok) {
          throw new Error("Failed to fetch country data");
        }
        const data = await response.json();
        setCountry(data[0]);

        // Update the route with the country name
        router.setParams({ countryName: data[0].name.common });
      } catch (err) {
        setError("Error fetching country data");
        console.error(err);
      } finally {
        setLoading(false);
      }
    }

    async function checkBookmarkStatus() {
      const bookmarks = await AsyncStorage.getItem("bookmarks");
      const bookmarkList = bookmarks ? JSON.parse(bookmarks) : [];
      setIsBookmarked(
        bookmarkList.some((bookmark: CountryDetail) => bookmark.cca3 === id)
      );
    }

    fetchCountryDetail();
    checkBookmarkStatus();
  }, [id, router]);

  const toggleBookmark = async () => {
    if (!country) return;

    const bookmarks = await AsyncStorage.getItem("bookmarks");
    let bookmarkList = bookmarks ? JSON.parse(bookmarks) : [];

    if (isBookmarked) {
      bookmarkList = bookmarkList.filter(
        (bookmark: CountryDetail) => bookmark.cca3 !== country.cca3
      );
    } else {
      bookmarkList.push(country);
    }

    await AsyncStorage.setItem("bookmarks", JSON.stringify(bookmarkList));
    setIsBookmarked(!isBookmarked);
  };

  if (loading) {
    return (
      <ThemedView style={styles.container}>
        <ThemedText>Loading...</ThemedText>
      </ThemedView>
    );
  }

  if (error || !country) {
    return (
      <ThemedView style={styles.container}>
        <ThemedText>{error || "Country not found"}</ThemedText>
      </ThemedView>
    );
  }

  return (
    <ThemedView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Image source={{ uri: country.flags.png }} style={styles.flag} />
        <View style={styles.headerContainer}>
          <ThemedText style={styles.name}>{country.name.common}</ThemedText>
          <TouchableOpacity
            onPress={toggleBookmark}
            style={styles.bookmarkButton}
          >
            <Ionicons
              name={isBookmarked ? "bookmark" : "bookmark-outline"}
              size={24}
              color={isBookmarked ? "#FFD700" : "#888"}
            />
          </TouchableOpacity>
        </View>

        <View style={styles.infoContainer}>
          <InfoItem label="Capital" value={country.capital.join(", ")} />
          <InfoItem label="Region" value={country.region} />
          <InfoItem label="Subregion" value={country.subregion} />
          <InfoItem
            label="Population"
            value={country.population.toLocaleString()}
          />
          <InfoItem
            label="Area"
            value={`${country.area.toLocaleString()} km²`}
          />
          <InfoItem
            label="Languages"
            value={Object.values(country.languages).join(", ")}
          />
          <InfoItem
            label="Currencies"
            value={Object.values(country.currencies)
              .map((currency) => `${currency.name} (${currency.symbol})`)
              .join(", ")}
          />
        </View>
      </ScrollView>
    </ThemedView>
  );
}

function InfoItem({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.infoItem}>
      <ThemedText style={styles.infoLabel}>{label}:</ThemedText>
      <ThemedText style={styles.infoValue}>{value}</ThemedText>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#030713",
  },
  scrollContent: {
    padding: 20,
  },
  flag: {
    width: "100%",
    height: 200,
    resizeMode: "contain",
    marginBottom: 20,
    borderRadius: 10,
  },
  name: {
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 5,
    lineHeight: 32,
  },
  officialName: {
    fontSize: 18,
    marginBottom: 20,
    color: "#888",
  },
  infoContainer: {
    backgroundColor: "#111E44",
    borderRadius: 10,
    padding: 15,
  },
  infoItem: {
    flexDirection: "row",
    marginBottom: 10,
  },
  infoLabel: {
    fontWeight: "bold",
    marginRight: 5,
    flex: 1,
  },
  infoValue: {
    flex: 2,
  },
  headerContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 5,
  },
  bookmarkButton: {
    padding: 5,
  },
});
