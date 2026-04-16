import {
  ScrollView,
  View,
  Text,
  Pressable,
  StyleSheet,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { Colors, FontSize, Spacing, Radius, Shadow } from "@/lib/theme";
import { useResearchStore } from "@/stores/research-store";
import { EntityRow } from "@/components/EntityRow";
import { SectionHeader } from "@/components/SectionHeader";

const QUICK_ACTIONS = [
  {
    label: "Photo",
    sub: "Archive",
    icon: "camera-outline" as const,
    route: "/capture/photo",
    color: Colors.person,
  },
  {
    label: "Audio",
    sub: "Témoignage",
    icon: "mic-outline" as const,
    route: "/capture/voice",
    color: Colors.group,
  },
  {
    label: "Personne",
    sub: "Ajouter",
    icon: "person-add-outline" as const,
    route: "/add/person",
    color: Colors.place,
  },
  {
    label: "Lieu",
    sub: "Ajouter",
    icon: "location-outline" as const,
    route: "/add/place",
    color: Colors.event,
  },
];

export default function HomeScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { persons, groups, places, events, archiveItems, oralTestimonies, getAllEntities } =
    useResearchStore();
  const recent = getAllEntities().slice(0, 6);

  const stats = [
    { label: "Personnes", count: persons.length, icon: "person" as const, color: Colors.person },
    { label: "Lieux", count: places.length, icon: "location" as const, color: Colors.place },
    { label: "Événements", count: events.length, icon: "calendar" as const, color: Colors.event },
    { label: "Archives", count: archiveItems.length, icon: "document-text" as const, color: { bg: "#FEE2E2", icon: "#DC2626" } },
  ];

  return (
    <ScrollView
      style={styles.scroll}
      contentContainerStyle={[styles.content, { paddingTop: insets.top + Spacing.lg }]}
    >
      {/* Brand header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.brand}>Athar</Text>
          <Text style={styles.brandSub}>Traces & vestiges</Text>
        </View>
        <View style={styles.brandAccent}>
          <Text style={styles.brandArabic}>أثر</Text>
        </View>
      </View>

      {/* Stats */}
      <View style={styles.statsRow}>
        {stats.map((s) => (
          <View key={s.label} style={styles.statCard}>
            <View style={[styles.statIcon, { backgroundColor: s.color.bg }]}>
              <Ionicons name={s.icon} size={16} color={s.color.icon} />
            </View>
            <Text style={styles.statCount}>{s.count}</Text>
            <Text style={styles.statLabel}>{s.label}</Text>
          </View>
        ))}
      </View>

      {/* Quick actions */}
      <SectionHeader title="Actions rapides" />
      <View style={styles.actionsGrid}>
        {QUICK_ACTIONS.map((a) => (
          <Pressable
            key={a.route}
            style={({ pressed }) => [styles.actionBtn, pressed && styles.actionPressed]}
            onPress={() => router.push(a.route as never)}
          >
            <View style={[styles.actionIconWrap, { backgroundColor: a.color.bg }]}>
              <Ionicons name={a.icon} size={22} color={a.color.icon} />
            </View>
            <Text style={styles.actionLabel}>{a.label}</Text>
            <Text style={styles.actionSub}>{a.sub}</Text>
          </Pressable>
        ))}
      </View>

      {/* Recent entities */}
      <SectionHeader title="Ajouts récents" />
      <View style={styles.listCard}>
        {recent.map((entity, i) => (
          <View key={`${entity.entityType}-${entity.id}`}>
            <EntityRow
              entity={entity}
              onPress={() =>
                router.push(`/entity/${entity.entityType}/${entity.id}` as never)
              }
            />
            {i < recent.length - 1 && <View style={styles.divider} />}
          </View>
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scroll: { flex: 1, backgroundColor: Colors.surfaceSunken },
  content: { paddingHorizontal: Spacing.lg, paddingBottom: Spacing.xxxl },

  // Header
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: Spacing.xl,
  },
  brand: {
    fontSize: FontSize.xxxl,
    fontWeight: "700",
    color: Colors.ink,
    letterSpacing: -0.5,
  },
  brandSub: {
    fontSize: FontSize.sm,
    color: Colors.inkMuted,
    marginTop: 2,
    letterSpacing: 0.5,
  },
  brandAccent: {
    width: 48,
    height: 48,
    borderRadius: Radius.lg,
    backgroundColor: Colors.accentLight,
    alignItems: "center",
    justifyContent: "center",
  },
  brandArabic: {
    fontSize: 22,
    fontWeight: "700",
    color: Colors.accent,
  },

  // Stats
  statsRow: {
    flexDirection: "row",
    gap: Spacing.sm,
    marginBottom: Spacing.sm,
  },
  statCard: {
    flex: 1,
    backgroundColor: Colors.surface,
    borderRadius: Radius.lg,
    padding: Spacing.md,
    alignItems: "center",
    gap: Spacing.xs,
    ...Shadow.sm,
  },
  statIcon: {
    width: 30,
    height: 30,
    borderRadius: Radius.sm,
    alignItems: "center",
    justifyContent: "center",
  },
  statCount: {
    fontSize: FontSize.xl,
    fontWeight: "700",
    color: Colors.ink,
  },
  statLabel: {
    fontSize: FontSize.xs,
    color: Colors.inkMuted,
  },

  // Actions
  actionsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: Spacing.sm,
  },
  actionBtn: {
    width: "48%",
    flexGrow: 1,
    backgroundColor: Colors.surface,
    borderRadius: Radius.lg,
    padding: Spacing.lg,
    alignItems: "center",
    gap: Spacing.sm,
    ...Shadow.sm,
  },
  actionPressed: { opacity: 0.7, transform: [{ scale: 0.97 }] },
  actionIconWrap: {
    width: 44,
    height: 44,
    borderRadius: Radius.md,
    alignItems: "center",
    justifyContent: "center",
  },
  actionLabel: {
    fontSize: FontSize.sm,
    color: Colors.ink,
    fontWeight: "600",
  },
  actionSub: {
    fontSize: FontSize.xs,
    color: Colors.inkMuted,
  },

  // Recent list
  listCard: {
    backgroundColor: Colors.surface,
    borderRadius: Radius.lg,
    overflow: "hidden",
    ...Shadow.sm,
  },
  divider: {
    height: 1,
    backgroundColor: Colors.border,
    marginHorizontal: Spacing.lg,
  },
});
