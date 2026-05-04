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

export default function AddPersonScreen() {
  const router = useRouter();
  const navigation = useNavigation();
  const { editId } = useLocalSearchParams<{ editId?: string }>();
  const { addPerson, updatePerson, persons } = useResearchStore();

  const existing = editId ? persons.find((p) => p.id === editId) : undefined;
  const isEdit = !!existing;

  const [name, setName] = useState("");
  const [alternates, setAlternates] = useState("");
  const [summary, setSummary] = useState("");
  const [birthYear, setBirthYear] = useState("");
  const [deathYear, setDeathYear] = useState("");
  const [tags, setTags] = useState("");
  const [notes, setNotes] = useState("");

  useEffect(() => {
    if (existing) {
      navigation.setOptions({ title: "Modifier la personne" });
      setName(existing.primaryName);
      setAlternates(existing.alternateNames.join(", "));
      setSummary(existing.summary);
      setBirthYear(existing.birthDate?.value ?? "");
      setDeathYear(existing.deathDate?.value ?? "");
      setTags(existing.tags.join(", "));
      setNotes(existing.notes);
    }
  }, [existing?.id]);

  async function save() {
    if (!name.trim()) {
      Alert.alert("Nom requis", "Saisissez au moins le nom principal.");
      return;
    }
    const parsed = {
      primaryName: name.trim(),
      alternateNames: alternates.split(",").map((s) => s.trim()).filter(Boolean),
      summary: summary.trim(),
      birthDate: birthYear ? { value: birthYear.trim(), precision: "estimated" as const } : undefined,
      deathDate: deathYear ? { value: deathYear.trim(), precision: "estimated" as const } : undefined,
      tags: tags.split(",").map((s) => s.trim()).filter(Boolean),
      notes: notes.trim(),
    };

    if (isEdit) {
      const result = await updatePerson(editId!, parsed);
      if (!result) { Alert.alert("Erreur", "Impossible de sauvegarder."); return; }
      router.back();
    } else {
      const result = await addPerson(parsed);
      if (!result) { Alert.alert("Erreur", "Impossible de sauvegarder."); return; }
      Alert.alert("Personne ajoutée", `${name.trim()} a été créée.`, [
        { text: "OK", onPress: () => router.back() },
      ]);
    }
  }

  return (
    <ScrollView
      style={styles.scroll}
      contentContainerStyle={styles.content}
      keyboardShouldPersistTaps="handled"
    >
      <View style={styles.card}>
        <Text style={styles.label}>Nom principal *</Text>
        <TextInput
          style={styles.input}
          value={name}
          onChangeText={setName}
          placeholder="Prénom et nom"
          placeholderTextColor={Colors.inkMuted}
          autoFocus={!isEdit}
        />

        <Text style={styles.label}>Variantes de nom</Text>
        <TextInput
          style={styles.input}
          value={alternates}
          onChangeText={setAlternates}
          placeholder="Séparées par des virgules"
          placeholderTextColor={Colors.inkMuted}
        />

        <View style={styles.row}>
          <View style={styles.half}>
            <Text style={styles.label}>Naissance</Text>
            <TextInput
              style={styles.input}
              value={birthYear}
              onChangeText={setBirthYear}
              placeholder="ex. 1898"
              placeholderTextColor={Colors.inkMuted}
              keyboardType="numeric"
            />
          </View>
          <View style={styles.half}>
            <Text style={styles.label}>Décès</Text>
            <TextInput
              style={styles.input}
              value={deathYear}
              onChangeText={setDeathYear}
              placeholder="ex. 1971"
              placeholderTextColor={Colors.inkMuted}
              keyboardType="numeric"
            />
          </View>
        </View>

        <Text style={styles.label}>Résumé</Text>
        <TextInput
          style={[styles.input, styles.multiline]}
          value={summary}
          onChangeText={setSummary}
          placeholder="Courte description..."
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
          placeholder="Notes libres..."
          placeholderTextColor={Colors.inkMuted}
          multiline
          numberOfLines={3}
          textAlignVertical="top"
        />

        <Text style={styles.label}>Tags</Text>
        <TextInput
          style={styles.input}
          value={tags}
          onChangeText={setTags}
          placeholder="migration, kabylie, ouvrier"
          placeholderTextColor={Colors.inkMuted}
        />
      </View>

      <Pressable
        style={({ pressed }) => [styles.saveBtn, pressed && styles.saveBtnPressed]}
        onPress={save}
      >
        <Text style={styles.saveBtnText}>
          {isEdit ? "Enregistrer" : "Créer la personne"}
        </Text>
      </Pressable>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scroll: { flex: 1, backgroundColor: Colors.surfaceSunken },
  content: { padding: Spacing.lg, paddingBottom: Spacing.xxxl },
  card: {
    backgroundColor: Colors.surface,
    borderRadius: Radius.lg,
    padding: Spacing.lg,
    ...Shadow.sm,
  },
  label: {
    fontSize: FontSize.sm,
    fontWeight: "600",
    color: Colors.inkSecondary,
    marginBottom: Spacing.xs,
    marginTop: Spacing.lg,
  },
  input: {
    backgroundColor: Colors.surfaceSunken,
    borderRadius: Radius.md,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm + 2,
    fontSize: FontSize.base,
    color: Colors.ink,
  },
  multiline: { minHeight: 80, paddingTop: Spacing.sm + 2 },
  row: { flexDirection: "row", gap: Spacing.sm },
  half: { flex: 1 },
  saveBtn: {
    backgroundColor: Colors.accent,
    borderRadius: Radius.lg,
    padding: Spacing.lg,
    alignItems: "center",
    marginTop: Spacing.xl,
    ...Shadow.md,
  },
  saveBtnPressed: { opacity: 0.85, transform: [{ scale: 0.98 }] },
  saveBtnText: { color: "white", fontSize: FontSize.base, fontWeight: "600" },
});
