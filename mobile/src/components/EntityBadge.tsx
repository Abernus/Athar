import { View, Text, StyleSheet } from "react-native";
import { Colors, FontSize, Radius, Spacing } from "@/lib/theme";
import type { EntityType } from "@/types";

const ENTITY_LABELS: Record<EntityType, string> = {
  person: "P",
  group: "G",
  place: "L",
  event: "E",
};

const ENTITY_COLORS: Record<EntityType, { bg: string; text: string }> = {
  person: Colors.person,
  group: Colors.group,
  place: Colors.place,
  event: Colors.event,
};

interface Props {
  type: EntityType;
  size?: "sm" | "md";
}

export function EntityBadge({ type, size = "sm" }: Props) {
  const dim = size === "sm" ? 22 : 28;
  const { bg, text } = ENTITY_COLORS[type];
  return (
    <View style={[styles.badge, { width: dim, height: dim, borderRadius: Radius.sm, backgroundColor: bg }]}>
      <Text style={[styles.letter, { color: text, fontSize: size === "sm" ? 10 : 12 }]}>
        {ENTITY_LABELS[type]}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: { alignItems: "center", justifyContent: "center" },
  letter: { fontWeight: "700" },
});
