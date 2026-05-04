import { useState, useEffect } from "react";
import {
  ScrollView,
  View,
  Text,
  TextInput,
  Pressable,
  StyleSheet,
  Alert,
} from "react-native";
import { useRouter, useLocalSearchParams, useNavigation } from "expo-router";
import { Colors, FontSize, Spacing, Radius, Shadow } from "@/lib/theme";
import { useResearchStore } from "@/stores/research-store";
import { HYPOTHESIS_STATUS_LABELS, CONFIDENCE_LABELS } from "@/lib/constants";
import type { HypothesisStatus, ConfidenceLevel } from "@/types";

const STATUSES: HypothesisStatus[] = [
  "draft", "open", "argued", "provisionally_validated", "rejected",
];

const CONF_LEVELS: ConfidenceLevel[] = [
  "confirmed", "probable", "uncertain", "contested", "abandoned",
];

export default function AddHypothesisScreen() {
  const router = useRouter();
  const navigation = useNavigation();
  const { editId } = useLocalSearchParams<{ editId?: string }>();
  const { addHypothesis, updateHypothesis, hypotheses } = useResearchStore();

  const existing = editId ? hypotheses.find((h) => h.id === editId) : undefined;
  const isEdit = !!existing;

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState<HypothesisStatus>("draft");
  const [confidence, setConfidence] = useState<ConfidenceLevel>("uncertain");
  const [notes, setNotes] = useState("");
  const [tags, setTags] = useState("");

  useEffect(() => {
    if (existing) {
      navigation.setOptions({ title: "Modifier l'hypothèse" });
      setTitle(existing.title);
      setDescription(existing.description);
      setStatus(existing.status as HypothesisStatus);
      setConfidence(existing.confidenceLevel as ConfidenceLevel);
      setNotes(existing.notes);
      setTags(existing.tags.join(", "));
    }
  }, [existing?.id]);

  async function save() {
    if (!title.trim()) { Alert.alert("Titre requis"); return; }
    const parsed = {
      title: title.trim(),
      description: description.trim(),
      status,
      confidenceLevel: confidence,
      notes: notes.trim(),
      tags: tags.split(",").map((s) => s.trim()).filter(Boolean),
    };
    if (isEdit) {
      const result = await updateHypothesis(editId!, parsed);
      if (!result) { Alert.alert("Erreur", "Impossible de sauvegarder."); return; }
      router.back();
    } else {
      const result = await addHypothesis(parsed);
      if (!result) { Alert.alert("Erreur", "Impossible de sauvegarder."); return; }
      Alert.alert("Hypothèse créée", title.trim(), [
        { text: "OK", onPress: () => router.back() },
      ]);
    }
  }

  return (
    <ScrollView style={styles.scroll} contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
      <View style={styles.card}>
        <Text style={styles.label}>Titre *</Text>
        <TextInput style={styles.input} value={title} onChangeText={setTitle} placeholder="ex. Ahmed serait arrivé en France en 1925" placeholderTextColor={Colors.inkMuted} autoFocus={!isEdit} />

        <Text style={styles.label}>Description / argumentaire</Text>
        <TextInput style={[styles.input, styles.multiline]} value={description} onChangeText={setDescription} placeholder="Développez l'hypothèse, les arguments pour et contre..." placeholderTextColor={Colors.inkMuted} multiline numberOfLines={5} textAlignVertical="top" />

        <Text style={styles.label}>Statut</Text>
        <View style={styles.pillGrid}>
          {STATUSES.map((s) => (
            <Pressable key={s} style={[styles.pill, status === s && styles.pillActive]} onPress={() => setStatus(s)}>
              <Text style={[styles.pillText, status === s && styles.pillTextActive]}>{HYPOTHESIS_STATUS_LABELS[s]}</Text>
            </Pressable>
          ))}
        </View>

        <Text style={styles.label}>Niveau de confiance</Text>
        <View style={styles.pillGrid}>
          {CONF_LEVELS.map((c) => (
            <Pressable key={c} style={[styles.pill, confidence === c && styles.pillActive]} onPress={() => setConfidence(c)}>
              <Text style={[styles.pillText, confidence === c && styles.pillTextActive]}>{CONFIDENCE_LABELS[c]}</Text>
            </Pressable>
          ))}
        </View>

        <Text style={styles.label}>Notes</Text>
        <TextInput style={[styles.input, styles.multiline]} value={notes} onChangeText={setNotes} placeholder="Sources à vérifier, pistes..." placeholderTextColor={Colors.inkMuted} multiline numberOfLines={3} textAlignVertical="top" />

        <Text style={styles.label}>Tags</Text>
        <TextInput style={styles.input} value={tags} onChangeText={setTags} placeholder="migration, chronologie, identité" placeholderTextColor={Colors.inkMuted} />
      </View>

      <Pressable style={({ pressed }) => [styles.saveBtn, pressed && styles.saveBtnPressed]} onPress={save}>
        <Text style={styles.saveBtnText}>{isEdit ? "Enregistrer" : "Créer l'hypothèse"}</Text>
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
  multiline: { minHeight: 100, paddingTop: Spacing.sm + 2 },
  pillGrid: { flexDirection: "row", flexWrap: "wrap", gap: Spacing.sm },
  pill: { paddingHorizontal: Spacing.md, paddingVertical: Spacing.sm, borderRadius: Radius.full, backgroundColor: Colors.surfaceSunken },
  pillActive: { backgroundColor: Colors.accentLight },
  pillText: { fontSize: FontSize.sm, color: Colors.inkMuted, fontWeight: "500" },
  pillTextActive: { color: Colors.accent, fontWeight: "600" },
  saveBtn: { backgroundColor: Colors.accent, borderRadius: Radius.lg, padding: Spacing.lg, alignItems: "center", marginTop: Spacing.xl, ...Shadow.md },
  saveBtnPressed: { opacity: 0.85, transform: [{ scale: 0.98 }] },
  saveBtnText: { color: "white", fontSize: FontSize.base, fontWeight: "600" },
});
