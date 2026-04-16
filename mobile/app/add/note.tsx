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
import { useLocalSearchParams, useRouter } from "expo-router";
import { Colors, FontSize, Spacing, Radius, Shadow } from "@/lib/theme";
import { useResearchStore } from "@/stores/research-store";
import type { NoteType } from "@/types";

const NOTE_TYPES: { key: NoteType; label: string; icon: string }[] = [
  { key: "note", label: "Note", icon: "📝" },
  { key: "idea", label: "Idée", icon: "💡" },
  { key: "todo", label: "À faire", icon: "☑️" },
  { key: "field_note", label: "Terrain", icon: "🗺️" },
  { key: "abandoned_lead", label: "Piste abandonnée", icon: "❌" },
];

export default function AddNoteScreen() {
  const { projectId } = useLocalSearchParams<{ projectId?: string }>();
  const router = useRouter();
  const { addResearchNote } = useResearchStore();
  const [noteType, setNoteType] = useState<NoteType>("note");
  const [content, setContent] = useState("");
  const [tags, setTags] = useState("");

  async function save() {
    if (!content.trim()) {
      Alert.alert("Contenu requis");
      return;
    }
    const result = await addResearchNote({
      projectId: projectId || undefined,
      noteType,
      content: content.trim(),
      tags: tags.split(",").map((s) => s.trim()).filter(Boolean),
    });
    if (!result) { Alert.alert("Erreur", "Impossible de sauvegarder."); return; }
    Alert.alert("Note enregistrée", "", [
      { text: "OK", onPress: () => router.back() },
    ]);
  }

  return (
    <ScrollView style={styles.scroll} contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
      <View style={styles.card}>
        <Text style={styles.label}>Type</Text>
        <View style={styles.pillGrid}>
          {NOTE_TYPES.map((t) => (
            <Pressable key={t.key} style={[styles.pill, noteType === t.key && styles.pillActive]} onPress={() => setNoteType(t.key)}>
              <Text style={[styles.pillText, noteType === t.key && styles.pillTextActive]}>
                {t.icon} {t.label}
              </Text>
            </Pressable>
          ))}
        </View>

        <Text style={styles.label}>Contenu *</Text>
        <TextInput
          style={[styles.input, styles.multiline]}
          value={content}
          onChangeText={setContent}
          placeholder="Votre note, idée, observation, tâche..."
          placeholderTextColor={Colors.inkMuted}
          multiline
          numberOfLines={8}
          textAlignVertical="top"
          autoFocus
        />

        <Text style={styles.label}>Tags</Text>
        <TextInput style={styles.input} value={tags} onChangeText={setTags} placeholder="à vérifier, terrain, archives" placeholderTextColor={Colors.inkMuted} />
      </View>

      <Pressable style={({ pressed }) => [styles.saveBtn, pressed && styles.saveBtnPressed]} onPress={save}>
        <Text style={styles.saveBtnText}>Enregistrer</Text>
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
  multiline: { minHeight: 160, paddingTop: Spacing.sm + 2 },
  pillGrid: { flexDirection: "row", flexWrap: "wrap", gap: Spacing.sm },
  pill: { paddingHorizontal: Spacing.md, paddingVertical: Spacing.sm, borderRadius: Radius.full, backgroundColor: Colors.surfaceSunken },
  pillActive: { backgroundColor: Colors.accentLight },
  pillText: { fontSize: FontSize.sm, color: Colors.inkMuted, fontWeight: "500" },
  pillTextActive: { color: Colors.accent, fontWeight: "600" },
  saveBtn: { backgroundColor: Colors.accent, borderRadius: Radius.lg, padding: Spacing.lg, alignItems: "center", marginTop: Spacing.xl, ...Shadow.md },
  saveBtnPressed: { opacity: 0.85, transform: [{ scale: 0.98 }] },
  saveBtnText: { color: "white", fontSize: FontSize.base, fontWeight: "600" },
});
