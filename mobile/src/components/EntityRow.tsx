import { View, Text, Pressable, StyleSheet } from "react-native";
import { Colors, FontSize, Spacing, Radius } from "@/lib/theme";
import { EntityBadge } from "./EntityBadge";
import { getEntityName } from "@/types";
import type { AnyEntity } from "@/types";
import { formatHistoricalDate } from "@/lib/utils";

interface Props {
  entity: AnyEntity;
  onPress?: () => void;
}

function getSubtitle(entity: AnyEntity): string {
  switch (entity.entityType) {
    case "person":
      return [formatHistoricalDate(entity.birthDate), entity.birthDate && entity.deathDate ? formatHistoricalDate(entity.deathDate) : null]
        .filter(Boolean)
        .join(" — ");
    case "group":
      return entity.groupType;
    case "place":
      return entity.placeType;
    case "event":
      return formatHistoricalDate(entity.dateStart);
  }
}

export function EntityRow({ entity, onPress }: Props) {
  return (
    <Pressable
      style={({ pressed }) => [styles.row, pressed && styles.pressed]}
      onPress={onPress}
    >
      <EntityBadge type={entity.entityType} size="md" />
      <View style={styles.content}>
        <Text style={styles.name} numberOfLines={1}>{getEntityName(entity)}</Text>
        <Text style={styles.sub} numberOfLines={1}>{getSubtitle(entity)}</Text>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.md,
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  pressed: { backgroundColor: Colors.surfaceSunken },
  content: { flex: 1 },
  name: { fontSize: FontSize.base, color: Colors.ink, fontWeight: "500" },
  sub: { fontSize: FontSize.xs, color: Colors.inkMuted, marginTop: 2 },
});
