import { useState, useMemo } from "react";
import {
  View,
  Text,
  Pressable,
  StyleSheet,
  Dimensions,
  ScrollView,
} from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { Colors, FontSize, Spacing, Radius, Shadow } from "@/lib/theme";
import { useThemedStyles } from "@/lib/useTheme";
import { useResearchStore } from "@/stores/research-store";
import { getEntityName } from "@/types";
import { RELATIONSHIP_TYPE_LABELS, CONFIDENCE_LABELS, ENTITY_TYPE_LABELS } from "@/lib/constants";
import { ConfidencePill } from "@/components/ConfidencePill";
import type { EntityType, AnyEntity, Relationship } from "@/types";

const { width: SCREEN_W, height: SCREEN_H } = Dimensions.get("window");
const GRAPH_SIZE = Math.max(SCREEN_W, SCREEN_H) * 1.8;

const NODE_COLORS: Record<EntityType, string> = {
  person: Colors.person.icon,
  group: Colors.group.icon,
  place: Colors.place.icon,
  event: Colors.event.icon,
};

const TYPE_SECTORS: Record<EntityType, number> = {
  person: 0,
  group: 1,
  place: 2,
  event: 3,
};

interface GraphNode {
  id: string;
  entityType: EntityType;
  label: string;
  x: number;
  y: number;
  connectionCount: number;
}

interface GraphEdge {
  id: string;
  source: string;
  target: string;
  label: string;
  confidence: string;
  relType: string;
}

function layoutNodes(entities: AnyEntity[], relationships: Relationship[]): GraphNode[] {
  const cx = GRAPH_SIZE / 2;
  const cy = GRAPH_SIZE / 2;

  const connectionCounts = new Map<string, number>();
  for (const r of relationships) {
    connectionCounts.set(r.sourceEntityId, (connectionCounts.get(r.sourceEntityId) ?? 0) + 1);
    connectionCounts.set(r.targetEntityId, (connectionCounts.get(r.targetEntityId) ?? 0) + 1);
  }

  const byType: Record<EntityType, AnyEntity[]> = { person: [], group: [], place: [], event: [] };
  for (const e of entities) byType[e.entityType].push(e);

  const nodes: GraphNode[] = [];
  const typeKeys = (Object.keys(byType) as EntityType[]).filter((t) => byType[t].length > 0);

  typeKeys.forEach((type, typeIdx) => {
    const typeEntities = byType[type];
    const sectorAngle = (2 * Math.PI) / Math.max(typeKeys.length, 1);
    const sectorStart = sectorAngle * typeIdx - Math.PI / 2;

    typeEntities.sort((a, b) => (connectionCounts.get(b.id) ?? 0) - (connectionCounts.get(a.id) ?? 0));

    typeEntities.forEach((entity, i) => {
      const conns = connectionCounts.get(entity.id) ?? 0;
      const radius = conns > 0
        ? 80 + i * 55
        : 200 + typeEntities.filter((e) => (connectionCounts.get(e.id) ?? 0) > 0).length * 55 + (i - typeEntities.filter((e) => (connectionCounts.get(e.id) ?? 0) > 0).length) * 50;

      const spread = Math.min(sectorAngle * 0.8, Math.PI * 0.4);
      const entityAngle = typeEntities.length === 1
        ? sectorStart + sectorAngle / 2
        : sectorStart + spread * 0.1 + (spread * 0.8 * i) / Math.max(typeEntities.length - 1, 1);

      nodes.push({
        id: entity.id,
        entityType: entity.entityType,
        label: getEntityName(entity),
        x: cx + radius * Math.cos(entityAngle),
        y: cy + radius * Math.sin(entityAngle),
        connectionCount: conns,
      });
    });
  });

  return nodes;
}

