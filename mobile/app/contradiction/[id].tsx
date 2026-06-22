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

const STATUS_LABELS: Record<string, string> = {
  open: "Ouverte",
  resolved: "Résolue",
  acknowledged: "Reconnue",
};

const STATUS_COLORS: Record<string, string> = {
  open: Colors.warning,
  resolved: Colors.success,
  acknowledged: Colors.inkMuted,
};

export default function ContradictionDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const navigation = useNavigation();
  const router = useRouter();
  const { contradictions, deleteContradiction, sources, getEntityDisplayName } = useResearchStore();

  const contradiction = contradictions.find((c) => c.id === id);
  const sourceA = contradiction?.sourceAId ? sources.find((s) => s.id === contradiction.sourceAId) : null;
  const sourceB = contradiction?.sourceBId ? sources.find((s) => s.id === contradiction.sourceBId) : null;

  useEffect(() => {
    if (contradiction) navigation.setOptions({ title: contradiction.title });
  }, [contradiction]);

  if (!contradiction) {
    return (
      <View style={styles.notFound}>
        <Text style={styles.notFoundText}>Contradiction introuvable.</Text>
      </View>
    );
  }

  const statusColor = STATUS_COLORS[contradiction.status] ?? Colors.inkMuted;

  return (
    <ScrollView style={styles.scroll} contentContainerStyle={styles.content}>
      <Card>
        <View style={styles.header}>
          <View style={styles.icon}>
            <Ionicons name="git-compare-outline" size={22} color={Colors.warning} />
          </View>
          <View style={styles.headerText}>
            <Text style={styles.title}>{contradiction.title}</Text>
            <View style={styles.statusRow}>
              <View style={[styles.statusDot, { backgroundColor: statusColor }]} />
              <Text style={styles.statusText}>
                {STATUS_LABELS[contradiction.status] ?? contradiction.status}
              </Text>
            </View>
          </View>
        </View>

        <View style={styles.metaRow}>
          <View style={styles.metaItem}>
            <Text style={styles.metaLabel}>Créée le</Text>
            <Text style={styles.metaValue}>
              {new Date(contradiction.createdAt).toLocaleDateString("fr-FR")}
            </Text>
          </View>
        </View>

        {contradiction.description ? (
          <>
            <View style={styles.separator} />
            <Text style={styles.sectionLabel}>Description</Text>
            <Text style={styles.description}>{contradiction.description}</Text>
          </>
        ) : null}

        {contradiction.resolutionNote ? (
          <>
            <View style={styles.separator} />
            <Text style={styles.sectionLabel}>Note de résolution</Text>
            <Text style={styles.description}>{contradiction.resolutionNote}</Text>
          </>
        ) : null}

        {contradiction.tags.length > 0 && (
          <View style={styles.tags}>
            {contradiction.tags.map((tag) => (
              <View key={tag} style={styles.tag}>
                <Text style={styles.tagText}>{tag}</Text>
              </View>
            ))}
          </View>
        )}
      </Card>

      {/* Linked sources */}
      {(sourceA || sourceB) && (
        <>
          <View style={styles.sectionRow}>
            <View style={styles.sectionBar} />
            <Text style={styles.sectionTitleText}>Sources en contradiction</Text>
          </View>
          <View style={styles.sourcesCompare}>
            {sourceA && (
              <Pressable
                style={styles.sourceCard}
                onPress={() => router.push(`/source/${sourceA.id}` as never)}
              >
                <View style={[styles.sourceIndicator, { backgroundColor: "#3B82F6" }]} />
                <View style={styles.sourceContent}>
                  <Text style={styles.sourceLabel}>Source A</Text>
                  <Text style={styles.sourceTitle} numberOfLines={2}>{sourceA.title}</Text>
                  <Text style={styles.sourceMeta}>{sourceA.sourceType}</Text>
                </View>
              </Pressable>
            )}
            {sourceA && sourceB && (
              <View style={styles.vsIndicator}>
                <Ionicons name="swap-horizontal" size={16} color={Colors.warning} />
              </View>
            )}
            {sourceB && (
              <Pressable
                style={styles.sourceCard}
                onPress={() => router.push(`/source/${sourceB.id}` as never)}
              >
                <View style={[styles.sourceIndicator, { backgroundColor: Colors.danger }]} />
                <View style={styles.sourceContent}>
                  <Text style={styles.sourceLabel}>Source B</Text>
                  <Text style={styles.sourceTitle} numberOfLines={2}>{sourceB.title}</Text>
                  <Text style={styles.sourceMeta}>{sourceB.sourceType}</Text>
                </View>
              </Pressable>
            )}
          </View>
        </>
      )}

      <View style={styles.actionRow}>
        <Pressable
          style={styles.actionBtn}
          onPress={() => router.push(`/add/contradiction?editId=${id}` as never)}
        >
          <Ionicons name="create-outline" size={16} color={Colors.accent} />
          <Text style={styles.actionBtnText}>Modifier</Text>
        </Pressable>
      </View>

      <Pressable
        style={styles.deleteBtn}
        onPress={() =>
          Alert.alert("Supprimer", `Supprimer "${contradiction.title}" ?`, [
            { text: "Annuler", style: "cancel" },
            {
              text: "Supprimer",
              style: "destructive",
              onPress: async () => {
                await deleteContradiction(id);
                router.back();
              },
            },
          ])
        }
      >
        <Ionicons name="trash-outline" size={16} color={Colors.danger} />
        <Text style={styles.deleteBtnText}>Supprimer</Text>
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
  icon: {
    width: 44, height: 44, borderRadius: Radius.lg,
    backgroundColor: "#FEF3C7", alignItems: "center", justifyContent: "center",
  },
  headerText: { flex: 1 },
  title: { fontSize: FontSize.xl, fontWeight: "700", color: Colors.ink },
  statusRow: { flexDirection: "row", alignItems: "center", gap: 6, marginTop: 4 },
  statusDot: { width: 8, height: 8, borderRadius: 4 },
  statusText: {
    fontSize: FontSize.xs, color: Colors.inkMuted,
    textTransform: "uppercase", letterSpacing: 0.5,
  },

  metaRow: {
    flexDirection: "row", gap: Spacing.xl, paddingTop: Spacing.md,
    borderTopWidth: 1, borderTopColor: Colors.border,
  },
  metaItem: {},
  metaLabel: {
    fontSize: FontSize.xs, color: Colors.inkMuted, textTransform: "uppercase",
    letterSpacing: 0.5, marginBottom: 2,
  },
  metaValue: { fontSize: FontSize.sm, color: Colors.ink, fontWeight: "500" },

  separator: { height: 1, backgroundColor: Colors.border, marginVertical: Spacing.md },
  sectionLabel: {
    fontSize: FontSize.xs, color: Colors.inkMuted, textTransform: "uppercase",
    letterSpacing: 0.5, marginBottom: Spacing.xs,
  },
  description: { fontSize: FontSize.sm, color: Colors.inkSecondary, lineHeight: 21 },

  tags: { flexDirection: "row", flexWrap: "wrap", gap: Spacing.xs, marginTop: Spacing.lg },
  tag: { backgroundColor: Colors.accentLight, borderRadius: Radius.full, paddingHorizontal: Spacing.sm + 2, paddingVertical: 4 },
  tagText: { fontSize: FontSize.xs, color: Colors.accent, fontWeight: "500" },

  sectionRow: { flexDirection: "row", alignItems: "center", gap: Spacing.sm, marginTop: Spacing.lg, marginBottom: Spacing.xs },
  sectionBar: { width: 3, height: 14, borderRadius: 2, backgroundColor: Colors.warning },
  sectionTitleText: { fontSize: FontSize.sm, fontWeight: "600", color: Colors.inkSecondary, letterSpacing: 0.3 },

  sourcesCompare: { gap: Spacing.sm },
  sourceCard: {
    flexDirection: "row",
    backgroundColor: Colors.surface,
    borderRadius: Radius.lg,
    overflow: "hidden",
    ...Shadow.sm,
  },
  sourceIndicator: { width: 4, alignSelf: "stretch" },
  sourceContent: { flex: 1, padding: Spacing.md },
  sourceLabel: { fontSize: FontSize.xs, color: Colors.inkMuted, textTransform: "uppercase", letterSpacing: 0.5, fontWeight: "600" },
  sourceTitle: { fontSize: FontSize.sm, color: Colors.ink, fontWeight: "500", marginTop: 2 },
  sourceMeta: { fontSize: FontSize.xs, color: Colors.inkMuted, marginTop: 2 },
  vsIndicator: { alignItems: "center", paddingVertical: 2 },

  actionRow: { flexDirection: "row", gap: Spacing.sm, marginTop: Spacing.lg },
  actionBtn: {
    flex: 1, flexDirection: "row", alignItems: "center", justifyContent: "center",
    gap: Spacing.sm, padding: Spacing.md, borderRadius: Radius.lg, backgroundColor: Colors.accentLight,
  },
  actionBtnText: { fontSize: FontSize.sm, color: Colors.accent, fontWeight: "600" },

  deleteBtn: {
    flexDirection: "row", alignItems: "center", justifyContent: "center",
    gap: Spacing.sm, marginTop: Spacing.xxl, padding: Spacing.lg,
    borderRadius: Radius.lg, backgroundColor: Colors.dangerLight,
  },
  deleteBtnText: { fontSize: FontSize.sm, color: Colors.danger, fontWeight: "600" },
});
