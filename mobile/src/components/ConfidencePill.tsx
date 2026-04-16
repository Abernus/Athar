import { View, Text, StyleSheet } from "react-native";
import { Colors, FontSize, Radius, Spacing } from "@/lib/theme";
import { CONFIDENCE_LABELS } from "@/lib/constants";
import type { ConfidenceLevel } from "@/types";

interface Props {
  level: ConfidenceLevel;
}

const PILL_COLORS: Record<
  ConfidenceLevel,
  { bg: string; text: string; border: string }
> = {
  confirmed: Colors.confirmed,
  probable: Colors.probable,
  uncertain: Colors.uncertain,
  contested: Colors.contested,
  abandoned: Colors.abandoned,
};

export function ConfidencePill({ level }: Props) {
  const c = PILL_COLORS[level];
  return (
    <View style={[styles.pill, { backgroundColor: c.bg, borderColor: c.border }]}>
      <Text style={[styles.label, { color: c.text }]}>
        {CONFIDENCE_LABELS[level]}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
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
