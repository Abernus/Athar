import { useCallback } from "react";
import { Pressable, PressableProps, ViewStyle, StyleProp } from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming,
} from "react-native-reanimated";
import { haptic } from "@/lib/haptics";

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

type HapticKind = "light" | "medium" | "selection" | "none";

interface Props extends Omit<PressableProps, "style"> {
  children: React.ReactNode;
  style?: StyleProp<ViewStyle>;
  /** How far it shrinks while pressed. Default 0.96. */
  scaleTo?: number;
  /** Haptic fired on press-in. Default "light". */
  haptics?: HapticKind;
}

/**
 * Pressable with a spring scale-down + dim on press, plus haptic feedback.
 * The shared depth/feel for every tappable surface in the app.
 */
export function PressableScale({
  children,
  style,
  scaleTo = 0.96,
  haptics = "light",
  onPressIn,
  ...rest
}: Props) {
  const scale = useSharedValue(1);
  const opacity = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
    opacity: opacity.value,
  }));

  const handlePressIn = useCallback(
    (e: Parameters<NonNullable<PressableProps["onPressIn"]>>[0]) => {
      scale.value = withSpring(scaleTo, { damping: 18, stiffness: 320 });
      opacity.value = withTiming(0.85, { duration: 80 });
      if (haptics !== "none") haptic[haptics]();
      onPressIn?.(e);
    },
    [scaleTo, haptics, onPressIn]
  );

  const handlePressOut = useCallback(() => {
    scale.value = withSpring(1, { damping: 15, stiffness: 280 });
    opacity.value = withTiming(1, { duration: 120 });
  }, []);

  return (
    <AnimatedPressable
      style={[style, animatedStyle]}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      {...rest}
    >
      {children}
    </AnimatedPressable>
  );
}
