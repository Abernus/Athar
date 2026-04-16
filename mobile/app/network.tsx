import { useState, useMemo, useRef, useEffect } from "react";
import {
  View,
  Text,
  Pressable,
  StyleSheet,
  Dimensions,
  ScrollView,
  PanResponder,
} from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { Colors, FontSize, Spacing, Radius, Shadow } from "@/lib/theme";
import { useResearchStore } from "@/stores/research-store";
import { getEntityName } from "@/types";
import { RELATIONSHIP_TYPE_LABELS, CONFIDENCE_LABELS } from "@/lib/constants";
import type { EntityType, AnyEntity, Relationship } from "@/types";

const { width: SCREEN_W, height: SCREEN_H } = Dimensions.get("window");
const GRAPH_SIZE = Math.max(SCREEN_W, SCREEN_H) * 1.5;

const NODE_COLORS: Record<EntityType, string> = {
  person: Colors.person.icon,
  group: Colors.group.icon,
  place: Colors.place.icon,
  event: Colors.event.icon,
};

const TYPE_FILTERS: { key: EntityType | "all"; label: string }[] = [
  { key: "all", label: "Tout" },
  { key: "person", label: "Personnes" },
  { key: "group", label: "Groupes" },
  { key: "place", label: "Lieux" },
  { key: "event", label: "Événements" },
];

interface GraphNode {
  id: string;
  entityType: EntityType;
  label: string;
  x: number;
  y: number;
}

interface GraphEdge {
  id: string;
  source: string;
  target: string;
  label: string;
  confidence: string;
}

function layoutNodes(entities: AnyEntity[], relationships: Relationship[]): GraphNode[] {
  const nodes: GraphNode[] = [];
  const cx = GRAPH_SIZE / 2;
  const cy = GRAPH_SIZE / 2;

  const connectedIds = new Set<string>();
  for (const r of relationships) {
    connectedIds.add(r.sourceEntityId);
    connectedIds.add(r.targetEntityId);
  }

  const connected = entities.filter((e) => connectedIds.has(e.id));
  const unconnected = entities.filter((e) => !connectedIds.has(e.id));

  const mainRadius = Math.min(connected.length * 30, GRAPH_SIZE * 0.35);
  connected.forEach((entity, i) => {
    const angle = (2 * Math.PI * i) / connected.length;
    nodes.push({
      id: entity.id,
      entityType: entity.entityType,
      label: getEntityName(entity),
      x: cx + mainRadius * Math.cos(angle),
      y: cy + mainRadius * Math.sin(angle),
    });
  });

  const outerRadius = mainRadius + 120;
  unconnected.forEach((entity, i) => {
    const angle = (2 * Math.PI * i) / Math.max(unconnected.length, 1);
    nodes.push({
      id: entity.id,
      entityType: entity.entityType,
      label: getEntityName(entity),
      x: cx + outerRadius * Math.cos(angle),
      y: cy + outerRadius * Math.sin(angle),
    });
  });

  return nodes;
}

