import { useState, useEffect } from "react";
import {
  ScrollView,
  Text,
  TextInput,
  Pressable,
  StyleSheet,
  Alert,
  View,
} from "react-native";
import { useRouter, useLocalSearchParams, useNavigation } from "expo-router";
import { Colors, FontSize, Spacing, Radius, Shadow } from "@/lib/theme";
import { useResearchStore } from "@/stores/research-store";
import type { EventType } from "@/types";
import { EVENT_TYPE_LABELS } from "@/lib/constants";

const EVENT_TYPES: EventType[] = [
  "birth", "death", "marriage", "migration", "conflict", "founding",
  "political", "economic", "religious", "social", "cultural", "legal", "other",
];

export default function AddEventScreen() {
  const router = useRouter();
  const navigation = useNavigation();
  const { editId } = useLocalSearchParams<{ editId?: string }>();
  const { addEvent, updateEvent, events } = useResearchStore();

  const existing = editId ? events.find((e) => e.id === editId) : undefined;
  const isEdit = !!existing;

  const [title, setTitle] = useState("");
  const [eventType, setEventType] = useState<EventType>("other");
  const [description, setDescription] = useState("");
  const [dateStart, setDateStart] = useState("");
  const [tags, setTags] = useState("");
  const [notes, setNotes] = useState("");

  useEffect(() => {
    if (existing) {
      navigation.setOptions({ title: "Modifier l'événement" });
      setTitle(existing.title);
      setEventType(existing.eventType);
      setDescription(existing.description);
      setDateStart(existing.dateStart?.value ?? "");
      setTags(existing.tags.join(", "));
      setNotes(existing.notes);
    }
  }, [existing?.id]);

  async function save() {
    if (!title.trim()) { Alert.alert("Titre requis"); return; }
    const parsed = {
      title: title.trim(),
      eventType,
      description: description.trim(),
      dateStart: dateStart ? { value: dateStart.trim(), precision: "estimated" as const } : undefined,
      tags: tags.split(",").map((s) => s.trim()).filter(Boolean),
      notes: notes.trim(),
    };
    if (isEdit) {
      const result = await updateEvent(editId!, parsed);
      if (!result) { Alert.alert("Erreur", "Impossible de sauvegarder."); return; }
      router.back();
    } else {
      const result = await addEvent(parsed);
      if (!result) { Alert.alert("Erreur", "Impossible de sauvegarder."); return; }
      Alert.alert("Événement ajouté", `${title.trim()} a été créé.`, [
        { text: "OK", onPress: () => router.back() },
      ]);
    }
  }

  return (
    <ScrollView style={styles.scroll} contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
      <View style={styles.card}>
        <Text style={styles.label}>Titre *</Text>
        <TextInput style={styles.input} value={title} onChangeText={setTitle} placeholder="ex. Migration vers la France" placeholderTextColor={Colors.inkMuted} autoFocus={!isEdit} />

        <Text style={styles.label}>Type</Text>
        <View style={styles.typeGrid}>
          {EVENT_TYPES.map((t) => (
            <Pressable key={t} style={[styles.typePill, eventType === t && styles.typePillActive]} onPress={() => setEventType(t)}>
              <Text style={[styles.typePillText, eventType === t && styles.typePillTextActive]}>{EVENT_TYPE_LABELS[t]}</Text>
            </Pressable>
          ))}
        </View>

        <Text style={styles.label}>Date (estimée)</Text>
        <TextInput style={styles.input} value={dateStart} onChangeText={setDateStart} placeholder="ex. 1925, vers 1930" placeholderTextColor={Colors.inkMuted} />

        <Text style={styles.label}>Description</Text>
        <TextInput style={[styles.input, styles.multiline]} value={description} onChangeText={setDescription} placeholder="Contexte et détails..." placeholderTextColor={Colors.inkMuted} multiline numberOfLines={3} textAlignVertical="top" />

        <Text style={styles.label}>Notes</Text>
        <TextInput style={[styles.input, styles.multiline]} value={notes} onChangeText={setNotes} placeholder="Notes libres..." placeholderTextColor={Colors.inkMuted} multiline numberOfLines={3} textAlignVertical="top" />

        <Text style={styles.label}>Tags</Text>
        <TextInput style={styles.input} value={tags} onChangeText={setTags} placeholder="migration, kabylie" placeholderTextColor={Colors.inkMuted} />
      </View>

      <Pressable style={({ pressed }) => [styles.saveBtn, pressed && styles.saveBtnPressed]} onPress={save}>
        <Text style={styles.saveBtnText}>{isEdit ? "Enregistrer" : "Créer l'événement"}</Text>
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
  typeGrid: { flexDirection: "row", flexWrap: "wrap", gap: Spacing.sm },
  typePill: { paddingHorizontal: Spacing.md, paddingVertical: Spacing.sm, borderRadius: Radius.full, backgroundColor: Colors.surfaceSunken },
  typePillActive: { backgroundColor: Colors.accentLight },
  typePillText: { fontSize: FontSize.sm, color: Colors.inkMuted, fontWeight: "500" },
  typePillTextActive: { color: Colors.accent, fontWeight: "600" },
  saveBtn: { backgroundColor: Colors.accent, borderRadius: Radius.lg, padding: Spacing.lg, alignItems: "center", marginTop: Spacing.xl, ...Shadow.md },
  saveBtnPressed: { opacity: 0.85, transform: [{ scale: 0.98 }] },
  saveBtnText: { color: "white", fontSize: FontSize.base, fontWeight: "600" },
});
