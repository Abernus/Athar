import { View, Text, StyleSheet } from "react-native";
import { Colors, FontSize, Spacing } from "@/lib/theme";

export function SectionHeader({ title }: { title: string }) {
  return (
    <View style={styles.container}>
      <View style={styles.bar} />
      <Text style={styles.text}>{title}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.sm,
    marginBottom: Spacing.md,
    marginTop: Spacing.xl,
  },
  bar: {
    width: 3,
    height: 14,
    borderRadius: 2,
    backgroundColor: Colors.accent,
  },
  text: {
    fontSize: FontSize.sm,
    fontWeight: "600",
    color: Colors.inkSecondary,
    letterSpacing: 0.3,
  },
});
