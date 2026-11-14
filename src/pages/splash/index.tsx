import { useEffect } from "react";
import { View, Text, StyleSheet, Image } from "react-native";
import { StatusBar } from "expo-status-bar";

import { hasSeenOnboarding } from "../../services/onboarding";
import { authColors } from "../../theme/colors";

const MIN_DURATION_MS = 1600;

export default function Splash({ navigation }: any) {
  useEffect(() => {
    let active = true;

    const ready = Promise.all([
      hasSeenOnboarding(),
      new Promise((resolve) => setTimeout(resolve, MIN_DURATION_MS)),
    ]);

    ready.then(([seen]) => {
      if (active) navigation.replace(seen ? "Login" : "Onboarding");
    });

    return () => {
      active = false;
    };
  }, [navigation]);

  return (
    <View style={styles.container}>
      <StatusBar style="dark" />

      <Image source={require("../../assets/logo.png")} style={styles.logo} />
      <Text style={styles.wordmark}>Assgard</Text>
      <Text style={styles.tagline}>Suas contas, organizadas.</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: authColors.background,
    justifyContent: "center",
    alignItems: "center",
    paddingBottom: 80,
  },
  logo: {
    width: 120,
    height: 120,
    resizeMode: "contain",
  },
  wordmark: {
    fontSize: 30,
    fontWeight: "bold",
    color: authColors.text,
    marginTop: 12,
  },
  tagline: {
    fontSize: 15,
    color: authColors.subtext,
    marginTop: 6,
  },
});
