import { useState } from "react";
import { View, Text, TextInput, FlatList, StyleSheet } from "react-native";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { Colors, FontSize, Spacing, Radius, Shadow } from "@/lib/theme";
import { useResearchStore } from "@/stores/research-store";
import { EntityRow } from "@/components/EntityRow";

export default function SearchScreen() {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const { searchAll } = useResearchStore();

  const results = query.length >= 2 ? searchAll(query) : [];

  return (
    <View style={styles.container}>
      {/* Search bar */}
      <View style={styles.inputWrap}>
        <View style={styles.inputRow}>
          <Ionicons name="search" size={18} color={Colors.inkMuted} />
          <TextInput
            style={styles.input}
            value={query}
            onChangeText={setQuery}
            placeholder="Nom, lieu, tag..."
            placeholderTextColor={Colors.inkMuted}
            autoFocus
            returnKeyType="search"
            clearButtonMode="while-editing"
          />
        </View>
      </View>

      {/* States */}
      {query.length === 0 && (
        <View style={styles.emptyState}>
          <View style={styles.emptyIcon}>
            <Ionicons name="search" size={32} color={Colors.borderStrong} />
          </View>
          <Text style={styles.emptyTitle}>Rechercher</Text>
          <Text style={styles.emptyHint}>
            Trouvez des personnes, lieux, événements ou groupes
          </Text>
        </View>
      )}

      {query.length > 0 && query.length < 2 && (
        <Text style={styles.hint}>Saisissez au moins 2 caractères</Text>
      )}

      {query.length >= 2 && results.length === 0 && (
        <View style={styles.emptyState}>
          <Ionicons name="alert-circle-outline" size={32} color={Colors.borderStrong} />
          <Text style={styles.emptyTitle}>Aucun résultat</Text>
          <Text style={styles.emptyHint}>
            Aucune correspondance pour "{query}"
          </Text>
        </View>
      )}

      {results.length > 0 && (
        <FlatList
          data={results}
          keyExtractor={(item) => `${item.entityType}-${item.id}`}
          renderItem={({ item }) => (
            <EntityRow
              entity={item}
              onPress={() =>
                router.push(`/entity/${item.entityType}/${item.id}` as never)
              }
            />
          )}
          ItemSeparatorComponent={() => <View style={styles.divider} />}
          style={styles.list}
          contentContainerStyle={styles.listContent}
          keyboardShouldPersistTaps="handled"
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.surfaceSunken },
  inputWrap: {
    padding: Spacing.lg,
    backgroundColor: Colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  inputRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.sm,
    backgroundColor: Colors.surfaceSunken,
    borderRadius: Radius.md,
    paddingHorizontal: Spacing.md,
  },
  input: {
    flex: 1,
    paddingVertical: Spacing.sm + 2,
    fontSize: FontSize.base,
    color: Colors.ink,
  },
  list: { flex: 1 },
  listContent: {
    backgroundColor: Colors.surface,
    borderRadius: Radius.lg,
    margin: Spacing.lg,
    overflow: "hidden",
    ...Shadow.sm,
  },
  divider: {
    height: 1,
    backgroundColor: Colors.border,
    marginHorizontal: Spacing.lg,
  },
  emptyState: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    gap: Spacing.sm,
    paddingBottom: Spacing.xxxl,
  },
  emptyIcon: {
    width: 64,
    height: 64,
    borderRadius: Radius.full,
    backgroundColor: Colors.surfaceSunken,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: Spacing.sm,
  },
  emptyTitle: {
    fontSize: FontSize.lg,
    fontWeight: "600",
    color: Colors.inkSecondary,
  },
  emptyHint: {
    fontSize: FontSize.sm,
    color: Colors.inkMuted,
    textAlign: "center",
    maxWidth: 250,
    lineHeight: 20,
  },
  hint: {
    padding: Spacing.lg,
    color: Colors.inkMuted,
    fontSize: FontSize.sm,
  },
});
