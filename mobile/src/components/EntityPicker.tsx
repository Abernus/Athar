import { useState } from "react";
import { View, Text, TextInput, Pressable, ScrollView, StyleSheet } from "react-native";
import { Colors, FontSize, Spacing, Radius } from "@/lib/theme";
import { useThemedStyles } from "@/lib/useTheme";
import { Ionicons } from "@expo/vector-icons";
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
  const styles = useThemedStyles(makeStyles);
  const [filterType, setFilterType] = useState<EntityType>(selectedType);
  const [search, setSearch] = useState("");
  const { persons, groups, places, events, getEntityDisplayName } = useResearchStore();

  const allOfType: AnyEntity[] = {
    person: persons,
    group: groups,
    place: places,
    event: events,
  }[filterType].filter((e) => e.id !== excludeId);

  const q = search.toLowerCase().trim();
  const entities = q
    ? allOfType.filter((e) => getEntityName(e).toLowerCase().includes(q))
    : allOfType;

  const selectedName = selectedId ? getEntityDisplayName(selectedType, selectedId) : null;

  return (
    <View style={styles.container}>
      {label && <Text style={styles.label}>{label}</Text>}

      {selectedName && (
        <View style={styles.selectedRow}>
          <EntityBadge type={selectedType} size="sm" />
          <Text style={styles.selectedName}>{selectedName}</Text>
          <Ionicons name="checkmark-circle" size={16} color={Colors.success} />
        </View>
      )}

      {/* Search */}
      <View style={styles.searchRow}>
        <Ionicons name="search" size={14} color={Colors.inkMuted} />
        <TextInput
          style={styles.searchInput}
          value={search}
          onChangeText={setSearch}
          placeholder="Filtrer..."
          placeholderTextColor={Colors.inkMuted}
        />
        {search ? (
          <Pressable onPress={() => setSearch("")}>
            <Ionicons name="close-circle" size={16} color={Colors.inkMuted} />
          </Pressable>
        ) : null}
      </View>

      {/* Type filter */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.typeTabs}
      >
        {TYPES.map((t) => {
          const count = {
            person: persons,
            group: groups,
            place: places,
            event: events,
          }[t.key].length;
          return (
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
                {t.label} ({count})
              </Text>
            </Pressable>
          );
        })}
      </ScrollView>

      {/* Entity list */}
      <ScrollView
        style={styles.list}
        nestedScrollEnabled
        showsVerticalScrollIndicator={false}
      >
        {entities.length === 0 ? (
          <Text style={styles.emptyText}>
            {q ? `Aucun résultat pour "${q}"` : "Aucun élément"}
          </Text>
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
                {isSelected && (
                  <Ionicons name="checkmark" size={16} color={Colors.accent} />
                )}
              </Pressable>
            );
          })
        )}
      </ScrollView>
    </View>
  );
}

const makeStyles = () => StyleSheet.create({
  container: { gap: Spacing.sm },
  label: {
    fontSize: FontSize.sm,
    fontWeight: "600",
    color: Colors.inkSecondary,
  },
  selectedRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.sm,
    backgroundColor: Colors.accentLight,
    borderRadius: Radius.md,
    padding: Spacing.sm + 2,
    paddingHorizontal: Spacing.md,
  },
  selectedName: {
    flex: 1,
    fontSize: FontSize.sm,
    color: Colors.accent,
    fontWeight: "600",
  },
  searchRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.sm,
    backgroundColor: Colors.surfaceSunken,
    borderRadius: Radius.md,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.xs,
  },
  searchInput: {
    flex: 1,
    fontSize: FontSize.sm,
    color: Colors.ink,
    paddingVertical: Spacing.xs,
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
  list: { maxHeight: 220 },
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
