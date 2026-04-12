import { useState } from "react";
import { View, Text, ScrollView, Pressable, StyleSheet, FlatList } from "react-native";
import { useRouter } from "expo-router";
import { Colors, FontSize, Spacing, Radius } from "@/lib/theme";
import { useResearchStore } from "@/stores/research-store";
import { EntityRow } from "@/components/EntityRow";
import { ENTITY_TYPE_LABELS_PLURAL } from "@/lib/constants";
import type { EntityType } from "@/types";

const TABS: { key: EntityType | "all"; label: string }[] = [
  { key: "all", label: "Tout" },
  { key: "person", label: "Personnes" },
  { key: "group", label: "Groupes" },
  { key: "place", label: "Lieux" },
  { key: "event", label: "Événements" },
];

export default function BrowseScreen() {
  const router = useRouter();
  const { persons, groups, places, events } = useResearchStore();
  const [activeTab, setActiveTab] = useState<EntityType | "all">("all");

  const allEntities = [...persons, ...groups, ...places, ...events];

  const filtered =
    activeTab === "all"
      ? allEntities
      : allEntities.filter((e) => e.entityType === activeTab);

  return (
    <View style={styles.container}>
      {/* Filter tabs */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.tabBar}
        contentContainerStyle={styles.tabContent}
      >
        {TABS.map((tab) => (
          <Pressable
            key={tab.key}
            style={[styles.tab, activeTab === tab.key && styles.tabActive]}
            onPress={() => setActiveTab(tab.key)}
          >
            <Text
              style={[styles.tabLabel, activeTab === tab.key && styles.tabLabelActive]}
            >
              {tab.label}
            </Text>
          </Pressable>
        ))}
      </ScrollView>

      {/* Count */}
      <Text style={styles.count}>{filtered.length} élément{filtered.length !== 1 ? "s" : ""}</Text>

      {/* List */}
      <FlatList
        data={filtered}
        keyExtractor={(item) => `${item.entityType}-${item.id}`}
        renderItem={({ item }) => (
          <EntityRow
            entity={item}
            onPress={() => router.push(`/entity/${item.entityType}/${item.id}` as never)}
          />
        )}
        style={styles.list}
        contentContainerStyle={styles.listContent}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.surfaceSunken },
  tabBar: {
    backgroundColor: Colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
    flexGrow: 0,
  },
  tabContent: { paddingHorizontal: Spacing.lg, paddingVertical: Spacing.sm, gap: Spacing.sm },
  tab: {
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.xs + 2,
    borderRadius: Radius.full,
    backgroundColor: Colors.surfaceSunken,
  },
  tabActive: { backgroundColor: Colors.accentLight },
  tabLabel: { fontSize: FontSize.sm, color: Colors.inkSecondary, fontWeight: "500" },
  tabLabelActive: { color: Colors.accent },
  count: {
    fontSize: FontSize.xs,
    color: Colors.inkMuted,
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.sm,
  },
  list: { flex: 1 },
  listContent: { backgroundColor: Colors.surface },
});
