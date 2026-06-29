import { useMemo } from "react";
import {
  ScrollView,
  View,
  Text,
  Pressable,
  StyleSheet,
} from "react-native";
import { useLocalSearchParams, useNavigation, useRouter } from "expo-router";
import { useEffect } from "react";
import { Ionicons } from "@expo/vector-icons";
import { Colors, FontSize, Spacing, Radius, Shadow } from "@/lib/theme";
import { useThemedStyles } from "@/lib/useTheme";
import { useResearchStore } from "@/stores/research-store";
import { EntityBadge } from "@/components/EntityBadge";
import { getEntityName } from "@/types";
import { SectionHeader } from "@/components/SectionHeader";

export default function TagDetailScreen() {
  const styles = useThemedStyles(makeStyles);
  const { tag } = useLocalSearchParams<{ tag: string }>();
  const navigation = useNavigation();
  const router = useRouter();
  const {
    persons, groups, places, events, sources, projects,
    hypotheses, contradictions, bibliography,
  } = useResearchStore();

  const decodedTag = decodeURIComponent(tag ?? "");

  useEffect(() => {
    navigation.setOptions({ title: `#${decodedTag}` });
  }, [decodedTag]);

  const results = useMemo(() => {
    const matches = (tags: string[]) => tags.some((t) => t.toLowerCase() === decodedTag.toLowerCase());
    return {
      entities: [
        ...persons.filter((p) => matches(p.tags)).map((p) => ({ ...p, _kind: "person" as const })),
        ...groups.filter((g) => matches(g.tags)).map((g) => ({ ...g, _kind: "group" as const })),
        ...places.filter((p) => matches(p.tags)).map((p) => ({ ...p, _kind: "place" as const })),
        ...events.filter((e) => matches(e.tags)).map((e) => ({ ...e, _kind: "event" as const })),
      ],
      sources: sources.filter((s) => matches(s.tags)),
      projects: projects.filter((p) => matches(p.tags)),
      hypotheses: hypotheses.filter((h) => matches(h.tags)),
      contradictions: contradictions.filter((c) => matches(c.tags)),
      bibliography: bibliography.filter((b) => matches(b.tags)),
    };
  }, [decodedTag, persons, groups, places, events, sources, projects, hypotheses, contradictions, bibliography]);

  const total = results.entities.length + results.sources.length + results.projects.length +
    results.hypotheses.length + results.contradictions.length + results.bibliography.length;

  return (
    <ScrollView style={styles.scroll} contentContainerStyle={styles.content}>
      <View style={styles.header}>
        <View style={styles.tagBadge}>
          <Ionicons name="pricetag" size={18} color={Colors.accent} />
          <Text style={styles.tagText}>{decodedTag}</Text>
        </View>
        <Text style={styles.total}>{total} élément{total !== 1 ? "s" : ""}</Text>
      </View>

      {total === 0 && (
        <View style={styles.empty}>
          <Ionicons name="pricetag-outline" size={32} color={Colors.borderStrong} />
          <Text style={styles.emptyText}>Aucun élément avec ce tag</Text>
        </View>
      )}

      {results.entities.length > 0 && (
        <>
          <SectionHeader title={`Entités (${results.entities.length})`} />
          <View style={styles.listCard}>
            {results.entities.map((e, i) => (
              <Pressable
                key={`${e._kind}-${e.id}`}
                style={[styles.row, i < results.entities.length - 1 && styles.rowBorder]}
                onPress={() => router.push(`/entity/${e._kind}/${e.id}` as never)}
              >
                <EntityBadge type={e._kind} size="sm" />
                <Text style={styles.rowText} numberOfLines={1}>{getEntityName(e as any)}</Text>
                <Ionicons name="chevron-forward" size={14} color={Colors.borderStrong} />
              </Pressable>
            ))}
          </View>
        </>
      )}

      {results.projects.length > 0 && (
        <>
          <SectionHeader title={`Dossiers (${results.projects.length})`} />
          <View style={styles.listCard}>
            {results.projects.map((p, i) => (
              <Pressable
                key={p.id}
                style={[styles.row, i < results.projects.length - 1 && styles.rowBorder]}
                onPress={() => router.push(`/project/${p.id}` as never)}
              >
                <View style={[styles.iconBg, { backgroundColor: Colors.accentLight }]}>
                  <Ionicons name="folder" size={14} color={Colors.accent} />
                </View>
                <Text style={styles.rowText} numberOfLines={1}>{p.title}</Text>
                <Ionicons name="chevron-forward" size={14} color={Colors.borderStrong} />
              </Pressable>
            ))}
          </View>
        </>
      )}

      {results.sources.length > 0 && (
        <>
          <SectionHeader title={`Sources (${results.sources.length})`} />
          <View style={styles.listCard}>
            {results.sources.map((s, i) => (
              <Pressable
                key={s.id}
                style={[styles.row, i < results.sources.length - 1 && styles.rowBorder]}
                onPress={() => router.push(`/source/${s.id}` as never)}
              >
                <View style={[styles.iconBg, { backgroundColor: "#DBEAFE" }]}>
                  <Ionicons name="document-text" size={14} color="#2563EB" />
                </View>
                <Text style={styles.rowText} numberOfLines={1}>{s.title}</Text>
                <Ionicons name="chevron-forward" size={14} color={Colors.borderStrong} />
              </Pressable>
            ))}
          </View>
        </>
      )}

      {results.hypotheses.length > 0 && (
        <>
          <SectionHeader title={`Hypothèses (${results.hypotheses.length})`} />
          <View style={styles.listCard}>
            {results.hypotheses.map((h, i) => (
              <Pressable
                key={h.id}
                style={[styles.row, i < results.hypotheses.length - 1 && styles.rowBorder]}
                onPress={() => router.push(`/hypothesis/${h.id}` as never)}
              >
                <View style={[styles.iconBg, { backgroundColor: "#FEF3C7" }]}>
                  <Ionicons name="bulb" size={14} color={Colors.warning} />
                </View>
                <Text style={styles.rowText} numberOfLines={1}>{h.title}</Text>
                <Ionicons name="chevron-forward" size={14} color={Colors.borderStrong} />
              </Pressable>
            ))}
          </View>
        </>
      )}

      {results.contradictions.length > 0 && (
        <>
          <SectionHeader title={`Contradictions (${results.contradictions.length})`} />
          <View style={styles.listCard}>
            {results.contradictions.map((c, i) => (
              <Pressable
                key={c.id}
                style={[styles.row, i < results.contradictions.length - 1 && styles.rowBorder]}
                onPress={() => router.push(`/contradiction/${c.id}` as never)}
              >
                <View style={[styles.iconBg, { backgroundColor: "#FEE2E2" }]}>
                  <Ionicons name="git-compare-outline" size={14} color={Colors.danger} />
                </View>
                <Text style={styles.rowText} numberOfLines={1}>{c.title}</Text>
                <Ionicons name="chevron-forward" size={14} color={Colors.borderStrong} />
              </Pressable>
            ))}
          </View>
        </>
      )}

      {results.bibliography.length > 0 && (
        <>
          <SectionHeader title={`Bibliographie (${results.bibliography.length})`} />
          <View style={styles.listCard}>
            {results.bibliography.map((b, i) => (
              <Pressable
                key={b.id}
                style={[styles.row, i < results.bibliography.length - 1 && styles.rowBorder]}
                onPress={() => router.push(`/bibliography/${b.id}` as never)}
              >
                <View style={[styles.iconBg, { backgroundColor: "#FDF4FF" }]}>
                  <Ionicons name="book" size={14} color="#A855F7" />
                </View>
                <Text style={styles.rowText} numberOfLines={1}>{b.title}</Text>
                <Ionicons name="chevron-forward" size={14} color={Colors.borderStrong} />
              </Pressable>
            ))}
          </View>
        </>
      )}
    </ScrollView>
  );
}

