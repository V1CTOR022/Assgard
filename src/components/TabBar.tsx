import { useEffect } from "react";
import { View, Pressable, StyleSheet } from "react-native";
import type { BottomTabBarProps } from "@react-navigation/bottom-tabs";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  runOnJS,
  type SharedValue,
} from "react-native-reanimated";

import { appColors } from "../theme/colors";

type IconName = keyof typeof Ionicons.glyphMap;

const TAB_ICONS: Record<string, IconName> = {
  History: "time",
  Home: "home",
  Profile: "person",
};

const TAB = 56;
const GAP = 18;
const PAD = 10;
const ICON = 22;
const BAR_HEIGHT = TAB + PAD * 2;

const LEAD = { stiffness: 640, damping: 38, mass: 1 };
const TRAIL = { stiffness: 150, damping: 16, mass: 1 };
const DRAG_LEAD = { stiffness: 1100, damping: 56, mass: 1 };
const DRAG_TRAIL = { stiffness: 320, damping: 26, mass: 1 };
const SETTLE = { stiffness: 600, damping: 44, mass: 1 };
const NUDGE = { stiffness: 300, damping: 18, mass: 1 };
const POP = { stiffness: 520, damping: 16, mass: 1 };

const POP_VELOCITY = -3.2;
const RUBBER_GIVE = 46;
const RUBBER_RESIST = 0.55;
const NUDGE_RATIO = 0.35;
const SNAP_BIAS = 0.18;
const MIN_PILL_WIDTH = 24;
const SQUASH_MIN = 0.66;
const SQUASH_MAX = 1.1;

function clamp(value: number, min: number, max: number) {
  "worklet";
  return Math.max(min, Math.min(max, value));
}

function center(index: number) {
  "worklet";
  return TAB / 2 + index * (TAB + GAP);
}

function rubber(value: number, min: number, max: number) {
  "worklet";
  if (value < min) {
    return min - (1 - 1 / (((min - value) * RUBBER_RESIST) / RUBBER_GIVE + 1)) * RUBBER_GIVE;
  }
  if (value > max) {
    return max + (1 - 1 / (((value - max) * RUBBER_RESIST) / RUBBER_GIVE + 1)) * RUBBER_GIVE;
  }
  return value;
}

function moveTo(
  left: SharedValue<number>,
  right: SharedValue<number>,
  target: number,
  direction: number,
  dragging: boolean,
) {
  "worklet";
  const lead = dragging ? DRAG_LEAD : LEAD;
  const trail = dragging ? DRAG_TRAIL : TRAIL;
  const leftConfig = direction === 0 ? SETTLE : direction > 0 ? trail : lead;
  const rightConfig = direction === 0 ? SETTLE : direction > 0 ? lead : trail;

  left.value = withSpring(target - TAB / 2, leftConfig);
  right.value = withSpring(target + TAB / 2, rightConfig);
}

function pillRect(left: number, right: number) {
  "worklet";
  const start = Math.min(left, right);
  const end = Math.max(left, right);
  const width = Math.max(end - start, MIN_PILL_WIDTH);
  const height = TAB * clamp(1 / Math.sqrt(width / TAB), SQUASH_MIN, SQUASH_MAX);

  return { start, width, height, top: (TAB - height) / 2 };
}

