import { useState } from "react";
import { View, Text, TextInput, SectionList, Pressable, StyleSheet } from "react-native";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { Colors, FontSize, Spacing, Radius, Shadow } from "@/lib/theme";
import { useResearchStore } from "@/stores/research-store";
import { EntityRow } from "@/components/EntityRow";
import { getEntityName } from "@/types";

type ResultItem = {
  id: string;
  type: "entity" | "source" | "project" | "hypothesis" | "contradiction";
  title: string;
  subtitle?: string;
  route: string;
  icon: keyof typeof Ionicons.glyphMap;
  iconColor: string;
};

export default function SearchScreen() {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const {
    searchAll, sources, projects, hypotheses, contradictions,
    entityAliases, getAllEntities,
  } = useResearchStore();

  function getResults(): { title: string; data: ResultItem[] }[] {
    if (query.length < 2) return [];
    const q = query.toLowerCase().trim();
    const sections: { title: string; data: ResultItem[] }[] = [];

    const entities = searchAll(q);
    if (entities.length > 0) {
      sections.push({
        title: `Entités (${entities.length})`,
        data: entities.map((e) => ({
          id: e.id,
          type: "entity",
          title: getEntityName(e),
          subtitle: e.entityType === "person" ? "Personne" : e.entityType === "group" ? "Groupe" : e.entityType === "place" ? "Lieu" : "Événement",
          route: `/entity/${e.entityType}/${e.id}`,
          icon: e.entityType === "person" ? "person" : e.entityType === "group" ? "people" : e.entityType === "place" ? "location" : "calendar",
          iconColor: e.entityType === "person" ? Colors.person.icon : e.entityType === "group" ? Colors.group.icon : e.entityType === "place" ? Colors.place.icon : Colors.event.icon,
        })),
      });
    }

    const matchedSources = sources.filter((s) =>
      s.title.toLowerCase().includes(q) ||
      s.authorName?.toLowerCase().includes(q) ||
      s.summary.toLowerCase().includes(q) ||
      s.tags.some((t) => t.toLowerCase().includes(q))
    );
    if (matchedSources.length > 0) {
      sections.push({
        title: `Sources (${matchedSources.length})`,
        data: matchedSources.map((s) => ({
          id: s.id,
          type: "source",
          title: s.title,
          subtitle: s.sourceType,
          route: `/source/${s.id}`,
          icon: "document-text",
          iconColor: Colors.accent,
        })),
      });
    }

    const matchedProjects = projects.filter((p) =>
      p.title.toLowerCase().includes(q) ||
      p.researchQuestion.toLowerCase().includes(q) ||
      p.tags.some((t) => t.toLowerCase().includes(q))
    );
    if (matchedProjects.length > 0) {
      sections.push({
        title: `Dossiers (${matchedProjects.length})`,
        data: matchedProjects.map((p) => ({
          id: p.id,
          type: "project",
          title: p.title,
          subtitle: p.status,
          route: `/project/${p.id}`,
          icon: "folder",
          iconColor: Colors.accent,
        })),
      });
    }

    const matchedHypo = hypotheses.filter((h) =>
      h.title.toLowerCase().includes(q) ||
      h.description.toLowerCase().includes(q) ||
      h.tags.some((t) => t.toLowerCase().includes(q))
    );
    if (matchedHypo.length > 0) {
      sections.push({
        title: `Hypothèses (${matchedHypo.length})`,
        data: matchedHypo.map((h) => ({
          id: h.id,
          type: "hypothesis",
          title: h.title,
          subtitle: h.status,
          route: `/hypothesis/${h.id}`,
          icon: "bulb",
          iconColor: Colors.warning,
        })),
      });
    }

    const matchedContra = contradictions.filter((c) =>
      c.title.toLowerCase().includes(q) ||
      c.description.toLowerCase().includes(q)
    );
    if (matchedContra.length > 0) {
      sections.push({
        title: `Contradictions (${matchedContra.length})`,
        data: matchedContra.map((c) => ({
          id: c.id,
          type: "contradiction",
          title: c.title,
          subtitle: c.status,
          route: `/contradiction/${c.id}`,
          icon: "git-compare-outline",
          iconColor: Colors.warning,
        })),
      });
    }

    return sections;
  }

  const sections = getResults();
  const totalResults = sections.reduce((sum, s) => sum + s.data.length, 0);

  return (
    <View style={styles.container}>
      <View style={styles.inputWrap}>
        <View style={styles.inputRow}>
          <Ionicons name="search" size={18} color={Colors.inkMuted} />
          <TextInput
            style={styles.input}
            value={query}
            onChangeText={setQuery}
            placeholder="Rechercher partout..."
            placeholderTextColor={Colors.inkMuted}
            autoFocus
            returnKeyType="search"
            clearButtonMode="while-editing"
          />
        </View>
      </View>

      {query.length === 0 && (
        <View style={styles.emptyState}>
          <View style={styles.emptyIcon}>
            <Ionicons name="search" size={32} color={Colors.borderStrong} />
          </View>
          <Text style={styles.emptyTitle}>Rechercher</Text>
          <Text style={styles.emptyHint}>
            Entités, sources, dossiers, hypothèses, contradictions
          </Text>
        </View>
      )}

      {query.length > 0 && query.length < 2 && (
        <Text style={styles.hint}>Saisissez au moins 2 caractères</Text>
      )}

      {query.length >= 2 && totalResults === 0 && (
        <View style={styles.emptyState}>
          <Ionicons name="alert-circle-outline" size={32} color={Colors.borderStrong} />
          <Text style={styles.emptyTitle}>Aucun résultat</Text>
          <Text style={styles.emptyHint}>Aucune correspondance pour "{query}"</Text>
        </View>
      )}

      {totalResults > 0 && (
        <SectionList
          sections={sections}
          keyExtractor={(item) => `${item.type}-${item.id}`}
          renderSectionHeader={({ section }) => (
            <View style={styles.sectionHeader}>
              <View style={styles.sectionBar} />
              <Text style={styles.sectionTitle}>{section.title}</Text>
            </View>
          )}
          renderItem={({ item }) => (
            <Pressable
              style={styles.resultRow}
              onPress={() => router.push(item.route as never)}
            >
              <View style={[styles.resultIcon, { backgroundColor: `${item.iconColor}18` }]}>
                <Ionicons name={item.icon as any} size={16} color={item.iconColor} />
              </View>
              <View style={styles.resultText}>
                <Text style={styles.resultTitle} numberOfLines={1}>{item.title}</Text>
                {item.subtitle ? (
                  <Text style={styles.resultSub}>{item.subtitle}</Text>
                ) : null}
              </View>
              <Ionicons name="chevron-forward" size={14} color={Colors.borderStrong} />
            </Pressable>
          )}
          ItemSeparatorComponent={() => <View style={styles.divider} />}
          style={styles.list}
          stickySectionHeadersEnabled={false}
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

  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.sm,
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.lg,
    paddingBottom: Spacing.sm,
  },
  sectionBar: {
    width: 3,
    height: 14,
    borderRadius: 2,
    backgroundColor: Colors.accent,
  },
  sectionTitle: {
    fontSize: FontSize.sm,
    fontWeight: "600",
    color: Colors.inkSecondary,
    letterSpacing: 0.3,
  },

  resultRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.md,
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.lg,
    backgroundColor: Colors.surface,
    marginHorizontal: Spacing.lg,
  },
  resultIcon: {
    width: 32,
    height: 32,
    borderRadius: Radius.sm,
    alignItems: "center",
    justifyContent: "center",
  },
  resultText: { flex: 1 },
  resultTitle: { fontSize: FontSize.sm, color: Colors.ink, fontWeight: "500" },
  resultSub: { fontSize: FontSize.xs, color: Colors.inkMuted, marginTop: 1 },

  list: { flex: 1 },
  divider: {
    height: 1,
    backgroundColor: Colors.border,
    marginHorizontal: Spacing.lg + Spacing.lg,
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
    maxWidth: 280,
    lineHeight: 20,
  },
  hint: {
    padding: Spacing.lg,
    color: Colors.inkMuted,
    fontSize: FontSize.sm,
  },
});
