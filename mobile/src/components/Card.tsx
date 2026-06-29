import { View, StyleSheet, ViewStyle } from "react-native";
import { Colors, Radius, Spacing, Shadow } from "@/lib/theme";

import { useThemedStyles } from "@/lib/useTheme";
interface Props {
  children: React.ReactNode;
  style?: ViewStyle;
}

export function Card({ children, style }: Props) {
  const styles = useThemedStyles(makeStyles);
  return <View style={[styles.card, style]}>{children}</View>;
}

const makeStyles = () => StyleSheet.create({
  card: {
    backgroundColor: Colors.surface,
    borderRadius: Radius.lg,
    padding: Spacing.lg,
    ...Shadow.sm,
  },
});
