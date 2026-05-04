import { useState } from "react";
import { View, Text, ScrollView, Pressable, StyleSheet, SectionList } from "react-native";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { Colors, FontSize, Spacing, Radius, Shadow } from "@/lib/theme";
import { useResearchStore } from "@/stores/research-store";
import { EntityRow } from "@/components/EntityRow";
import { getEntityName } from "@/types";

type BrowseTab = "entities" | "sources" | "hypotheses" | "contradictions" | "projects";

const TABS: { key: BrowseTab; label: string; icon: keyof typeof Ionicons.glyphMap }[] = [
  { key: "entities", label: "Entités", icon: "people" },
  { key: "sources", label: "Sources", icon: "document-text" },
  { key: "projects", label: "Dossiers", icon: "folder" },
  { key: "hypotheses", label: "Hypothèses", icon: "bulb" },
  { key: "contradictions", label: "Contra.", icon: "git-compare-outline" },
];

export default function BrowseScreen() {
  const router = useRouter();
  const {
    persons, groups, places, events, sources, projects,
    hypotheses, contradictions, fetchAll, loading,
  } = useResearchStore();
  const [activeTab, setActiveTab] = useState<BrowseTab>("entities");

  function renderContent() {
    switch (activeTab) {
      case "entities": {
        const allEntities = [...persons, ...groups, ...places, ...events];
        return (
          <>
            <Text style={styles.count}>{allEntities.length} entité{allEntities.length !== 1 ? "s" : ""}</Text>
            {allEntities.length === 0 ? (
              <EmptyState message="Aucune entité. Ajoutez des personnes, lieux ou événements." />
            ) : (
              <View style={styles.listCard}>
                {allEntities.map((entity, i) => (
                  <View key={`${entity.entityType}-${entity.id}`}>
                    <EntityRow
                      entity={entity}
                      onPress={() => router.push(`/entity/${entity.entityType}/${entity.id}` as never)}
                    />
                    {i < allEntities.length - 1 && <View style={styles.divider} />}
                  </View>
                ))}
              </View>
            )}
          </>
        );
      }
      case "sources":
        return (
          <>
            <Text style={styles.count}>{sources.length} source{sources.length !== 1 ? "s" : ""}</Text>
            {sources.length === 0 ? (
              <EmptyState message="Aucune source. Créez-en depuis l'onglet Ajouter." />
            ) : (
              <View style={styles.listCard}>
                {sources.map((src, i) => (
                  <Pressable
                    key={src.id}
                    style={[styles.row, i < sources.length - 1 && styles.rowBorder]}
                    onPress={() => router.push(`/source/${src.id}` as never)}
                  >
                    <View style={[styles.rowIcon, { backgroundColor: `${Colors.accent}18` }]}>
                      <Ionicons name="document-text" size={16} color={Colors.accent} />
                    </View>
                    <View style={styles.rowText}>
                      <Text style={styles.rowTitle} numberOfLines={1}>{src.title}</Text>
                      <Text style={styles.rowSub}>{src.sourceType}{src.authorName ? ` · ${src.authorName}` : ""}</Text>
                    </View>
                    <Ionicons name="chevron-forward" size={14} color={Colors.borderStrong} />
                  </Pressable>
                ))}
              </View>
            )}
          </>
        );
      case "projects":
        return (
          <>
            <Text style={styles.count}>{projects.length} dossier{projects.length !== 1 ? "s" : ""}</Text>
            {projects.length === 0 ? (
              <EmptyState message="Aucun dossier. Créez un dossier de recherche pour commencer." />
            ) : (
              <View style={styles.listCard}>
                {projects.map((p, i) => (
                  <Pressable
                    key={p.id}
                    style={[styles.row, i < projects.length - 1 && styles.rowBorder]}
                    onPress={() => router.push(`/project/${p.id}` as never)}
                  >
                    <View style={[styles.rowIcon, { backgroundColor: `${Colors.accent}18` }]}>
                      <Ionicons name="folder" size={16} color={Colors.accent} />
                    </View>
                    <View style={styles.rowText}>
                      <Text style={styles.rowTitle} numberOfLines={1}>{p.title}</Text>
                      <Text style={styles.rowSub}>{p.status}{p.periodStart ? ` · ${p.periodStart}` : ""}</Text>
                    </View>
                    <Ionicons name="chevron-forward" size={14} color={Colors.borderStrong} />
                  </Pressable>
                ))}
              </View>
            )}
          </>
        );
      case "hypotheses":
        return (
          <>
            <Text style={styles.count}>{hypotheses.length} hypothèse{hypotheses.length !== 1 ? "s" : ""}</Text>
            {hypotheses.length === 0 ? (
              <EmptyState message="Aucune hypothèse. Formulez des hypothèses depuis vos dossiers." />
            ) : (
              <View style={styles.listCard}>
                {hypotheses.map((h, i) => (
                  <Pressable
                    key={h.id}
                    style={[styles.row, i < hypotheses.length - 1 && styles.rowBorder]}
                    onPress={() => router.push(`/hypothesis/${h.id}` as never)}
                  >
                    <View style={[styles.rowIcon, { backgroundColor: "#FEF3C718" }]}>
                      <Ionicons name="bulb" size={16} color={Colors.warning} />
                    </View>
                    <View style={styles.rowText}>
                      <Text style={styles.rowTitle} numberOfLines={1}>{h.title}</Text>
                      <Text style={styles.rowSub}>{h.status} · {h.confidenceLevel}</Text>
                    </View>
                    <Ionicons name="chevron-forward" size={14} color={Colors.borderStrong} />
                  </Pressable>
                ))}
              </View>
            )}
          </>
        );
      case "contradictions":
        return (
          <>
            <Text style={styles.count}>{contradictions.length} contradiction{contradictions.length !== 1 ? "s" : ""}</Text>
            {contradictions.length === 0 ? (
              <EmptyState message="Aucune contradiction documentée." />
            ) : (
              <View style={styles.listCard}>
                {contradictions.map((c, i) => (
                  <Pressable
                    key={c.id}
                    style={[styles.row, i < contradictions.length - 1 && styles.rowBorder]}
                    onPress={() => router.push(`/contradiction/${c.id}` as never)}
                  >
                    <View style={[styles.rowIcon, { backgroundColor: "#FEF3C718" }]}>
                      <Ionicons name="git-compare-outline" size={16} color={Colors.warning} />
                    </View>
                    <View style={styles.rowText}>
                      <Text style={styles.rowTitle} numberOfLines={1}>{c.title}</Text>
                      <Text style={styles.rowSub}>{c.status}</Text>
                    </View>
                    <Ionicons name="chevron-forward" size={14} color={Colors.borderStrong} />
                  </Pressable>
                ))}
              </View>
            )}
          </>
        );
    }
  }

  return (
    <View style={styles.container}>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.tabBar}
        contentContainerStyle={styles.tabContent}
      >
        {TABS.map((tab) => {
          const isActive = activeTab === tab.key;
          return (
            <Pressable
              key={tab.key}
              style={[styles.tab, isActive && styles.tabActive]}
              onPress={() => setActiveTab(tab.key)}
            >
              <Ionicons
                name={tab.icon as any}
                size={14}
                color={isActive ? Colors.accent : Colors.inkMuted}
              />
              <Text style={[styles.tabLabel, isActive && styles.tabLabelActive]}>
                {tab.label}
              </Text>
            </Pressable>
          );
        })}
      </ScrollView>

      <ScrollView
        style={styles.scrollContent}
        contentContainerStyle={styles.scrollPadding}
      >
        {renderContent()}
      </ScrollView>
    </View>
  );
}

