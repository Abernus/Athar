import { View, Text, StyleSheet } from "react-native";
import { Colors, FontSize, Radius, Spacing } from "@/lib/theme";
import { useThemedStyles } from "@/lib/useTheme";
import { CONFIDENCE_LABELS } from "@/lib/constants";
import type { ConfidenceLevel } from "@/types";

interface Props {
  level: ConfidenceLevel;
}

export function ConfidencePill({ level }: Props) {
  const styles = useThemedStyles(makeStyles);
  const c = Colors[level];
  return (
    <View style={[styles.pill, { backgroundColor: c.bg, borderColor: c.border }]}>
      <Text style={[styles.label, { color: c.text }]}>
        {CONFIDENCE_LABELS[level]}
      </Text>
    </View>
  );
}

const makeStyles = () => StyleSheet.create({
  pill: {
    borderWidth: 1,
    borderRadius: Radius.full,
    paddingHorizontal: Spacing.sm + 2,
    paddingVertical: 3,
  },
  label: {
    fontSize: FontSize.xs,
    fontWeight: "600",
  },
});
