import { View, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Colors, Radius } from "@/lib/theme";
import { useThemedStyles } from "@/lib/useTheme";
import type { EntityType } from "@/types";

const ENTITY_ICONS: Record<EntityType, keyof typeof Ionicons.glyphMap> = {
  person: "person",
  group: "people",
  place: "location",
  event: "calendar",
};

interface Props {
  type: EntityType;
  size?: "sm" | "md" | "lg";
}

export function EntityBadge({ type, size = "sm" }: Props) {
  const styles = useThemedStyles(makeStyles);
  const dim = size === "sm" ? 28 : size === "md" ? 36 : 44;
  const iconSize = size === "sm" ? 14 : size === "md" ? 18 : 22;
  // Read live so the badge re-themes on light/dark toggle.
  const { bg, icon } = Colors[type];
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

const makeStyles = () => StyleSheet.create({
  badge: { alignItems: "center", justifyContent: "center" },
});
