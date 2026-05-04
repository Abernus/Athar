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
import type { GroupType } from "@/types";
import { GROUP_TYPE_LABELS } from "@/lib/constants";

const GROUP_TYPES: GroupType[] = [
  "family", "lineage", "tribe", "institution", "community",
  "association", "political", "religious", "military", "economic", "other",
];

export default function AddGroupScreen() {
  const router = useRouter();
  const navigation = useNavigation();
  const { editId } = useLocalSearchParams<{ editId?: string }>();
  const { addGroup, updateGroup, groups } = useResearchStore();

  const existing = editId ? groups.find((g) => g.id === editId) : undefined;
  const isEdit = !!existing;

  const [name, setName] = useState("");
  const [groupType, setGroupType] = useState<GroupType>("family");
  const [summary, setSummary] = useState("");
  const [tags, setTags] = useState("");
  const [notes, setNotes] = useState("");

  useEffect(() => {
    if (existing) {
      navigation.setOptions({ title: "Modifier le groupe" });
      setName(existing.name);
      setGroupType(existing.groupType);
      setSummary(existing.summary);
      setTags(existing.tags.join(", "));
      setNotes(existing.notes);
    }
  }, [existing?.id]);

  async function save() {
    if (!name.trim()) { Alert.alert("Nom requis"); return; }
    const parsed = {
      name: name.trim(),
      groupType,
      summary: summary.trim(),
      tags: tags.split(",").map((s) => s.trim()).filter(Boolean),
      notes: notes.trim(),
    };
    if (isEdit) {
      const result = await updateGroup(editId!, parsed);
      if (!result) { Alert.alert("Erreur", "Impossible de sauvegarder."); return; }
      router.back();
    } else {
      const result = await addGroup(parsed);
      if (!result) { Alert.alert("Erreur", "Impossible de sauvegarder."); return; }
      Alert.alert("Groupe ajouté", `${name.trim()} a été créé.`, [
        { text: "OK", onPress: () => router.back() },
      ]);
    }
  }

  return (
    <ScrollView style={styles.scroll} contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
      <View style={styles.card}>
        <Text style={styles.label}>Nom du groupe *</Text>
        <TextInput style={styles.input} value={name} onChangeText={setName} placeholder="ex. Famille Ben Mostefa, FLN" placeholderTextColor={Colors.inkMuted} autoFocus={!isEdit} />

        <Text style={styles.label}>Type</Text>
        <View style={styles.typeGrid}>
          {GROUP_TYPES.map((t) => (
            <Pressable key={t} style={[styles.typePill, groupType === t && styles.typePillActive]} onPress={() => setGroupType(t)}>
              <Text style={[styles.typePillText, groupType === t && styles.typePillTextActive]}>{GROUP_TYPE_LABELS[t]}</Text>
            </Pressable>
          ))}
        </View>

        <Text style={styles.label}>Description</Text>
        <TextInput style={[styles.input, styles.multiline]} value={summary} onChangeText={setSummary} placeholder="Courte description..." placeholderTextColor={Colors.inkMuted} multiline numberOfLines={3} textAlignVertical="top" />

        <Text style={styles.label}>Notes</Text>
        <TextInput style={[styles.input, styles.multiline]} value={notes} onChangeText={setNotes} placeholder="Notes libres..." placeholderTextColor={Colors.inkMuted} multiline numberOfLines={3} textAlignVertical="top" />

        <Text style={styles.label}>Tags</Text>
        <TextInput style={styles.input} value={tags} onChangeText={setTags} placeholder="famille, kabylie, résistance" placeholderTextColor={Colors.inkMuted} />
      </View>

      <Pressable style={({ pressed }) => [styles.saveBtn, pressed && styles.saveBtnPressed]} onPress={save}>
        <Text style={styles.saveBtnText}>{isEdit ? "Enregistrer" : "Créer le groupe"}</Text>
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
