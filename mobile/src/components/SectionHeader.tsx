import { View, Text, StyleSheet, StyleProp, ViewStyle } from "react-native";
import { Colors, FontSize, Spacing } from "@/lib/theme";

import { useThemedStyles } from "@/lib/useTheme";
export function SectionHeader({
  title,
  style,
}: {
  title: string;
  style?: StyleProp<ViewStyle>;
}) {
  const styles = useThemedStyles(makeStyles);
  return (
    <View style={[styles.container, style]}>
      <View style={styles.bar} />
      <Text style={styles.text}>{title}</Text>
    </View>
  );
}

const makeStyles = () => StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.sm,
    marginBottom: Spacing.md,
    marginTop: Spacing.xl,
  },
  bar: {
    width: 3,
    height: 13,
    borderRadius: 2,
    backgroundColor: Colors.accent,
  },
  text: {
    fontSize: FontSize.xs,
    fontWeight: "700",
    color: Colors.inkMuted,
    letterSpacing: 1.2,
    textTransform: "uppercase",
  },
});