const makeStyles = () => StyleSheet.create({
  scroll: { flex: 1, backgroundColor: Colors.surfaceSunken },
  content: { padding: Spacing.lg, paddingBottom: Spacing.xxxl },

  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: Spacing.md,
  },
  tagBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.sm,
    backgroundColor: Colors.accentLight,
    borderRadius: Radius.full,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
  },
  tagText: { fontSize: FontSize.base, color: Colors.accent, fontWeight: "700" },
  total: { fontSize: FontSize.sm, color: Colors.inkMuted },

  listCard: {
    backgroundColor: Colors.surface,
    borderRadius: Radius.lg,
    overflow: "hidden",
    ...Shadow.sm,
    marginBottom: Spacing.sm,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.md,
    padding: Spacing.md + 2,
    paddingHorizontal: Spacing.lg,
  },
  rowBorder: { borderBottomWidth: 1, borderBottomColor: Colors.border },
  iconBg: {
    width: 30,
    height: 30,
    borderRadius: Radius.sm,
    alignItems: "center",
    justifyContent: "center",
  },
  rowText: { flex: 1, fontSize: FontSize.sm, color: Colors.ink, fontWeight: "500" },

  empty: {
    alignItems: "center",
    gap: Spacing.sm,
    paddingVertical: Spacing.xxxl,
  },
  emptyText: { fontSize: FontSize.sm, color: Colors.inkMuted },
});
