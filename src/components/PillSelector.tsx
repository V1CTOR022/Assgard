import React from "react";
import { View, Text, StyleSheet, type StyleProp, type ViewStyle } from "react-native";

import Bounce from "./Bounce";
import { appColors } from "../theme/colors";

export interface PillOption<T extends string> {
  id: T;
  label: string;
  renderIcon?: (color: string) => React.ReactNode;
}

interface Props<T extends string> {
  options: PillOption<T>[];
  value: T | null;
  onChange: (id: T) => void;
  variant?: "pill" | "card";
  style?: StyleProp<ViewStyle>;
}

export default function PillSelector<T extends string>({
  options,
  value,
  onChange,
  variant = "pill",
  style,
}: Props<T>) {
  return (
    <View style={[styles.row, style]}>
      {options.map((option) => {
        const active = option.id === value;
        const iconColor = active ? appColors.actionText : appColors.sub;

        return (
          <Bounce
            key={option.id}
            style={[
              styles.option,
              variant === "card" ? styles.card : styles.pill,
              active && styles.optionActive,
            ]}
            onPress={() => onChange(option.id)}
            accessibilityLabel={option.label}
          >
            {option.renderIcon?.(iconColor)}
            <Text style={[styles.label, active && styles.labelActive]}>{option.label}</Text>
          </Bounce>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    gap: 10,
  },
  option: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    backgroundColor: appColors.chromeLight,
    borderWidth: 1,
    borderColor: appColors.strokeLight,
  },
  pill: {
    height: 48,
    borderRadius: 24,
  },
  card: {
    height: 52,
    borderRadius: 16,
  },
  optionActive: {
    backgroundColor: appColors.gold,
    borderColor: appColors.gold,
  },
  label: {
    fontSize: 14,
    fontWeight: "600",
    color: appColors.sub,
  },
  labelActive: {
    color: appColors.actionText,
  },
});
