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
import { SOURCE_TYPE_LABELS } from "@/lib/constants";
import type { SourceType, ReliabilityLevel } from "@/types";

const SOURCE_TYPES: SourceType[] = [
  "primary", "secondary", "testimony", "private_archive", "internal_note", "other",
];

const RELIABILITY: { key: ReliabilityLevel; label: string }[] = [
  { key: "high", label: "Haute" },
  { key: "medium", label: "Moyenne" },
  { key: "low", label: "Basse" },
  { key: "unknown", label: "Inconnue" },
];

export default function AddSourceScreen() {
  const router = useRouter();
  const navigation = useNavigation();
  const { editId } = useLocalSearchParams<{ editId?: string }>();
  const { addSource, updateSource, sources } = useResearchStore();

  const existing = editId ? sources.find((s) => s.id === editId) : undefined;
  const isEdit = !!existing;

  const [title, setTitle] = useState("");
  const [sourceType, setSourceType] = useState<SourceType>("primary");
  const [authorName, setAuthorName] = useState("");
  const [origin, setOrigin] = useState("");
  const [reference, setReference] = useState("");
  const [archiveRef, setArchiveRef] = useState("");
  const [archiveFund, setArchiveFund] = useState("");
  const [repository, setRepository] = useState("");
  const [language, setLanguage] = useState("");
  const [reliability, setReliability] = useState<ReliabilityLevel>("unknown");
  const [summary, setSummary] = useState("");
  const [biasNotes, setBiasNotes] = useState("");
  const [tags, setTags] = useState("");

  useEffect(() => {
    if (existing) {
      navigation.setOptions({ title: "Modifier la source" });
      setTitle(existing.title);
      setSourceType(existing.sourceType);
      setAuthorName(existing.authorName ?? "");
      setOrigin(existing.origin);
      setReference(existing.reference);
      setArchiveRef(existing.archiveReference ?? "");
      setArchiveFund(existing.archiveFund ?? "");
      setRepository(existing.repositoryName ?? "");
      setLanguage(existing.language ?? "");
      setReliability((existing.reliabilityLevel ?? "unknown") as ReliabilityLevel);
      setSummary(existing.summary);
      setBiasNotes(existing.biasNotes ?? "");
      setTags(existing.tags.join(", "));
    }
  }, [existing?.id]);

  async function save() {
    if (!title.trim()) { Alert.alert("Titre requis"); return; }
    const parsed = {
      title: title.trim(),
      sourceType,
      origin: origin.trim(),
      reference: reference.trim(),
      summary: summary.trim(),
      criticalNote: "",
      authorName: authorName.trim(),
      language: language.trim(),
      archiveReference: archiveRef.trim(),
      archiveFund: archiveFund.trim(),
      repositoryName: repository.trim(),
      reliabilityLevel: reliability,
      biasNotes: biasNotes.trim(),
      tags: tags.split(",").map((s) => s.trim()).filter(Boolean),
    };
    if (isEdit) {
      const result = await updateSource(editId!, parsed);
      if (!result) { Alert.alert("Erreur", "Impossible de sauvegarder."); return; }
      router.back();
    } else {
      const result = await addSource(parsed);
      if (!result) { Alert.alert("Erreur", "Impossible de sauvegarder."); return; }
      Alert.alert("Source ajoutée", title.trim(), [
        { text: "OK", onPress: () => router.back() },
      ]);
    }
  }

  return (
    <ScrollView style={styles.scroll} contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
      <View style={styles.card}>
        <Text style={styles.label}>Titre *</Text>
        <TextInput style={styles.input} value={title} onChangeText={setTitle} placeholder="ex. Registre d'état civil de Tizi, 1898" placeholderTextColor={Colors.inkMuted} autoFocus={!isEdit} />

        <Text style={styles.label}>Type de source</Text>
        <View style={styles.pillGrid}>
          {SOURCE_TYPES.map((t) => (
            <Pressable key={t} style={[styles.pill, sourceType === t && styles.pillActive]} onPress={() => setSourceType(t)}>
              <Text style={[styles.pillText, sourceType === t && styles.pillTextActive]}>{SOURCE_TYPE_LABELS[t]}</Text>
            </Pressable>
          ))}
        </View>

        <Text style={styles.label}>Auteur / Producteur</Text>
        <TextInput style={styles.input} value={authorName} onChangeText={setAuthorName} placeholder="Nom de l'auteur ou institution" placeholderTextColor={Colors.inkMuted} />

        <Text style={styles.label}>Provenance</Text>
        <TextInput style={styles.input} value={origin} onChangeText={setOrigin} placeholder="ex. Archives nationales d'Algérie" placeholderTextColor={Colors.inkMuted} />

        <View style={styles.row}>
          <View style={styles.half}>
            <Text style={styles.label}>Cote / Référence</Text>
            <TextInput style={styles.input} value={archiveRef} onChangeText={setArchiveRef} placeholder="ex. FR ANOM 93/1" placeholderTextColor={Colors.inkMuted} />
          </View>
          <View style={styles.half}>
            <Text style={styles.label}>Fonds</Text>
            <TextInput style={styles.input} value={archiveFund} onChangeText={setArchiveFund} placeholder="ex. GGA" placeholderTextColor={Colors.inkMuted} />
          </View>
        </View>

        <Text style={styles.label}>Lieu de conservation</Text>
        <TextInput style={styles.input} value={repository} onChangeText={setRepository} placeholder="ex. ANOM Aix-en-Provence" placeholderTextColor={Colors.inkMuted} />

        <View style={styles.row}>
          <View style={styles.half}>
            <Text style={styles.label}>Langue</Text>
            <TextInput style={styles.input} value={language} onChangeText={setLanguage} placeholder="Français, Arabe..." placeholderTextColor={Colors.inkMuted} />
          </View>
          <View style={styles.half}>
            <Text style={styles.label}>Référence</Text>
            <TextInput style={styles.input} value={reference} onChangeText={setReference} placeholder="ISBN, URL..." placeholderTextColor={Colors.inkMuted} />
          </View>
        </View>

        <Text style={styles.label}>Fiabilité</Text>
        <View style={styles.pillGrid}>
          {RELIABILITY.map((r) => (
            <Pressable key={r.key} style={[styles.pill, reliability === r.key && styles.pillActive]} onPress={() => setReliability(r.key)}>
              <Text style={[styles.pillText, reliability === r.key && styles.pillTextActive]}>{r.label}</Text>
            </Pressable>
          ))}
        </View>

        <Text style={styles.label}>Résumé analytique</Text>
        <TextInput style={[styles.input, styles.multiline]} value={summary} onChangeText={setSummary} placeholder="De quoi traite cette source..." placeholderTextColor={Colors.inkMuted} multiline numberOfLines={3} textAlignVertical="top" />

        <Text style={styles.label}>Biais / réserves</Text>
        <TextInput style={[styles.input, styles.multiline]} value={biasNotes} onChangeText={setBiasNotes} placeholder="Limites, biais connus, contexte de production..." placeholderTextColor={Colors.inkMuted} multiline numberOfLines={2} textAlignVertical="top" />

        <Text style={styles.label}>Tags</Text>
        <TextInput style={styles.input} value={tags} onChangeText={setTags} placeholder="archive, état-civil, militaire" placeholderTextColor={Colors.inkMuted} />
      </View>

      <Pressable style={({ pressed }) => [styles.saveBtn, pressed && styles.saveBtnPressed]} onPress={save}>
        <Text style={styles.saveBtnText}>{isEdit ? "Enregistrer" : "Créer la source"}</Text>
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
  multiline: { minHeight: 70, paddingTop: Spacing.sm + 2 },
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
