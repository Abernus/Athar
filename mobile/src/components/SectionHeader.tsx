import { Text, StyleSheet } from "react-native";
import { Colors, FontSize, Spacing } from "@/lib/theme";

export function SectionHeader({ title }: { title: string }) {
  return <Text style={styles.text}>{title.toUpperCase()}</Text>;
}

const styles = StyleSheet.create({
  text: {
    fontSize: FontSize.xs,
    fontWeight: "600",
    color: Colors.inkMuted,
    letterSpacing: 0.8,
    marginBottom: Spacing.sm,
    marginTop: Spacing.lg,
  },
});
