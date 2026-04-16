import { View, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Colors, Radius } from "@/lib/theme";
import type { EntityType } from "@/types";

const ENTITY_ICONS: Record<EntityType, keyof typeof Ionicons.glyphMap> = {
  person: "person",
  group: "people",
  place: "location",
  event: "calendar",
};

const ENTITY_COLORS: Record<EntityType, { bg: string; icon: string }> = {
  person: { bg: Colors.person.bg, icon: Colors.person.icon },
  group: { bg: Colors.group.bg, icon: Colors.group.icon },
  place: { bg: Colors.place.bg, icon: Colors.place.icon },
  event: { bg: Colors.event.bg, icon: Colors.event.icon },
};

interface Props {
  type: EntityType;
  size?: "sm" | "md" | "lg";
}

export function EntityBadge({ type, size = "sm" }: Props) {
  const dim = size === "sm" ? 28 : size === "md" ? 36 : 44;
  const iconSize = size === "sm" ? 14 : size === "md" ? 18 : 22;
  const { bg, icon } = ENTITY_COLORS[type];
  return (
    <View
      style={[
        styles.badge,
        {
          width: dim,
          height: dim,
          borderRadius: dim * 0.3,
          backgroundColor: bg,
        },
      ]}
    >
      <Ionicons name={ENTITY_ICONS[type]} size={iconSize} color={icon} />
    </View>
  );
}

const styles = StyleSheet.create({
  badge: { alignItems: "center", justifyContent: "center" },
});
