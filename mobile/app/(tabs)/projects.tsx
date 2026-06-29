import { useState } from "react";
import { View, Text, FlatList, Pressable, StyleSheet, RefreshControl, ScrollView } from "react-native";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { Colors, FontSize, Spacing, Radius, Shadow } from "@/lib/theme";
import { useThemedStyles } from "@/lib/useTheme";
import { useResearchStore } from "@/stores/research-store";
import type { ResearchProject, ProjectStatus } from "@/types";

const STATUS_LABELS: Record<string, { label: string; color: string }> = {
  active: { label: "Actif", color: Colors.success },
  paused: { label: "En pause", color: Colors.warning },
  completed: { label: "Termine", color: Colors.accent },
  archived: { label: "Archive", color: Colors.inkMuted },
};

const FILTER_OPTIONS: { key: ProjectStatus | "all"; label: string }[] = [
  { key: "all", label: "Tous" },
  { key: "active", label: "Actifs" },
  { key: "paused", label: "En pause" },
  { key: "completed", label: "Termines" },
  { key: "archived", label: "Archives" },
];

function ProjectCard({ project, onPress }: { project: ResearchProject; onPress: () => void }) {
  const styles = useThemedStyles(makeStyles);
  const st = STATUS_LABELS[project.status] ?? STATUS_LABELS.active;
  return (
    <Pressable style={({ pressed }) => [styles.card, pressed && styles.cardPressed]} onPress={onPress}>
      <View style={styles.cardHeader}>
        <View style={styles.folderIcon}>
          <Ionicons name="folder" size={20} color={Colors.accent} />
        </View>
        <View style={styles.cardHeaderText}>
          <Text style={styles.cardTitle} numberOfLines={2}>{project.title}</Text>
          {project.periodStart && (
            <Text style={styles.cardPeriod}>
              {project.periodStart}{project.periodEnd ? ` — ${project.periodEnd}` : ""}
            </Text>
          )}
        </View>
        <View style={[styles.statusBadge, { backgroundColor: `${st.color}18` }]}>
          <View style={[styles.statusBadgeDot, { backgroundColor: st.color }]} />
          <Text style={[styles.statusBadgeText, { color: st.color }]}>{st.label}</Text>
        </View>
      </View>
      {project.researchQuestion ? (
        <Text style={styles.cardQuestion} numberOfLines={2}>
          {project.researchQuestion}
        </Text>
      ) : null}
      {project.tags.length > 0 && (
        <View style={styles.cardTags}>
          {project.tags.slice(0, 3).map((tag) => (
            <View key={tag} style={styles.tag}>
              <Text style={styles.tagText}>{tag}</Text>
            </View>
          ))}
        </View>
      )}
    </Pressable>
  );
}

export default function ProjectsScreen() {
  const styles = useThemedStyles(makeStyles);
  const router = useRouter();
  const { projects, fetchAll, loading } = useResearchStore();
  const [filter, setFilter] = useState<ProjectStatus | "all">("all");

  const statusCounts: Record<string, number> = {
    all: projects.length,
    active: 0,
    paused: 0,
    completed: 0,
    archived: 0,
  };
  for (const p of projects) {
    statusCounts[p.status] = (statusCounts[p.status] ?? 0) + 1;
  }

  const filtered = filter === "all" ? projects : projects.filter((p) => p.status === filter);

  return (
    <View style={styles.container}>
      <FlatList
        data={filtered}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <ProjectCard
            project={item}
            onPress={() => router.push(`/project/${item.id}` as never)}
          />
        )}
        contentContainerStyle={styles.list}
        refreshing={loading}
        onRefresh={fetchAll}
        ListEmptyComponent={() => (
          <View style={styles.emptyState}>
            <View style={styles.emptyIcon}>
              <Ionicons name="folder-open-outline" size={36} color={Colors.borderStrong} />
            </View>
            <Text style={styles.emptyTitle}>Aucun dossier</Text>
            <Text style={styles.emptyHint}>
              Creez votre premier dossier de recherche pour structurer votre enquete
            </Text>
            <Pressable
              style={styles.emptyBtn}
              onPress={() => router.push("/add/project" as never)}
            >
              <Ionicons name="add" size={18} color="white" />
              <Text style={styles.emptyBtnText}>Nouveau dossier</Text>
            </Pressable>
          </View>
        )}
        ListHeaderComponent={() => (
          <View>
            {projects.length > 0 && (
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.filterBar}
              >
                {FILTER_OPTIONS.map((opt) => {
                  const count = statusCounts[opt.key] ?? 0;
                  if (opt.key !== "all" && count === 0) return null;
                  const isActive = filter === opt.key;
                  return (
                    <Pressable
                      key={opt.key}
                      style={[styles.filterPill, isActive && styles.filterPillActive]}
                      onPress={() => setFilter(opt.key)}
                    >
                      <Text style={[styles.filterPillText, isActive && styles.filterPillTextActive]}>
                        {opt.label} ({count})
                      </Text>
                    </Pressable>
                  );
                })}
              </ScrollView>
            )}
            {projects.length > 0 ? (
              <Pressable
                style={styles.addBtn}
                onPress={() => router.push("/add/project" as never)}
              >
                <Ionicons name="add-circle-outline" size={18} color={Colors.accent} />
                <Text style={styles.addBtnText}>Nouveau dossier</Text>
              </Pressable>
            ) : null}
          </View>
        )}
      />
    </View>
  );
}

