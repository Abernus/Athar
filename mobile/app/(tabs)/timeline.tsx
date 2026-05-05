import { useState, useMemo } from "react";
import {
  View,
  Text,
  ScrollView,
  Pressable,
  StyleSheet,
} from "react-native";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { Colors, FontSize, Spacing, Radius, Shadow } from "@/lib/theme";
import { useResearchStore } from "@/stores/research-store";
import { EntityBadge } from "@/components/EntityBadge";
import { getEntityName } from "@/types";
import type { AnyEntity, HistoricalDate } from "@/types";

type Layer = "all" | "facts" | "sources" | "testimonies";

const LAYERS: { key: Layer; label: string }[] = [
  { key: "all", label: "Tout" },
  { key: "facts", label: "Faits" },
  { key: "sources", label: "Sources" },
  { key: "testimonies", label: "Témoignages" },
];

interface TimelineItem {
  id: string;
  label: string;
  sublabel?: string;
  date: string;
  sortKey: number;
  type: "person_birth" | "person_death" | "event" | "source" | "testimony";
  entityType?: "person" | "group" | "place" | "event";
  entityId?: string;
  color: string;
  icon: keyof typeof Ionicons.glyphMap;
}

function extractYear(date?: HistoricalDate): number | null {
  if (!date?.value) return null;
  const match = date.value.match(/\d{4}/);
  return match ? parseInt(match[0], 10) : null;
}

function dateLabel(date?: HistoricalDate): string {
  if (!date?.value) return "";
  if (date.display) return date.display;
  switch (date.precision) {
    case "estimated": return `vers ${date.value}`;
    case "approximate": return `≈ ${date.value}`;
    case "before": return `avant ${date.value}`;
    case "after": return `après ${date.value}`;
    default: return date.value;
  }
}