export default function NetworkScreen() {
  const styles = useThemedStyles(makeStyles);
  const router = useRouter();
  const { focusId } = useLocalSearchParams<{ focusId?: string }>();
  const { getAllEntities, relationships, getEntityDisplayName } = useResearchStore();
  const [filter, setFilter] = useState<EntityType | "all">("all");
  const [selectedNode, setSelectedNode] = useState<string | null>(focusId ?? null);
  const [showLegend, setShowLegend] = useState(true);
  const [focusMode, setFocusMode] = useState(!!focusId);

  const allEntities = getAllEntities();
  const typeFiltered =
    filter === "all" ? allEntities : allEntities.filter((e) => e.entityType === filter);

  const filteredEntities = focusMode && selectedNode
    ? (() => {
        const connectedIds = new Set<string>([selectedNode]);
        for (const r of relationships) {
          if (r.sourceEntityId === selectedNode) connectedIds.add(r.targetEntityId);
          if (r.targetEntityId === selectedNode) connectedIds.add(r.sourceEntityId);
        }
        return typeFiltered.filter((e) => connectedIds.has(e.id));
      })()
    : typeFiltered;

  const typeCounts: Record<string, number> = { all: allEntities.length, person: 0, group: 0, place: 0, event: 0 };
  for (const e of allEntities) typeCounts[e.entityType]++;

  const nodes = useMemo(
    () => layoutNodes(filteredEntities, relationships),
    [filteredEntities, relationships]
  );

  const edges = useMemo(() => {
    const nodeIds = new Set(nodes.map((n) => n.id));
    return relationships
      .filter((r) => nodeIds.has(r.sourceEntityId) && nodeIds.has(r.targetEntityId))
      .map((r) => ({
        id: r.id,
        source: r.sourceEntityId,
        target: r.targetEntityId,
        label: r.label || RELATIONSHIP_TYPE_LABELS[r.relationshipType],
        confidence: r.confidenceLevel,
        relType: r.relationshipType,
      }));
  }, [nodes, relationships]);

  const nodeMap = useMemo(() => {
    const map = new Map<string, GraphNode>();
    nodes.forEach((n) => map.set(n.id, n));
    return map;
  }, [nodes]);

  const selectedEntity = selectedNode
    ? allEntities.find((e) => e.id === selectedNode)
    : null;
  const selectedEdges = selectedNode
    ? edges.filter((e) => e.source === selectedNode || e.target === selectedNode)
    : [];

  return (
    <View style={styles.container}>
      {/* Type filter */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.filterBar}
        contentContainerStyle={styles.filterContent}
      >
        {[
          { key: "all" as const, label: "Tout" },
          { key: "person" as const, label: "Personnes" },
          { key: "group" as const, label: "Groupes" },
          { key: "place" as const, label: "Lieux" },
          { key: "event" as const, label: "Événements" },
        ].map((f) => {
          const count = typeCounts[f.key] ?? 0;
          if (f.key !== "all" && count === 0) return null;
          return (
            <Pressable
              key={f.key}
              style={[styles.filterPill, filter === f.key && styles.filterPillActive]}
              onPress={() => { setFilter(f.key); setSelectedNode(null); }}
            >
              {f.key !== "all" && (
                <View style={[styles.filterDot, { backgroundColor: NODE_COLORS[f.key] }]} />
              )}
              <Text style={[styles.filterText, filter === f.key && styles.filterTextActive]}>
                {f.label} ({count})
              </Text>
            </Pressable>
          );
        })}
      </ScrollView>

      {/* Graph area */}
      <ScrollView
        style={styles.graphScroll}
        contentContainerStyle={{ width: GRAPH_SIZE, height: GRAPH_SIZE }}
        maximumZoomScale={3}
        minimumZoomScale={0.2}
        bouncesZoom
        showsHorizontalScrollIndicator={false}
        showsVerticalScrollIndicator={false}
        contentOffset={{ x: GRAPH_SIZE / 2 - SCREEN_W / 2, y: GRAPH_SIZE / 2 - SCREEN_H / 3 }}
      >
        {/* Edges */}
        {edges.map((edge) => {
          const src = nodeMap.get(edge.source);
          const tgt = nodeMap.get(edge.target);
          if (!src || !tgt) return null;

          const isHighlighted =
            selectedNode === edge.source || selectedNode === edge.target;
          const dx = tgt.x - src.x;
          const dy = tgt.y - src.y;
          const len = Math.sqrt(dx * dx + dy * dy);
          const angle = Math.atan2(dy, dx) * (180 / Math.PI);

          return (
            <View key={edge.id}>
              <View
                style={[
                  styles.edge,
                  {
                    left: src.x,
                    top: src.y,
                    width: len,
                    transform: [{ rotate: `${angle}deg` }],
                    opacity: selectedNode ? (isHighlighted ? 1 : 0.1) : 0.35,
                    backgroundColor: isHighlighted ? Colors.accent : Colors.borderStrong,
                    height: isHighlighted ? 2.5 : 1,
                  },
                ]}
              />
              {isHighlighted && len > 100 && (
                <Text
                  style={[
                    styles.edgeLabel,
                    {
                      left: (src.x + tgt.x) / 2 - 40,
                      top: (src.y + tgt.y) / 2 - 8,
                    },
                  ]}
                  numberOfLines={1}
                >
                  {edge.label}
                </Text>
              )}
            </View>
          );
        })}

        {/* Nodes */}
        {nodes.map((node) => {
          const isSelected = selectedNode === node.id;
          const isConnected = selectedNode
            ? edges.some(
                (e) =>
                  (e.source === selectedNode && e.target === node.id) ||
                  (e.target === selectedNode && e.source === node.id)
              )
            : false;
          const dimmed = selectedNode && !isSelected && !isConnected;
          const size = node.connectionCount > 3 ? 56 : node.connectionCount > 0 ? 48 : 36;

          return (
            <Pressable
              key={node.id}
              style={[
                styles.node,
                {
                  left: node.x - size / 2,
                  top: node.y - size / 2,
                  width: size,
                  height: size,
                  borderRadius: size / 2,
                  backgroundColor: NODE_COLORS[node.entityType],
                  opacity: dimmed ? 0.15 : 1,
                  transform: [{ scale: isSelected ? 1.25 : 1 }],
                },
                isSelected && styles.nodeSelected,
              ]}
              onPress={() => setSelectedNode(isSelected ? null : node.id)}
            >
              <Text style={[styles.nodeLabel, { fontSize: size > 48 ? 14 : size > 36 ? 13 : 11 }]} numberOfLines={1}>
                {node.label.slice(0, 2).toUpperCase()}
              </Text>
            </Pressable>
          );
        })}

        {/* Node labels */}
        {nodes.map((node) => {
          const dimmed =
            selectedNode &&
            node.id !== selectedNode &&
            !edges.some(
              (e) =>
                (e.source === selectedNode && e.target === node.id) ||
                (e.target === selectedNode && e.source === node.id)
            );
          return (
            <Text
              key={`label-${node.id}`}
              style={[
                styles.nodeName,
                {
                  left: node.x - 50,
                  top: node.y + (node.connectionCount > 3 ? 30 : node.connectionCount > 0 ? 26 : 20),
                  opacity: dimmed ? 0.1 : 1,
                },
              ]}
              numberOfLines={1}
            >
              {node.label}
            </Text>
          );
        })}
      </ScrollView>

      {/* Legend */}
      {showLegend && !selectedEntity && (
        <View style={styles.legend}>
          {(Object.keys(NODE_COLORS) as EntityType[]).map((type) => (
            <View key={type} style={styles.legendItem}>
              <View style={[styles.legendDot, { backgroundColor: NODE_COLORS[type] }]} />
              <Text style={styles.legendText}>{ENTITY_TYPE_LABELS[type]}</Text>
            </View>
          ))}
          <Pressable onPress={() => setShowLegend(false)} style={styles.legendClose}>
            <Ionicons name="close" size={14} color={Colors.inkMuted} />
          </Pressable>
        </View>
      )}

      {/* Detail panel */}
      {selectedEntity && (
        <View style={styles.detailPanel}>
          <View style={styles.detailHeader}>
            <View style={[styles.detailDot, { backgroundColor: NODE_COLORS[selectedEntity.entityType] }]} />
            <View style={styles.detailHeaderText}>
              <Text style={styles.detailName} numberOfLines={1}>
                {getEntityName(selectedEntity)}
              </Text>
              <Text style={styles.detailType}>
                {ENTITY_TYPE_LABELS[selectedEntity.entityType]} · {selectedEdges.length} relation{selectedEdges.length !== 1 ? "s" : ""}
              </Text>
            </View>
            <Pressable
              style={styles.detailGoBtn}
              onPress={() =>
                router.push(`/entity/${selectedEntity.entityType}/${selectedEntity.id}` as never)
              }
            >
              <Ionicons name="open-outline" size={16} color={Colors.accent} />
            </Pressable>
            <Pressable onPress={() => setSelectedNode(null)}>
              <Ionicons name="close" size={20} color={Colors.inkMuted} />
            </Pressable>
          </View>
          {selectedEdges.length > 0 && (
            <ScrollView
              horizontal={false}
              style={styles.detailEdges}
              showsVerticalScrollIndicator={false}
            >
              {selectedEdges.map((edge) => {
                const otherId = edge.source === selectedNode ? edge.target : edge.source;
                const other = allEntities.find((e) => e.id === otherId);
                return (
                  <Pressable
                    key={edge.id}
                    style={styles.edgeRow}
                    onPress={() => setSelectedNode(otherId)}
                  >
                    <View style={[styles.edgeRowDot, { backgroundColor: other ? NODE_COLORS[other.entityType] : Colors.inkMuted }]} />
                    <View style={styles.edgeRowText}>
                      <Text style={styles.edgeRowName} numberOfLines={1}>
                        {other ? getEntityName(other) : "?"}
                      </Text>
                      <Text style={styles.edgeRowLabel}>{edge.label}</Text>
                    </View>
                    <ConfidencePill level={edge.confidence} />
                  </Pressable>
                );
              })}
            </ScrollView>
          )}
        </View>
      )}

      {/* Empty state */}
      {nodes.length === 0 && (
        <View style={styles.emptyState}>
          <Ionicons name="git-network-outline" size={36} color={Colors.borderStrong} />
          <Text style={styles.emptyTitle}>Réseau vide</Text>
          <Text style={styles.emptyHint}>
            Ajoutez des entités et créez des relations pour visualiser le réseau
          </Text>
        </View>
      )}

      {/* Stats */}
      <View style={styles.statsBar}>
        <Text style={styles.statsText}>
          {nodes.length} nœuds · {edges.length} liens
        </Text>
      </View>

      {/* Focus toggle */}
      {selectedNode && (
        <Pressable
          style={[styles.focusBtn, focusMode && styles.focusBtnActive]}
          onPress={() => setFocusMode(!focusMode)}
        >
          <Ionicons
            name={focusMode ? "eye" : "eye-outline"}
            size={14}
            color={focusMode ? "white" : Colors.accent}
          />
          <Text style={[styles.focusBtnText, focusMode && { color: "white" }]}>
            {focusMode ? "Focus actif" : "Focus"}
          </Text>
        </Pressable>
      )}
    </View>
  );
}

