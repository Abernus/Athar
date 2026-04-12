import { useState } from "react";
import { View, Text, TextInput, FlatList, StyleSheet } from "react-native";
import { useRouter } from "expo-router";
import { Colors, FontSize, Spacing, Radius } from "@/lib/theme";
import { useResearchStore } from "@/stores/research-store";
import { EntityRow } from "@/components/EntityRow";

export default function SearchScreen() {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const { searchAll } = useResearchStore();

  const results = query.length >= 2 ? searchAll(query) : [];

  return (
    <View style={styles.container}>
      <View style={styles.inputWrap}>
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

      {query.length >= 2 && results.length === 0 && (
        <Text style={styles.empty}>Aucun résultat pour « {query} »</Text>
      )}

      {query.length > 0 && query.length < 2 && (
        <Text style={styles.hint}>Saisissez au moins 2 caractères</Text>
      )}

      <FlatList
        data={results}
        keyExtractor={(item) => `${item.entityType}-${item.id}`}
        renderItem={({ item }) => (
          <EntityRow
            entity={item}
            onPress={() => router.push(`/entity/${item.entityType}/${item.id}` as never)}
          />
        )}
        style={styles.list}
        contentContainerStyle={styles.listContent}
        keyboardShouldPersistTaps="handled"
      />
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
  input: {
    backgroundColor: Colors.surfaceSunken,
    borderRadius: Radius.md,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm + 2,
    fontSize: FontSize.base,
    color: Colors.ink,
  },
  list: { flex: 1 },
  listContent: { backgroundColor: Colors.surface },
  empty: {
    padding: Spacing.xl,
    textAlign: "center",
    color: Colors.inkMuted,
    fontSize: FontSize.sm,
  },
  hint: {
    padding: Spacing.lg,
    color: Colors.inkMuted,
    fontSize: FontSize.xs,
  },
});
