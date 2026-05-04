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
import { SectionHeader } from "@/components/SectionHeader";
import { SOURCE_TYPE_LABELS } from "@/lib/constants";

const RELIABILITY_LABELS: Record<string, string> = {
  high: "Haute",
  medium: "Moyenne",
  low: "Basse",
  unknown: "Inconnue",
};

const CLASSIFICATION_LABELS: Record<string, { label: string; color: string }> = {
  proof: { label: "Preuve", color: Colors.success },
  clue: { label: "Indice", color: Colors.accent },
  context: { label: "Contexte", color: Colors.inkMuted },
  contradiction: { label: "Contradiction", color: Colors.warning },
  doubt: { label: "Doute", color: Colors.danger },
};

export default function SourceDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const navigation = useNavigation();
  const router = useRouter();
  const { sources, excerpts, deleteSource, addExcerpt } = useResearchStore();

  const source = sources.find((s) => s.id === id);
  const sourceExcerpts = excerpts.filter((e) => e.sourceId === id);

  useEffect(() => {
    if (source) navigation.setOptions({ title: source.title });
  }, [source]);

  if (!source) {
    return (
      <View style={styles.notFound}>
        <Text style={styles.notFoundText}>Source introuvable.</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.scroll} contentContainerStyle={styles.content}>
      {/* Header */}
      <Card>
        <View style={styles.header}>
          <View style={styles.docIcon}>
            <Ionicons name="document-text" size={22} color={Colors.accent} />
          </View>
          <View style={styles.headerText}>
            <Text style={styles.title}>{source.title}</Text>
            <Text style={styles.type}>{SOURCE_TYPE_LABELS[source.sourceType]}</Text>
          </View>
        </View>

        {/* Metadata grid */}
        <View style={styles.metaGrid}>
          {source.authorName ? (
            <View style={styles.metaItem}>
              <Text style={styles.metaLabel}>Auteur</Text>
              <Text style={styles.metaValue}>{source.authorName}</Text>
            </View>
          ) : null}
          {source.origin ? (
            <View style={styles.metaItem}>
              <Text style={styles.metaLabel}>Provenance</Text>
              <Text style={styles.metaValue}>{source.origin}</Text>
            </View>
          ) : null}
          {source.archiveReference ? (
            <View style={styles.metaItem}>
              <Text style={styles.metaLabel}>Cote</Text>
              <Text style={styles.metaValue}>{source.archiveReference}</Text>
            </View>
          ) : null}
          {source.archiveFund ? (
            <View style={styles.metaItem}>
              <Text style={styles.metaLabel}>Fonds</Text>
              <Text style={styles.metaValue}>{source.archiveFund}</Text>
            </View>
          ) : null}
          {source.repositoryName ? (
            <View style={styles.metaItem}>
              <Text style={styles.metaLabel}>Conservation</Text>
              <Text style={styles.metaValue}>{source.repositoryName}</Text>
            </View>
          ) : null}
          {source.language ? (
            <View style={styles.metaItem}>
              <Text style={styles.metaLabel}>Langue</Text>
              <Text style={styles.metaValue}>{source.language}</Text>
            </View>
          ) : null}
          {source.reliabilityLevel && source.reliabilityLevel !== "unknown" ? (
            <View style={styles.metaItem}>
              <Text style={styles.metaLabel}>Fiabilité</Text>
              <Text style={styles.metaValue}>
                {RELIABILITY_LABELS[source.reliabilityLevel]}
              </Text>
            </View>
          ) : null}
        </View>

        {source.summary ? (
          <Text style={styles.summary}>{source.summary}</Text>
        ) : null}

        {source.biasNotes ? (
          <>
            <Text style={styles.biasLabel}>Biais / Réserves</Text>
            <Text style={styles.biasText}>{source.biasNotes}</Text>
          </>
        ) : null}

        {source.tags.length > 0 && (
          <View style={styles.tags}>
            {source.tags.map((tag) => (
              <View key={tag} style={styles.tag}>
                <Text style={styles.tagText}>{tag}</Text>
              </View>
            ))}
          </View>
        )}
      </Card>

      {/* Excerpts */}
      <SectionHeader title={`Extraits (${sourceExcerpts.length})`} />

      {sourceExcerpts.length > 0 ? (
        <View style={styles.listCard}>
          {sourceExcerpts.map((exc, i) => {
            const cls = CLASSIFICATION_LABELS[exc.classification] ?? CLASSIFICATION_LABELS.context;
            return (
              <View
                key={exc.id}
                style={[styles.excerptRow, i < sourceExcerpts.length - 1 && styles.excerptBorder]}
              >
                <View style={styles.excerptHeader}>
                  <View style={[styles.classificationDot, { backgroundColor: cls.color }]} />
                  <Text style={styles.classificationLabel}>{cls.label}</Text>
                  {exc.pageOrLocation ? (
                    <Text style={styles.excerptLoc}>{exc.pageOrLocation}</Text>
                  ) : null}
                </View>
                <Text style={styles.excerptText} numberOfLines={4}>
                  {exc.selectedText || exc.excerptSummary}
                </Text>
                {exc.notes ? (
                  <Text style={styles.excerptNote}>{exc.notes}</Text>
                ) : null}
              </View>
            );
          })}
        </View>
      ) : (
        <Card>
          <Text style={styles.emptyText}>
            Aucun extrait. Ajoutez des passages clés de cette source.
          </Text>
        </Card>
      )}

      {/* Edit source button */}
      <Pressable
        style={styles.addExcerptBtn}
        onPress={() => router.push(`/add/source?editId=${id}` as never)}
      >
        <Ionicons name="create-outline" size={18} color={Colors.accent} />
        <Text style={styles.addExcerptText}>Modifier cette source</Text>
      </Pressable>

      {/* Add excerpt button */}
      <Pressable
        style={styles.addExcerptBtn}
        onPress={() => {
          Alert.prompt
            ? Alert.prompt("Nouvel extrait", "Texte de l'extrait :", (text) => {
                if (text?.trim()) {
                  addExcerpt({
                    sourceId: id,
                    excerptType: "text",
                    selectedText: text.trim(),
                    pageOrLocation: "",
                    excerptSummary: "",
                    classification: "context",
                    importance: "normal",
                    tags: [],
                    notes: "",
                  });
                }
              })
            : Alert.alert(
                "Nouvel extrait",
                "La saisie d'extraits sera améliorée dans une prochaine version."
              );
        }}
      >
        <Ionicons name="add-circle-outline" size={18} color={Colors.accent} />
        <Text style={styles.addExcerptText}>Ajouter un extrait</Text>
      </Pressable>

      {/* Delete */}
      <Pressable
        style={styles.deleteBtn}
        onPress={() =>
          Alert.alert("Supprimer", `Supprimer "${source.title}" et ses extraits ?`, [
            { text: "Annuler", style: "cancel" },
            {
              text: "Supprimer",
              style: "destructive",
              onPress: async () => {
                await deleteSource(id);
                router.back();
              },
            },
          ])
        }
      >
        <Ionicons name="trash-outline" size={16} color={Colors.danger} />
        <Text style={styles.deleteBtnText}>Supprimer cette source</Text>
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
  docIcon: {
    width: 44,
    height: 44,
    borderRadius: Radius.lg,
    backgroundColor: Colors.accentLight,
    alignItems: "center",
    justifyContent: "center",
  },
  headerText: { flex: 1 },
  title: { fontSize: FontSize.xl, fontWeight: "700", color: Colors.ink },
  type: { fontSize: FontSize.xs, color: Colors.inkMuted, marginTop: 2, textTransform: "uppercase", letterSpacing: 0.5 },

  metaGrid: { flexDirection: "row", flexWrap: "wrap", gap: Spacing.md, paddingTop: Spacing.md, borderTopWidth: 1, borderTopColor: Colors.border, marginBottom: Spacing.sm },
  metaItem: { minWidth: "45%" },
  metaLabel: { fontSize: FontSize.xs, color: Colors.inkMuted, textTransform: "uppercase", letterSpacing: 0.5, marginBottom: 2 },
  metaValue: { fontSize: FontSize.sm, color: Colors.ink, fontWeight: "500" },

  summary: { fontSize: FontSize.sm, color: Colors.inkSecondary, lineHeight: 20, marginTop: Spacing.md, paddingTop: Spacing.md, borderTopWidth: 1, borderTopColor: Colors.border },
  biasLabel: { fontSize: FontSize.xs, color: Colors.warning, textTransform: "uppercase", letterSpacing: 0.5, marginTop: Spacing.lg },
  biasText: { fontSize: FontSize.sm, color: Colors.inkSecondary, lineHeight: 19, marginTop: Spacing.xs, fontStyle: "italic" },

  tags: { flexDirection: "row", flexWrap: "wrap", gap: Spacing.xs, marginTop: Spacing.lg },
  tag: { backgroundColor: Colors.accentLight, borderRadius: Radius.full, paddingHorizontal: Spacing.sm + 2, paddingVertical: 4 },
  tagText: { fontSize: FontSize.xs, color: Colors.accent, fontWeight: "500" },

  listCard: { backgroundColor: Colors.surface, borderRadius: Radius.lg, overflow: "hidden", ...Shadow.sm },
  excerptRow: { padding: Spacing.lg },
  excerptBorder: { borderBottomWidth: 1, borderBottomColor: Colors.border },
  excerptHeader: { flexDirection: "row", alignItems: "center", gap: Spacing.sm, marginBottom: Spacing.sm },
  classificationDot: { width: 8, height: 8, borderRadius: 4 },
  classificationLabel: { fontSize: FontSize.xs, color: Colors.inkMuted, fontWeight: "600", textTransform: "uppercase" },
  excerptLoc: { fontSize: FontSize.xs, color: Colors.inkMuted, marginLeft: "auto" },
  excerptText: { fontSize: FontSize.sm, color: Colors.ink, lineHeight: 20 },
  excerptNote: { fontSize: FontSize.xs, color: Colors.inkMuted, fontStyle: "italic", marginTop: Spacing.xs },

  emptyText: { fontSize: FontSize.sm, color: Colors.inkMuted, textAlign: "center" },

  addExcerptBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: Spacing.sm,
    padding: Spacing.lg,
    borderRadius: Radius.lg,
    backgroundColor: Colors.accentLight,
  },
  addExcerptText: { fontSize: FontSize.sm, color: Colors.accent, fontWeight: "600" },

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
