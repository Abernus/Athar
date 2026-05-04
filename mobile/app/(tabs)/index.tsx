import {
  ScrollView,
  View,
  Text,
  Pressable,
  StyleSheet,
  RefreshControl,
  ActivityIndicator,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { Colors, FontSize, Spacing, Radius, Shadow } from "@/lib/theme";
import { useResearchStore } from "@/stores/research-store";
import { EntityRow } from "@/components/EntityRow";
import { SectionHeader } from "@/components/SectionHeader";
import { getEntityName } from "@/types";

const QUICK_ACTIONS = [
  {
    label: "Réseau",
    sub: "Graphe",
    icon: "git-network-outline" as const,
    route: "/network",
    color: { bg: "#FCE7F3", icon: "#DB2777" },
  },
  {
    label: "Photo",
    sub: "Archive",
    icon: "camera-outline" as const,
    route: "/capture/photo",
    color: Colors.person,
  },
  {
    label: "Personne",
    sub: "Ajouter",
    icon: "person-add-outline" as const,
    route: "/add/person",
    color: Colors.place,
  },
  {
    label: "Source",
    sub: "Ajouter",
    icon: "document-text-outline" as const,
    route: "/add/source",
    color: Colors.event,
  },
];

export default function HomeScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const {
    persons, groups, places, events, archiveItems, sources,
    projects, hypotheses, contradictions,
    getAllEntities, fetchAll, loading, initialized,
  } = useResearchStore();
  const recent = getAllEntities().slice(0, 6);
  const recentSources = sources.slice(0, 3);
  const recentProjects = projects.slice(0, 3);
  const isEmpty = initialized && recent.length === 0 && sources.length === 0 && projects.length === 0;

  const stats = [
    { label: "Personnes", count: persons.length, icon: "person" as const, color: Colors.person },
    { label: "Sources", count: sources.length, icon: "document-text" as const, color: { bg: "#DBEAFE", icon: "#2563EB" } },
    { label: "Dossiers", count: projects.length, icon: "folder" as const, color: Colors.event },
    { label: "Hypothèses", count: hypotheses.length, icon: "bulb" as const, color: { bg: "#FEF3C7", icon: "#D97706" } },
  ];

  const stats2 = [
    { label: "Lieux", count: places.length, icon: "location" as const, color: Colors.place },
    { label: "Événements", count: events.length, icon: "calendar" as const, color: Colors.event },
    { label: "Groupes", count: groups.length, icon: "people" as const, color: Colors.group },
    { label: "Archives", count: archiveItems.length, icon: "camera" as const, color: { bg: "#FEE2E2", icon: "#DC2626" } },
  ];

  return (
    <ScrollView
      style={styles.scroll}
      contentContainerStyle={[styles.content, { paddingTop: insets.top + Spacing.lg }]}
      refreshControl={
        <RefreshControl refreshing={loading} onRefresh={fetchAll} tintColor={Colors.accent} />
      }
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

      {/* Stats row 1 */}
      <View style={styles.statsRow}>
        {stats.map((s) => (
          <View key={s.label} style={styles.statCard}>
            <View style={[styles.statIcon, { backgroundColor: s.color.bg }]}>
              <Ionicons name={s.icon} size={14} color={s.color.icon} />
            </View>
            <Text style={styles.statCount}>{s.count}</Text>
            <Text style={styles.statLabel}>{s.label}</Text>
          </View>
        ))}
      </View>

      {/* Stats row 2 */}
      <View style={styles.statsRow}>
        {stats2.map((s) => (
          <View key={s.label} style={styles.statCard}>
            <View style={[styles.statIcon, { backgroundColor: s.color.bg }]}>
              <Ionicons name={s.icon} size={14} color={s.color.icon} />
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

      {!initialized ? (
        <ActivityIndicator color={Colors.accent} style={{ marginTop: Spacing.xxl }} />
      ) : isEmpty ? (
        <View style={styles.emptyState}>
          <View style={styles.emptyIcon}>
            <Ionicons name="compass-outline" size={32} color={Colors.borderStrong} />
          </View>
          <Text style={styles.emptyTitle}>Commencez votre recherche</Text>
          <Text style={styles.emptyHint}>
            Ajoutez des personnes, sources ou dossiers pour démarrer
          </Text>
        </View>
      ) : (
        <>
          {/* Recent projects */}
          {recentProjects.length > 0 && (
            <>
              <SectionHeader title="Dossiers récents" />
              <View style={styles.listCard}>
                {recentProjects.map((p, i) => (
                  <Pressable
                    key={p.id}
                    style={[styles.compactRow, i < recentProjects.length - 1 && styles.compactBorder]}
                    onPress={() => router.push(`/project/${p.id}` as never)}
                  >
                    <View style={[styles.compactIcon, { backgroundColor: `${Colors.accent}18` }]}>
                      <Ionicons name="folder" size={14} color={Colors.accent} />
                    </View>
                    <View style={styles.compactText}>
                      <Text style={styles.compactTitle} numberOfLines={1}>{p.title}</Text>
                      <Text style={styles.compactSub}>{p.status}</Text>
                    </View>
                    <Ionicons name="chevron-forward" size={14} color={Colors.borderStrong} />
                  </Pressable>
                ))}
              </View>
            </>
          )}

          {/* Recent sources */}
          {recentSources.length > 0 && (
            <>
              <SectionHeader title="Sources récentes" />
              <View style={styles.listCard}>
                {recentSources.map((s, i) => (
                  <Pressable
                    key={s.id}
                    style={[styles.compactRow, i < recentSources.length - 1 && styles.compactBorder]}
                    onPress={() => router.push(`/source/${s.id}` as never)}
                  >
                    <View style={[styles.compactIcon, { backgroundColor: "#DBEAFE" }]}>
                      <Ionicons name="document-text" size={14} color="#2563EB" />
                    </View>
                    <View style={styles.compactText}>
                      <Text style={styles.compactTitle} numberOfLines={1}>{s.title}</Text>
                      <Text style={styles.compactSub}>{s.sourceType}</Text>
                    </View>
                    <Ionicons name="chevron-forward" size={14} color={Colors.borderStrong} />
                  </Pressable>
                ))}
              </View>
            </>
          )}

          {/* Recent entities */}
          {recent.length > 0 && (
            <>
              <SectionHeader title="Entités récentes" />
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
            </>
          )}
        </>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scroll: { flex: 1, backgroundColor: Colors.surfaceSunken },
  content: { paddingHorizontal: Spacing.lg, paddingBottom: Spacing.xxxl },

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

  statsRow: {
    flexDirection: "row",
    gap: Spacing.sm,
    marginBottom: Spacing.sm,
  },
  statCard: {
    flex: 1,
    backgroundColor: Colors.surface,
    borderRadius: Radius.lg,
    padding: Spacing.sm + 2,
    alignItems: "center",
    gap: 2,
    ...Shadow.sm,
  },
  statIcon: {
    width: 26,
    height: 26,
    borderRadius: Radius.sm,
    alignItems: "center",
    justifyContent: "center",
  },
  statCount: {
    fontSize: FontSize.lg,
    fontWeight: "700",
    color: Colors.ink,
  },
  statLabel: {
    fontSize: 10,
    color: Colors.inkMuted,
  },

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

  compactRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.md,
    padding: Spacing.md + 2,
    paddingHorizontal: Spacing.lg,
  },
  compactBorder: { borderBottomWidth: 1, borderBottomColor: Colors.border },
  compactIcon: {
    width: 30,
    height: 30,
    borderRadius: Radius.sm,
    alignItems: "center",
    justifyContent: "center",
  },
  compactText: { flex: 1 },
  compactTitle: { fontSize: FontSize.sm, color: Colors.ink, fontWeight: "500" },
  compactSub: { fontSize: FontSize.xs, color: Colors.inkMuted, marginTop: 1 },

  emptyState: {
    alignItems: "center",
    gap: Spacing.sm,
    paddingVertical: Spacing.xxxl,
  },
  emptyIcon: {
    width: 64,
    height: 64,
    borderRadius: Radius.full,
    backgroundColor: Colors.surfaceSunken,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: Spacing.sm,
  },
  emptyTitle: {
    fontSize: FontSize.lg,
    fontWeight: "600",
    color: Colors.inkSecondary,
  },
  emptyHint: {
    fontSize: FontSize.sm,
    color: Colors.inkMuted,
    textAlign: "center",
    maxWidth: 250,
    lineHeight: 20,
  },
});
