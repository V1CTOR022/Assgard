import { useEffect } from "react";
import { View, TouchableOpacity, StyleSheet } from "react-native";
import type { BottomTabBarProps } from "@react-navigation/bottom-tabs";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import Animated, { useAnimatedStyle, useSharedValue, withSpring } from "react-native-reanimated";
import { appColors } from "../theme/colors";

const TAB_ICONS: Record<string, { focused: string; unfocused: string }> = {
  Home: { focused: "home", unfocused: "home-outline" },
  History: { focused: "time", unfocused: "time-outline" },
  Profile: { focused: "person", unfocused: "person-outline" },
};

const FOCUSED_SCALE = 1.18;
const SPRING = { damping: 13, stiffness: 190, mass: 0.6 };

export default function TabBar({ state, descriptors, navigation }: BottomTabBarProps) {
  return (
    <View style={styles.wrapper}>
      <View style={styles.container}>
        <LinearGradient
          colors={appColors.cardGradient as unknown as [string, string, string]}
          start={{ x: 0.1, y: 0 }}
          end={{ x: 0.9, y: 1 }}
          style={[StyleSheet.absoluteFill, styles.gradient]}
          pointerEvents="none"
        />

        {state.routes.map((route, index) => {
          const isFocused = state.index === index;

          const onPress = () => {
            const event = navigation.emit({
              type: "tabPress",
              target: route.key,
              canPreventDefault: true,
            });
            if (!isFocused && !event.defaultPrevented) {
              navigation.navigate(route.name);
            }
          };

          return (
            <TabButton
              key={route.key}
              name={route.name}
              isFocused={isFocused}
              onPress={onPress}
              accessibilityLabel={descriptors[route.key].options.tabBarAccessibilityLabel}
            />
          );
        })}
      </View>
    </View>
  );
}

interface TabButtonProps {
  name: string;
  isFocused: boolean;
  onPress: () => void;
  accessibilityLabel?: string;
}

function TabButton({ name, isFocused, onPress, accessibilityLabel }: TabButtonProps) {
  const icons = TAB_ICONS[name];
  const scale = useSharedValue(isFocused ? FOCUSED_SCALE : 1);

  useEffect(() => {
    scale.value = withSpring(isFocused ? FOCUSED_SCALE : 1, SPRING);
  }, [isFocused, scale]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  return (
    <TouchableOpacity
      onPress={onPress}
      style={styles.tab}
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel}
    >
      <Animated.View style={[styles.iconWrapper, isFocused && styles.iconFocused, animatedStyle]}>
        <Ionicons
          name={(isFocused ? icons?.focused : icons?.unfocused) as any}
          size={22}
          color={isFocused ? appColors.text : appColors.muted}
        />
      </Animated.View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    position: "absolute",
    bottom: 28,
    left: 0,
    right: 0,
    alignItems: "center",
  },
  container: {
    flexDirection: "row",
    backgroundColor: appColors.ink,
    borderRadius: 40,
    borderWidth: 1,
    borderColor: appColors.stroke,
    paddingVertical: 10,
    paddingHorizontal: 24,
    gap: 8,
    shadowColor: appColors.black,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.4,
    shadowRadius: 16,
  },
  gradient: {
    borderRadius: 40,
  },
  tab: {
    paddingHorizontal: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  iconWrapper: {
    width: 38,
    height: 38,
    borderRadius: 19,
    alignItems: "center",
    justifyContent: "center",
  },
  iconFocused: {
    backgroundColor: "rgba(255, 255, 255, 0.12)",
    borderRadius: 19,
  },
});
