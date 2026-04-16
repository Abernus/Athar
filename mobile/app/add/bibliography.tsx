import { useState } from "react";
import {
  ScrollView,
  View,
  Text,
  TextInput,
  Pressable,
  StyleSheet,
  Alert,
} from "react-native";
import { useRouter } from "expo-router";
import { Colors, FontSize, Spacing, Radius, Shadow } from "@/lib/theme";
import { useResearchStore } from "@/stores/research-store";
import type { BibEntryType } from "@/types";

const ENTRY_TYPES: { key: BibEntryType; label: string }[] = [
  { key: "book", label: "Livre" },
  { key: "article", label: "Article" },
  { key: "thesis", label: "Thèse" },
  { key: "chapter", label: "Chapitre" },
  { key: "report", label: "Rapport" },
  { key: "website", label: "Site web" },
  { key: "archive_guide", label: "Guide d'archives" },
];

export default function AddBibliographyScreen() {
  const router = useRouter();
  const { addBibEntry } = useResearchStore();
  const [entryType, setEntryType] = useState<BibEntryType>("book");
  const [title, setTitle] = useState("");
  const [authors, setAuthors] = useState("");
  const [year, setYear] = useState("");
  const [publisher, setPublisher] = useState("");
  const [journal, setJournal] = useState("");
  const [pages, setPages] = useState("");
  const [url, setUrl] = useState("");
  const [abstract, setAbstract] = useState("");
  const [tags, setTags] = useState("");

  async function save() {
    if (!title.trim()) {
      Alert.alert("Titre requis");
      return;
    }
    const result = await addBibEntry({
      entryType,
      title: title.trim(),
      authors: authors.trim(),
      year: year.trim(),
      publisher: publisher.trim(),
      journal: journal.trim(),
      volume: "",
      pages: pages.trim(),
      url: url.trim(),
      isbn: "",
      abstract: abstract.trim(),
      notes: "",
      tags: tags.split(",").map((s) => s.trim()).filter(Boolean),
    });
    if (!result) { Alert.alert("Erreur", "Impossible de sauvegarder."); return; }
    Alert.alert("Entrée ajoutée", title.trim(), [
      { text: "OK", onPress: () => router.back() },
    ]);
  }

  return (
    <ScrollView style={styles.scroll} contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
      <View style={styles.card}>
        <Text style={styles.label}>Type</Text>
        <View style={styles.pillGrid}>
          {ENTRY_TYPES.map((t) => (
            <Pressable key={t.key} style={[styles.pill, entryType === t.key && styles.pillActive]} onPress={() => setEntryType(t.key)}>
              <Text style={[styles.pillText, entryType === t.key && styles.pillTextActive]}>{t.label}</Text>
            </Pressable>
          ))}
        </View>

        <Text style={styles.label}>Titre *</Text>
        <TextInput style={styles.input} value={title} onChangeText={setTitle} placeholder="Titre de l'ouvrage ou article" placeholderTextColor={Colors.inkMuted} autoFocus />

        <Text style={styles.label}>Auteur(s)</Text>
        <TextInput style={styles.input} value={authors} onChangeText={setAuthors} placeholder="Nom, Prénom ; Nom, Prénom" placeholderTextColor={Colors.inkMuted} />

        <View style={styles.row}>
          <View style={styles.half}>
            <Text style={styles.label}>Année</Text>
            <TextInput style={styles.input} value={year} onChangeText={setYear} placeholder="2003" placeholderTextColor={Colors.inkMuted} keyboardType="numeric" />
          </View>
          <View style={styles.half}>
            <Text style={styles.label}>Pages</Text>
            <TextInput style={styles.input} value={pages} onChangeText={setPages} placeholder="pp. 42-67" placeholderTextColor={Colors.inkMuted} />
          </View>
        </View>

        <Text style={styles.label}>Éditeur / Revue</Text>
        <TextInput style={styles.input} value={entryType === "article" ? journal : publisher} onChangeText={entryType === "article" ? setJournal : setPublisher} placeholder={entryType === "article" ? "Nom de la revue" : "Maison d'édition"} placeholderTextColor={Colors.inkMuted} />

        <Text style={styles.label}>URL</Text>
        <TextInput style={styles.input} value={url} onChangeText={setUrl} placeholder="https://..." placeholderTextColor={Colors.inkMuted} autoCapitalize="none" keyboardType="url" />

        <Text style={styles.label}>Résumé</Text>
        <TextInput style={[styles.input, styles.multiline]} value={abstract} onChangeText={setAbstract} placeholder="Résumé analytique..." placeholderTextColor={Colors.inkMuted} multiline numberOfLines={3} textAlignVertical="top" />

        <Text style={styles.label}>Tags</Text>
        <TextInput style={styles.input} value={tags} onChangeText={setTags} placeholder="historiographie, migration, sociologie" placeholderTextColor={Colors.inkMuted} />
      </View>

      <Pressable style={({ pressed }) => [styles.saveBtn, pressed && styles.saveBtnPressed]} onPress={save}>
        <Text style={styles.saveBtnText}>Ajouter à la bibliographie</Text>
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
