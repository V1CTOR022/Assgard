import React from "react";
import { View, Image, StyleSheet } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";
import { Feather } from "@expo/vector-icons";

import Bounce from "./Bounce";
import { appColors } from "../theme/colors";
import { sharedStyles } from "../theme/styles";

interface Props {
  onBack: () => void;
  backLabel?: string;
  children?: React.ReactNode;
}

export default function ScreenHeader({ onBack, backLabel = "Voltar", children }: Props) {
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.header, { paddingTop: insets.top + 16 }]}>
      <LinearGradient
        colors={appColors.cardGradient as unknown as [string, string, string]}
        start={{ x: 0.1, y: 0 }}
        end={{ x: 0.9, y: 1 }}
        style={StyleSheet.absoluteFill}
        pointerEvents="none"
      />

      <View style={styles.topRow}>
        <Bounce style={sharedStyles.iconButton} onPress={onBack} accessibilityLabel={backLabel}>
          <Feather name="arrow-left" size={20} color={appColors.text} />
        </Bounce>

        <Image source={require("../assets/logo.png")} style={styles.logo} />
      </View>

      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    paddingHorizontal: 22,
    paddingBottom: 28,
    borderBottomLeftRadius: 40,
    borderBottomRightRadius: 40,
    overflow: "hidden",
    backgroundColor: appColors.ink,
  },
  topRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 16,
  },
  logo: {
    width: 54,
    height: 54,
    resizeMode: "contain",
    tintColor: appColors.text,
    marginRight: -6,
  },
});
