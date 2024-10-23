import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  FlatList,
  Image,
  TouchableOpacity,
} from "react-native";
import { BlurView } from "expo-blur";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { Href, useRouter, Link } from "expo-router";

import EarthVideo from "@/components/EarthVideo";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { Intro } from "@/components/Intro";
import Flag from "@/components/Flag";
import { Country } from "@/types/country";

export default function HomeScreen() {
  const [countries, setCountries] = useState<Country[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredCountries, setFilteredCountries] = useState<Country[]>([]);
  const router = useRouter();

  useEffect(() => {
    fetchCountries();
  }, []);

  useEffect(() => {
    filterCountries();
  }, [searchQuery, countries]);

  async function fetchCountries() {
    try {
      const response = await fetch("https://restcountries.com/v3.1/all");
      const data = await response.json();
      setCountries(data);
    } catch (error) {
      console.error("Error fetching countries:", error);
    }
  }

  function filterCountries() {
    if (!searchQuery.trim()) {
      setFilteredCountries([]);
      return;
    }

    const query = searchQuery.toLowerCase().trim();
    const filtered = countries.filter((country) => {
      const commonName = country.name.common.toLowerCase();
      const nativeNames = Object.values(country.name.nativeName || {}).map(
        (name) => name.common.toLowerCase()
      );
      const translatedNames = Object.values(country.translations).map(
        (translation) => translation.common.toLowerCase()
      );

      return (
        commonName.includes(query) ||
        nativeNames.some((name) => name.includes(query)) ||
        translatedNames.some((name) => name.includes(query))
      );
    });
    setFilteredCountries(filtered);
  }

  function handleCountryPress(country: Country) {
    router.push(`/country/${country.cca3}` as Href<string>);
  }

  const showIntro = !searchQuery.trim();

  function renderCountryItem({ item }: { item: Country }) {
    return (
      <Link href={`/country/${item.cca3}`} asChild>
        <TouchableOpacity>
          <View style={styles.countryItemContainer}>
            <View style={styles.countryFlagContainer}>
              <Image
                source={{
                  uri: `https://flagsapi.com/${item.cca2}/flat/64.png`,
                }}
                style={styles.countryFlag}
              />
            </View>
            <View style={styles.countryInfoContainer}>
              <Text style={styles.title}>{item.name.common}</Text>
              <Text style={styles.countryItem}>{item.region}</Text>
            </View>
          </View>
        </TouchableOpacity>
      </Link>
    );
  }

  return (
    <ThemedView style={styles.container}>
      <View style={styles.videoContainer}>
        <EarthVideo />
      </View>
      <LinearGradient
        colors={["rgba(0,0,0,0)", "rgba(1,2,4,1)"]}
        style={styles.gradientOverlay}
      >
        <BlurView intensity={35} style={styles.searchContainer}>
          <Ionicons
            name="search"
            size={20}
            color="rgba(255,255,255,0.7)"
            style={styles.searchIcon}
          />
          <TextInput
            style={styles.searchInput}
            placeholder="Search countries"
            placeholderTextColor="rgba(255,255,255,0.7)"
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </BlurView>
      </LinearGradient>
      {showIntro ? (
        <Intro />
      ) : (
        <FlatList
          data={filteredCountries}
          keyExtractor={(item) => item.cca3}
          renderItem={renderCountryItem}
          style={styles.countryList}
        />
      )}
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "rgba(1,2,4,1)",
  },
  videoContainer: {
    height: 300,
  },
  gradientOverlay: {
    height: 150,
    marginTop: -150,
    justifyContent: "center",
    paddingHorizontal: 20,
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 20,
    overflow: "hidden",
    backgroundColor: "rgba(42,55,96,0.3)",
    borderWidth: 1,
    borderColor: "#111E44",
  },
  searchIcon: {
    padding: 10,
  },
  searchInput: {
    flex: 1,
    height: 40,
    color: "white",
    fontSize: 16,
    paddingRight: 10,
  },
  countryList: {
    marginHorizontal: 20,
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
  titleContainer: {
    paddingHorizontal: 20,
    marginTop: 20,
  },
  flag: {
    marginTop: 20,
  },
});