function EmptyState({ message }: { message: string }) {
  return (
    <View style={styles.emptyState}>
      <Ionicons name="compass-outline" size={32} color={Colors.borderStrong} />
      <Text style={styles.emptyTitle}>Rien à explorer</Text>
      <Text style={styles.emptyHint}>{message}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.surfaceSunken },
  tabBar: {
    backgroundColor: Colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
    flexGrow: 0,
  },
  tabContent: {
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.sm,
    gap: Spacing.sm,
  },
  tab: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderRadius: Radius.full,
    backgroundColor: Colors.surfaceSunken,
  },
  tabActive: { backgroundColor: Colors.accentLight },
  tabLabel: { fontSize: FontSize.sm, color: Colors.inkMuted, fontWeight: "500" },
  tabLabelActive: { color: Colors.accent, fontWeight: "600" },

  scrollContent: { flex: 1 },
  scrollPadding: { padding: Spacing.lg, paddingBottom: Spacing.xxxl },

  count: {
    fontSize: FontSize.xs,
    color: Colors.inkMuted,
    marginBottom: Spacing.sm,
  },

  listCard: {
    backgroundColor: Colors.surface,
    borderRadius: Radius.lg,
    overflow: "hidden",
    ...Shadow.sm,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.md,
    padding: Spacing.lg,
  },
  rowBorder: { borderBottomWidth: 1, borderBottomColor: Colors.border },
  rowIcon: {
    width: 32,
    height: 32,
    borderRadius: Radius.sm,
    alignItems: "center",
    justifyContent: "center",
  },
  rowText: { flex: 1 },
  rowTitle: { fontSize: FontSize.sm, color: Colors.ink, fontWeight: "500" },
  rowSub: { fontSize: FontSize.xs, color: Colors.inkMuted, marginTop: 1 },

  divider: {
    height: 1,
    backgroundColor: Colors.border,
    marginHorizontal: Spacing.lg,
  },

  emptyState: {
    alignItems: "center",
    gap: Spacing.sm,
    paddingVertical: Spacing.xxxl,
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
    maxWidth: 260,
  },
});
