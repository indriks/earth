import React from "react";
import { StyleSheet, FlatList } from "react-native";
import { useAtom } from "jotai";
import { bookmarksAtom } from "@/app/atoms/bookmarkAtom";
import { CountryListItem } from "@/components/CountryListItem";
import { ThemedView } from "@/components/ThemedView";
import { CountryDetail } from "@/types/country";

export default function BookmarksScreen() {
  const [bookmarks] = useAtom(bookmarksAtom);

  return (
    <ThemedView style={styles.container}>
      <FlatList
        data={bookmarks}
        renderItem={({ item }) => (
          <CountryListItem country={item as CountryDetail} />
        )}
        keyExtractor={(item) => (item as CountryDetail).cca3}
      />
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
