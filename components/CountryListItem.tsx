import React from "react";
import { View, Text, StyleSheet, Image, TouchableOpacity } from "react-native";
import { Link } from "expo-router";
import { CountryDetail } from "@/types/country";

interface CountryListItemProps {
  country: CountryDetail;
}

export function CountryListItem({ country }: CountryListItemProps) {
  return (
    <Link href={`/country/${country.cca3}`} asChild>
      <TouchableOpacity style={styles.container}>
        <Image
          source={{ uri: country.flags.png }}
          style={styles.flag}
          resizeMode="cover"
        />
        <View style={styles.infoContainer}>
          <Text style={styles.name}>{country.name.common}</Text>
          <Text style={styles.capital}>
            {country.capital ? country.capital[0] : "N/A"}
          </Text>
        </View>
      </TouchableOpacity>
    </Link>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#2A3760",
  },
  flag: {
    width: 60,
    height: 40,
    marginRight: 16,
    borderRadius: 4,
  },
  infoContainer: {
    flex: 1,
  },
  name: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#FFFFFF",
    marginBottom: 4,
  },
  capital: {
    fontSize: 14,
    color: "#A2ACCA",
  },
});
