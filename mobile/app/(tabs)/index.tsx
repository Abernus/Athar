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

export default function HomeScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const {
    persons, groups, places, events, archiveItems, sources,
    projects, hypotheses, contradictions, relationships,
    getAllEntities, fetchAll, loading, initialized,
  } = useResearchStore();
  const recent = getAllEntities().slice(0, 5);
  const recentSources = sources.slice(0, 3);
  const recentProjects = projects.slice(0, 3);
  const totalEntities = persons.length + groups.length + places.length + events.length;
  const isEmpty = initialized && totalEntities === 0 && sources.length === 0 && projects.length === 0;

  return (
    <ScrollView
      style={styles.scroll}
      contentContainerStyle={[styles.content, { paddingTop: insets.top }]}
      refreshControl={
        <RefreshControl refreshing={loading} onRefresh={fetchAll} tintColor={Colors.accent} />
      }
    >
      {/* Hero header */}
      <View style={styles.hero}>
        <View style={styles.heroTop}>
          <View>
            <Text style={styles.heroTitle}>Athar</Text>
            <Text style={styles.heroSub}>L'atelier d'enquête historique</Text>
          </View>
          <View style={styles.heroBadge}>
            <Text style={styles.heroArabic}>أثر</Text>
          </View>
        </View>

        {/* Key metrics */}
        <View style={styles.metricsRow}>
          <View style={styles.metric}>
            <Text style={styles.metricValue}>{totalEntities}</Text>
            <Text style={styles.metricLabel}>Entités</Text>
          </View>
          <View style={styles.metricDivider} />
          <View style={styles.metric}>
            <Text style={styles.metricValue}>{sources.length}</Text>
            <Text style={styles.metricLabel}>Sources</Text>
          </View>
          <View style={styles.metricDivider} />
          <View style={styles.metric}>
            <Text style={styles.metricValue}>{relationships.length}</Text>
            <Text style={styles.metricLabel}>Relations</Text>
          </View>
          <View style={styles.metricDivider} />
          <View style={styles.metric}>
            <Text style={styles.metricValue}>{projects.length}</Text>
            <Text style={styles.metricLabel}>Dossiers</Text>
          </View>
        </View>
      </View>

      {/* Quick actions */}
      <View style={styles.actionsRow}>
        <Pressable
          style={({ pressed }) => [styles.actionCard, styles.actionPrimary, pressed && styles.actionPressed]}
          onPress={() => router.push("/add/project" as never)}
        >
          <Ionicons name="folder-open" size={24} color="white" />
          <Text style={styles.actionPrimaryText}>Nouveau dossier</Text>
        </Pressable>
        <Pressable
          style={({ pressed }) => [styles.actionCard, pressed && styles.actionPressed]}
          onPress={() => router.push("/add/source" as never)}
        >
          <Ionicons name="document-text-outline" size={22} color={Colors.accent} />
          <Text style={styles.actionText}>Source</Text>
        </Pressable>
        <Pressable
          style={({ pressed }) => [styles.actionCard, pressed && styles.actionPressed]}
          onPress={() => router.push("/add/person" as never)}
        >
          <Ionicons name="person-add-outline" size={22} color={Colors.person.icon} />
          <Text style={styles.actionText}>Personne</Text>
        </Pressable>
      </View>

      {/* Secondary actions */}
      <View style={styles.secondaryRow}>
        {[
          { icon: "compass-outline" as const, label: "Explorer", route: "/(tabs)/browse", color: "#7C3AED" },
          { icon: "git-network-outline" as const, label: "Réseau", route: "/network", color: "#DB2777" },
          { icon: "map-outline" as const, label: "Lieux", route: "/(tabs)/map", color: Colors.place.icon },
          { icon: "camera-outline" as const, label: "Photo", route: "/capture/photo", color: Colors.person.icon },
        ].map((a) => (
          <Pressable
            key={a.route}
            style={({ pressed }) => [styles.secondaryBtn, pressed && { opacity: 0.6 }]}
            onPress={() => router.push(a.route as never)}
          >
            <View style={[styles.secondaryIcon, { backgroundColor: `${a.color}14` }]}>
              <Ionicons name={a.icon} size={18} color={a.color} />
            </View>
            <Text style={styles.secondaryLabel}>{a.label}</Text>
          </Pressable>
        ))}
      </View>

      {/* Detailed stats */}
      <View style={styles.statsGrid}>
        {[
          { label: "Personnes", count: persons.length, icon: "person" as const, color: Colors.person },
          { label: "Lieux", count: places.length, icon: "location" as const, color: Colors.place },
          { label: "Événements", count: events.length, icon: "calendar" as const, color: Colors.event },
          { label: "Groupes", count: groups.length, icon: "people" as const, color: Colors.group },
          { label: "Hypothèses", count: hypotheses.length, icon: "bulb" as const, color: { bg: "#FEF3C7", icon: "#D97706" } },
          { label: "Contradictions", count: contradictions.length, icon: "git-compare-outline" as const, color: { bg: "#FEE2E2", icon: "#DC2626" } },
          { label: "Archives", count: archiveItems.length, icon: "camera" as const, color: { bg: "#FCE7F3", icon: "#DB2777" } },
          { label: "Extraits", count: useResearchStore.getState().excerpts.length, icon: "reader" as const, color: { bg: "#EDE9FE", icon: "#7C3AED" } },
        ].map((s) => (
          <View key={s.label} style={styles.statMini}>
            <Ionicons name={s.icon as any} size={14} color={s.color.icon} />
            <Text style={styles.statMiniCount}>{s.count}</Text>
            <Text style={styles.statMiniLabel}>{s.label}</Text>
          </View>
        ))}
      </View>

      {!initialized ? (
        <ActivityIndicator color={Colors.accent} style={{ marginTop: Spacing.xxl }} />
      ) : isEmpty ? (
        <View style={styles.emptyState}>
          <View style={styles.emptyIcon}>
            <Ionicons name="compass-outline" size={36} color={Colors.borderStrong} />
          </View>
          <Text style={styles.emptyTitle}>Commencez votre recherche</Text>
          <Text style={styles.emptyHint}>
            Créez un dossier, ajoutez des sources et des entités pour démarrer votre enquête
          </Text>
        </View>
      ) : (
        <>
          {/* Recent projects */}
          {recentProjects.length > 0 && (
            <>
              <SectionHeader title="Dossiers récents" />
              {recentProjects.map((p) => (
                <Pressable
                  key={p.id}
                  style={({ pressed }) => [styles.projectCard, pressed && { opacity: 0.7 }]}
                  onPress={() => router.push(`/project/${p.id}` as never)}
                >
                  <View style={styles.projectCardLeft} />
                  <View style={styles.projectCardContent}>
                    <Text style={styles.projectCardTitle} numberOfLines={1}>{p.title}</Text>
                    {p.researchQuestion ? (
                      <Text style={styles.projectCardQuestion} numberOfLines={1}>{p.researchQuestion}</Text>
                    ) : null}
                    <Text style={styles.projectCardMeta}>
                      {p.status}{p.periodStart ? ` · ${p.periodStart}` : ""}
                    </Text>
                  </View>
                  <Ionicons name="chevron-forward" size={16} color={Colors.borderStrong} />
                </Pressable>
              ))}
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
  content: { paddingBottom: Spacing.xxxl },

  // Hero
  hero: {
    backgroundColor: Colors.surface,
    paddingHorizontal: Spacing.xl,
    paddingTop: Spacing.lg,
    paddingBottom: Spacing.xl,
    borderBottomLeftRadius: Radius.xxl,
    borderBottomRightRadius: Radius.xxl,
    ...Shadow.md,
  },
  heroTop: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: Spacing.xl,
  },
  heroTitle: {
    fontSize: FontSize.hero,
    fontWeight: "800",
    color: Colors.ink,
    letterSpacing: -1,
  },
  heroSub: {
    fontSize: FontSize.sm,
    color: Colors.inkMuted,
    marginTop: 2,
    letterSpacing: 0.3,
  },
  heroBadge: {
    width: 52,
    height: 52,
    borderRadius: Radius.lg,
    backgroundColor: Colors.accentLight,
    alignItems: "center",
    justifyContent: "center",
    ...Shadow.glow,
  },
  heroArabic: {
    fontSize: 24,
    fontWeight: "800",
    color: Colors.accent,
  },

  // Metrics
  metricsRow: {
    flexDirection: "row",
    backgroundColor: Colors.surfaceSunken,
    borderRadius: Radius.xl,
    padding: Spacing.md,
  },
  metric: {
    flex: 1,
    alignItems: "center",
  },
  metricValue: {
    fontSize: FontSize.xl,
    fontWeight: "800",
    color: Colors.ink,
  },
  metricLabel: {
    fontSize: 10,
    color: Colors.inkMuted,
    marginTop: 1,
  },
  metricDivider: {
    width: 1,
    backgroundColor: Colors.border,
    marginVertical: 4,
  },

  // Primary actions
  actionsRow: {
    flexDirection: "row",
    gap: Spacing.sm,
    paddingHorizontal: Spacing.lg,
    marginTop: Spacing.lg,
  },
  actionCard: {
    flex: 1,
    backgroundColor: Colors.surface,
    borderRadius: Radius.xl,
    padding: Spacing.md,
    alignItems: "center",
    gap: Spacing.sm,
    ...Shadow.sm,
  },
  actionPrimary: {
    backgroundColor: Colors.accent,
    flex: 1.5,
    ...Shadow.glow,
  },
  actionPressed: { opacity: 0.7, transform: [{ scale: 0.97 }] },
  actionPrimaryText: {
    fontSize: FontSize.xs,
    color: "white",
    fontWeight: "700",
  },
  actionText: {
    fontSize: FontSize.xs,
    color: Colors.inkSecondary,
    fontWeight: "600",
  },

  // Secondary actions
  secondaryRow: {
    flexDirection: "row",
    gap: Spacing.sm,
    paddingHorizontal: Spacing.lg,
    marginTop: Spacing.sm,
  },
  secondaryBtn: {
    flex: 1,
    alignItems: "center",
    gap: 4,
    paddingVertical: Spacing.sm,
  },
  secondaryIcon: {
    width: 36,
    height: 36,
    borderRadius: Radius.md,
    alignItems: "center",
    justifyContent: "center",
  },
  secondaryLabel: {
    fontSize: 10,
    color: Colors.inkMuted,
    fontWeight: "500",
  },

  // Stats grid
  statsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    paddingHorizontal: Spacing.lg,
    marginTop: Spacing.lg,
    gap: Spacing.sm,
  },
  statMini: {
    width: "22%",
    flexGrow: 1,
    flexDirection: "column",
    alignItems: "center",
    gap: 2,
    backgroundColor: Colors.surface,
    borderRadius: Radius.lg,
    paddingVertical: Spacing.sm + 2,
    ...Shadow.sm,
  },
  statMiniCount: {
    fontSize: FontSize.base,
    fontWeight: "700",
    color: Colors.ink,
  },
  statMiniLabel: {
    fontSize: 9,
    color: Colors.inkMuted,
    textAlign: "center",
  },

  // Project cards
  projectCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Colors.surface,
    borderRadius: Radius.lg,
    marginHorizontal: Spacing.lg,
    marginBottom: Spacing.sm,
    overflow: "hidden",
    ...Shadow.sm,
  },
  projectCardLeft: {
    width: 4,
    alignSelf: "stretch",
    backgroundColor: Colors.accent,
  },
  projectCardContent: {
    flex: 1,
    padding: Spacing.md,
    paddingLeft: Spacing.md,
  },
  projectCardTitle: {
    fontSize: FontSize.sm,
    fontWeight: "600",
    color: Colors.ink,
  },
  projectCardQuestion: {
    fontSize: FontSize.xs,
    color: Colors.inkSecondary,
    fontStyle: "italic",
    marginTop: 2,
  },
  projectCardMeta: {
    fontSize: FontSize.xs,
    color: Colors.inkMuted,
    marginTop: 3,
  },

  // Lists
  listCard: {
    backgroundColor: Colors.surface,
    borderRadius: Radius.lg,
    marginHorizontal: Spacing.lg,
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

  // Empty
  emptyState: {
    alignItems: "center",
    gap: Spacing.sm,
    paddingVertical: Spacing.xxxl,
    paddingHorizontal: Spacing.xl,
  },
  emptyIcon: {
    width: 72,
    height: 72,
    borderRadius: Radius.full,
    backgroundColor: Colors.surfaceSunken,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: Spacing.sm,
  },
  emptyTitle: {
    fontSize: FontSize.lg,
    fontWeight: "700",
    color: Colors.inkSecondary,
  },
  emptyHint: {
    fontSize: FontSize.sm,
    color: Colors.inkMuted,
    textAlign: "center",
    maxWidth: 280,
    lineHeight: 20,
  },
});
