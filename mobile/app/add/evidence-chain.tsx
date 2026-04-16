import { useState } from "react";
import { ScrollView, View, Text, TextInput, Pressable, StyleSheet, Alert } from "react-native";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { Colors, FontSize, Spacing, Radius, Shadow } from "@/lib/theme";
import { useResearchStore } from "@/stores/research-store";
import type { ClaimStatus } from "@/types";

const STATUSES: { key: ClaimStatus; label: string; color: string }[] = [
  { key: "unverified", label: "Non vérifié", color: Colors.inkMuted },
  { key: "supported", label: "Étayé", color: Colors.success },
  { key: "weakly_supported", label: "Faiblement étayé", color: Colors.warning },
  { key: "contested", label: "Contesté", color: "#EA580C" },
  { key: "refuted", label: "Réfuté", color: Colors.danger },
];

export default function AddEvidenceChainScreen() {
  const router = useRouter();
  const { addEvidenceChain } = useResearchStore();
  const [title, setTitle] = useState("");
  const [claim, setClaim] = useState("");
  const [status, setStatus] = useState<ClaimStatus>("unverified");
  const [conclusion, setConclusion] = useState("");
  const [tags, setTags] = useState("");

  async function save() {
    if (!title.trim() || !claim.trim()) {
      Alert.alert("Requis", "Titre et affirmation sont obligatoires.");
      return;
    }
    const result = await addEvidenceChain({
      title: title.trim(), claimText: claim.trim(), claimStatus: status,
      conclusion: conclusion.trim(),
      tags: tags.split(",").map((s) => s.trim()).filter(Boolean),
    });
    if (!result) { Alert.alert("Erreur"); return; }
    Alert.alert("Chaîne créée", "Ajoutez des maillons pour construire la preuve.", [
      { text: "OK", onPress: () => router.back() },
    ]);
  }

  return (
    <ScrollView style={styles.scroll} contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
      <View style={styles.infoCard}>
        <Ionicons name="link-outline" size={20} color={Colors.accent} />
        <Text style={styles.infoText}>
          Une chaîne de preuve relie une affirmation à ses appuis documentaires. Chaque maillon est une source, un extrait ou un témoignage.
        </Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.label}>Titre *</Text>
        <TextInput style={styles.input} value={title} onChangeText={setTitle} placeholder="ex. Preuve de la date d'arrivée en France" placeholderTextColor={Colors.inkMuted} autoFocus />

        <Text style={styles.label}>Affirmation à démontrer *</Text>
        <TextInput style={[styles.input, styles.multiline]} value={claim} onChangeText={setClaim} placeholder="ex. Ahmed Ben Mostefa est arrivé en France en 1925" placeholderTextColor={Colors.inkMuted} multiline numberOfLines={3} textAlignVertical="top" />

        <Text style={styles.label}>Statut de la preuve</Text>
        <View style={styles.pillGrid}>
          {STATUSES.map((s) => (
            <Pressable key={s.key} style={[styles.pill, status === s.key && { backgroundColor: s.color + "20" }]} onPress={() => setStatus(s.key)}>
              <View style={[styles.statusDot, { backgroundColor: s.color }]} />
              <Text style={[styles.pillText, status === s.key && { color: s.color, fontWeight: "600" }]}>{s.label}</Text>
            </Pressable>
          ))}
        </View>

        <Text style={styles.label}>Conclusion</Text>
        <TextInput style={[styles.input, styles.multiline]} value={conclusion} onChangeText={setConclusion} placeholder="Synthèse de ce que la chaîne de preuves démontre..." placeholderTextColor={Colors.inkMuted} multiline numberOfLines={3} textAlignVertical="top" />

        <Text style={styles.label}>Tags</Text>
        <TextInput style={styles.input} value={tags} onChangeText={setTags} placeholder="chronologie, identité, migration" placeholderTextColor={Colors.inkMuted} />
      </View>

      <Pressable style={({ pressed }) => [styles.saveBtn, pressed && styles.saveBtnPressed]} onPress={save}>
        <Text style={styles.saveBtnText}>Créer la chaîne</Text>
      </Pressable>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scroll: { flex: 1, backgroundColor: Colors.surfaceSunken },
  content: { padding: Spacing.lg, paddingBottom: Spacing.xxxl },
  infoCard: {
    flexDirection: "row", gap: Spacing.md, backgroundColor: Colors.accentLight,
    borderRadius: Radius.lg, padding: Spacing.lg, marginBottom: Spacing.sm, alignItems: "flex-start",
  },
  infoText: { flex: 1, fontSize: FontSize.sm, color: Colors.accentDark, lineHeight: 19 },
  card: { backgroundColor: Colors.surface, borderRadius: Radius.lg, padding: Spacing.lg, ...Shadow.sm },
  label: { fontSize: FontSize.sm, fontWeight: "600", color: Colors.inkSecondary, marginBottom: Spacing.xs, marginTop: Spacing.lg },
  input: { backgroundColor: Colors.surfaceSunken, borderRadius: Radius.md, paddingHorizontal: Spacing.md, paddingVertical: Spacing.sm + 2, fontSize: FontSize.base, color: Colors.ink },
  multiline: { minHeight: 80, paddingTop: Spacing.sm + 2 },
  pillGrid: { flexDirection: "row", flexWrap: "wrap", gap: Spacing.sm },
  pill: {
    flexDirection: "row", alignItems: "center", gap: Spacing.xs,
    paddingHorizontal: Spacing.md, paddingVertical: Spacing.sm,
    borderRadius: Radius.full, backgroundColor: Colors.surfaceSunken,
  },
  statusDot: { width: 8, height: 8, borderRadius: 4 },
  pillText: { fontSize: FontSize.sm, color: Colors.inkMuted, fontWeight: "500" },
  saveBtn: { backgroundColor: Colors.accent, borderRadius: Radius.lg, padding: Spacing.lg, alignItems: "center", marginTop: Spacing.xl, ...Shadow.md },
  saveBtnPressed: { opacity: 0.85, transform: [{ scale: 0.98 }] },
  saveBtnText: { color: "white", fontSize: FontSize.base, fontWeight: "600" },
});