export default function TimelineScreen() {
  const router = useRouter();
  const { persons, events, sources, oralTestimonies } = useResearchStore();
  const [layer, setLayer] = useState<Layer>("all");

  const items = useMemo(() => {
    const result: TimelineItem[] = [];

    if (layer === "all" || layer === "facts") {
      for (const p of persons) {
        const by = extractYear(p.birthDate);
        if (by) {
          result.push({
            id: `birth-${p.id}`,
            label: p.primaryName,
            sublabel: "Naissance",
            date: dateLabel(p.birthDate),
            sortKey: by,
            type: "person_birth",
            entityType: "person",
            entityId: p.id,
            color: Colors.success,
            icon: "ellipse",
          });
        }
        const dy = extractYear(p.deathDate);
        if (dy) {
          result.push({
            id: `death-${p.id}`,
            label: p.primaryName,
            sublabel: "Décès",
            date: dateLabel(p.deathDate),
            sortKey: dy,
            type: "person_death",
            entityType: "person",
            entityId: p.id,
            color: Colors.inkMuted,
            icon: "ellipse",
          });
        }
      }
      for (const e of events) {
        const ey = extractYear(e.dateStart);
        if (ey) {
          result.push({
            id: `event-${e.id}`,
            label: e.title,
            sublabel: e.eventType,
            date: dateLabel(e.dateStart),
            sortKey: ey,
            type: "event",
            entityType: "event",
            entityId: e.id,
            color: Colors.event.icon,
            icon: "calendar",
          });
        }
      }
    }

    if (layer === "all" || layer === "sources") {
      for (const s of sources) {
        const sy = extractYear(s.createdOrPublishedAt);
        if (sy) {
          result.push({
            id: `source-${s.id}`,
            label: s.title,
            sublabel: s.sourceType,
            date: dateLabel(s.createdOrPublishedAt),
            sortKey: sy,
            type: "source",
            color: Colors.accent,
            icon: "document-text",
          });
        }
      }
    }

    if (layer === "all" || layer === "testimonies") {
      for (const t of oralTestimonies) {
        const ty = extractYear(t.recordedAt);
        if (ty) {
          result.push({
            id: `testimony-${t.id}`,
            label: t.title,
            sublabel: `Témoin : ${t.speaker}`,
            date: dateLabel(t.recordedAt),
            sortKey: ty,
            type: "testimony",
            color: Colors.group.icon,
            icon: "mic",
          });
        }
      }
    }

    result.sort((a, b) => a.sortKey - b.sortKey);
    return result;
  }, [persons, events, sources, oralTestimonies, layer]);

  return (
    <View style={styles.container}>
      {/* Layer filter */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.filterBar}
        contentContainerStyle={styles.filterContent}
      >
        {LAYERS.map((l) => (
          <Pressable
            key={l.key}
            style={[styles.filterPill, layer === l.key && styles.filterPillActive]}
            onPress={() => setLayer(l.key)}
          >
            <Text style={[styles.filterText, layer === l.key && styles.filterTextActive]}>
              {l.label}
            </Text>
          </Pressable>
        ))}
      </ScrollView>

      {/* Timeline */}
      <ScrollView style={styles.timeline} contentContainerStyle={styles.timelineContent}>
        {items.length === 0 ? (
          <View style={styles.emptyState}>
            <Ionicons name="time-outline" size={36} color={Colors.borderStrong} />
            <Text style={styles.emptyTitle}>Chronologie vide</Text>
            <Text style={styles.emptyHint}>
              Les entités avec des dates apparaîtront ici
            </Text>
          </View>
        ) : (
          items.map((item, i) => {
            const showYear =
              i === 0 || items[i - 1].sortKey !== item.sortKey;

            return (
              <View key={item.id}>
                {showYear && (
                  <View style={styles.yearRow}>
                    <View style={styles.yearBadge}>
                      <Text style={styles.yearText}>{item.sortKey}</Text>
                    </View>
                    <View style={styles.yearLine} />
                  </View>
                )}

                <Pressable
                  style={styles.itemRow}
                  onPress={() => {
                    if (item.entityType && item.entityId) {
                      router.push(`/entity/${item.entityType}/${item.entityId}` as never);
                    } else if (item.type === "source") {
                      router.push(`/source/${item.id.replace("source-", "")}` as never);
                    }
                  }}
                >
                  {/* Timeline line */}
                  <View style={styles.lineCol}>
                    <View style={styles.lineTop} />
                    <View style={[styles.dot, { backgroundColor: item.color }]} />
                    <View style={[styles.lineBottom, i === items.length - 1 && { opacity: 0 }]} />
                  </View>

                  {/* Content */}
                  <View style={styles.itemCard}>
                    <View style={styles.itemHeader}>
                      {item.entityType && (
                        <EntityBadge type={item.entityType} size="sm" />
                      )}
                      {!item.entityType && (
                        <Ionicons name={item.icon} size={14} color={item.color} />
                      )}
                      <Text style={styles.itemDate}>{item.date}</Text>
                    </View>
                    <Text style={styles.itemLabel} numberOfLines={2}>{item.label}</Text>
                    {item.sublabel && (
                      <Text style={styles.itemSublabel}>{item.sublabel}</Text>
                    )}
                  </View>
                </Pressable>
              </View>
            );
          })
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.surfaceSunken },

  filterBar: {
    backgroundColor: Colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
    flexGrow: 0,
  },
  filterContent: {
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.sm,
    gap: Spacing.sm,
  },
  filterPill: {
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.sm,
    borderRadius: Radius.full,
    backgroundColor: Colors.surfaceSunken,
  },
  filterPillActive: { backgroundColor: Colors.accentLight },
  filterText: { fontSize: FontSize.sm, color: Colors.inkMuted, fontWeight: "500" },
  filterTextActive: { color: Colors.accent, fontWeight: "600" },

  timeline: { flex: 1 },
  timelineContent: { padding: Spacing.lg, paddingBottom: Spacing.xxxl },

  yearRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.md,
    marginTop: Spacing.lg,
    marginBottom: Spacing.sm,
  },
  yearBadge: {
    backgroundColor: Colors.accent,
    borderRadius: Radius.full,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.xs + 1,
  },
  yearText: {
    fontSize: FontSize.sm,
    fontWeight: "700",
    color: "white",
    letterSpacing: 0.5,
  },
  yearLine: {
    flex: 1,
    height: 1,
    backgroundColor: Colors.border,
  },

  itemRow: {
    flexDirection: "row",
    gap: Spacing.md,
  },
  lineCol: {
    width: 20,
    alignItems: "center",
  },
  lineTop: {
    width: 2,
    height: Spacing.sm,
    backgroundColor: Colors.border,
  },
  dot: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  lineBottom: {
    width: 2,
    flex: 1,
    backgroundColor: Colors.border,
  },

  itemCard: {
    flex: 1,
    backgroundColor: Colors.surface,
    borderRadius: Radius.md,
    padding: Spacing.md,
    marginBottom: Spacing.sm,
    ...Shadow.sm,
  },
  itemHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.sm,
    marginBottom: Spacing.xs,
  },
  itemDate: {
    fontSize: FontSize.xs,
    color: Colors.inkMuted,
    fontWeight: "500",
  },
  itemLabel: {
    fontSize: FontSize.sm,
    color: Colors.ink,
    fontWeight: "500",
  },
  itemSublabel: {
    fontSize: FontSize.xs,
    color: Colors.inkMuted,
    marginTop: 2,
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
  },
});
