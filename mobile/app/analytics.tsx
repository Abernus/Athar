import { useMemo } from "react";
import {
  ScrollView,
  View,
  Text,
  Pressable,
  StyleSheet,
} from "react-native";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { Colors, FontSize, Spacing, Radius, Shadow } from "@/lib/theme";
import { useThemedStyles } from "@/lib/useTheme";
import { useResearchStore } from "@/stores/research-store";
import { getEntityName } from "@/types";
import { CONFIDENCE_LABELS } from "@/lib/constants";

export default function AnalyticsScreen() {
  const styles = useThemedStyles(makeStyles);
  const router = useRouter();
  const {
    persons, groups, places, events, sources, hypotheses,
    relationships, excerpts, contradictions, evidenceChains,
    witnesses, entityAliases, getResearchGaps, detectDuplicates,
  } = useResearchStore();

  const gaps = useMemo(() => getResearchGaps(), [
    persons, groups, places, events, sources, hypotheses, relationships, excerpts,
  ]);

  const duplicates = useMemo(() => detectDuplicates(), [
    persons, groups, places, events, entityAliases,
  ]);

  const totalEntities = persons.length + groups.length + places.length + events.length;
  const totalExcerpts = excerpts.length;
  const proofExcerpts = excerpts.filter((e) => e.classification === "proof").length;
  const contradictionExcerpts = excerpts.filter((e) => e.classification === "contradiction").length;

  const confidenceDist = {
    confirmed: relationships.filter((r) => r.confidenceLevel === "confirmed").length,
    probable: relationships.filter((r) => r.confidenceLevel === "probable").length,
    uncertain: relationships.filter((r) => r.confidenceLevel === "uncertain").length,
    contested: relationships.filter((r) => r.confidenceLevel === "contested").length,
  };

  return (
    <ScrollView style={styles.scroll} contentContainerStyle={styles.content}>
      {/* Overview */}
      <Text style={styles.sectionTitle}>Vue d'ensemble</Text>
      <View style={styles.overviewGrid}>
        <View style={styles.overviewCard}>
          <Text style={styles.overviewValue}>{totalEntities}</Text>
          <Text style={styles.overviewLabel}>Entités</Text>
        </View>
        <View style={styles.overviewCard}>
          <Text style={styles.overviewValue}>{relationships.length}</Text>
          <Text style={styles.overviewLabel}>Relations</Text>
        </View>
        <View style={styles.overviewCard}>
          <Text style={styles.overviewValue}>{sources.length}</Text>
          <Text style={styles.overviewLabel}>Sources</Text>
        </View>
        <View style={styles.overviewCard}>
          <Text style={styles.overviewValue}>{totalExcerpts}</Text>
          <Text style={styles.overviewLabel}>Extraits</Text>
        </View>
      </View>

      {/* Evidence quality */}
      <Text style={styles.sectionTitle}>Qualité des preuves</Text>
      <View style={styles.card}>
        <View style={styles.barRow}>
          <Text style={styles.barLabel}>Preuves établies</Text>
          <View style={styles.barTrack}>
            <View style={[styles.barFill, { width: `${totalExcerpts ? (proofExcerpts / totalExcerpts * 100) : 0}%`, backgroundColor: Colors.success }]} />
          </View>
          <Text style={styles.barValue}>{proofExcerpts}</Text>
        </View>
        <View style={styles.barRow}>
          <Text style={styles.barLabel}>Contradictions</Text>
          <View style={styles.barTrack}>
            <View style={[styles.barFill, { width: `${totalExcerpts ? (contradictionExcerpts / totalExcerpts * 100) : 0}%`, backgroundColor: Colors.danger }]} />
          </View>
          <Text style={styles.barValue}>{contradictionExcerpts}</Text>
        </View>
        <View style={styles.separator} />
        <Text style={styles.miniTitle}>Confiance des relations</Text>
        {Object.entries(confidenceDist).map(([key, count]) => (
          <View key={key} style={styles.barRow}>
            <Text style={styles.barLabel}>{CONFIDENCE_LABELS[key as keyof typeof CONFIDENCE_LABELS]}</Text>
            <View style={styles.barTrack}>
              <View style={[styles.barFill, {
                width: `${relationships.length ? (count / relationships.length * 100) : 0}%`,
                backgroundColor: key === "confirmed" ? Colors.success : key === "probable" ? "#3B82F6" : key === "uncertain" ? Colors.warning : Colors.danger,
              }]} />
            </View>
            <Text style={styles.barValue}>{count}</Text>
          </View>
        ))}
      </View>

      {/* Research gaps */}
      <Text style={styles.sectionTitle}>Zones d'ombre</Text>
      <View style={styles.gapGrid}>
        <Pressable
          style={[styles.gapCard, { borderLeftColor: Colors.warning }]}
          onPress={() => router.push("/(tabs)/browse" as never)}
        >
          <Text style={styles.gapValue}>{gaps.entitiesWithoutSources.length}</Text>
          <Text style={styles.gapLabel}>Entités sans source</Text>
          <Text style={styles.gapHint}>Non documentées</Text>
        </Pressable>
        <Pressable
          style={[styles.gapCard, { borderLeftColor: Colors.danger }]}
          onPress={() => router.push("/(tabs)/browse" as never)}
        >
          <Text style={styles.gapValue}>{gaps.entitiesIsolated.length}</Text>
          <Text style={styles.gapLabel}>Entités isolées</Text>
          <Text style={styles.gapHint}>Aucune relation</Text>
        </Pressable>
        <Pressable
          style={[styles.gapCard, { borderLeftColor: "#3B82F6" }]}
          onPress={() => router.push("/(tabs)/browse" as never)}
        >
          <Text style={styles.gapValue}>{gaps.hypothesesUnverified.length}</Text>
          <Text style={styles.gapLabel}>Hypothèses ouvertes</Text>
          <Text style={styles.gapHint}>Non argumentées</Text>
        </Pressable>
        <Pressable
          style={[styles.gapCard, { borderLeftColor: Colors.inkMuted }]}
          onPress={() => router.push("/(tabs)/browse" as never)}
        >
          <Text style={styles.gapValue}>{gaps.sourcesLowReliability.length}</Text>
          <Text style={styles.gapLabel}>Sources fragiles</Text>
          <Text style={styles.gapHint}>Fiabilité basse/inconnue</Text>
        </Pressable>
      </View>

      {/* Duplicates */}
      {duplicates.length > 0 && (
        <>
          <Text style={styles.sectionTitle}>Doublons potentiels</Text>
          <View style={styles.card}>
            {duplicates.slice(0, 8).map(({ a, b, reason }, i) => (
              <View key={`${a.id}-${b.id}`} style={[styles.dupRow, i < Math.min(duplicates.length, 8) - 1 && { borderBottomWidth: 1, borderBottomColor: Colors.border }]}>
                <View style={styles.dupEntities}>
                  <Pressable onPress={() => router.push(`/entity/${a.entityType}/${a.id}` as never)}>
                    <Text style={styles.dupName}>{getEntityName(a)}</Text>
                  </Pressable>
                  <Ionicons name="swap-horizontal" size={14} color={Colors.inkMuted} />
                  <Pressable onPress={() => router.push(`/entity/${b.entityType}/${b.id}` as never)}>
                    <Text style={styles.dupName}>{getEntityName(b)}</Text>
                  </Pressable>
                </View>
                <Text style={styles.dupReason}>{reason}</Text>
              </View>
            ))}
            {duplicates.length > 8 && (
              <Text style={styles.dupMore}>+{duplicates.length - 8} autres doublons potentiels</Text>
            )}
          </View>
        </>
      )}

      {/* Coverage stats */}
      <Text style={styles.sectionTitle}>Couverture</Text>
      <View style={styles.card}>
        <View style={styles.coverRow}>
          <View style={styles.coverDot}>
            <Ionicons name="person" size={14} color={Colors.person.icon} />
          </View>
          <Text style={styles.coverLabel}>Personnes</Text>
          <Text style={styles.coverValue}>{persons.length}</Text>
          <Text style={styles.coverAliases}>+{entityAliases.filter((a) => a.entityType === "person").length} aliases</Text>
        </View>
        <View style={styles.coverRow}>
          <View style={styles.coverDot}>
            <Ionicons name="location" size={14} color={Colors.place.icon} />
          </View>
          <Text style={styles.coverLabel}>Lieux</Text>
          <Text style={styles.coverValue}>{places.length}</Text>
          <Text style={styles.coverAliases}>+{entityAliases.filter((a) => a.entityType === "place").length} aliases</Text>
        </View>
        <View style={styles.coverRow}>
          <View style={styles.coverDot}>
            <Ionicons name="calendar" size={14} color={Colors.event.icon} />
          </View>
          <Text style={styles.coverLabel}>Événements</Text>
          <Text style={styles.coverValue}>{events.length}</Text>
          <Text style={styles.coverAliases}>{events.filter((e) => e.dateStart).length} datés</Text>
        </View>
        <View style={styles.coverRow}>
          <View style={styles.coverDot}>
            <Ionicons name="people" size={14} color={Colors.group.icon} />
          </View>
          <Text style={styles.coverLabel}>Groupes</Text>
          <Text style={styles.coverValue}>{groups.length}</Text>
          <Text style={styles.coverAliases}>+{entityAliases.filter((a) => a.entityType === "group").length} aliases</Text>
        </View>
        <View style={styles.separator} />
        <View style={styles.coverRow}>
          <View style={styles.coverDot}>
            <Ionicons name="git-compare-outline" size={14} color={Colors.warning} />
          </View>
          <Text style={styles.coverLabel}>Contradictions</Text>
          <Text style={styles.coverValue}>{contradictions.length}</Text>
          <Text style={styles.coverAliases}>{contradictions.filter((c) => c.status === "resolved").length} résolues</Text>
        </View>
        <View style={styles.coverRow}>
          <View style={styles.coverDot}>
            <Ionicons name="link" size={14} color={Colors.accent} />
          </View>
          <Text style={styles.coverLabel}>Chaînes de preuve</Text>
          <Text style={styles.coverValue}>{evidenceChains.length}</Text>
          <Text style={styles.coverAliases}>{evidenceChains.filter((e) => e.claimStatus === "supported").length} étayées</Text>
        </View>
        <View style={styles.coverRow}>
          <View style={styles.coverDot}>
            <Ionicons name="person-circle" size={14} color={Colors.success} />
          </View>
          <Text style={styles.coverLabel}>Témoins</Text>
          <Text style={styles.coverValue}>{witnesses.length}</Text>
          <Text style={styles.coverAliases}>{witnesses.filter((w) => w.consentStatus === "obtained").length} consentis</Text>
        </View>
      </View>
    </ScrollView>
  );
}

