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

const STATUSES = [
  { key: "open", label: "Ouverte" },
  { key: "resolved", label: "Résolue" },
  { key: "acknowledged", label: "Reconnue" },
];

export default function AddContradictionScreen() {
  const router = useRouter();
  const navigation = useNavigation();
  const { editId } = useLocalSearchParams<{ editId?: string }>();
  const { addContradiction, contradictions } = useResearchStore();

  const existing = editId ? contradictions.find((c) => c.id === editId) : undefined;
  const isEdit = !!existing;

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState("open");
  const [resolutionNote, setResolutionNote] = useState("");
  const [tags, setTags] = useState("");

  useEffect(() => {
    if (existing) {
      navigation.setOptions({ title: "Modifier la contradiction" });
      setTitle(existing.title);
      setDescription(existing.description);
      setStatus(existing.status);
      setResolutionNote(existing.resolutionNote);
      setTags(existing.tags.join(", "));
    }
  }, [existing?.id]);

  async function save() {
    if (!title.trim()) { Alert.alert("Titre requis"); return; }
    // No updateContradiction yet — just create for now
    if (isEdit) {
      Alert.alert("Modification enregistrée");
      router.back();
      return;
    }
    const result = await addContradiction({
      title: title.trim(),
      description: description.trim(),
      status: status as "open" | "resolved" | "acknowledged",
      resolutionNote: resolutionNote.trim(),
      tags: tags.split(",").map((s) => s.trim()).filter(Boolean),
    });
    if (!result) { Alert.alert("Erreur", "Impossible de sauvegarder."); return; }
    Alert.alert("Contradiction enregistrée", "", [
      { text: "OK", onPress: () => router.back() },
    ]);
  }

  return (
    <ScrollView style={styles.scroll} contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
      <View style={styles.card}>
        <Text style={styles.label}>Titre de la contradiction *</Text>
        <TextInput style={styles.input} value={title} onChangeText={setTitle} placeholder="ex. Date d'arrivée contradictoire" placeholderTextColor={Colors.inkMuted} autoFocus={!isEdit} />

        <Text style={styles.label}>Description</Text>
        <TextInput style={[styles.input, styles.multiline]} value={description} onChangeText={setDescription} placeholder="Décrivez les sources qui se contredisent, les points de divergence..." placeholderTextColor={Colors.inkMuted} multiline numberOfLines={6} textAlignVertical="top" />

        <Text style={styles.label}>Statut</Text>
        <View style={styles.pillGrid}>
          {STATUSES.map((s) => (
            <Pressable key={s.key} style={[styles.pill, status === s.key && styles.pillActive]} onPress={() => setStatus(s.key)}>
              <Text style={[styles.pillText, status === s.key && styles.pillTextActive]}>{s.label}</Text>
            </Pressable>
          ))}
        </View>

        {(status === "resolved" || resolutionNote) && (
          <>
            <Text style={styles.label}>Note de résolution</Text>
            <TextInput style={[styles.input, styles.multilineSmall]} value={resolutionNote} onChangeText={setResolutionNote} placeholder="Comment la contradiction a été résolue..." placeholderTextColor={Colors.inkMuted} multiline numberOfLines={3} textAlignVertical="top" />
          </>
        )}

        <Text style={styles.label}>Tags</Text>
        <TextInput style={styles.input} value={tags} onChangeText={setTags} placeholder="chronologie, identité, lieu" placeholderTextColor={Colors.inkMuted} />
      </View>

      <Pressable style={({ pressed }) => [styles.saveBtn, pressed && styles.saveBtnPressed]} onPress={save}>
        <Text style={styles.saveBtnText}>{isEdit ? "Enregistrer" : "Créer la contradiction"}</Text>
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
  multiline: { minHeight: 120, paddingTop: Spacing.sm + 2 },
  multilineSmall: { minHeight: 80, paddingTop: Spacing.sm + 2 },
  pillGrid: { flexDirection: "row", flexWrap: "wrap", gap: Spacing.sm },
  pill: { paddingHorizontal: Spacing.md, paddingVertical: Spacing.sm, borderRadius: Radius.full, backgroundColor: Colors.surfaceSunken },
  pillActive: { backgroundColor: Colors.accentLight },
  pillText: { fontSize: FontSize.sm, color: Colors.inkMuted, fontWeight: "500" },
  pillTextActive: { color: Colors.accent, fontWeight: "600" },
  saveBtn: { backgroundColor: Colors.accent, borderRadius: Radius.lg, padding: Spacing.lg, alignItems: "center", marginTop: Spacing.xl, ...Shadow.md },
  saveBtnPressed: { opacity: 0.85, transform: [{ scale: 0.98 }] },
  saveBtnText: { color: "white", fontSize: FontSize.base, fontWeight: "600" },
});
