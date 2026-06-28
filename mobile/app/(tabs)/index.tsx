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
import { SectionHeader } from "@/components/SectionHeader";
import { PressableScale } from "@/components/PressableScale";
import { FadeInView } from "@/components/Motion";
import { haptic } from "@/lib/haptics";

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

  const recentActivity = [
    ...persons.slice(0, 2).map((p) => ({ id: p.id, type: "person" as const, name: p.primaryName, route: `/entity/person/${p.id}`, icon: "person" as const, color: Colors.person.icon, date: p.createdAt })),
    ...sources.slice(0, 2).map((s) => ({ id: s.id, type: "source" as const, name: s.title, route: `/source/${s.id}`, icon: "document-text" as const, color: Colors.accent, date: s.createdAt })),
    ...hypotheses.slice(0, 1).map((h) => ({ id: h.id, type: "hypothesis" as const, name: h.title, route: `/hypothesis/${h.id}`, icon: "bulb" as const, color: Colors.warning, date: h.createdAt })),
    ...places.slice(0, 1).map((p) => ({ id: p.id, type: "place" as const, name: p.name, route: `/entity/place/${p.id}`, icon: "location" as const, color: Colors.place.icon, date: p.createdAt })),
  ].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()).slice(0, 5);

  return (
    <View style={{ flex: 1 }}>
    <ScrollView
      style={styles.scroll}
      contentContainerStyle={[styles.content, { paddingTop: insets.top }]}
      refreshControl={
        <RefreshControl refreshing={loading} onRefresh={fetchAll} tintColor={Colors.accent} />
      }
    >
      {/* Hero header */}
      <View style={styles.hero}>
        <Text style={styles.heroWatermark} pointerEvents="none">أثر</Text>
        <View style={styles.heroTop}>
          <View style={{ flex: 1 }}>
            <Text style={styles.heroKicker}>L'ATELIER D'ENQUÊTE HISTORIQUE</Text>
            <Text style={styles.heroTitle}>Athar</Text>
            <View style={styles.heroRule} />
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
      <FadeInView delay={60} style={styles.actionsRow}>
        <PressableScale
          style={[styles.actionCard, styles.actionPrimary]}
          haptics="medium"
          onPress={() => router.push("/add/project" as never)}
        >
          <Ionicons name="folder-open" size={24} color={Colors.onAccent} />
          <Text style={styles.actionPrimaryText}>Nouveau dossier</Text>
        </PressableScale>
        <PressableScale
          style={styles.actionCard}
          onPress={() => router.push("/add/source" as never)}
        >
          <Ionicons name="document-text-outline" size={22} color={Colors.accent} />
          <Text style={styles.actionText}>Source</Text>
        </PressableScale>
        <PressableScale
          style={styles.actionCard}
          onPress={() => router.push("/add/person" as never)}
        >
          <Ionicons name="person-add-outline" size={22} color={Colors.person.icon} />
          <Text style={styles.actionText}>Personne</Text>
        </PressableScale>
      </FadeInView>

      {/* Secondary actions */}
      <FadeInView delay={120} style={styles.secondaryRow}>
        {[
          { icon: "analytics-outline" as const, label: "Analyse", route: "/analytics", color: Colors.danger },
          { icon: "compass-outline" as const, label: "Explorer", route: "/(tabs)/browse", color: Colors.group.icon },
          { icon: "git-network-outline" as const, label: "Réseau", route: "/network", color: "#F472B6" },
          { icon: "pricetags-outline" as const, label: "Tags", route: "/tags", color: Colors.accent },
        ].map((a) => (
          <PressableScale
            key={a.route}
            style={styles.secondaryBtn}
            haptics="selection"
            onPress={() => router.push(a.route as never)}
          >
            <View style={[styles.secondaryIcon, { backgroundColor: `${a.color}22` }]}>
              <Ionicons name={a.icon} size={18} color={a.color} />
            </View>
            <Text style={styles.secondaryLabel}>{a.label}</Text>
          </PressableScale>
        ))}
      </FadeInView>

      {/* Detailed stats */}
      <FadeInView delay={180} style={styles.statsGrid}>
        {[
          { label: "Personnes", count: persons.length, icon: "person" as const, color: Colors.person },
          { label: "Lieux", count: places.length, icon: "location" as const, color: Colors.place },
          { label: "Événements", count: events.length, icon: "calendar" as const, color: Colors.event },
          { label: "Groupes", count: groups.length, icon: "people" as const, color: Colors.group },
          { label: "Hypothèses", count: hypotheses.length, icon: "bulb" as const, color: { bg: "", icon: Colors.warning } },
          { label: "Contradictions", count: contradictions.length, icon: "git-compare-outline" as const, color: { bg: "", icon: Colors.danger } },
          { label: "Archives", count: archiveItems.length, icon: "camera" as const, color: { bg: "", icon: "#F472B6" } },
          { label: "Extraits", count: useResearchStore.getState().excerpts.length, icon: "reader" as const, color: { bg: "", icon: Colors.group.icon } },
        ].map((s) => (
          <View key={s.label} style={styles.statMini}>
            <View style={[styles.statMiniIcon, { backgroundColor: `${s.color.icon}22` }]}>
              <Ionicons name={s.icon as any} size={14} color={s.color.icon} />
            </View>
            <Text style={styles.statMiniCount}>{s.count}</Text>
            <Text style={styles.statMiniLabel}>{s.label}</Text>
          </View>
        ))}
      </FadeInView>

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
              <SectionHeader title="Dossiers récents" style={{ paddingHorizontal: Spacing.lg }} />
              {recentProjects.map((p) => (
                <PressableScale
                  key={p.id}
                  style={styles.projectCard}
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
                </PressableScale>
              ))}
            </>
          )}

          {/* Recent sources */}
          {recentSources.length > 0 && (
            <>
              <SectionHeader title="Sources récentes" style={{ paddingHorizontal: Spacing.lg }} />
              <View style={styles.listCard}>
                {recentSources.map((s, i) => (
                  <Pressable
                    key={s.id}
                    style={({ pressed }) => [styles.compactRow, i < recentSources.length - 1 && styles.compactBorder, pressed && styles.rowPressed]}
                    onPress={() => { haptic.selection(); router.push(`/source/${s.id}` as never); }}
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
          {recentActivity.length > 0 && (
            <>
              <SectionHeader title="Activité récente" style={{ paddingHorizontal: Spacing.lg }} />
              <View style={styles.listCard}>
                {recentActivity.map((item, i) => (
                  <Pressable
                    key={`${item.type}-${item.id}`}
                    style={({ pressed }) => [styles.activityRow, i < recentActivity.length - 1 && styles.activityBorder, pressed && styles.rowPressed]}
                    onPress={() => { haptic.selection(); router.push(item.route as never); }}
                  >
                    <View style={[styles.activityIcon, { backgroundColor: `${item.color}18` }]}>
                      <Ionicons name={item.icon} size={14} color={item.color} />
                    </View>
                    <View style={styles.activityText}>
                      <Text style={styles.activityName} numberOfLines={1}>{item.name}</Text>
                      <Text style={styles.activityDate}>
                        {new Date(item.date).toLocaleDateString("fr-FR", { day: "numeric", month: "short" })}
                      </Text>
                    </View>
                    <Ionicons name="chevron-forward" size={14} color={Colors.borderStrong} />
                  </Pressable>
                ))}
              </View>
            </>
          )}
        </>
      )}
    </ScrollView>

    {/* Floating quick note button */}
    <PressableScale
      style={styles.fab}
      haptics="medium"
      scaleTo={0.9}
      onPress={() => router.push("/add/note" as never)}
    >
      <Ionicons name="create" size={22} color={Colors.onAccent} />
    </PressableScale>
    </View>
  );
}

const styles = StyleSheet.create({
  scroll: { flex: 1, backgroundColor: Colors.surfaceSunken },
  content: { paddingBottom: Spacing.xxxl },

  // Hero
  hero: {
    backgroundColor: Colors.surfaceWarm,
    paddingHorizontal: Spacing.xl,
    paddingTop: Spacing.xl,
    paddingBottom: Spacing.xl,
    borderBottomLeftRadius: Radius.xxl,
    borderBottomRightRadius: Radius.xxl,
    borderBottomWidth: 1,
    borderColor: Colors.border,
    overflow: "hidden",
    ...Shadow.md,
  },
  heroWatermark: {
    position: "absolute",
    right: -24,
    top: -28,
    fontSize: 180,
    fontWeight: "800",
    color: Colors.accent,
    opacity: 0.05,
  },
  heroTop: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: Spacing.xl,
  },
  heroKicker: {
    fontSize: 10,
    fontWeight: "700",
    color: Colors.accent,
    letterSpacing: 2,
    marginBottom: Spacing.xs,
  },
  heroTitle: {
    fontSize: FontSize.hero,
    fontWeight: "800",
    color: Colors.ink,
    letterSpacing: -1.5,
  },
  heroRule: {
    width: 44,
    height: 3,
    borderRadius: Radius.full,
    backgroundColor: Colors.accent,
    marginTop: Spacing.md,
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
    borderWidth: 1,
    borderColor: Colors.accent,
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
    borderWidth: 1,
    borderColor: Colors.border,
    ...Shadow.sm,
  },
  actionPrimary: {
    backgroundColor: Colors.accent,
    borderColor: Colors.accent,
    flex: 1.5,
    ...Shadow.glow,
  },
  actionPressed: { opacity: 0.7, transform: [{ scale: 0.97 }] },
  actionPrimaryText: {
    fontSize: FontSize.xs,
    color: Colors.onAccent,
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
    gap: 3,
    backgroundColor: Colors.surface,
    borderRadius: Radius.lg,
    borderWidth: 1,
    borderColor: Colors.border,
    paddingVertical: Spacing.md,
    ...Shadow.sm,
  },
  statMiniIcon: {
    width: 28,
    height: 28,
    borderRadius: Radius.sm,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 1,
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
    borderWidth: 1,
    borderColor: Colors.border,
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
    borderWidth: 1,
    borderColor: Colors.border,
    ...Shadow.sm,
  },
  divider: {
    height: 1,
    backgroundColor: Colors.border,
    marginHorizontal: Spacing.lg,
  },
  fab: {
    position: "absolute",
    bottom: Spacing.xl,
    right: Spacing.xl,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: Colors.accent,
    alignItems: "center",
    justifyContent: "center",
    ...Shadow.lg,
  },

  rowPressed: { backgroundColor: Colors.surfaceRaised },
  activityRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.md,
    padding: Spacing.md,
    paddingHorizontal: Spacing.lg,
  },
  activityBorder: { borderBottomWidth: 1, borderBottomColor: Colors.border },
  activityIcon: {
    width: 32,
    height: 32,
    borderRadius: Radius.md,
    alignItems: "center",
    justifyContent: "center",
  },
  activityText: { flex: 1 },
  activityName: { fontSize: FontSize.sm, color: Colors.ink, fontWeight: "500" },
  activityDate: { fontSize: FontSize.xs, color: Colors.inkMuted, marginTop: 1 },

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
