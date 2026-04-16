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
import { useLocalSearchParams, useRouter } from "expo-router";
import { Colors, FontSize, Spacing, Radius, Shadow } from "@/lib/theme";
import { useResearchStore } from "@/stores/research-store";
import { EntityPicker } from "@/components/EntityPicker";
import { RELATIONSHIP_TYPE_LABELS, CONFIDENCE_LABELS } from "@/lib/constants";
import type { RelationshipType, ConfidenceLevel, EntityType } from "@/types";

const REL_TYPES: RelationshipType[] = [
  "kinship",
  "alliance",
  "membership",
  "neighborhood",
  "function",
  "institutional",
  "participation",
  "dependency",
  "transmission",
  "economic",
  "religious",
  "military",
  "political",
  "social",
  "other",
];

const CONF_LEVELS: ConfidenceLevel[] = [
  "confirmed",
  "probable",
  "uncertain",
  "contested",
];

export default function AddRelationshipScreen() {
  const { fromType, fromId } = useLocalSearchParams<{
    fromType?: string;
    fromId?: string;
  }>();
  const router = useRouter();
  const { addRelationship } = useResearchStore();

  const [sourceType, setSourceType] = useState<EntityType>(
    (fromType as EntityType) || "person"
  );
  const [sourceId, setSourceId] = useState<string | null>(fromId ?? null);
  const [targetType, setTargetType] = useState<EntityType>("person");
  const [targetId, setTargetId] = useState<string | null>(null);
  const [relType, setRelType] = useState<RelationshipType>("kinship");
  const [label, setLabel] = useState("");
  const [confidence, setConfidence] = useState<ConfidenceLevel>("probable");
  const [notes, setNotes] = useState("");

  async function save() {
    if (!sourceId || !targetId) {
      Alert.alert("Sélection requise", "Choisissez les deux entités à relier.");
      return;
    }
    const result = await addRelationship({
      sourceEntityType: sourceType,
      sourceEntityId: sourceId,
      targetEntityType: targetType,
      targetEntityId: targetId,
      relationshipType: relType,
      label: label.trim() || undefined,
      confidenceLevel: confidence,
      notes: notes.trim(),
    });
    if (!result) {
      Alert.alert("Erreur", "Impossible de créer la relation.");
      return;
    }
    Alert.alert("Relation créée", "", [
      { text: "OK", onPress: () => router.back() },
    ]);
  }

  return (
    <ScrollView
      style={styles.scroll}
      contentContainerStyle={styles.content}
      keyboardShouldPersistTaps="handled"
    >
      {/* Source entity */}
      <View style={styles.card}>
        <EntityPicker
          label="Entité source"
          selectedType={sourceType}
          selectedId={sourceId}
          onSelect={(t, id) => {
            setSourceType(t);
            setSourceId(id);
          }}
        />
      </View>

      {/* Target entity */}
      <View style={styles.card}>
        <EntityPicker
          label="Entité cible"
          selectedType={targetType}
          selectedId={targetId}
          onSelect={(t, id) => {
            setTargetType(t);
            setTargetId(id);
          }}
          excludeId={sourceId ?? undefined}
        />
      </View>

      {/* Relationship config */}
      <View style={styles.card}>
        <Text style={styles.label}>Type de relation</Text>
        <View style={styles.pillGrid}>
          {REL_TYPES.map((t) => (
            <Pressable
              key={t}
              style={[styles.pill, relType === t && styles.pillActive]}
              onPress={() => setRelType(t)}
            >
              <Text
                style={[
                  styles.pillText,
                  relType === t && styles.pillTextActive,
                ]}
              >
                {RELATIONSHIP_TYPE_LABELS[t]}
              </Text>
            </Pressable>
          ))}
        </View>

        <Text style={styles.label}>Libellé (optionnel)</Text>
        <TextInput
          style={styles.input}
          value={label}
          onChangeText={setLabel}
          placeholder="ex. père, voisin, président"
          placeholderTextColor={Colors.inkMuted}
        />

        <Text style={styles.label}>Confiance</Text>
        <View style={styles.pillGrid}>
          {CONF_LEVELS.map((c) => (
            <Pressable
              key={c}
              style={[styles.pill, confidence === c && styles.pillActive]}
              onPress={() => setConfidence(c)}
            >
              <Text
                style={[
                  styles.pillText,
                  confidence === c && styles.pillTextActive,
                ]}
              >
                {CONFIDENCE_LABELS[c]}
              </Text>
            </Pressable>
          ))}
        </View>

        <Text style={styles.label}>Notes</Text>
        <TextInput
          style={[styles.input, styles.multiline]}
          value={notes}
          onChangeText={setNotes}
          placeholder="Justification, source..."
          placeholderTextColor={Colors.inkMuted}
          multiline
          numberOfLines={3}
          textAlignVertical="top"
        />
      </View>

      <Pressable
        style={({ pressed }) => [
          styles.saveBtn,
          pressed && styles.saveBtnPressed,
          (!sourceId || !targetId) && styles.saveBtnDisabled,
        ]}
        onPress={save}
        disabled={!sourceId || !targetId}
      >
        <Text style={styles.saveBtnText}>Créer la relation</Text>
      </Pressable>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scroll: { flex: 1, backgroundColor: Colors.surfaceSunken },
  content: { padding: Spacing.lg, paddingBottom: Spacing.xxxl, gap: Spacing.sm },
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
  multiline: { minHeight: 70, paddingTop: Spacing.sm + 2 },
  pillGrid: { flexDirection: "row", flexWrap: "wrap", gap: Spacing.sm },
  pill: {
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderRadius: Radius.full,
    backgroundColor: Colors.surfaceSunken,
  },
  pillActive: { backgroundColor: Colors.accentLight },
  pillText: {
    fontSize: FontSize.sm,
    color: Colors.inkMuted,
    fontWeight: "500",
  },
  pillTextActive: { color: Colors.accent, fontWeight: "600" },
  saveBtn: {
    backgroundColor: Colors.accent,
    borderRadius: Radius.lg,
    padding: Spacing.lg,
    alignItems: "center",
    marginTop: Spacing.md,
    ...Shadow.md,
  },
  saveBtnPressed: { opacity: 0.85, transform: [{ scale: 0.98 }] },
  saveBtnDisabled: { backgroundColor: Colors.border, shadowOpacity: 0 },
  saveBtnText: { color: "white", fontSize: FontSize.base, fontWeight: "600" },
});
