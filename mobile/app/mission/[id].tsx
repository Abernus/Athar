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
import { useThemedStyles } from "@/lib/useTheme";
import { useResearchStore } from "@/stores/research-store";
import { Card } from "@/components/Card";

const STATUS_LABELS: Record<string, { label: string; color: string }> = {
  planned: { label: "Planifiée", color: Colors.accent },
  in_progress: { label: "En cours", color: Colors.warning },
  completed: { label: "Terminée", color: Colors.success },
  cancelled: { label: "Annulée", color: Colors.danger },
};

export default function MissionDetailScreen() {
  const styles = useThemedStyles(makeStyles);
  const { id } = useLocalSearchParams<{ id: string }>();
  const navigation = useNavigation();
  const router = useRouter();
  const { fieldMissions } = useResearchStore();

  const mission = fieldMissions.find((m) => m.id === id);

  useEffect(() => {
    if (mission) navigation.setOptions({ title: mission.title });
  }, [mission]);

  if (!mission) {
    return (
      <View style={styles.notFound}>
        <Text style={styles.notFoundText}>Mission introuvable.</Text>
      </View>
    );
  }

  const status = STATUS_LABELS[mission.status] ?? STATUS_LABELS.planned;

  return (
    <ScrollView style={styles.scroll} contentContainerStyle={styles.content}>
      <Card>
        <View style={styles.header}>
          <View style={styles.icon}>
            <Ionicons name="airplane" size={22} color={Colors.accent} />
          </View>
          <View style={styles.headerText}>
            <Text style={styles.title}>{mission.title}</Text>
            <View style={styles.statusRow}>
              <View style={[styles.statusDot, { backgroundColor: status.color }]} />
              <Text style={styles.statusText}>{status.label}</Text>
            </View>
          </View>
        </View>

        <View style={styles.metaGrid}>
          {mission.location ? (
            <View style={styles.metaItem}>
              <Text style={styles.metaLabel}>Lieu</Text>
              <Text style={styles.metaValue}>{mission.location}</Text>
            </View>
          ) : null}
          {mission.dateStart ? (
            <View style={styles.metaItem}>
              <Text style={styles.metaLabel}>Dates</Text>
              <Text style={styles.metaValue}>
                {mission.dateStart}{mission.dateEnd ? ` — ${mission.dateEnd}` : ""}
              </Text>
            </View>
          ) : null}
        </View>

        {mission.objectives ? <Field label="Objectifs" value={mission.objectives} /> : null}
        {mission.personsToMeet ? <Field label="Personnes à rencontrer" value={mission.personsToMeet} /> : null}
        {mission.placesToVisit ? <Field label="Lieux à visiter" value={mission.placesToVisit} /> : null}
        {mission.archivesToConsult ? <Field label="Archives à consulter" value={mission.archivesToConsult} /> : null}
        {mission.equipmentChecklist ? <Field label="Matériel" value={mission.equipmentChecklist} /> : null}
        {mission.debriefNotes ? <Field label="Debrief" value={mission.debriefNotes} /> : null}

        {mission.tags.length > 0 && (
          <View style={styles.tags}>
            {mission.tags.map((tag) => (
              <View key={tag} style={styles.tag}>
                <Text style={styles.tagText}>{tag}</Text>
              </View>
            ))}
          </View>
        )}
      </Card>

      <View style={styles.actionRow}>
        <Pressable style={styles.actionBtn} onPress={() => router.push(`/add/mission?editId=${id}` as never)}>
          <Ionicons name="create-outline" size={16} color={Colors.accent} />
          <Text style={styles.actionBtnText}>Modifier</Text>
        </Pressable>
      </View>
    </ScrollView>
  );
}

function Field({ label, value }: { label: string; value: string }) {
  const fieldStyles = useThemedStyles(makeFieldStyles);
  return (
    <>
      <View style={fieldStyles.separator} />
      <Text style={fieldStyles.label}>{label}</Text>
      <Text style={fieldStyles.value}>{value}</Text>
    </>
  );
}

const makeFieldStyles = () => StyleSheet.create({
  separator: { height: 1, backgroundColor: Colors.border, marginVertical: Spacing.md },
  label: { fontSize: FontSize.xs, color: Colors.inkMuted, textTransform: "uppercase", letterSpacing: 0.5, marginBottom: Spacing.xs },
  value: { fontSize: FontSize.sm, color: Colors.inkSecondary, lineHeight: 21 },
});

const makeStyles = () => StyleSheet.create({
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
  statusRow: { flexDirection: "row", alignItems: "center", gap: 6, marginTop: 4 },
  statusDot: { width: 8, height: 8, borderRadius: 4 },
  statusText: { fontSize: FontSize.xs, color: Colors.inkMuted, textTransform: "uppercase", letterSpacing: 0.5 },

  metaGrid: { flexDirection: "row", flexWrap: "wrap", gap: Spacing.md, paddingTop: Spacing.md, borderTopWidth: 1, borderTopColor: Colors.border },
  metaItem: { minWidth: "45%", marginBottom: Spacing.sm },
  metaLabel: { fontSize: FontSize.xs, color: Colors.inkMuted, textTransform: "uppercase", letterSpacing: 0.5, marginBottom: 2 },
  metaValue: { fontSize: FontSize.sm, color: Colors.ink, fontWeight: "500" },

  actionRow: { flexDirection: "row", gap: Spacing.sm, marginTop: Spacing.lg },
  actionBtn: {
    flex: 1, flexDirection: "row", alignItems: "center", justifyContent: "center",
    gap: Spacing.sm, padding: Spacing.md, borderRadius: Radius.lg, backgroundColor: Colors.accentLight,
  },
  actionBtnText: { fontSize: FontSize.sm, color: Colors.accent, fontWeight: "600" },

  tags: { flexDirection: "row", flexWrap: "wrap", gap: Spacing.xs, marginTop: Spacing.lg },
  tag: { backgroundColor: Colors.accentLight, borderRadius: Radius.full, paddingHorizontal: Spacing.sm + 2, paddingVertical: 4 },
  tagText: { fontSize: FontSize.xs, color: Colors.accent, fontWeight: "500" },
});
