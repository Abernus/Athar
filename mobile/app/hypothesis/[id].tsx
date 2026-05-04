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
import { ConfidencePill } from "@/components/ConfidencePill";
import { HYPOTHESIS_STATUS_LABELS } from "@/lib/constants";

export default function HypothesisDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const navigation = useNavigation();
  const router = useRouter();
  const { hypotheses, deleteHypothesis } = useResearchStore();

  const hypothesis = hypotheses.find((h) => h.id === id);

  useEffect(() => {
    if (hypothesis) navigation.setOptions({ title: hypothesis.title });
  }, [hypothesis]);

  if (!hypothesis) {
    return (
      <View style={styles.notFound}>
        <Text style={styles.notFoundText}>Hypothèse introuvable.</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.scroll} contentContainerStyle={styles.content}>
      <Card>
        <View style={styles.header}>
          <View style={styles.icon}>
            <Ionicons name="bulb" size={22} color={Colors.accent} />
          </View>
          <View style={styles.headerText}>
            <Text style={styles.title}>{hypothesis.title}</Text>
            <Text style={styles.statusText}>
              {HYPOTHESIS_STATUS_LABELS[hypothesis.status as keyof typeof HYPOTHESIS_STATUS_LABELS] ?? hypothesis.status}
            </Text>
          </View>
        </View>

        <View style={styles.metaRow}>
          <View style={styles.metaItem}>
            <Text style={styles.metaLabel}>Confiance</Text>
            <ConfidencePill level={hypothesis.confidenceLevel} />
          </View>
          <View style={styles.metaItem}>
            <Text style={styles.metaLabel}>Créée le</Text>
            <Text style={styles.metaValue}>
              {new Date(hypothesis.createdAt).toLocaleDateString("fr-FR")}
            </Text>
          </View>
        </View>

        {hypothesis.description ? (
          <>
            <View style={styles.separator} />
            <Text style={styles.sectionLabel}>Argumentaire</Text>
            <Text style={styles.description}>{hypothesis.description}</Text>
          </>
        ) : null}

        {hypothesis.notes ? (
          <>
            <View style={styles.separator} />
            <Text style={styles.sectionLabel}>Notes</Text>
            <Text style={styles.description}>{hypothesis.notes}</Text>
          </>
        ) : null}

        {hypothesis.tags.length > 0 && (
          <View style={styles.tags}>
            {hypothesis.tags.map((tag) => (
              <View key={tag} style={styles.tag}>
                <Text style={styles.tagText}>{tag}</Text>
              </View>
            ))}
          </View>
        )}
      </Card>

      <View style={styles.actionRow}>
        <Pressable
          style={styles.actionBtn}
          onPress={() => router.push(`/add/hypothesis?editId=${id}` as never)}
        >
          <Ionicons name="create-outline" size={16} color={Colors.accent} />
          <Text style={styles.actionBtnText}>Modifier</Text>
        </Pressable>
      </View>

      <Pressable
        style={styles.deleteBtn}
        onPress={() =>
          Alert.alert("Supprimer", `Supprimer "${hypothesis.title}" ?`, [
            { text: "Annuler", style: "cancel" },
            {
              text: "Supprimer",
              style: "destructive",
              onPress: async () => {
                await deleteHypothesis(id);
                router.back();
              },
            },
          ])
        }
      >
        <Ionicons name="trash-outline" size={16} color={Colors.danger} />
        <Text style={styles.deleteBtnText}>Supprimer cette hypothèse</Text>
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
    backgroundColor: Colors.accentLight, alignItems: "center", justifyContent: "center",
  },
  headerText: { flex: 1 },
  title: { fontSize: FontSize.xl, fontWeight: "700", color: Colors.ink },
  statusText: {
    fontSize: FontSize.xs, color: Colors.inkMuted, marginTop: 2,
    textTransform: "uppercase", letterSpacing: 0.5,
  },

  metaRow: {
    flexDirection: "row", gap: Spacing.xl, paddingTop: Spacing.md,
    borderTopWidth: 1, borderTopColor: Colors.border,
  },
  metaItem: {},
  metaLabel: {
    fontSize: FontSize.xs, color: Colors.inkMuted, textTransform: "uppercase",
    letterSpacing: 0.5, marginBottom: 4,
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
