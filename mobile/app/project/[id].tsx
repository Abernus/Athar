import {
  ScrollView,
  View,
  Text,
  Pressable,
  StyleSheet,
  Alert,
} from "react-native";
import { useLocalSearchParams, useNavigation, useRouter } from "expo-router";
import { useEffect } from "react";
import { Ionicons } from "@expo/vector-icons";
import { Colors, FontSize, Spacing, Radius, Shadow } from "@/lib/theme";
import { useResearchStore } from "@/stores/research-store";
import { Card } from "@/components/Card";
import { EntityRow } from "@/components/EntityRow";
import { SectionHeader } from "@/components/SectionHeader";

const STATUS_LABELS: Record<string, string> = {
  active: "Actif",
  paused: "En pause",
  completed: "Terminé",
  archived: "Archivé",
};

export default function ProjectDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const navigation = useNavigation();
  const router = useRouter();
  const { projects, sources, hypotheses, researchNotes, getAllEntities, deleteProject } =
    useResearchStore();

  const project = projects.find((p) => p.id === id);
  const projectNotes = researchNotes.filter((n) => n.projectId === id);
  const allEntities = getAllEntities();

  useEffect(() => {
    if (project) navigation.setOptions({ title: project.title });
  }, [project]);

  if (!project) {
    return (
      <View style={styles.notFound}>
        <Text style={styles.notFoundText}>Dossier introuvable.</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.scroll} contentContainerStyle={styles.content}>
      <Card>
        <View style={styles.header}>
          <View style={styles.folderIcon}>
            <Ionicons name="folder" size={22} color={Colors.accent} />
          </View>
          <View style={styles.headerText}>
            <Text style={styles.title}>{project.title}</Text>
            <Text style={styles.status}>{STATUS_LABELS[project.status]}</Text>
          </View>
        </View>

        {(project.periodStart || project.geographicScope) && (
          <View style={styles.metaRow}>
            {project.periodStart && (
              <View style={styles.metaItem}>
                <Text style={styles.metaLabel}>Période</Text>
                <Text style={styles.metaValue}>
                  {project.periodStart}
                  {project.periodEnd ? ` — ${project.periodEnd}` : ""}
                </Text>
              </View>
            )}
            {project.geographicScope ? (
              <View style={styles.metaItem}>
                <Text style={styles.metaLabel}>Géographie</Text>
                <Text style={styles.metaValue}>{project.geographicScope}</Text>
              </View>
            ) : null}
          </View>
        )}

        {project.researchQuestion ? (
          <>
            <Text style={styles.qLabel}>Question de recherche</Text>
            <Text style={styles.question}>{project.researchQuestion}</Text>
          </>
        ) : null}

        {project.summary ? (
          <Text style={styles.summary}>{project.summary}</Text>
        ) : null}

        {project.tags.length > 0 && (
          <View style={styles.tags}>
            {project.tags.map((tag) => (
              <View key={tag} style={styles.tag}>
                <Text style={styles.tagText}>{tag}</Text>
              </View>
            ))}
          </View>
        )}
      </Card>

      {/* Quick actions */}
      <View style={styles.actionsRow}>
        <Pressable
          style={styles.actionBtn}
          onPress={() => router.push(`/add/project?editId=${id}` as never)}
        >
          <Ionicons name="create-outline" size={18} color={Colors.accent} />
          <Text style={styles.actionBtnText}>Modifier</Text>
        </Pressable>
        <Pressable
          style={styles.actionBtn}
          onPress={() => router.push("/add/source" as never)}
        >
          <Ionicons name="document-text-outline" size={18} color={Colors.accent} />
          <Text style={styles.actionBtnText}>Source</Text>
        </Pressable>
        <Pressable
          style={styles.actionBtn}
          onPress={() => router.push("/add/hypothesis" as never)}
        >
          <Ionicons name="bulb-outline" size={18} color={Colors.accent} />
          <Text style={styles.actionBtnText}>Hypothèse</Text>
        </Pressable>
        <Pressable
          style={styles.actionBtn}
          onPress={() => router.push(`/add/note?projectId=${id}` as never)}
        >
          <Ionicons name="create-outline" size={18} color={Colors.accent} />
          <Text style={styles.actionBtnText}>Note</Text>
        </Pressable>
      </View>

      {/* Export */}
      <Pressable
        style={styles.exportBtn}
        onPress={() => router.push(`/export/project?id=${id}` as never)}
      >
        <Ionicons name="share-outline" size={18} color={Colors.accent} />
        <Text style={styles.exportBtnText}>Exporter ce dossier</Text>
      </Pressable>

      {/* Sources */}
      {sources.length > 0 && (
        <>
          <SectionHeader title={`Sources (${sources.length})`} />
          <View style={styles.listCard}>
            {sources.slice(0, 5).map((src, i) => (
              <Pressable
                key={src.id}
                style={[styles.srcRow, i < Math.min(sources.length, 5) - 1 && styles.srcBorder]}
                onPress={() => router.push(`/source/${src.id}` as never)}
              >
                <Ionicons name="document-text" size={16} color={Colors.inkMuted} />
                <View style={styles.srcText}>
                  <Text style={styles.srcTitle} numberOfLines={1}>{src.title}</Text>
                  <Text style={styles.srcType}>{src.sourceType}</Text>
                </View>
                <Ionicons name="chevron-forward" size={14} color={Colors.borderStrong} />
              </Pressable>
            ))}
          </View>
        </>
      )}

      {/* Hypotheses */}
      {hypotheses.length > 0 && (
        <>
          <SectionHeader title={`Hypothèses (${hypotheses.length})`} />
          <View style={styles.listCard}>
            {hypotheses.slice(0, 5).map((hyp, i) => (
              <Pressable
                key={hyp.id}
                style={[styles.srcRow, i < Math.min(hypotheses.length, 5) - 1 && styles.srcBorder]}
                onPress={() => router.push(`/hypothesis/${hyp.id}` as never)}
              >
                <Ionicons name="bulb" size={16} color={Colors.warning} />
                <View style={styles.srcText}>
                  <Text style={styles.srcTitle} numberOfLines={1}>{hyp.title}</Text>
                  <Text style={styles.srcType}>{hyp.status} · {hyp.confidenceLevel}</Text>
                </View>
                <Ionicons name="chevron-forward" size={14} color={Colors.borderStrong} />
              </Pressable>
            ))}
          </View>
        </>
      )}

      {/* Notes */}
      {projectNotes.length > 0 && (
        <>
          <SectionHeader title={`Notes (${projectNotes.length})`} />
          <View style={styles.listCard}>
            {projectNotes.map((note, i) => (
              <View
                key={note.id}
                style={[styles.noteRow, i < projectNotes.length - 1 && styles.srcBorder]}
              >
                <Text style={styles.noteContent} numberOfLines={3}>
                  {note.content}
                </Text>
                <Text style={styles.noteDate}>
                  {new Date(note.createdAt).toLocaleDateString("fr-FR")}
                </Text>
              </View>
            ))}
          </View>
        </>
      )}

      {/* Delete */}
      <Pressable
        style={styles.deleteBtn}
        onPress={() =>
          Alert.alert("Supprimer", `Supprimer le dossier "${project.title}" ?`, [
            { text: "Annuler", style: "cancel" },
            {
              text: "Supprimer",
              style: "destructive",
              onPress: async () => {
                await deleteProject(id);
                router.back();
              },
            },
          ])
        }
      >
        <Ionicons name="trash-outline" size={16} color={Colors.danger} />
        <Text style={styles.deleteBtnText}>Supprimer ce dossier</Text>
      </Pressable>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scroll: { flex: 1, backgroundColor: Colors.surfaceSunken },
  content: { padding: Spacing.lg, paddingBottom: Spacing.xxxl, gap: Spacing.sm },
  notFound: { flex: 1, alignItems: "center", justifyContent: "center" },
  notFoundText: { fontSize: FontSize.base, color: Colors.inkMuted },

  header: { flexDirection: "row", alignItems: "center", gap: Spacing.md, marginBottom: Spacing.md },
  folderIcon: {
    width: 44,
    height: 44,
    borderRadius: Radius.lg,
    backgroundColor: Colors.accentLight,
    alignItems: "center",
    justifyContent: "center",
  },
  headerText: { flex: 1 },
  title: { fontSize: FontSize.xl, fontWeight: "700", color: Colors.ink },
  status: { fontSize: FontSize.xs, color: Colors.inkMuted, marginTop: 2, textTransform: "uppercase", letterSpacing: 0.5 },

  metaRow: { flexDirection: "row", gap: Spacing.xl, marginBottom: Spacing.md, paddingTop: Spacing.md, borderTopWidth: 1, borderTopColor: Colors.border },
  metaItem: {},
  metaLabel: { fontSize: FontSize.xs, color: Colors.inkMuted, textTransform: "uppercase", letterSpacing: 0.5, marginBottom: 2 },
  metaValue: { fontSize: FontSize.sm, color: Colors.ink, fontWeight: "500" },

  qLabel: { fontSize: FontSize.xs, color: Colors.inkMuted, textTransform: "uppercase", letterSpacing: 0.5, marginTop: Spacing.md },
  question: { fontSize: FontSize.sm, color: Colors.inkSecondary, fontStyle: "italic", lineHeight: 20, marginTop: Spacing.xs },
  summary: { fontSize: FontSize.sm, color: Colors.inkSecondary, lineHeight: 20, marginTop: Spacing.md, paddingTop: Spacing.md, borderTopWidth: 1, borderTopColor: Colors.border },

  tags: { flexDirection: "row", flexWrap: "wrap", gap: Spacing.xs, marginTop: Spacing.lg },
  tag: { backgroundColor: Colors.accentLight, borderRadius: Radius.full, paddingHorizontal: Spacing.sm + 2, paddingVertical: 4 },
  tagText: { fontSize: FontSize.xs, color: Colors.accent, fontWeight: "500" },

  exportBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: Spacing.sm,
    padding: Spacing.md,
    borderRadius: Radius.lg,
    backgroundColor: Colors.accentLight,
    marginTop: Spacing.sm,
  },
  exportBtnText: { fontSize: FontSize.sm, color: Colors.accent, fontWeight: "600" },
  actionsRow: { flexDirection: "row", gap: Spacing.sm, marginTop: Spacing.sm },
  actionBtn: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: Spacing.xs,
    backgroundColor: Colors.accentLight,
    borderRadius: Radius.lg,
    paddingVertical: Spacing.md,
  },
  actionBtnText: { fontSize: FontSize.sm, color: Colors.accent, fontWeight: "600" },

  listCard: { backgroundColor: Colors.surface, borderRadius: Radius.lg, overflow: "hidden", ...Shadow.sm },
  srcRow: { flexDirection: "row", alignItems: "center", gap: Spacing.md, padding: Spacing.lg },
  srcBorder: { borderBottomWidth: 1, borderBottomColor: Colors.border },
  srcText: { flex: 1 },
  srcTitle: { fontSize: FontSize.sm, color: Colors.ink, fontWeight: "500" },
  srcType: { fontSize: FontSize.xs, color: Colors.inkMuted, marginTop: 1 },

  noteRow: { padding: Spacing.lg },
  noteContent: { fontSize: FontSize.sm, color: Colors.inkSecondary, lineHeight: 19 },
  noteDate: { fontSize: FontSize.xs, color: Colors.inkMuted, marginTop: Spacing.xs },

  deleteBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: Spacing.sm,
    marginTop: Spacing.xxl,
    padding: Spacing.lg,
    borderRadius: Radius.lg,
    backgroundColor: Colors.dangerLight,
  },
  deleteBtnText: { fontSize: FontSize.sm, color: Colors.danger, fontWeight: "600" },
});