const makeStyles = () => StyleSheet.create({
  scroll: { flex: 1, backgroundColor: Colors.surfaceSunken },
  content: { padding: Spacing.lg, paddingBottom: Spacing.xxxl },

  sectionTitle: {
    fontSize: FontSize.sm,
    fontWeight: "700",
    color: Colors.ink,
    textTransform: "uppercase",
    letterSpacing: 0.8,
    marginTop: Spacing.xl,
    marginBottom: Spacing.sm,
  },

  overviewGrid: { flexDirection: "row", gap: Spacing.sm },
  overviewCard: {
    flex: 1,
    backgroundColor: Colors.surface,
    borderRadius: Radius.lg,
    padding: Spacing.md,
    alignItems: "center",
    ...Shadow.md,
  },
  overviewValue: { fontSize: FontSize.xxl, fontWeight: "800", color: Colors.ink },
  overviewLabel: { fontSize: 10, color: Colors.inkMuted, marginTop: 2 },

  card: {
    backgroundColor: Colors.surface,
    borderRadius: Radius.lg,
    padding: Spacing.lg,
    ...Shadow.sm,
  },

  barRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.sm,
    marginBottom: Spacing.sm,
  },
  barLabel: { width: 90, fontSize: FontSize.xs, color: Colors.inkSecondary },
  barTrack: {
    flex: 1,
    height: 6,
    backgroundColor: Colors.surfaceSunken,
    borderRadius: 3,
    overflow: "hidden",
  },
  barFill: { height: 6, borderRadius: 3, minWidth: 2 },
  barValue: { width: 24, fontSize: FontSize.xs, color: Colors.inkMuted, textAlign: "right", fontWeight: "600" },

  separator: { height: 1, backgroundColor: Colors.border, marginVertical: Spacing.md },
  miniTitle: { fontSize: FontSize.xs, color: Colors.inkMuted, fontWeight: "600", marginBottom: Spacing.sm, textTransform: "uppercase", letterSpacing: 0.5 },

  gapGrid: { flexDirection: "row", flexWrap: "wrap", gap: Spacing.sm },
  gapCard: {
    width: "48%",
    flexGrow: 1,
    backgroundColor: Colors.surface,
    borderRadius: Radius.lg,
    padding: Spacing.md,
    borderLeftWidth: 3,
    ...Shadow.sm,
  },
  gapValue: { fontSize: FontSize.xl, fontWeight: "800", color: Colors.ink },
  gapLabel: { fontSize: FontSize.xs, color: Colors.inkSecondary, fontWeight: "600", marginTop: 2 },
  gapHint: { fontSize: 10, color: Colors.inkMuted, marginTop: 1 },

  coverRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.sm,
    paddingVertical: Spacing.xs + 2,
  },
  coverDot: {
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: Colors.surfaceSunken,
    alignItems: "center",
    justifyContent: "center",
  },
  coverLabel: { flex: 1, fontSize: FontSize.sm, color: Colors.ink },
  coverValue: { fontSize: FontSize.base, fontWeight: "700", color: Colors.ink },
  coverAliases: { fontSize: FontSize.xs, color: Colors.inkMuted, width: 70, textAlign: "right" },

  dupRow: { paddingVertical: Spacing.md },
  dupEntities: { flexDirection: "row", alignItems: "center", gap: Spacing.sm },
  dupName: { fontSize: FontSize.sm, color: Colors.accent, fontWeight: "600" },
  dupReason: { fontSize: FontSize.xs, color: Colors.inkMuted, marginTop: 2 },
  dupMore: { fontSize: FontSize.xs, color: Colors.inkMuted, textAlign: "center", marginTop: Spacing.sm },
});
