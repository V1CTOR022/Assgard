import { useEffect } from "react";
import { StyleSheet, TextInput, type TextStyle } from "react-native";
import Animated, {
  Easing,
  useAnimatedProps,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import { appColors } from "../theme/colors";

const AnimatedTextInput = Animated.createAnimatedComponent(TextInput);

interface RollingCounterProps {
  value: number;
  prefix?: string;
  style?: TextStyle;
  duration?: number;
}

function formatBRL(value: number): string {
  "worklet";
  const fixed = Math.abs(value).toFixed(2);
  const dot = fixed.indexOf(".");
  const integer = fixed.slice(0, dot);
  const decimals = fixed.slice(dot + 1);

  let grouped = "";
  for (let i = 0; i < integer.length; i++) {
    if (i > 0 && (integer.length - i) % 3 === 0) grouped += ".";
    grouped += integer[i];
  }

  return `${value < 0 ? "-" : ""}${grouped},${decimals}`;
}

export default function RollingCounter({
  value,
  prefix = "R$ ",
  style,
  duration = 1200,
}: RollingCounterProps) {
  const displayed = useSharedValue(0);

  useEffect(() => {
    displayed.value = withTiming(value, {
      duration,
      easing: Easing.out(Easing.cubic),
    });
  }, [value, duration, displayed]);

  const animatedProps = useAnimatedProps(() => {
    return { text: `${prefix}${formatBRL(displayed.value)}` } as any;
  });

  return (
    <AnimatedTextInput
      editable={false}
      caretHidden
      pointerEvents="none"
      underlineColorAndroid="transparent"
      defaultValue={`${prefix}${formatBRL(0)}`}
      animatedProps={animatedProps}
      style={[styles.counter, style]}
    />
  );
}

const styles = StyleSheet.create({
  counter: {
    fontSize: 36,
    fontWeight: "bold",
    color: appColors.gold,
    fontVariant: ["tabular-nums"],
    padding: 0,
    includeFontPadding: false,
  },
});
