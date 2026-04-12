import { useState } from "react";
import { ScrollView, View, Text, TextInput, Pressable, StyleSheet, Alert } from "react-native";
import { useRouter } from "expo-router";
import { Colors, FontSize, Spacing, Radius } from "@/lib/theme";
import { useResearchStore } from "@/stores/research-store";

export default function AddPersonScreen() {
  const router = useRouter();
  const { addPerson } = useResearchStore();
  const [name, setName] = useState("");
  const [alternates, setAlternates] = useState("");
  const [summary, setSummary] = useState("");
  const [birthYear, setBirthYear] = useState("");
  const [deathYear, setDeathYear] = useState("");
  const [tags, setTags] = useState("");

  function save() {
    if (!name.trim()) {
      Alert.alert("Nom requis", "Saisissez au moins le nom principal.");
      return;
    }
    addPerson({
      primaryName: name.trim(),
      alternateNames: alternates.split(",").map((s) => s.trim()).filter(Boolean),
      summary: summary.trim(),
      birthDate: birthYear ? { value: birthYear.trim(), precision: "estimated" } : undefined,
      deathDate: deathYear ? { value: deathYear.trim(), precision: "estimated" } : undefined,
      tags: tags.split(",").map((s) => s.trim()).filter(Boolean),
      notes: "",
    });
    Alert.alert("Personne ajoutée", `${name.trim()} a été créée.`, [
      { text: "OK", onPress: () => router.back() },
    ]);
  }

  return (
    <ScrollView style={styles.scroll} contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
      <Text style={styles.label}>Nom principal *</Text>
      <TextInput style={styles.input} value={name} onChangeText={setName} placeholder="Prénom et nom" placeholderTextColor={Colors.inkMuted} autoFocus />

      <Text style={styles.label}>Variantes de nom</Text>
      <TextInput style={styles.input} value={alternates} onChangeText={setAlternates} placeholder="Séparées par des virgules" placeholderTextColor={Colors.inkMuted} />

      <View style={styles.row}>
        <View style={styles.half}>
          <Text style={styles.label}>Naissance (année)</Text>
          <TextInput style={styles.input} value={birthYear} onChangeText={setBirthYear} placeholder="ex. 1898" placeholderTextColor={Colors.inkMuted} keyboardType="numeric" />
        </View>
        <View style={styles.half}>
          <Text style={styles.label}>Décès (année)</Text>
          <TextInput style={styles.input} value={deathYear} onChangeText={setDeathYear} placeholder="ex. 1971" placeholderTextColor={Colors.inkMuted} keyboardType="numeric" />
        </View>
      </View>

      <Text style={styles.label}>Résumé</Text>
      <TextInput style={[styles.input, styles.multiline]} value={summary} onChangeText={setSummary} placeholder="Courte description..." placeholderTextColor={Colors.inkMuted} multiline numberOfLines={3} textAlignVertical="top" />

      <Text style={styles.label}>Tags (séparés par des virgules)</Text>
      <TextInput style={styles.input} value={tags} onChangeText={setTags} placeholder="migration, kabylie, ouvrier" placeholderTextColor={Colors.inkMuted} />

      <Pressable style={styles.saveBtn} onPress={save}>
        <Text style={styles.saveBtnText}>Créer la personne</Text>
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
  row: { flexDirection: "row", gap: Spacing.sm },
  half: { flex: 1 },
  saveBtn: { backgroundColor: Colors.accent, borderRadius: Radius.md, padding: Spacing.lg, alignItems: "center", marginTop: Spacing.xl },
  saveBtnText: { color: "white", fontSize: FontSize.base, fontWeight: "600" },
});
