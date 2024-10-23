import { StyleSheet, View, Text } from "react-native";

export function Intro() {
  return (
    <View style={styles.titleContainer}>
      <Text style={styles.title}>
        Planet Earth{"\n"}
        <Text style={styles.subtitle}>
          has 7.8 billion people and 195 countries
        </Text>
      </Text>
      <Text style={styles.description}>
        Explore the world and learn about countries we live in.
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  title: {
    fontSize: 48,
    fontWeight: "bold",
    color: "rgba(255,255,255,1)",
  },
  subtitle: {
    fontSize: 48,
    fontWeight: "bold",
    color: "rgba(255,255,255,0.6)",
  },
  description: {
    fontSize: 26,
    fontWeight: "300",
    color: "#A2ACCA",
    marginTop: 10,
    opacity: 0.7,
  },
  titleContainer: {
    paddingHorizontal: 20,
    marginTop: 20,
  },
});