const makeStyles = () => StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.surfaceSunken },
  list: { padding: Spacing.lg, gap: Spacing.sm },

  filterBar: { gap: Spacing.sm, paddingBottom: Spacing.sm },
  filterPill: {
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.xs + 2,
    borderRadius: Radius.full,
    backgroundColor: Colors.surface,
    ...Shadow.sm,
  },
  filterPillActive: { backgroundColor: Colors.accentLight },
  filterPillText: { fontSize: FontSize.xs, color: Colors.inkMuted, fontWeight: "500" },
  filterPillTextActive: { color: Colors.accent, fontWeight: "600" },

  card: {
    backgroundColor: Colors.surface,
    borderRadius: Radius.lg,
    padding: Spacing.lg,
    gap: Spacing.sm,
    ...Shadow.sm,
  },
  cardPressed: { opacity: 0.7 },
  cardHeader: { flexDirection: "row", alignItems: "flex-start", gap: Spacing.md },
  folderIcon: {
    width: 36,
    height: 36,
    borderRadius: Radius.md,
    backgroundColor: Colors.accentLight,
    alignItems: "center",
    justifyContent: "center",
  },
  cardHeaderText: { flex: 1 },
  cardTitle: { fontSize: FontSize.base, fontWeight: "600", color: Colors.ink },
  cardPeriod: { fontSize: FontSize.xs, color: Colors.inkMuted, marginTop: 2 },
  statusBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    paddingHorizontal: Spacing.sm + 2,
    paddingVertical: 3,
    borderRadius: Radius.full,
  },
  statusBadgeDot: { width: 6, height: 6, borderRadius: 3 },
  statusBadgeText: { fontSize: FontSize.xs, fontWeight: "600" },
  cardQuestion: { fontSize: FontSize.sm, color: Colors.inkSecondary, lineHeight: 19, fontStyle: "italic" },
  cardTags: { flexDirection: "row", gap: Spacing.xs, marginTop: Spacing.xs },
  tag: { backgroundColor: Colors.accentLight, borderRadius: Radius.full, paddingHorizontal: Spacing.sm, paddingVertical: 2 },
  tagText: { fontSize: FontSize.xs, color: Colors.accent, fontWeight: "500" },

  addBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: Spacing.xs,
    paddingVertical: Spacing.md,
    marginBottom: Spacing.sm,
  },
  addBtnText: { fontSize: FontSize.sm, color: Colors.accent, fontWeight: "600" },

  emptyState: { alignItems: "center", gap: Spacing.sm, paddingVertical: Spacing.xxxl },
  emptyIcon: {
    width: 72,
    height: 72,
    borderRadius: Radius.full,
    backgroundColor: Colors.surfaceSunken,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: Spacing.sm,
  },
  emptyTitle: { fontSize: FontSize.lg, fontWeight: "600", color: Colors.inkSecondary },
  emptyHint: { fontSize: FontSize.sm, color: Colors.inkMuted, textAlign: "center", maxWidth: 260, lineHeight: 20 },
  emptyBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.xs,
    backgroundColor: Colors.accent,
    borderRadius: Radius.lg,
    paddingHorizontal: Spacing.xl,
    paddingVertical: Spacing.md,
    marginTop: Spacing.md,
    ...Shadow.md,
  },
  emptyBtnText: { color: "white", fontWeight: "600", fontSize: FontSize.sm },
});