export default function NetworkScreen() {
  const router = useRouter();
  const { focusId } = useLocalSearchParams<{ focusId?: string }>();
  const { getAllEntities, relationships } = useResearchStore();
  const [filter, setFilter] = useState<EntityType | "all">("all");
  const [selectedNode, setSelectedNode] = useState<string | null>(focusId ?? null);

  const allEntities = getAllEntities();
  const filteredEntities =
    filter === "all" ? allEntities : allEntities.filter((e) => e.entityType === filter);

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
        {TYPE_FILTERS.map((f) => (
          <Pressable
            key={f.key}
            style={[styles.filterPill, filter === f.key && styles.filterPillActive]}
            onPress={() => { setFilter(f.key); setSelectedNode(null); }}
          >
            <Text style={[styles.filterText, filter === f.key && styles.filterTextActive]}>
              {f.label}
            </Text>
          </Pressable>
        ))}
      </ScrollView>

      {/* Graph area */}
      <ScrollView
        style={styles.graphScroll}
        contentContainerStyle={{ width: GRAPH_SIZE, height: GRAPH_SIZE }}
        maximumZoomScale={3}
        minimumZoomScale={0.3}
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
            <View
              key={edge.id}
              style={[
                styles.edge,
                {
                  left: src.x,
                  top: src.y,
                  width: len,
                  transform: [{ rotate: `${angle}deg` }],
                  opacity: selectedNode ? (isHighlighted ? 1 : 0.15) : 0.4,
                  backgroundColor: isHighlighted ? Colors.accent : Colors.borderStrong,
                  height: isHighlighted ? 2 : 1,
                },
              ]}
            />
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

          return (
            <Pressable
              key={node.id}
              style={[
                styles.node,
                {
                  left: node.x - 24,
                  top: node.y - 24,
                  backgroundColor: NODE_COLORS[node.entityType],
                  opacity: dimmed ? 0.2 : 1,
                  transform: [{ scale: isSelected ? 1.3 : 1 }],
                },
                isSelected && styles.nodeSelected,
              ]}
              onPress={() => setSelectedNode(isSelected ? null : node.id)}
            >
              <Text style={styles.nodeLabel} numberOfLines={1}>
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
                  top: node.y + 26,
                  opacity: dimmed ? 0.15 : 1,
                },
              ]}
              numberOfLines={1}
            >
              {node.label}
            </Text>
          );
        })}
      </ScrollView>

      {/* Detail panel */}
      {selectedEntity && (
        <View style={styles.detailPanel}>
          <View style={styles.detailHeader}>
            <View style={[styles.detailDot, { backgroundColor: NODE_COLORS[selectedEntity.entityType] }]} />
            <Text style={styles.detailName} numberOfLines={1}>
              {getEntityName(selectedEntity)}
            </Text>
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
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.detailEdges}>
              {selectedEdges.map((edge) => {
                const otherId = edge.source === selectedNode ? edge.target : edge.source;
                const other = allEntities.find((e) => e.id === otherId);
                return (
                  <Pressable
                    key={edge.id}
                    style={styles.edgeChip}
                    onPress={() => setSelectedNode(otherId)}
                  >
                    <Text style={styles.edgeChipLabel}>{edge.label}</Text>
                    <Text style={styles.edgeChipName}>
                      {other ? getEntityName(other) : "?"}
                    </Text>
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
    </View>
  );
}

const styles = StyleSheet.create({
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
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.sm,
    borderRadius: Radius.full,
    backgroundColor: Colors.surfaceSunken,
  },
  filterPillActive: { backgroundColor: Colors.accentLight },
  filterText: { fontSize: FontSize.sm, color: Colors.inkMuted, fontWeight: "500" },
  filterTextActive: { color: Colors.accent, fontWeight: "600" },

  graphScroll: { flex: 1 },

  edge: {
    position: "absolute",
    height: 1,
    transformOrigin: "left center",
  },

  node: {
    position: "absolute",
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: "center",
    justifyContent: "center",
  },
  nodeSelected: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  nodeLabel: {
    color: "white",
    fontSize: 13,
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
    ...Shadow.lg,
  },
  detailHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.md,
  },
  detailDot: { width: 12, height: 12, borderRadius: 6 },
  detailName: { flex: 1, fontSize: FontSize.base, fontWeight: "600", color: Colors.ink },
  detailGoBtn: {
    width: 32,
    height: 32,
    borderRadius: Radius.sm,
    backgroundColor: Colors.accentLight,
    alignItems: "center",
    justifyContent: "center",
  },
  detailEdges: { marginTop: Spacing.md },
  edgeChip: {
    backgroundColor: Colors.surfaceSunken,
    borderRadius: Radius.md,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    marginRight: Spacing.sm,
  },
  edgeChipLabel: { fontSize: FontSize.xs, color: Colors.inkMuted, fontWeight: "500" },
  edgeChipName: { fontSize: FontSize.sm, color: Colors.ink, fontWeight: "500", marginTop: 2 },

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
