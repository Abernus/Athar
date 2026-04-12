import { ScrollView, View, Text, Pressable, StyleSheet, Linking } from "react-native";
import { useLocalSearchParams, useNavigation, useRouter } from "expo-router";
import { useEffect } from "react";
import { Colors, FontSize, Spacing, Radius } from "@/lib/theme";
import { useResearchStore } from "@/stores/research-store";
import { Card } from "@/components/Card";
import { EntityBadge } from "@/components/EntityBadge";
import { ConfidencePill } from "@/components/ConfidencePill";
import { formatHistoricalDate } from "@/lib/utils";
import { RELATIONSHIP_TYPE_LABELS, ENTITY_TYPE_LABELS } from "@/lib/constants";
import { getEntityName } from "@/types";
import type { EntityType } from "@/types";

export default function EntityDetailScreen() {
  const { type, id } = useLocalSearchParams<{ type: string; id: string }>();
  const navigation = useNavigation();
  const router = useRouter();
  const { getEntityById, getRelationshipsFor, getEntityDisplayName } = useResearchStore();

  const entityType = type as EntityType;
  const entity = getEntityById(entityType, id);
  const relationships = getRelationshipsFor(entityType, id);

  useEffect(() => {
    if (entity) navigation.setOptions({ title: getEntityName(entity) });
  }, [entity]);

  if (!entity) {
    return (
      <View style={styles.notFound}>
        <Text style={styles.notFoundText}>Entité introuvable.</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.scroll} contentContainerStyle={styles.content}>
      {/* Header card */}
      <Card>
        <View style={styles.entityHeader}>
          <EntityBadge type={entity.entityType} size="md" />
          <View style={styles.entityHeaderText}>
            <Text style={styles.entityName}>{getEntityName(entity)}</Text>
            <Text style={styles.entityType}>{ENTITY_TYPE_LABELS[entity.entityType]}</Text>
          </View>
        </View>

        {/* Entity-specific fields */}
        {entity.entityType === "person" && (
          <View style={styles.fieldGrid}>
            {entity.birthDate && (
              <View style={styles.field}>
                <Text style={styles.fieldLabel}>Naissance</Text>
                <Text style={styles.fieldValue}>{formatHistoricalDate(entity.birthDate)}</Text>
              </View>
            )}
            {entity.deathDate && (
              <View style={styles.field}>
                <Text style={styles.fieldLabel}>Décès</Text>
                <Text style={styles.fieldValue}>{formatHistoricalDate(entity.deathDate)}</Text>
              </View>
            )}
            {entity.alternateNames.length > 0 && (
              <View style={styles.fieldFull}>
                <Text style={styles.fieldLabel}>Aussi connu(e) comme</Text>
                <Text style={styles.fieldValue}>{entity.alternateNames.join(", ")}</Text>
              </View>
            )}
          </View>
        )}

        {entity.entityType === "event" && (
          <View style={styles.fieldGrid}>
            {entity.dateStart && (
              <View style={styles.field}>
                <Text style={styles.fieldLabel}>Date</Text>
                <Text style={styles.fieldValue}>{formatHistoricalDate(entity.dateStart)}</Text>
              </View>
            )}
          </View>
        )}

        {/* Summary */}
        {"summary" in entity && entity.summary ? (
          <Text style={styles.summary}>{entity.summary}</Text>
        ) : null}
        {"description" in entity && entity.description ? (
          <Text style={styles.summary}>{entity.description}</Text>
        ) : null}

        {/* Tags */}
        {entity.tags.length > 0 && (
          <View style={styles.tags}>
            {entity.tags.map((tag) => (
              <View key={tag} style={styles.tag}>
                <Text style={styles.tagText}>{tag}</Text>
              </View>
            ))}
          </View>
        )}
      </Card>

      {/* Relations */}
      {relationships.length > 0 && (
        <>
          <Text style={styles.sectionTitle}>RELATIONS</Text>
          <Card style={styles.relCard}>
            {relationships.map((rel, i) => {
              const isSource = rel.sourceEntityType === entityType && rel.sourceEntityId === id;
              const otherType = isSource ? rel.targetEntityType : rel.sourceEntityType;
              const otherId = isSource ? rel.targetEntityId : rel.sourceEntityId;

              return (
                <Pressable
                  key={rel.id}
                  style={[styles.relRow, i < relationships.length - 1 && styles.relBorder]}
                  onPress={() => router.push(`/entity/${otherType}/${otherId}` as never)}
                >
                  <EntityBadge type={otherType} />
                  <View style={styles.relText}>
                    <Text style={styles.relName}>{getEntityDisplayName(otherType, otherId)}</Text>
                    <Text style={styles.relType}>
                      {rel.label || RELATIONSHIP_TYPE_LABELS[rel.relationshipType]}
                    </Text>
                  </View>
                  <ConfidencePill level={rel.confidenceLevel} />
                </Pressable>
              );
            })}
          </Card>
        </>
      )}

      {/* Notes */}
      {entity.notes ? (
        <>
          <Text style={styles.sectionTitle}>NOTES</Text>
          <Card>
            <Text style={styles.notes}>{entity.notes}</Text>
          </Card>
        </>
      ) : null}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scroll: { flex: 1, backgroundColor: Colors.surfaceSunken },
  content: { padding: Spacing.lg, paddingBottom: Spacing.xxl, gap: Spacing.sm },
  notFound: { flex: 1, alignItems: "center", justifyContent: "center" },
  notFoundText: { fontSize: FontSize.base, color: Colors.inkMuted },
  entityHeader: { flexDirection: "row", alignItems: "center", gap: Spacing.md, marginBottom: Spacing.md },
  entityHeaderText: { flex: 1 },
  entityName: { fontSize: FontSize.lg, fontWeight: "600", color: Colors.ink },
  entityType: { fontSize: FontSize.xs, color: Colors.inkMuted, marginTop: 2, textTransform: "uppercase", letterSpacing: 0.5 },
  fieldGrid: { flexDirection: "row", flexWrap: "wrap", gap: Spacing.md, marginBottom: Spacing.md },
  field: { minWidth: "40%" },
  fieldFull: { width: "100%" },
  fieldLabel: { fontSize: FontSize.xs, color: Colors.inkMuted, textTransform: "uppercase", letterSpacing: 0.5, marginBottom: 2 },
  fieldValue: { fontSize: FontSize.sm, color: Colors.ink, fontWeight: "500" },
  summary: { fontSize: FontSize.sm, color: Colors.inkSecondary, lineHeight: 20, marginTop: Spacing.sm },
  tags: { flexDirection: "row", flexWrap: "wrap", gap: Spacing.xs, marginTop: Spacing.md },
  tag: { backgroundColor: Colors.surfaceSunken, borderRadius: Radius.full, paddingHorizontal: Spacing.sm, paddingVertical: 3, borderWidth: 1, borderColor: Colors.border },
  tagText: { fontSize: FontSize.xs, color: Colors.inkSecondary },
  sectionTitle: { fontSize: FontSize.xs, fontWeight: "600", color: Colors.inkMuted, letterSpacing: 0.8, marginTop: Spacing.sm },
  relCard: { padding: 0, overflow: "hidden" },
  relRow: { flexDirection: "row", alignItems: "center", gap: Spacing.md, padding: Spacing.md },
  relBorder: { borderBottomWidth: 1, borderBottomColor: Colors.border },
  relText: { flex: 1 },
  relName: { fontSize: FontSize.sm, color: Colors.ink, fontWeight: "500" },
  relType: { fontSize: FontSize.xs, color: Colors.inkMuted, marginTop: 2 },
  notes: { fontSize: FontSize.sm, color: Colors.inkSecondary, lineHeight: 20 },
});
