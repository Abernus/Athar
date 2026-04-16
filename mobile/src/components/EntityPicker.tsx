import { useState } from "react";
import { View, Text, Pressable, ScrollView, StyleSheet } from "react-native";
import { Colors, FontSize, Spacing, Radius } from "@/lib/theme";
import { useResearchStore } from "@/stores/research-store";
import { EntityBadge } from "./EntityBadge";
import { getEntityName } from "@/types";
import type { EntityType, AnyEntity } from "@/types";

const TYPES: { key: EntityType; label: string }[] = [
  { key: "person", label: "Personnes" },
  { key: "group", label: "Groupes" },
  { key: "place", label: "Lieux" },
  { key: "event", label: "Événements" },
];

interface Props {
  selectedType: EntityType;
  selectedId: string | null;
  onSelect: (type: EntityType, id: string) => void;
  excludeId?: string;
  label?: string;
}

export function EntityPicker({
  selectedType,
  selectedId,
  onSelect,
  excludeId,
  label,
}: Props) {
  const [filterType, setFilterType] = useState<EntityType>(selectedType);
  const { persons, groups, places, events } = useResearchStore();

  const entities: AnyEntity[] = {
    person: persons,
    group: groups,
    place: places,
    event: events,
  }[filterType].filter((e) => e.id !== excludeId);

  return (
    <View style={styles.container}>
      {label && <Text style={styles.label}>{label}</Text>}

      {/* Type filter */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.typeTabs}
      >
        {TYPES.map((t) => (
          <Pressable
            key={t.key}
            style={[styles.typeTab, filterType === t.key && styles.typeTabActive]}
            onPress={() => setFilterType(t.key)}
          >
            <Text
              style={[
                styles.typeTabText,
                filterType === t.key && styles.typeTabTextActive,
              ]}
            >
              {t.label}
            </Text>
          </Pressable>
        ))}
      </ScrollView>

      {/* Entity list */}
      <ScrollView
        style={styles.list}
        nestedScrollEnabled
        showsVerticalScrollIndicator={false}
      >
        {entities.length === 0 ? (
          <Text style={styles.emptyText}>Aucun élément</Text>
        ) : (
          entities.map((entity) => {
            const isSelected =
              entity.id === selectedId && entity.entityType === selectedType;
            return (
              <Pressable
                key={entity.id}
                style={[styles.row, isSelected && styles.rowSelected]}
                onPress={() => onSelect(entity.entityType, entity.id)}
              >
                <EntityBadge type={entity.entityType} size="sm" />
                <Text
                  style={[styles.rowName, isSelected && styles.rowNameSelected]}
                  numberOfLines={1}
                >
                  {getEntityName(entity)}
                </Text>
              </Pressable>
            );
          })
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { gap: Spacing.sm },
  label: {
    fontSize: FontSize.sm,
    fontWeight: "600",
    color: Colors.inkSecondary,
  },
  typeTabs: { gap: Spacing.sm },
  typeTab: {
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.xs + 2,
    borderRadius: Radius.full,
    backgroundColor: Colors.surfaceSunken,
  },
  typeTabActive: { backgroundColor: Colors.accentLight },
  typeTabText: {
    fontSize: FontSize.xs,
    color: Colors.inkMuted,
    fontWeight: "500",
  },
  typeTabTextActive: { color: Colors.accent, fontWeight: "600" },
  list: { maxHeight: 200 },
  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.sm,
    paddingVertical: Spacing.sm,
    paddingHorizontal: Spacing.sm,
    borderRadius: Radius.sm,
  },
  rowSelected: { backgroundColor: Colors.accentLight },
  rowName: { flex: 1, fontSize: FontSize.sm, color: Colors.ink },
  rowNameSelected: { color: Colors.accent, fontWeight: "600" },
  emptyText: {
    fontSize: FontSize.sm,
    color: Colors.inkMuted,
    paddingVertical: Spacing.lg,
    textAlign: "center",
  },
});
