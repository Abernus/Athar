import Animated, { FadeInDown, FadeIn } from "react-native-reanimated";
import { ViewStyle, StyleProp } from "react-native";

interface FadeInViewProps {
  children: React.ReactNode;
  style?: StyleProp<ViewStyle>;
  /** Stagger delay in ms. */
  delay?: number;
  /** Slide-up distance; 0 for a pure fade. Default 12. */
  offset?: number;
  duration?: number;
}

/**
 * Entrance animation wrapper. Fades + slides content up on mount.
 * Use `delay` to stagger sibling sections for an editorial reveal.
 */
export function FadeInView({
  children,
  style,
  delay = 0,
  offset = 12,
  duration = 420,
}: FadeInViewProps) {
  const animation =
    offset > 0
      ? FadeInDown.duration(duration).delay(delay).withInitialValues({
          transform: [{ translateY: offset }],
        })
      : FadeIn.duration(duration).delay(delay);

  return (
    <Animated.View entering={animation} style={style}>
      {children}
    </Animated.View>
  );
}
