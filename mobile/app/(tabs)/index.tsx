import { ScrollView, View, Text, Pressable, StyleSheet } from "react-native";
import { useRouter } from "expo-router";
import { Colors, FontSize, Spacing, Radius } from "@/lib/theme";
import { useResearchStore } from "@/stores/research-store";
import { EntityRow } from "@/components/EntityRow";
import { Card } from "@/components/Card";
import { SectionHeader } from "@/components/SectionHeader";
import { getEntityName } from "@/types";
import type { EntityType } from "@/types";

const QUICK_ACTIONS = [
  { label: "Photo\nd'archive", icon: "📷", route: "/capture/photo" },
  { label: "Témoignage\nvocal", icon: "🎙", route: "/capture/voice" },
  { label: "Ajouter\npersonne", icon: "👤", route: "/add/person" },
  { label: "Ajouter\nlieu", icon: "📍", route: "/add/place" },
];

export default function HomeScreen() {
  const router = useRouter();
  const { persons, archiveItems, oralTestimonies, getAllEntities } = useResearchStore();
  const recent = getAllEntities().slice(0, 5);

  const stats = [
    { label: "Personnes", count: persons.length },
    { label: "Archives", count: archiveItems.length },
    { label: "Témoignages", count: oralTestimonies.length },
  ];

  return (
    <ScrollView style={styles.scroll} contentContainerStyle={styles.content}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>Historiens</Text>
        <Text style={styles.subtitle}>Terrain</Text>
      </View>

      {/* Stats */}
      <View style={styles.statsRow}>
        {stats.map((s) => (
          <Card key={s.label} style={styles.statCard}>
            <Text style={styles.statCount}>{s.count}</Text>
            <Text style={styles.statLabel}>{s.label}</Text>
          </Card>
        ))}
      </View>

      {/* Quick actions */}
      <SectionHeader title="Actions rapides" />
      <View style={styles.actionsGrid}>
        {QUICK_ACTIONS.map((a) => (
          <Pressable
            key={a.route}
            style={({ pressed }) => [styles.actionBtn, pressed && styles.pressed]}
            onPress={() => router.push(a.route as never)}
          >
            <Text style={styles.actionIcon}>{a.icon}</Text>
            <Text style={styles.actionLabel}>{a.label}</Text>
          </Pressable>
        ))}
      </View>

      {/* Recent entities */}
      <SectionHeader title="Récents" />
      <Card style={styles.listCard}>
        {recent.map((entity) => (
          <EntityRow
            key={`${entity.entityType}-${entity.id}`}
            entity={entity}
            onPress={() =>
              router.push(`/entity/${entity.entityType}/${entity.id}` as never)
            }
          />
        ))}
      </Card>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scroll: { flex: 1, backgroundColor: Colors.surfaceSunken },
  content: { padding: Spacing.lg, paddingBottom: Spacing.xxl },
  header: { marginBottom: Spacing.xl },
  title: { fontSize: FontSize.xxl, fontWeight: "700", color: Colors.ink },
  subtitle: {
    fontSize: FontSize.sm,
    color: Colors.inkMuted,
    marginTop: 2,
    textTransform: "uppercase",
    letterSpacing: 1,
  },
  statsRow: { flexDirection: "row", gap: Spacing.sm, marginBottom: Spacing.sm },
  statCard: { flex: 1, alignItems: "center", padding: Spacing.md },
  statCount: { fontSize: FontSize.xl, fontWeight: "700", color: Colors.ink },
  statLabel: { fontSize: FontSize.xs, color: Colors.inkMuted, marginTop: 2 },
  actionsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: Spacing.sm,
    marginBottom: Spacing.sm,
  },
  actionBtn: {
    width: "47.5%",
    backgroundColor: Colors.surface,
    borderRadius: Radius.md,
    borderWidth: 1,
    borderColor: Colors.border,
    padding: Spacing.lg,
    alignItems: "center",
    gap: Spacing.sm,
  },
  pressed: { backgroundColor: Colors.surfaceSunken },
  actionIcon: { fontSize: 28 },
  actionLabel: {
    fontSize: FontSize.xs,
    color: Colors.inkSecondary,
    textAlign: "center",
    fontWeight: "500",
  },
  listCard: { padding: 0, overflow: "hidden" },
});
