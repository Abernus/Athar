import { useState } from "react";
import { ScrollView, Text, TextInput, Pressable, StyleSheet, Alert, View } from "react-native";
import { useRouter } from "expo-router";
import { Colors, FontSize, Spacing, Radius } from "@/lib/theme";
import { useResearchStore } from "@/stores/research-store";
import type { PlaceType } from "@/types";
import { PLACE_TYPE_LABELS } from "@/lib/constants";

const PLACE_TYPES: PlaceType[] = ["village", "city", "region", "country", "neighborhood", "building", "site", "other"];

export default function AddPlaceScreen() {
  const router = useRouter();
  const { addPlace } = useResearchStore();
  const [name, setName] = useState("");
  const [placeType, setPlaceType] = useState<PlaceType>("village");
  const [summary, setSummary] = useState("");
  const [tags, setTags] = useState("");

  function save() {
    if (!name.trim()) {
      Alert.alert("Nom requis");
      return;
    }
    addPlace({ name: name.trim(), placeType, summary: summary.trim(), tags: tags.split(",").map(s => s.trim()).filter(Boolean), notes: "" });
    Alert.alert("Lieu ajouté", `${name.trim()} a été créé.`, [{ text: "OK", onPress: () => router.back() }]);
  }

  return (
    <ScrollView style={styles.scroll} contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
      <Text style={styles.label}>Nom du lieu *</Text>
      <TextInput style={styles.input} value={name} onChangeText={setName} placeholder="ex. Tizi, Boulogne-Billancourt" placeholderTextColor={Colors.inkMuted} autoFocus />

      <Text style={styles.label}>Type</Text>
      <View style={styles.typeGrid}>
        {PLACE_TYPES.map((t) => (
          <Pressable key={t} style={[styles.typePill, placeType === t && styles.typePillActive]} onPress={() => setPlaceType(t)}>
            <Text style={[styles.typePillText, placeType === t && styles.typePillTextActive]}>{PLACE_TYPE_LABELS[t]}</Text>
          </Pressable>
        ))}
      </View>

      <Text style={styles.label}>Description</Text>
      <TextInput style={[styles.input, styles.multiline]} value={summary} onChangeText={setSummary} placeholder="Courte description..." placeholderTextColor={Colors.inkMuted} multiline numberOfLines={3} textAlignVertical="top" />

      <Text style={styles.label}>Tags (séparés par des virgules)</Text>
      <TextInput style={styles.input} value={tags} onChangeText={setTags} placeholder="algérie, migration" placeholderTextColor={Colors.inkMuted} />

      <Pressable style={styles.saveBtn} onPress={save}>
        <Text style={styles.saveBtnText}>Créer le lieu</Text>
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
