import { useState, useEffect } from "react";
import {
  ScrollView,
  View,
  Text,
  StyleSheet,
  Alert,
} from "react-native";
import { useRouter, useLocalSearchParams, useNavigation } from "expo-router";
import { Colors, FontSize, Spacing, Radius, Shadow } from "@/lib/theme";
import { useResearchStore } from "@/stores/research-store";
import { TagInput } from "@/components/TagInput";
import { Field } from "@/components/Field";
import { PressableScale } from "@/components/PressableScale";
import { haptic } from "@/lib/haptics";

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
  const [saving, setSaving] = useState(false);

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
      haptic.warning();
      Alert.alert("Nom requis", "Saisissez au moins le nom principal.");
      return;
    }
    if (saving) return;
    haptic.success();
    setSaving(true);
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
      if (!result) { setSaving(false); Alert.alert("Erreur", "Impossible de sauvegarder."); return; }
      router.back();
    } else {
      const result = await addPerson(parsed);
      if (!result) { setSaving(false); Alert.alert("Erreur", "Impossible de sauvegarder."); return; }
      router.replace(`/entity/person/${result.id}` as never);
    }
  }

  return (
    <ScrollView
      style={styles.scroll}
      contentContainerStyle={styles.content}
      keyboardShouldPersistTaps="handled"
    >
      <View style={styles.card}>
        <Field
          label="Nom principal"
          required
          icon="person-outline"
          value={name}
          onChangeText={setName}
          placeholder="Prénom et nom"
          autoFocus={!isEdit}
          containerStyle={{ marginTop: 0 }}
        />

        <Field
          label="Variantes de nom"
          icon="text-outline"
          value={alternates}
          onChangeText={setAlternates}
          placeholder="Séparées par des virgules"
        />

        <View style={styles.row}>
          <Field
            label="Naissance"
            icon="calendar-outline"
            value={birthYear}
            onChangeText={setBirthYear}
            placeholder="ex. 1898"
            keyboardType="numeric"
            containerStyle={styles.half}
          />
          <Field
            label="Décès"
            icon="calendar-outline"
            value={deathYear}
            onChangeText={setDeathYear}
            placeholder="ex. 1971"
            keyboardType="numeric"
            containerStyle={styles.half}
          />
        </View>

        <Field
          label="Résumé"
          value={summary}
          onChangeText={setSummary}
          placeholder="Courte description..."
          multiline
        />

        <Field
          label="Notes"
          value={notes}
          onChangeText={setNotes}
          placeholder="Notes libres..."
          multiline
        />

        <Text style={styles.label}>Tags</Text>
        <TagInput value={tags} onChangeText={setTags} placeholder="migration, kabylie, ouvrier" />
      </View>

      <PressableScale
        style={styles.saveBtn}
        haptics="none"
        onPress={save}
      >
        <Text style={styles.saveBtnText}>
          {saving ? "Enregistrement..." : isEdit ? "Enregistrer" : "Créer la personne"}
        </Text>
      </PressableScale>
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
    borderWidth: 1,
    borderColor: Colors.border,
    ...Shadow.sm,
  },
  label: {
    fontSize: FontSize.sm,
    fontWeight: "600",
    color: Colors.inkSecondary,
    marginBottom: Spacing.sm,
    marginTop: Spacing.lg,
    letterSpacing: 0.2,
  },
  row: { flexDirection: "row", gap: Spacing.md },
  half: { flex: 1 },
  saveBtn: {
    backgroundColor: Colors.accent,
    borderRadius: Radius.lg,
    padding: Spacing.lg,
    alignItems: "center",
    marginTop: Spacing.xl,
    ...Shadow.glow,
  },
  saveBtnText: { color: Colors.onAccent, fontSize: FontSize.base, fontWeight: "700" },
});
