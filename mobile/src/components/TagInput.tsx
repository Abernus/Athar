import { useState } from "react";
import { View, Text, TextInput, Pressable, ScrollView, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Colors, FontSize, Spacing, Radius } from "@/lib/theme";
import { useResearchStore } from "@/stores/research-store";

interface Props {
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
}

export function TagInput({ value, onChangeText, placeholder }: Props) {
  const [focused, setFocused] = useState(false);
  const {
    persons, groups, places, events, sources, hypotheses,
    contradictions, projects,
  } = useResearchStore();

  const allTags = new Set<string>();
  for (const list of [persons, groups, places, events, sources, hypotheses, contradictions, projects]) {
    for (const item of list) {
      if ("tags" in item && Array.isArray((item as any).tags)) {
        for (const t of (item as any).tags) allTags.add(t);
      }
    }
  }

  const currentTags = value.split(",").map((s) => s.trim()).filter(Boolean);
  const lastPart = value.split(",").pop()?.trim().toLowerCase() ?? "";

  const suggestions = lastPart.length >= 1
    ? [...allTags].filter((t) =>
        t.toLowerCase().includes(lastPart) && !currentTags.includes(t)
      ).slice(0, 5)
    : [];

  function addTag(tag: string) {
    const parts = value.split(",").map((s) => s.trim()).filter(Boolean);
    parts.pop();
    parts.push(tag);
    onChangeText(parts.join(", ") + ", ");
  }

  return (
    <View>
      <TextInput
        style={styles.input}
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder ?? "tag1, tag2, tag3"}
        placeholderTextColor={Colors.inkMuted}
        onFocus={() => setFocused(true)}
        onBlur={() => setTimeout(() => setFocused(false), 200)}
      />
      {focused && suggestions.length > 0 && (
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.suggestions}
        >
          {suggestions.map((tag) => (
            <Pressable key={tag} style={styles.suggestion} onPress={() => addTag(tag)}>
              <Text style={styles.suggestionText}>{tag}</Text>
            </Pressable>
          ))}
        </ScrollView>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  input: {
    backgroundColor: Colors.surfaceSunken,
    borderRadius: Radius.md,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm + 2,
    fontSize: FontSize.base,
    color: Colors.ink,
  },
  suggestions: {
    gap: Spacing.xs,
    paddingTop: Spacing.xs,
  },
  suggestion: {
    backgroundColor: Colors.accentLight,
    borderRadius: Radius.full,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.xs + 2,
  },
  suggestionText: {
    fontSize: FontSize.xs,
    color: Colors.accent,
    fontWeight: "600",
  },
});