export default function TabBar({ state, descriptors, navigation }: BottomTabBarProps) {
  const count = state.routes.length;
  const trackWidth = count * TAB + (count - 1) * GAP;

  const left = useSharedValue(center(state.index) - TAB / 2);
  const right = useSharedValue(center(state.index) + TAB / 2);
  const nudge = useSharedValue(0);
  const dragCenter = useSharedValue(center(state.index));
  const dragDirection = useSharedValue(0);

  useEffect(() => {
    const target = center(state.index);
    const direction = Math.sign(target - (left.value + right.value) / 2);
    moveTo(left, right, target, direction, false);
  }, [state.index, left, right]);

  function select(index: number) {
    const route = state.routes[index];
    if (!route) return;

    const event = navigation.emit({
      type: "tabPress",
      target: route.key,
      canPreventDefault: true,
    });

    if (state.index !== index && !event.defaultPrevented) {
      navigation.navigate(route.name);
    }
  }

  const pan = Gesture.Pan()
    .activeOffsetX([-8, 8])
    .onUpdate((event) => {
      const min = center(0);
      const max = center(count - 1);
      const position = rubber(event.x, min, max);

      if (Math.abs(event.velocityX) > 1) {
        dragDirection.value = Math.sign(event.velocityX);
      }

      dragCenter.value = position;
      moveTo(left, right, position, dragDirection.value, true);
      nudge.value = withSpring((position - clamp(position, min, max)) * NUDGE_RATIO, NUDGE);
    })
    .onEnd(() => {
      const raw = (dragCenter.value - center(0)) / (TAB + GAP) + dragDirection.value * SNAP_BIAS;
      const index = Math.round(clamp(raw, 0, count - 1));

      nudge.value = withSpring(0, NUDGE);
      moveTo(left, right, center(index), dragDirection.value, false);
      dragDirection.value = 0;

      runOnJS(select)(index);
    });

  const barStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: nudge.value }],
  }));

  const pillStyle = useAnimatedStyle(() => {
    const rect = pillRect(left.value, right.value);
    return {
      width: rect.width,
      height: rect.height,
      borderRadius: rect.height / 2,
      transform: [{ translateX: rect.start }, { translateY: rect.top }],
    };
  });

  const clipStyle = useAnimatedStyle(() => {
    const rect = pillRect(left.value, right.value);
    return {
      width: rect.width,
      height: rect.height,
      borderRadius: rect.height / 2,
      transform: [{ translateX: rect.start }, { translateY: rect.top }],
    };
  });

  const clipInnerStyle = useAnimatedStyle(() => {
    const rect = pillRect(left.value, right.value);
    return {
      transform: [{ translateX: -rect.start }, { translateY: -rect.top }],
    };
  });

  return (
    <View style={styles.wrapper} pointerEvents="box-none">
      <Animated.View style={[styles.bar, barStyle]}>
        <LinearGradient
          colors={appColors.cardGradient as unknown as [string, string, string]}
          start={{ x: 0.1, y: 0 }}
          end={{ x: 0.9, y: 1 }}
          style={[StyleSheet.absoluteFill, styles.gradient]}
          pointerEvents="none"
        />

        <GestureDetector gesture={pan}>
          <View style={[styles.track, { width: trackWidth }]}>
            <Animated.View style={[styles.pill, pillStyle]} pointerEvents="none" />

            <View style={[styles.row, { width: trackWidth }]}>
              {state.routes.map((route, index) => (
                <Pressable
                  key={route.key}
                  style={styles.tab}
                  onPress={() => select(index)}
                  accessibilityRole="button"
                  accessibilityState={{ selected: state.index === index }}
                  accessibilityLabel={descriptors[route.key].options.tabBarAccessibilityLabel}
                >
                  <TabIcon
                    name={TAB_ICONS[route.name]}
                    focused={state.index === index}
                    color={appColors.dim}
                  />
                </Pressable>
              ))}
            </View>

            <Animated.View style={[styles.clip, clipStyle]} pointerEvents="none">
              <Animated.View style={[styles.clipInner, { width: trackWidth }, clipInnerStyle]}>
                <View style={[styles.row, { width: trackWidth }]}>
                  {state.routes.map((route, index) => (
                    <View key={route.key} style={styles.tab}>
                      <TabIcon
                        name={TAB_ICONS[route.name]}
                        focused={state.index === index}
                        color={appColors.ink}
                      />
                    </View>
                  ))}
                </View>
              </Animated.View>
            </Animated.View>
          </View>
        </GestureDetector>
      </Animated.View>
    </View>
  );
}

interface TabIconProps {
  name: IconName;
  focused: boolean;
  color: string;
}

function TabIcon({ name, focused, color }: TabIconProps) {
  const pop = useSharedValue(1);

  useEffect(() => {
    if (focused) {
      pop.value = withSpring(1, { ...POP, velocity: POP_VELOCITY });
    }
  }, [focused, pop]);

  const style = useAnimatedStyle(() => ({
    transform: [{ scale: pop.value }],
  }));

  return (
    <Animated.View style={style}>
      <Ionicons name={name} size={ICON} color={color} />
    </Animated.View>
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
  bar: {
    height: BAR_HEIGHT,
    paddingHorizontal: PAD,
    justifyContent: "center",
    borderRadius: BAR_HEIGHT / 2,
    backgroundColor: appColors.ink,
    borderWidth: 1,
    borderColor: appColors.stroke,
    shadowColor: appColors.black,
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.45,
    shadowRadius: 18,
    elevation: 12,
    overflow: "hidden",
  },
  gradient: {
    borderRadius: BAR_HEIGHT / 2,
  },
  track: {
    height: TAB,
    justifyContent: "center",
  },
  row: {
    flexDirection: "row",
    height: TAB,
    gap: GAP,
  },
  tab: {
    width: TAB,
    height: TAB,
    alignItems: "center",
    justifyContent: "center",
  },
  pill: {
    position: "absolute",
    left: 0,
    top: 0,
    backgroundColor: appColors.gold,
    shadowColor: appColors.black,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.5,
    shadowRadius: 10,
  },
  clip: {
    position: "absolute",
    left: 0,
    top: 0,
    overflow: "hidden",
  },
  clipInner: {
    height: TAB,
  },
});