const makeStyles = () => StyleSheet.create({
  container: { flex: 1, backgroundColor: "#FAFAF9" },

  filterBar: {
    backgroundColor: Colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
    flexGrow: 0,
    zIndex: 10,
  },
  filterContent: { paddingHorizontal: Spacing.lg, paddingVertical: Spacing.sm, gap: Spacing.sm },
  filterPill: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.sm,
    borderRadius: Radius.full,
    backgroundColor: Colors.surfaceSunken,
  },
  filterPillActive: { backgroundColor: Colors.accentLight },
  filterDot: { width: 8, height: 8, borderRadius: 4 },
  filterText: { fontSize: FontSize.sm, color: Colors.inkMuted, fontWeight: "500" },
  filterTextActive: { color: Colors.accent, fontWeight: "600" },

  graphScroll: { flex: 1 },

  edge: {
    position: "absolute",
    height: 1,
    transformOrigin: "left center",
  },
  edgeLabel: {
    position: "absolute",
    width: 80,
    textAlign: "center",
    fontSize: 9,
    color: Colors.accent,
    fontWeight: "600",
    backgroundColor: "rgba(255,255,255,0.85)",
    borderRadius: 4,
    paddingHorizontal: 4,
    paddingVertical: 1,
    overflow: "hidden",
  },

  node: {
    position: "absolute",
    alignItems: "center",
    justifyContent: "center",
  },
  nodeSelected: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.35,
    shadowRadius: 10,
    elevation: 6,
  },
  nodeLabel: {
    color: "white",
    fontWeight: "700",
  },
  nodeName: {
    position: "absolute",
    width: 100,
    textAlign: "center",
    fontSize: 11,
    color: Colors.inkSecondary,
    fontWeight: "500",
  },

  legend: {
    position: "absolute",
    bottom: Spacing.xxxl + 40,
    left: Spacing.lg,
    backgroundColor: "rgba(255,255,255,0.95)",
    borderRadius: Radius.lg,
    padding: Spacing.md,
    gap: Spacing.xs,
    ...Shadow.sm,
  },
  legendItem: { flexDirection: "row", alignItems: "center", gap: Spacing.sm },
  legendDot: { width: 10, height: 10, borderRadius: 5 },
  legendText: { fontSize: FontSize.xs, color: Colors.inkSecondary, fontWeight: "500" },
  legendClose: { position: "absolute", top: 6, right: 6 },

  detailPanel: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: Colors.surface,
    borderTopLeftRadius: Radius.xl,
    borderTopRightRadius: Radius.xl,
    padding: Spacing.lg,
    paddingBottom: Spacing.xxxl,
    maxHeight: SCREEN_H * 0.45,
    ...Shadow.lg,
  },
  detailHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.md,
  },
  detailDot: { width: 14, height: 14, borderRadius: 7 },
  detailHeaderText: { flex: 1 },
  detailName: { fontSize: FontSize.base, fontWeight: "700", color: Colors.ink },
  detailType: { fontSize: FontSize.xs, color: Colors.inkMuted, marginTop: 1 },
  detailGoBtn: {
    width: 34,
    height: 34,
    borderRadius: Radius.md,
    backgroundColor: Colors.accentLight,
    alignItems: "center",
    justifyContent: "center",
  },
  detailEdges: { marginTop: Spacing.md, maxHeight: 180 },
  edgeRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.md,
    paddingVertical: Spacing.sm + 2,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  edgeRowDot: { width: 8, height: 8, borderRadius: 4 },
  edgeRowText: { flex: 1 },
  edgeRowName: { fontSize: FontSize.sm, color: Colors.ink, fontWeight: "500" },
  edgeRowLabel: { fontSize: FontSize.xs, color: Colors.inkMuted, marginTop: 1 },

  emptyState: {
    position: "absolute",
    top: "40%",
    left: 0,
    right: 0,
    alignItems: "center",
    gap: Spacing.sm,
  },
  emptyTitle: { fontSize: FontSize.lg, fontWeight: "600", color: Colors.inkSecondary },
  emptyHint: { fontSize: FontSize.sm, color: Colors.inkMuted, textAlign: "center", maxWidth: 260 },

  focusBtn: {
    position: "absolute",
    top: 52,
    left: Spacing.lg,
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    backgroundColor: "rgba(255,255,255,0.95)",
    borderRadius: Radius.full,
    paddingHorizontal: Spacing.sm + 2,
    paddingVertical: 4,
    ...Shadow.sm,
  },
  focusBtnActive: { backgroundColor: Colors.accent },
  focusBtnText: { fontSize: FontSize.xs, color: Colors.accent, fontWeight: "600" },

  statsBar: {
    position: "absolute",
    top: 52,
    right: Spacing.lg,
    backgroundColor: "rgba(255,255,255,0.9)",
    borderRadius: Radius.full,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.xs,
  },
  statsText: { fontSize: FontSize.xs, color: Colors.inkMuted },
});
