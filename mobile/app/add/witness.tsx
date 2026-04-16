import { useState } from "react";
import { ScrollView, View, Text, TextInput, Pressable, StyleSheet, Alert } from "react-native";
import { useRouter } from "expo-router";
import { Colors, FontSize, Spacing, Radius, Shadow } from "@/lib/theme";
import { useResearchStore } from "@/stores/research-store";
import type { ConsentStatus, SensitivityLevel } from "@/types";

const CONSENT: { key: ConsentStatus; label: string }[] = [
  { key: "obtained", label: "Obtenu" },
  { key: "pending", label: "En attente" },
  { key: "restricted", label: "Restreint" },
  { key: "refused", label: "Refusé" },
];

const SENSITIVITY: { key: SensitivityLevel; label: string }[] = [
  { key: "public", label: "Public" },
  { key: "normal", label: "Normal" },
  { key: "sensitive", label: "Sensible" },
  { key: "confidential", label: "Confidentiel" },
];

export default function AddWitnessScreen() {
  const router = useRouter();
  const { addWitness } = useResearchStore();
  const [name, setName] = useState("");
  const [birthYear, setBirthYear] = useState("");
  const [birthPlace, setBirthPlace] = useState("");
  const [location, setLocation] = useState("");
  const [relation, setRelation] = useState("");
  const [context, setContext] = useState("");
  const [consent, setConsent] = useState<ConsentStatus>("pending");
  const [sensitivity, setSensitivity] = useState<SensitivityLevel>("normal");
  const [tags, setTags] = useState("");

  async function save() {
    if (!name.trim()) { Alert.alert("Nom requis"); return; }
    const result = await addWitness({
      fullName: name.trim(), birthYear: birthYear.trim(), birthPlace: birthPlace.trim(),
      currentLocation: location.trim(), relationToSubject: relation.trim(),
      reliabilityAssessment: "", contextNotes: context.trim(),
      consentStatus: consent, consentNotes: "", sensitivityLevel: sensitivity,
      tags: tags.split(",").map((s) => s.trim()).filter(Boolean),
    });
    if (!result) { Alert.alert("Erreur"); return; }
    Alert.alert("Fiche témoin créée", name.trim(), [{ text: "OK", onPress: () => router.back() }]);
  }

  return (
    <ScrollView style={styles.scroll} contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
      <View style={styles.card}>
        <Text style={styles.label}>Nom complet *</Text>
        <TextInput style={styles.input} value={name} onChangeText={setName} placeholder="Prénom et nom du témoin" placeholderTextColor={Colors.inkMuted} autoFocus />

        <View style={styles.row}>
          <View style={styles.half}>
            <Text style={styles.label}>Année de naissance</Text>
            <TextInput style={styles.input} value={birthYear} onChangeText={setBirthYear} placeholder="ex. 1935" placeholderTextColor={Colors.inkMuted} keyboardType="numeric" />
          </View>
          <View style={styles.half}>
            <Text style={styles.label}>Lieu de naissance</Text>
            <TextInput style={styles.input} value={birthPlace} onChangeText={setBirthPlace} placeholder="ex. Tizi Ouzou" placeholderTextColor={Colors.inkMuted} />
          </View>
        </View>

        <Text style={styles.label}>Localisation actuelle</Text>
        <TextInput style={styles.input} value={location} onChangeText={setLocation} placeholder="Ville, pays" placeholderTextColor={Colors.inkMuted} />

        <Text style={styles.label}>Relation au sujet d'étude</Text>
        <TextInput style={styles.input} value={relation} onChangeText={setRelation} placeholder="ex. Petite-fille du sujet, voisin, ancien collègue" placeholderTextColor={Colors.inkMuted} />

        <Text style={styles.label}>Consentement</Text>
        <View style={styles.pillGrid}>
          {CONSENT.map((c) => (
            <Pressable key={c.key} style={[styles.pill, consent === c.key && styles.pillActive]} onPress={() => setConsent(c.key)}>
              <Text style={[styles.pillText, consent === c.key && styles.pillTextActive]}>{c.label}</Text>
            </Pressable>
          ))}
        </View>

        <Text style={styles.label}>Sensibilité</Text>
        <View style={styles.pillGrid}>
          {SENSITIVITY.map((s) => (
            <Pressable key={s.key} style={[styles.pill, sensitivity === s.key && styles.pillActive]} onPress={() => setSensitivity(s.key)}>
              <Text style={[styles.pillText, sensitivity === s.key && styles.pillTextActive]}>{s.label}</Text>
            </Pressable>
          ))}
        </View>

        <Text style={styles.label}>Contexte / notes</Text>
        <TextInput style={[styles.input, styles.multiline]} value={context} onChangeText={setContext} placeholder="Comment avez-vous contacté ce témoin, contexte de l'entretien..." placeholderTextColor={Colors.inkMuted} multiline numberOfLines={3} textAlignVertical="top" />

        <Text style={styles.label}>Tags</Text>
        <TextInput style={styles.input} value={tags} onChangeText={setTags} placeholder="famille, voisinage, militant" placeholderTextColor={Colors.inkMuted} />
      </View>

      <Pressable style={({ pressed }) => [styles.saveBtn, pressed && styles.saveBtnPressed]} onPress={save}>
        <Text style={styles.saveBtnText}>Créer la fiche témoin</Text>
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
  row: { flexDirection: "row", gap: Spacing.sm },
  half: { flex: 1 },
  pillGrid: { flexDirection: "row", flexWrap: "wrap", gap: Spacing.sm },
  pill: { paddingHorizontal: Spacing.md, paddingVertical: Spacing.sm, borderRadius: Radius.full, backgroundColor: Colors.surfaceSunken },
  pillActive: { backgroundColor: Colors.accentLight },
  pillText: { fontSize: FontSize.sm, color: Colors.inkMuted, fontWeight: "500" },
  pillTextActive: { color: Colors.accent, fontWeight: "600" },
  saveBtn: { backgroundColor: Colors.accent, borderRadius: Radius.lg, padding: Spacing.lg, alignItems: "center", marginTop: Spacing.xl, ...Shadow.md },
  saveBtnPressed: { opacity: 0.85, transform: [{ scale: 0.98 }] },
  saveBtnText: { color: "white", fontSize: FontSize.base, fontWeight: "600" },
});
