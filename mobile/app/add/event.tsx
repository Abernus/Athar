import { useState } from "react";
import {
  ScrollView,
  Text,
  TextInput,
  Pressable,
  StyleSheet,
  Alert,
  View,
} from "react-native";
import { useRouter } from "expo-router";
import { Colors, FontSize, Spacing, Radius, Shadow } from "@/lib/theme";
import { useResearchStore } from "@/stores/research-store";
import type { EventType } from "@/types";
import { EVENT_TYPE_LABELS } from "@/lib/constants";

const EVENT_TYPES: EventType[] = [
  "birth",
  "death",
  "marriage",
  "migration",
  "conflict",
  "founding",
  "political",
  "economic",
  "religious",
  "social",
  "cultural",
  "legal",
  "other",
];

export default function AddEventScreen() {
  const router = useRouter();
  const { addEvent } = useResearchStore();
  const [title, setTitle] = useState("");
  const [eventType, setEventType] = useState<EventType>("other");
  const [description, setDescription] = useState("");
  const [dateStart, setDateStart] = useState("");
  const [tags, setTags] = useState("");

  function save() {
    if (!title.trim()) {
      Alert.alert("Titre requis");
      return;
    }
    addEvent({
      title: title.trim(),
      eventType,
      description: description.trim(),
      dateStart: dateStart
        ? { value: dateStart.trim(), precision: "estimated" }
        : undefined,
      tags: tags
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean),
      notes: "",
    });
    Alert.alert("Événement ajouté", `${title.trim()} a été créé.`, [
      { text: "OK", onPress: () => router.back() },
    ]);
  }

  return (
    <ScrollView
      style={styles.scroll}
      contentContainerStyle={styles.content}
      keyboardShouldPersistTaps="handled"
    >
      <View style={styles.card}>
        <Text style={styles.label}>Titre *</Text>
        <TextInput
          style={styles.input}
          value={title}
          onChangeText={setTitle}
          placeholder="ex. Migration vers la France"
          placeholderTextColor={Colors.inkMuted}
          autoFocus
        />

        <Text style={styles.label}>Type</Text>
        <View style={styles.typeGrid}>
          {EVENT_TYPES.map((t) => {
            const isActive = eventType === t;
            return (
              <Pressable
                key={t}
                style={[styles.typePill, isActive && styles.typePillActive]}
                onPress={() => setEventType(t)}
              >
                <Text
                  style={[
                    styles.typePillText,
                    isActive && styles.typePillTextActive,
                  ]}
                >
                  {EVENT_TYPE_LABELS[t]}
                </Text>
              </Pressable>
            );
          })}
        </View>

        <Text style={styles.label}>Date (estimée)</Text>
        <TextInput
          style={styles.input}
          value={dateStart}
          onChangeText={setDateStart}
          placeholder="ex. 1925, vers 1930"
          placeholderTextColor={Colors.inkMuted}
        />

        <Text style={styles.label}>Description</Text>
        <TextInput
          style={[styles.input, styles.multiline]}
          value={description}
          onChangeText={setDescription}
          placeholder="Contexte et détails..."
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
          placeholder="migration, kabylie"
          placeholderTextColor={Colors.inkMuted}
        />
      </View>

      <Pressable
        style={({ pressed }) => [styles.saveBtn, pressed && styles.saveBtnPressed]}
        onPress={save}
      >
        <Text style={styles.saveBtnText}>Créer l'événement</Text>
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
  typeGrid: { flexDirection: "row", flexWrap: "wrap", gap: Spacing.sm },
  typePill: {
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderRadius: Radius.full,
    backgroundColor: Colors.surfaceSunken,
  },
  typePillActive: {
    backgroundColor: Colors.accentLight,
  },
  typePillText: {
    fontSize: FontSize.sm,
    color: Colors.inkMuted,
    fontWeight: "500",
  },
  typePillTextActive: { color: Colors.accent, fontWeight: "600" },
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
