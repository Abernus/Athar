import {
  ScrollView,
  View,
  Text,
  Pressable,
  StyleSheet,
} from "react-native";
import { useLocalSearchParams, useNavigation, useRouter } from "expo-router";
import { useEffect } from "react";
import { Ionicons } from "@expo/vector-icons";
import { Colors, FontSize, Spacing, Radius, Shadow } from "@/lib/theme";
import { useResearchStore } from "@/stores/research-store";
import { Card } from "@/components/Card";

const CONSENT_LABELS: Record<string, { label: string; color: string }> = {
  obtained: { label: "Obtenu", color: Colors.success },
  pending: { label: "En attente", color: Colors.warning },
  restricted: { label: "Restreint", color: "#EA580C" },
  refused: { label: "Refusé", color: Colors.danger },
};

const SENSITIVITY_LABELS: Record<string, { label: string; color: string }> = {
  public: { label: "Public", color: Colors.success },
  normal: { label: "Normal", color: Colors.inkMuted },
  sensitive: { label: "Sensible", color: Colors.warning },
  confidential: { label: "Confidentiel", color: Colors.danger },
};

export default function WitnessDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const navigation = useNavigation();
  const router = useRouter();
  const { witnesses, interviewSessions } = useResearchStore();

  const witness = witnesses.find((w) => w.id === id);
  const sessions = interviewSessions.filter((s) => s.witnessId === id);

  useEffect(() => {
    if (witness) navigation.setOptions({ title: witness.fullName });
  }, [witness]);

  if (!witness) {
    return (
      <View style={styles.notFound}>
        <Text style={styles.notFoundText}>Témoin introuvable.</Text>
      </View>
    );
  }

  const consent = CONSENT_LABELS[witness.consentStatus] ?? CONSENT_LABELS.pending;
  const sensitivity = SENSITIVITY_LABELS[witness.sensitivityLevel] ?? SENSITIVITY_LABELS.normal;

  return (
    <ScrollView style={styles.scroll} contentContainerStyle={styles.content}>
      <Card>
        <View style={styles.header}>
          <View style={styles.icon}>
            <Ionicons name="person-circle" size={22} color={Colors.accent} />
          </View>
          <View style={styles.headerText}>
            <Text style={styles.title}>{witness.fullName}</Text>
            {witness.birthYear ? (
              <Text style={styles.subtitle}>Né(e) en {witness.birthYear}</Text>
            ) : null}
          </View>
        </View>

        <View style={styles.badgeRow}>
          <View style={[styles.badge, { backgroundColor: `${consent.color}18` }]}>
            <View style={[styles.badgeDot, { backgroundColor: consent.color }]} />
            <Text style={[styles.badgeText, { color: consent.color }]}>Consentement : {consent.label}</Text>
          </View>
          <View style={[styles.badge, { backgroundColor: `${sensitivity.color}18` }]}>
            <View style={[styles.badgeDot, { backgroundColor: sensitivity.color }]} />
            <Text style={[styles.badgeText, { color: sensitivity.color }]}>{sensitivity.label}</Text>
          </View>
        </View>

        <View style={styles.metaGrid}>
          {witness.birthPlace ? (
            <View style={styles.metaItem}>
              <Text style={styles.metaLabel}>Lieu de naissance</Text>
              <Text style={styles.metaValue}>{witness.birthPlace}</Text>
            </View>
          ) : null}
          {witness.currentLocation ? (
            <View style={styles.metaItem}>
              <Text style={styles.metaLabel}>Localisation</Text>
              <Text style={styles.metaValue}>{witness.currentLocation}</Text>
            </View>
          ) : null}
          {witness.relationToSubject ? (
            <View style={styles.metaItem}>
              <Text style={styles.metaLabel}>Relation au sujet</Text>
              <Text style={styles.metaValue}>{witness.relationToSubject}</Text>
            </View>
          ) : null}
          {witness.reliabilityAssessment ? (
            <View style={styles.metaItem}>
              <Text style={styles.metaLabel}>Fiabilité</Text>
              <Text style={styles.metaValue}>{witness.reliabilityAssessment}</Text>
            </View>
          ) : null}
        </View>

        {witness.contextNotes ? (
          <>
            <View style={styles.separator} />
            <Text style={styles.sectionLabel}>Notes de contexte</Text>
            <Text style={styles.bodyText}>{witness.contextNotes}</Text>
          </>
        ) : null}

        {witness.consentNotes ? (
          <>
            <View style={styles.separator} />
            <Text style={styles.sectionLabel}>Notes consentement</Text>
            <Text style={styles.bodyText}>{witness.consentNotes}</Text>
          </>
        ) : null}
      </Card>

      <View style={styles.actionRow}>
        <Pressable style={styles.actionBtn} onPress={() => router.push(`/add/witness?editId=${id}` as never)}>
          <Ionicons name="create-outline" size={16} color={Colors.accent} />
          <Text style={styles.actionBtnText}>Modifier</Text>
        </Pressable>
      </View>

      {sessions.length > 0 && (
        <>
          <View style={styles.sectionRow}>
            <View style={styles.sectionBar} />
            <Text style={styles.sectionTitleText}>Entretiens ({sessions.length})</Text>
          </View>
          <View style={styles.listCard}>
            {sessions.map((s, i) => (
              <View key={s.id} style={[styles.sessionRow, i < sessions.length - 1 && styles.sessionBorder]}>
                <Text style={styles.sessionTitle}>{s.title}</Text>
                <Text style={styles.sessionMeta}>
                  {s.date ? `${s.date} · ` : ""}{s.location}{s.durationMinutes ? ` · ${s.durationMinutes} min` : ""}
                </Text>
                {s.topicsCovered.length > 0 && (
                  <Text style={styles.sessionTopics}>Sujets : {s.topicsCovered.join(", ")}</Text>
                )}
              </View>
            ))}
          </View>
        </>
      )}
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
  subtitle: { fontSize: FontSize.xs, color: Colors.inkMuted, marginTop: 2 },

  badgeRow: { flexDirection: "row", flexWrap: "wrap", gap: Spacing.sm, marginBottom: Spacing.md },
  badge: { flexDirection: "row", alignItems: "center", gap: 6, paddingHorizontal: Spacing.sm + 2, paddingVertical: 4, borderRadius: Radius.full },
  badgeDot: { width: 6, height: 6, borderRadius: 3 },
  badgeText: { fontSize: FontSize.xs, fontWeight: "600" },

  metaGrid: { flexDirection: "row", flexWrap: "wrap", gap: Spacing.md, paddingTop: Spacing.md, borderTopWidth: 1, borderTopColor: Colors.border },
  metaItem: { minWidth: "45%", marginBottom: Spacing.sm },
  metaLabel: { fontSize: FontSize.xs, color: Colors.inkMuted, textTransform: "uppercase", letterSpacing: 0.5, marginBottom: 2 },
  metaValue: { fontSize: FontSize.sm, color: Colors.ink, fontWeight: "500" },

  separator: { height: 1, backgroundColor: Colors.border, marginVertical: Spacing.md },
  sectionLabel: { fontSize: FontSize.xs, color: Colors.inkMuted, textTransform: "uppercase", letterSpacing: 0.5, marginBottom: Spacing.xs },
  bodyText: { fontSize: FontSize.sm, color: Colors.inkSecondary, lineHeight: 21 },

  sectionRow: { flexDirection: "row", alignItems: "center", gap: Spacing.sm, marginTop: Spacing.lg, marginBottom: Spacing.xs },
  sectionBar: { width: 3, height: 14, borderRadius: 2, backgroundColor: Colors.accent },
  sectionTitleText: { fontSize: FontSize.sm, fontWeight: "600", color: Colors.inkSecondary, letterSpacing: 0.3 },

  actionRow: { flexDirection: "row", gap: Spacing.sm, marginTop: Spacing.lg },
  actionBtn: {
    flex: 1, flexDirection: "row", alignItems: "center", justifyContent: "center",
    gap: Spacing.sm, padding: Spacing.md, borderRadius: Radius.lg, backgroundColor: Colors.accentLight,
  },
  actionBtnText: { fontSize: FontSize.sm, color: Colors.accent, fontWeight: "600" },

  listCard: { backgroundColor: Colors.surface, borderRadius: Radius.lg, overflow: "hidden", ...Shadow.sm },
  sessionRow: { padding: Spacing.lg },
  sessionBorder: { borderBottomWidth: 1, borderBottomColor: Colors.border },
  sessionTitle: { fontSize: FontSize.sm, color: Colors.ink, fontWeight: "600" },
  sessionMeta: { fontSize: FontSize.xs, color: Colors.inkMuted, marginTop: 2 },
  sessionTopics: { fontSize: FontSize.xs, color: Colors.inkSecondary, marginTop: 4 },
});
