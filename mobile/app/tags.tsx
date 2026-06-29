import { useMemo, useState } from "react";
import {
  ScrollView,
  View,
  Text,
  TextInput,
  Pressable,
  StyleSheet,
} from "react-native";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { Colors, FontSize, Spacing, Radius, Shadow } from "@/lib/theme";
import { useThemedStyles } from "@/lib/useTheme";
import { useResearchStore } from "@/stores/research-store";

export default function TagsScreen() {
  const styles = useThemedStyles(makeStyles);
  const router = useRouter();
  const [query, setQuery] = useState("");
  const {
    persons, groups, places, events, sources, projects,
    hypotheses, contradictions, bibliography,
  } = useResearchStore();

  const tagCounts = useMemo(() => {
    const counts = new Map<string, number>();
    const collections = [persons, groups, places, events, sources, projects, hypotheses, contradictions, bibliography];
    for (const list of collections) {
      for (const item of list) {
        if ("tags" in item && Array.isArray((item as any).tags)) {
          for (const t of (item as any).tags) {
            counts.set(t, (counts.get(t) ?? 0) + 1);
          }
        }
      }
    }
    const sorted = [...counts.entries()].sort((a, b) => b[1] - a[1]);
    if (query.trim()) {
      const q = query.toLowerCase().trim();
      return sorted.filter(([t]) => t.toLowerCase().includes(q));
    }
    return sorted;
  }, [persons, groups, places, events, sources, projects, hypotheses, contradictions, bibliography, query]);

  const maxCount = tagCounts[0]?.[1] ?? 1;

  return (
    <View style={styles.container}>
      <View style={styles.searchBar}>
        <Ionicons name="search" size={16} color={Colors.inkMuted} />
        <TextInput
          style={styles.searchInput}
          value={query}
          onChangeText={setQuery}
          placeholder="Filtrer les tags..."
          placeholderTextColor={Colors.inkMuted}
        />
        {query ? (
          <Pressable onPress={() => setQuery("")}>
            <Ionicons name="close-circle" size={18} color={Colors.inkMuted} />
          </Pressable>
        ) : null}
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.count}>
          {tagCounts.length} tag{tagCounts.length !== 1 ? "s" : ""} utilisé{tagCounts.length !== 1 ? "s" : ""}
        </Text>

        {tagCounts.length === 0 ? (
          <View style={styles.empty}>
            <Ionicons name="pricetag-outline" size={36} color={Colors.borderStrong} />
            <Text style={styles.emptyTitle}>Aucun tag</Text>
            <Text style={styles.emptyHint}>
              {query ? `Aucun tag contenant "${query}"` : "Ajoutez des tags à vos entités pour les retrouver ici"}
            </Text>
          </View>
        ) : (
          <View style={styles.cloud}>
            {tagCounts.map(([tag, count]) => {
              const weight = Math.min(count / maxCount, 1);
              const size = 12 + weight * 8;
              return (
                <Pressable
                  key={tag}
                  style={({ pressed }) => [
                    styles.tagChip,
                    { paddingVertical: 4 + weight * 4, paddingHorizontal: 10 + weight * 4 },
                    pressed && { opacity: 0.7 },
                  ]}
                  onPress={() => router.push(`/tag/${encodeURIComponent(tag)}` as never)}
                >
                  <Text style={[styles.tagText, { fontSize: size }]}>{tag}</Text>
                  <View style={styles.tagCount}>
                    <Text style={styles.tagCountText}>{count}</Text>
                  </View>
                </Pressable>
              );
            })}
          </View>
        )}
      </ScrollView>
    </View>
  );
}

const makeStyles = () => StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.surfaceSunken },

  searchBar: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.sm,
    backgroundColor: Colors.surface,
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.sm + 2,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  searchInput: { flex: 1, fontSize: FontSize.sm, color: Colors.ink },

  content: { padding: Spacing.lg, paddingBottom: Spacing.xxxl },

  count: { fontSize: FontSize.xs, color: Colors.inkMuted, marginBottom: Spacing.md },

  cloud: { flexDirection: "row", flexWrap: "wrap", gap: Spacing.sm },
  tagChip: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    backgroundColor: Colors.accentLight,
    borderRadius: Radius.full,
    ...Shadow.sm,
  },
  tagText: { color: Colors.accent, fontWeight: "600" },
  tagCount: {
    backgroundColor: Colors.accent,
    borderRadius: Radius.full,
    minWidth: 18,
    height: 18,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 5,
  },
  tagCountText: { color: "white", fontSize: 10, fontWeight: "700" },

  empty: { alignItems: "center", gap: Spacing.sm, paddingVertical: Spacing.xxxl },
  emptyTitle: { fontSize: FontSize.lg, fontWeight: "600", color: Colors.inkSecondary },
  emptyHint: { fontSize: FontSize.sm, color: Colors.inkMuted, textAlign: "center", maxWidth: 260 },
});
