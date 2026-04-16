import { useState } from "react";
import {
  ScrollView,
  View,
  Text,
  TextInput,
  Pressable,
  StyleSheet,
  Alert,
} from "react-native";
import { useRouter } from "expo-router";
import { Colors, FontSize, Spacing, Radius, Shadow } from "@/lib/theme";
import { useResearchStore } from "@/stores/research-store";
import type { ProjectStatus } from "@/types";

const STATUSES: { key: ProjectStatus; label: string }[] = [
  { key: "active", label: "Actif" },
  { key: "paused", label: "En pause" },
  { key: "completed", label: "Terminé" },
  { key: "archived", label: "Archivé" },
];

export default function AddProjectScreen() {
  const router = useRouter();
  const { addProject } = useResearchStore();
  const [title, setTitle] = useState("");
  const [question, setQuestion] = useState("");
  const [summary, setSummary] = useState("");
  const [periodStart, setPeriodStart] = useState("");
  const [periodEnd, setPeriodEnd] = useState("");
  const [geo, setGeo] = useState("");
  const [status, setStatus] = useState<ProjectStatus>("active");
  const [tags, setTags] = useState("");

  async function save() {
    if (!title.trim()) {
      Alert.alert("Titre requis");
      return;
    }
    const result = await addProject({
      title: title.trim(),
      summary: summary.trim(),
      researchQuestion: question.trim(),
      periodStart: periodStart.trim() || undefined,
      periodEnd: periodEnd.trim() || undefined,
      geographicScope: geo.trim(),
      status,
      tags: tags.split(",").map((s) => s.trim()).filter(Boolean),
      notes: "",
    });
    if (!result) { Alert.alert("Erreur", "Impossible de sauvegarder."); return; }
    Alert.alert("Dossier créé", `${title.trim()}`, [
      { text: "OK", onPress: () => router.back() },
    ]);
  }

  return (
    <ScrollView style={styles.scroll} contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
      <View style={styles.card}>
        <Text style={styles.label}>Titre du dossier *</Text>
        <TextInput style={styles.input} value={title} onChangeText={setTitle} placeholder="ex. Migration kabyle 1900-1960" placeholderTextColor={Colors.inkMuted} autoFocus />

        <Text style={styles.label}>Question de recherche</Text>
        <TextInput style={[styles.input, styles.multiline]} value={question} onChangeText={setQuestion} placeholder="Quelle problématique guidera ce dossier ?" placeholderTextColor={Colors.inkMuted} multiline numberOfLines={3} textAlignVertical="top" />

        <View style={styles.row}>
          <View style={styles.half}>
            <Text style={styles.label}>Période début</Text>
            <TextInput style={styles.input} value={periodStart} onChangeText={setPeriodStart} placeholder="ex. 1900" placeholderTextColor={Colors.inkMuted} />
          </View>
          <View style={styles.half}>
            <Text style={styles.label}>Période fin</Text>
            <TextInput style={styles.input} value={periodEnd} onChangeText={setPeriodEnd} placeholder="ex. 1962" placeholderTextColor={Colors.inkMuted} />
          </View>
        </View>

        <Text style={styles.label}>Aire géographique</Text>
        <TextInput style={styles.input} value={geo} onChangeText={setGeo} placeholder="ex. Kabylie, Paris, Marseille" placeholderTextColor={Colors.inkMuted} />

        <Text style={styles.label}>Statut</Text>
        <View style={styles.pillGrid}>
          {STATUSES.map((s) => (
            <Pressable key={s.key} style={[styles.pill, status === s.key && styles.pillActive]} onPress={() => setStatus(s.key)}>
              <Text style={[styles.pillText, status === s.key && styles.pillTextActive]}>{s.label}</Text>
            </Pressable>
          ))}
        </View>

        <Text style={styles.label}>Résumé</Text>
        <TextInput style={[styles.input, styles.multiline]} value={summary} onChangeText={setSummary} placeholder="Description du dossier..." placeholderTextColor={Colors.inkMuted} multiline numberOfLines={3} textAlignVertical="top" />

        <Text style={styles.label}>Tags</Text>
        <TextInput style={styles.input} value={tags} onChangeText={setTags} placeholder="migration, algérie, guerre" placeholderTextColor={Colors.inkMuted} />
      </View>

      <Pressable style={({ pressed }) => [styles.saveBtn, pressed && styles.saveBtnPressed]} onPress={save}>
        <Text style={styles.saveBtnText}>Créer le dossier</Text>
      </Pressable>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scroll: { flex: 1, backgroundColor: Colors.surfaceSunken },
  content: { padding: Spacing.lg, paddingBottom: Spacing.xxxl },
  card: { backgroundColor: Colors.surface, borderRadius: Radius.lg, padding: Spacing.lg, ...Shadow.sm },
  label: { fontSize: FontSize.sm, fontWeight: "600", color: Colors.inkSecondary, marginBottom: Spacing.xs, marginTop: Spacing.lg },
  input: { backgroundColor: Colors.surfaceSunken, borderRadius: Radius.md, paddingHorizontal: Spacing.md, paddingVertical: Spacing.sm + 2, fontSize: FontSize.base, color: Colors.ink },
  multiline: { minHeight: 80, paddingTop: Spacing.sm + 2 },
  row: { flexDirection: "row", gap: Spacing.sm },
  half: { flex: 1 },
  pillGrid: { flexDirection: "row", flexWrap: "wrap", gap: Spacing.sm },
  pill: { paddingHorizontal: Spacing.md, paddingVertical: Spacing.sm, borderRadius: Radius.full, backgroundColor: Colors.surfaceSunken },
  pillActive: { backgroundColor: Colors.accentLight },
  pillText: { fontSize: FontSize.sm, color: Colors.inkMuted, fontWeight: "500" },
  pillTextActive: { color: Colors.accent, fontWeight: "600" },
  saveBtn: { backgroundColor: Colors.accent, borderRadius: Radius.lg, padding: Spacing.lg, alignItems: "center", marginTop: Spacing.xl, ...Shadow.md },
  saveBtnPressed: { opacity: 0.85, transform: [{ scale: 0.98 }] },
  saveBtnText: { color: "white", fontSize: FontSize.base, fontWeight: "600" },
});
