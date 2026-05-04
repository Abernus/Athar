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
import { useRouter, useLocalSearchParams } from "expo-router";
import { Colors, FontSize, Spacing, Radius, Shadow } from "@/lib/theme";
import { useResearchStore } from "@/stores/research-store";

type Classification = "proof" | "clue" | "context" | "contradiction" | "doubt";

const CLASSIFICATIONS: { key: Classification; label: string; color: string }[] = [
  { key: "proof", label: "Preuve", color: Colors.success },
  { key: "clue", label: "Indice", color: Colors.accent },
  { key: "context", label: "Contexte", color: Colors.inkMuted },
  { key: "contradiction", label: "Contradiction", color: Colors.warning },
  { key: "doubt", label: "Doute", color: Colors.danger },
];

export default function AddExcerptScreen() {
  const router = useRouter();
  const { sourceId } = useLocalSearchParams<{ sourceId: string }>();
  const { addExcerpt } = useResearchStore();

  const [text, setText] = useState("");
  const [page, setPage] = useState("");
  const [summary, setSummary] = useState("");
  const [classification, setClassification] = useState<Classification>("context");
  const [notes, setNotes] = useState("");

  async function save() {
    if (!text.trim() && !summary.trim()) {
      Alert.alert("Contenu requis", "Saisissez le texte de l'extrait ou un résumé.");
      return;
    }
    const result = await addExcerpt({
      sourceId: sourceId!,
      excerptType: "text",
      selectedText: text.trim(),
      pageOrLocation: page.trim(),
      excerptSummary: summary.trim(),
      classification,
      importance: "normal",
      tags: [],
      notes: notes.trim(),
    });
    if (!result) { Alert.alert("Erreur", "Impossible de sauvegarder."); return; }
    router.back();
  }

  return (
    <ScrollView style={styles.scroll} contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
      <View style={styles.card}>
        <Text style={styles.label}>Texte de l'extrait *</Text>
        <TextInput
          style={[styles.input, styles.multiline]}
          value={text}
          onChangeText={setText}
          placeholder="Copiez ou saisissez le passage..."
          placeholderTextColor={Colors.inkMuted}
          multiline
          numberOfLines={6}
          textAlignVertical="top"
          autoFocus
        />

        <Text style={styles.label}>Page / Localisation</Text>
        <TextInput
          style={styles.input}
          value={page}
          onChangeText={setPage}
          placeholder="ex. p. 42, folio 3r, 12:30"
          placeholderTextColor={Colors.inkMuted}
        />

        <Text style={styles.label}>Classification</Text>
        <View style={styles.pillGrid}>
          {CLASSIFICATIONS.map((c) => (
            <Pressable
              key={c.key}
              style={[styles.pill, classification === c.key && styles.pillActive]}
              onPress={() => setClassification(c.key)}
            >
              <View style={[styles.dot, { backgroundColor: c.color }]} />
              <Text style={[styles.pillText, classification === c.key && styles.pillTextActive]}>
                {c.label}
              </Text>
            </Pressable>
          ))}
        </View>

        <Text style={styles.label}>Résumé de l'extrait</Text>
        <TextInput
          style={[styles.input, styles.multiline]}
          value={summary}
          onChangeText={setSummary}
          placeholder="Ce que cet extrait apporte à l'enquête..."
          placeholderTextColor={Colors.inkMuted}
          multiline
          numberOfLines={3}
          textAlignVertical="top"
        />

        <Text style={styles.label}>Notes</Text>
        <TextInput
          style={[styles.input, styles.multiline]}
          value={notes}
          onChangeText={setNotes}
          placeholder="Remarques, questions..."
          placeholderTextColor={Colors.inkMuted}
          multiline
          numberOfLines={2}
          textAlignVertical="top"
        />
      </View>

      <Pressable style={({ pressed }) => [styles.saveBtn, pressed && styles.saveBtnPressed]} onPress={save}>
        <Text style={styles.saveBtnText}>Ajouter l'extrait</Text>
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
  pill: {
    flexDirection: "row", alignItems: "center", gap: 6,
    paddingHorizontal: Spacing.md, paddingVertical: Spacing.sm,
    borderRadius: Radius.full, backgroundColor: Colors.surfaceSunken,
  },
  pillActive: { backgroundColor: Colors.accentLight },
  dot: { width: 8, height: 8, borderRadius: 4 },
  pillText: { fontSize: FontSize.sm, color: Colors.inkMuted, fontWeight: "500" },
  pillTextActive: { color: Colors.accent, fontWeight: "600" },
  saveBtn: { backgroundColor: Colors.accent, borderRadius: Radius.lg, padding: Spacing.lg, alignItems: "center", marginTop: Spacing.xl, ...Shadow.md },
  saveBtnPressed: { opacity: 0.85, transform: [{ scale: 0.98 }] },
  saveBtnText: { color: "white", fontSize: FontSize.base, fontWeight: "600" },
});
