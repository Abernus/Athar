import { View, Text, FlatList, Pressable, StyleSheet, RefreshControl } from "react-native";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { Colors, FontSize, Spacing, Radius, Shadow } from "@/lib/theme";
import { useResearchStore } from "@/stores/research-store";
import type { ResearchProject } from "@/types";

const STATUS_LABELS: Record<string, { label: string; color: string }> = {
  active: { label: "Actif", color: Colors.success },
  paused: { label: "En pause", color: Colors.warning },
  completed: { label: "Terminé", color: Colors.accent },
  archived: { label: "Archivé", color: Colors.inkMuted },
};

function ProjectCard({ project, onPress }: { project: ResearchProject; onPress: () => void }) {
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
        <View style={[styles.statusDot, { backgroundColor: st.color }]} />
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
  const router = useRouter();
  const { projects, fetchAll, loading } = useResearchStore();

  return (
    <View style={styles.container}>
      <FlatList
        data={projects}
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
              Créez votre premier dossier de recherche pour structurer votre enquête
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
          projects.length > 0 ? (
            <Pressable
              style={styles.addBtn}
              onPress={() => router.push("/add/project" as never)}
            >
              <Ionicons name="add-circle-outline" size={18} color={Colors.accent} />
              <Text style={styles.addBtnText}>Nouveau dossier</Text>
            </Pressable>
          ) : null
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.surfaceSunken },
  list: { padding: Spacing.lg, gap: Spacing.sm },

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
  statusDot: { width: 8, height: 8, borderRadius: 4, marginTop: 6 },
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
