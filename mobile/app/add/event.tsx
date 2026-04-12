import { useState } from "react";
import { ScrollView, Text, TextInput, Pressable, StyleSheet, Alert, View } from "react-native";
import { useRouter } from "expo-router";
import { Colors, FontSize, Spacing, Radius } from "@/lib/theme";
import { useResearchStore } from "@/stores/research-store";
import type { EventType } from "@/types";
import { EVENT_TYPE_LABELS } from "@/lib/constants";

const EVENT_TYPES: EventType[] = ["birth", "death", "marriage", "migration", "conflict", "founding", "political", "economic", "religious", "social", "cultural", "legal", "other"];

export default function AddEventScreen() {
  const router = useRouter();
  const { addEvent } = useResearchStore();
  const [title, setTitle] = useState("");
  const [eventType, setEventType] = useState<EventType>("other");
  const [description, setDescription] = useState("");
  const [dateStart, setDateStart] = useState("");
  const [tags, setTags] = useState("");

  function save() {
    if (!title.trim()) {
      Alert.alert("Titre requis");
      return;
    }
    addEvent({
      title: title.trim(),
      eventType,
      description: description.trim(),
      dateStart: dateStart ? { value: dateStart.trim(), precision: "estimated" } : undefined,
      tags: tags.split(",").map(s => s.trim()).filter(Boolean),
      notes: "",
    });
    Alert.alert("Événement ajouté", `${title.trim()} a été créé.`, [{ text: "OK", onPress: () => router.back() }]);
  }

  return (
    <ScrollView style={styles.scroll} contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
      <Text style={styles.label}>Titre *</Text>
      <TextInput style={styles.input} value={title} onChangeText={setTitle} placeholder="ex. Migration vers la France" placeholderTextColor={Colors.inkMuted} autoFocus />

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

      <Text style={styles.label}>Tags</Text>
      <TextInput style={styles.input} value={tags} onChangeText={setTags} placeholder="migration, kabylie" placeholderTextColor={Colors.inkMuted} />

      <Pressable style={styles.saveBtn} onPress={save}>
        <Text style={styles.saveBtnText}>Créer l'événement</Text>
      </Pressable>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scroll: { flex: 1, backgroundColor: Colors.surfaceSunken },
  content: { padding: Spacing.lg, paddingBottom: Spacing.xxl },
  label: { fontSize: FontSize.sm, fontWeight: "500", color: Colors.inkSecondary, marginBottom: Spacing.xs, marginTop: Spacing.md },
  input: { backgroundColor: Colors.surface, borderRadius: Radius.md, borderWidth: 1, borderColor: Colors.border, paddingHorizontal: Spacing.md, paddingVertical: Spacing.sm, fontSize: FontSize.base, color: Colors.ink },
  multiline: { minHeight: 80, paddingTop: Spacing.sm },
  typeGrid: { flexDirection: "row", flexWrap: "wrap", gap: Spacing.sm },
  typePill: { paddingHorizontal: Spacing.md, paddingVertical: Spacing.xs + 2, borderRadius: Radius.full, backgroundColor: Colors.surface, borderWidth: 1, borderColor: Colors.border },
  typePillActive: { backgroundColor: Colors.accentLight, borderColor: Colors.accent },
  typePillText: { fontSize: FontSize.xs, color: Colors.inkSecondary, fontWeight: "500" },
  typePillTextActive: { color: Colors.accent },
  saveBtn: { backgroundColor: Colors.accent, borderRadius: Radius.md, padding: Spacing.lg, alignItems: "center", marginTop: Spacing.xl },
  saveBtnText: { color: "white", fontSize: FontSize.base, fontWeight: "600" },
});
