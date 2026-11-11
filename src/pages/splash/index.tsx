import { useEffect } from "react";
import { View, Text, StyleSheet, Image } from "react-native";
import { StatusBar } from "expo-status-bar";
import { authColors } from "../../theme/colors";

export default function Splash({ navigation }: any) {
  useEffect(() => {
    const timer = setTimeout(() => {
      navigation.replace("Login");
    }, 2000);

    return () => clearTimeout(timer);
  }, [navigation]);

  return (
    <View style={styles.container}>
      <StatusBar style="dark" />
      <Image
        source={require("../../assets/logo.png")}
        style={styles.logo}
      />
      <Text style={styles.text}>Seja bem-vindo ao Asgard</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: authColors.background,
    justifyContent: "center",
    alignItems: "center",
    paddingBottom: 100,
  },
  logo: {
    width: 200,
    height: 200,
  },
  text: {
    color: authColors.text,
    fontSize: 22,
    fontWeight: "bold",
  },
});
