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
import type { GroupType } from "@/types";
import { GROUP_TYPE_LABELS } from "@/lib/constants";

const GROUP_TYPES: GroupType[] = [
  "family",
  "lineage",
  "tribe",
  "institution",
  "community",
  "association",
  "political",
  "religious",
  "military",
  "economic",
  "other",
];

export default function AddGroupScreen() {
  const router = useRouter();
  const { addGroup } = useResearchStore();
  const [name, setName] = useState("");
  const [groupType, setGroupType] = useState<GroupType>("family");
  const [summary, setSummary] = useState("");
  const [tags, setTags] = useState("");

  async function save() {
    if (!name.trim()) {
      Alert.alert("Nom requis");
      return;
    }
    const result = await addGroup({
      name: name.trim(),
      groupType,
      summary: summary.trim(),
      tags: tags
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean),
      notes: "",
    });
    if (!result) {
      Alert.alert("Erreur", "Impossible de sauvegarder.");
      return;
    }
    Alert.alert("Groupe ajouté", `${name.trim()} a été créé.`, [
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
        <Text style={styles.label}>Nom du groupe *</Text>
        <TextInput
          style={styles.input}
          value={name}
          onChangeText={setName}
          placeholder="ex. Famille Ben Mostefa, FLN"
          placeholderTextColor={Colors.inkMuted}
          autoFocus
        />

        <Text style={styles.label}>Type</Text>
        <View style={styles.typeGrid}>
          {GROUP_TYPES.map((t) => {
            const isActive = groupType === t;
            return (
              <Pressable
                key={t}
                style={[styles.typePill, isActive && styles.typePillActive]}
                onPress={() => setGroupType(t)}
              >
                <Text
                  style={[
                    styles.typePillText,
                    isActive && styles.typePillTextActive,
                  ]}
                >
                  {GROUP_TYPE_LABELS[t]}
                </Text>
              </Pressable>
            );
          })}
        </View>

        <Text style={styles.label}>Description</Text>
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

        <Text style={styles.label}>Tags</Text>
        <TextInput
          style={styles.input}
          value={tags}
          onChangeText={setTags}
          placeholder="famille, kabylie, résistance"
          placeholderTextColor={Colors.inkMuted}
        />
      </View>

      <Pressable
        style={({ pressed }) => [
          styles.saveBtn,
          pressed && styles.saveBtnPressed,
        ]}
        onPress={save}
      >
        <Text style={styles.saveBtnText}>Créer le groupe</Text>
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
