import { useState } from "react";
import { ScrollView, View, Text, TextInput, Pressable, StyleSheet, Alert } from "react-native";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { Colors, FontSize, Spacing, Radius, Shadow } from "@/lib/theme";
import { useResearchStore } from "@/stores/research-store";

export default function AddCohortScreen() {
  const router = useRouter();
  const { addCohort } = useResearchStore();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [criteria, setCriteria] = useState("");
  const [tags, setTags] = useState("");

  async function save() {
    if (!title.trim()) { Alert.alert("Titre requis"); return; }
    const result = await addCohort({
      title: title.trim(), description: description.trim(), criteria: criteria.trim(),
      tags: tags.split(",").map((s) => s.trim()).filter(Boolean),
    });
    if (!result) { Alert.alert("Erreur"); return; }
    Alert.alert("Cohorte créée", "Ajoutez des personnes pour comparer leurs trajectoires.", [
      { text: "OK", onPress: () => router.back() },
    ]);
  }

  return (
    <ScrollView style={styles.scroll} contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
      <View style={styles.infoCard}>
        <Ionicons name="people" size={20} color={Colors.group.icon} />
        <Text style={styles.infoText}>
          La prosopographie étudie un groupe d'individus par champs comparables : origine, parcours, appartenances. Définissez les critères de votre cohorte.
        </Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.label}>Nom de la cohorte *</Text>
        <TextInput style={styles.input} value={title} onChangeText={setTitle} placeholder="ex. Ouvriers kabyles à Renault 1930-1950" placeholderTextColor={Colors.inkMuted} autoFocus />

        <Text style={styles.label}>Description</Text>
        <TextInput style={[styles.input, styles.multiline]} value={description} onChangeText={setDescription} placeholder="Qui fait partie de cette cohorte et pourquoi..." placeholderTextColor={Colors.inkMuted} multiline numberOfLines={3} textAlignVertical="top" />

        <Text style={styles.label}>Critères d'inclusion</Text>
        <TextInput style={[styles.input, styles.multiline]} value={criteria} onChangeText={setCriteria} placeholder="ex. Homme, né en Kabylie entre 1900-1920, migré en France, employé dans l'industrie" placeholderTextColor={Colors.inkMuted} multiline numberOfLines={3} textAlignVertical="top" />

        <Text style={styles.label}>Tags</Text>
        <TextInput style={styles.input} value={tags} onChangeText={setTags} placeholder="prosopographie, ouvriers, migration" placeholderTextColor={Colors.inkMuted} />
      </View>

      <Pressable style={({ pressed }) => [styles.saveBtn, pressed && styles.saveBtnPressed]} onPress={save}>
        <Text style={styles.saveBtnText}>Créer la cohorte</Text>
      </Pressable>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scroll: { flex: 1, backgroundColor: Colors.surfaceSunken },
  content: { padding: Spacing.lg, paddingBottom: Spacing.xxxl },
  infoCard: {
    flexDirection: "row", gap: Spacing.md, backgroundColor: Colors.group.bg,
    borderRadius: Radius.lg, padding: Spacing.lg, marginBottom: Spacing.sm, alignItems: "flex-start",
  },
  infoText: { flex: 1, fontSize: FontSize.sm, color: Colors.group.text, lineHeight: 19 },
  card: { backgroundColor: Colors.surface, borderRadius: Radius.lg, padding: Spacing.lg, ...Shadow.sm },
  label: { fontSize: FontSize.sm, fontWeight: "600", color: Colors.inkSecondary, marginBottom: Spacing.xs, marginTop: Spacing.lg },
  input: { backgroundColor: Colors.surfaceSunken, borderRadius: Radius.md, paddingHorizontal: Spacing.md, paddingVertical: Spacing.sm + 2, fontSize: FontSize.base, color: Colors.ink },
  multiline: { minHeight: 80, paddingTop: Spacing.sm + 2 },
  saveBtn: { backgroundColor: Colors.accent, borderRadius: Radius.lg, padding: Spacing.lg, alignItems: "center", marginTop: Spacing.xl, ...Shadow.md },
  saveBtnPressed: { opacity: 0.85, transform: [{ scale: 0.98 }] },
  saveBtnText: { color: "white", fontSize: FontSize.base, fontWeight: "600" },
});
