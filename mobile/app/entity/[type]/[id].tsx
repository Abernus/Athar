import {
  ScrollView,
  View,
  Text,
  TextInput,
  Pressable,
  StyleSheet,
  Alert,
} from "react-native";
import { useLocalSearchParams, useNavigation, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { Ionicons } from "@expo/vector-icons";
import { Colors, FontSize, Spacing, Radius, Shadow } from "@/lib/theme";
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
  const {
    getEntityById, getRelationshipsFor, getEntityDisplayName,
    deleteEntity, getAliasesFor, addEntityAlias, excerpts, sources,
  } = useResearchStore();

  const entityType = type as EntityType;
  const entity = getEntityById(entityType, id);
  const relationships = getRelationshipsFor(entityType, id);
  const aliases = getAliasesFor(entityType, id);

  const linkedExcerpts = excerpts.filter(
    (e) => e.linkedEntityType === entityType && e.linkedEntityId === id
  );

  const [showAliasForm, setShowAliasForm] = useState(false);
  const [aliasText, setAliasText] = useState("");
  const [aliasLang, setAliasLang] = useState("");

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

  async function saveAlias() {
    if (!aliasText.trim()) return;
    await addEntityAlias({
      entityType,
      entityId: id,
      alias: aliasText.trim(),
      language: aliasLang.trim(),
      script: "",
      transcriptionSystem: "",
      notes: "",
    });
    setAliasText("");
    setAliasLang("");
    setShowAliasForm(false);
  }

  return (
    <ScrollView style={styles.scroll} contentContainerStyle={styles.content}>
      {/* Header card */}
      <Card>
        <View style={styles.entityHeader}>
          <EntityBadge type={entity.entityType} size="lg" />
          <View style={styles.entityHeaderText}>
            <Text style={styles.entityName}>{getEntityName(entity)}</Text>
            <Text style={styles.entityType}>
              {ENTITY_TYPE_LABELS[entity.entityType]}
            </Text>
          </View>
        </View>

        {/* Person fields */}
        {entity.entityType === "person" && (
          <View style={styles.fieldGrid}>
            {entity.birthDate && (
              <View style={styles.field}>
                <Text style={styles.fieldLabel}>Naissance</Text>
                <Text style={styles.fieldValue}>
                  {formatHistoricalDate(entity.birthDate)}
                </Text>
              </View>
            )}
            {entity.deathDate && (
              <View style={styles.field}>
                <Text style={styles.fieldLabel}>Décès</Text>
                <Text style={styles.fieldValue}>
                  {formatHistoricalDate(entity.deathDate)}
                </Text>
              </View>
            )}
            {entity.alternateNames.length > 0 && (
              <View style={styles.fieldFull}>
                <Text style={styles.fieldLabel}>Aussi connu(e) comme</Text>
                <Text style={styles.fieldValue}>
                  {entity.alternateNames.join(", ")}
                </Text>
              </View>
            )}
          </View>
        )}

        {/* Group fields */}
        {entity.entityType === "group" && entity.timeRange && (
          <View style={styles.fieldGrid}>
            {entity.timeRange.start && (
              <View style={styles.field}>
                <Text style={styles.fieldLabel}>Début</Text>
                <Text style={styles.fieldValue}>{formatHistoricalDate(entity.timeRange.start)}</Text>
              </View>
            )}
            {entity.timeRange.end && (
              <View style={styles.field}>
                <Text style={styles.fieldLabel}>Fin</Text>
                <Text style={styles.fieldValue}>{formatHistoricalDate(entity.timeRange.end)}</Text>
              </View>
            )}
          </View>
        )}

        {/* Event fields */}
        {entity.entityType === "event" && (
          <View style={styles.fieldGrid}>
            {entity.dateStart && (
              <View style={styles.field}>
                <Text style={styles.fieldLabel}>Date début</Text>
                <Text style={styles.fieldValue}>
                  {formatHistoricalDate(entity.dateStart)}
                </Text>
              </View>
            )}
            {entity.dateEnd && (
              <View style={styles.field}>
                <Text style={styles.fieldLabel}>Date fin</Text>
                <Text style={styles.fieldValue}>
                  {formatHistoricalDate(entity.dateEnd)}
                </Text>
              </View>
            )}
          </View>
        )}

        {/* Place type */}
        {entity.entityType === "place" && entity.placeType && (
          <View style={styles.fieldGrid}>
            <View style={styles.field}>
              <Text style={styles.fieldLabel}>Type</Text>
              <Text style={styles.fieldValue}>{entity.placeType}</Text>
            </View>
          </View>
        )}

        {/* Summary / Description */}
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

      {/* Aliases */}
      {(aliases.length > 0 || showAliasForm) && (
        <>
          <View style={styles.sectionRow}>
            <View style={styles.sectionBar} />
            <Text style={styles.sectionTitle}>Variantes de nom</Text>
          </View>
          <Card>
            {aliases.map((a) => (
              <View key={a.id} style={styles.aliasRow}>
                <Text style={styles.aliasText}>{a.alias}</Text>
                {a.language ? (
                  <View style={styles.aliasLangBadge}>
                    <Text style={styles.aliasLangText}>{a.language}</Text>
                  </View>
                ) : null}
              </View>
            ))}
            {showAliasForm && (
              <View style={styles.aliasForm}>
                <TextInput
                  style={styles.aliasInput}
                  value={aliasText}
                  onChangeText={setAliasText}
                  placeholder="Variante de nom..."
                  placeholderTextColor={Colors.inkMuted}
                  autoFocus
                />
                <TextInput
                  style={[styles.aliasInput, { flex: 0.4 }]}
                  value={aliasLang}
                  onChangeText={setAliasLang}
                  placeholder="Langue"
                  placeholderTextColor={Colors.inkMuted}
                />
                <Pressable style={styles.aliasSaveBtn} onPress={saveAlias}>
                  <Ionicons name="checkmark" size={18} color="white" />
                </Pressable>
              </View>
            )}
          </Card>
        </>
      )}

      {/* Relations */}
      {relationships.length > 0 && (
        <>
          <View style={styles.sectionRow}>
            <View style={styles.sectionBar} />
            <Text style={styles.sectionTitle}>Relations ({relationships.length})</Text>
          </View>
          <View style={styles.relCard}>
            {relationships.map((rel, i) => {
              const isSource =
                rel.sourceEntityType === entityType &&
                rel.sourceEntityId === id;
              const otherType = isSource
                ? rel.targetEntityType
                : rel.sourceEntityType;
              const otherId = isSource
                ? rel.targetEntityId
                : rel.sourceEntityId;

              return (
                <Pressable
                  key={rel.id}
                  style={[
                    styles.relRow,
                    i < relationships.length - 1 && styles.relBorder,
                  ]}
                  onPress={() =>
                    router.push(`/entity/${otherType}/${otherId}` as never)
                  }
                >
                  <EntityBadge type={otherType} />
                  <View style={styles.relText}>
                    <Text style={styles.relName}>
                      {getEntityDisplayName(otherType, otherId)}
                    </Text>
                    <Text style={styles.relType}>
                      {rel.label ||
                        RELATIONSHIP_TYPE_LABELS[rel.relationshipType]}
                    </Text>
                  </View>
                  <ConfidencePill level={rel.confidenceLevel} />
                </Pressable>
              );
            })}
          </View>
        </>
      )}

      {/* Linked excerpts */}
      {linkedExcerpts.length > 0 && (
        <>
          <View style={styles.sectionRow}>
            <View style={styles.sectionBar} />
            <Text style={styles.sectionTitle}>Extraits liés ({linkedExcerpts.length})</Text>
          </View>
          <View style={styles.relCard}>
            {linkedExcerpts.map((exc, i) => {
              const src = sources.find((s) => s.id === exc.sourceId);
              return (
                <Pressable
                  key={exc.id}
                  style={[styles.relRow, i < linkedExcerpts.length - 1 && styles.relBorder]}
                  onPress={() => src ? router.push(`/source/${src.id}` as never) : undefined}
                >
                  <Ionicons name="document-text" size={16} color={Colors.inkMuted} />
                  <View style={styles.relText}>
                    <Text style={styles.relName} numberOfLines={2}>
                      {exc.selectedText || exc.excerptSummary}
                    </Text>
                    <Text style={styles.relType}>
                      {src?.title ?? "Source"}{exc.pageOrLocation ? ` · ${exc.pageOrLocation}` : ""}
                    </Text>
                  </View>
                </Pressable>
              );
            })}
          </View>
        </>
      )}

      {/* Notes */}
      {entity.notes ? (
        <>
          <View style={styles.sectionRow}>
            <View style={styles.sectionBar} />
            <Text style={styles.sectionTitle}>Notes</Text>
          </View>
          <Card>
            <Text style={styles.notes}>{entity.notes}</Text>
          </Card>
        </>
      ) : null}

      {/* Action buttons */}
      <View style={styles.actionRow}>
        <Pressable
          style={styles.addRelBtn}
          onPress={() =>
            router.push(`/add/${entityType}?editId=${id}` as never)
          }
        >
          <Ionicons name="create-outline" size={16} color={Colors.accent} />
          <Text style={styles.addRelBtnText}>Modifier</Text>
        </Pressable>
        <Pressable
          style={styles.addRelBtn}
          onPress={() =>
            router.push(`/add/relationship?fromType=${entityType}&fromId=${id}` as never)
          }
        >
          <Ionicons name="add-circle-outline" size={16} color={Colors.accent} />
          <Text style={styles.addRelBtnText}>Relation</Text>
        </Pressable>
        <Pressable
          style={styles.addRelBtn}
          onPress={() => setShowAliasForm(true)}
        >
          <Ionicons name="text-outline" size={16} color={Colors.accent} />
          <Text style={styles.addRelBtnText}>Alias</Text>
        </Pressable>
      </View>

      <Pressable
        style={styles.networkBtn}
        onPress={() => router.push(`/network?focusId=${id}` as never)}
      >
        <Ionicons name="git-network-outline" size={16} color={Colors.accent} />
        <Text style={styles.addRelBtnText}>Voir le réseau</Text>
      </Pressable>

      {/* Delete */}
      <Pressable
        style={styles.deleteBtn}
        onPress={() =>
          Alert.alert(
            "Supprimer",
            `Supprimer ${getEntityName(entity)} et toutes ses relations ?`,
            [
              { text: "Annuler", style: "cancel" },
              {
                text: "Supprimer",
                style: "destructive",
                onPress: async () => {
                  await deleteEntity(entityType, id);
                  router.back();
                },
              },
            ]
          )
        }
      >
        <Ionicons name="trash-outline" size={16} color={Colors.danger} />
        <Text style={styles.deleteBtnText}>Supprimer cette entité</Text>
      </Pressable>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scroll: { flex: 1, backgroundColor: Colors.surfaceSunken },
  content: {
    padding: Spacing.lg,
    paddingBottom: Spacing.xxxl,
    gap: Spacing.sm,
  },

  notFound: { flex: 1, alignItems: "center", justifyContent: "center" },
  notFoundText: { fontSize: FontSize.base, color: Colors.inkMuted },

  entityHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.md,
    marginBottom: Spacing.lg,
  },
  entityHeaderText: { flex: 1 },
  entityName: {
    fontSize: FontSize.xl,
    fontWeight: "700",
    color: Colors.ink,
  },
  entityType: {
    fontSize: FontSize.xs,
    color: Colors.inkMuted,
    marginTop: 3,
    textTransform: "uppercase",
    letterSpacing: 0.8,
  },

  fieldGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: Spacing.md,
    marginBottom: Spacing.md,
    paddingTop: Spacing.md,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
  },
  field: { minWidth: "40%" },
  fieldFull: { width: "100%" },
  fieldLabel: {
    fontSize: FontSize.xs,
    color: Colors.inkMuted,
    textTransform: "uppercase",
    letterSpacing: 0.5,
    marginBottom: 2,
  },
  fieldValue: {
    fontSize: FontSize.sm,
    color: Colors.ink,
    fontWeight: "500",
  },

  summary: {
    fontSize: FontSize.sm,
    color: Colors.inkSecondary,
    lineHeight: 21,
    marginTop: Spacing.md,
    paddingTop: Spacing.md,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
  },

  tags: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: Spacing.xs,
    marginTop: Spacing.lg,
  },
  tag: {
    backgroundColor: Colors.accentLight,
    borderRadius: Radius.full,
    paddingHorizontal: Spacing.sm + 2,
    paddingVertical: 4,
  },
  tagText: {
    fontSize: FontSize.xs,
    color: Colors.accent,
    fontWeight: "500",
  },

  sectionRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.sm,
    marginTop: Spacing.lg,
    marginBottom: Spacing.xs,
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

  aliasRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.sm,
    paddingVertical: Spacing.xs,
  },
  aliasText: { fontSize: FontSize.sm, color: Colors.ink, fontWeight: "500" },
  aliasLangBadge: {
    backgroundColor: Colors.surfaceSunken,
    borderRadius: Radius.full,
    paddingHorizontal: Spacing.sm,
    paddingVertical: 2,
  },
  aliasLangText: { fontSize: FontSize.xs, color: Colors.inkMuted },

  aliasForm: {
    flexDirection: "row",
    gap: Spacing.sm,
    marginTop: Spacing.sm,
    alignItems: "center",
  },
  aliasInput: {
    flex: 1,
    backgroundColor: Colors.surfaceSunken,
    borderRadius: Radius.md,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    fontSize: FontSize.sm,
    color: Colors.ink,
  },
  aliasSaveBtn: {
    width: 34,
    height: 34,
    borderRadius: Radius.md,
    backgroundColor: Colors.accent,
    alignItems: "center",
    justifyContent: "center",
  },

  relCard: {
    backgroundColor: Colors.surface,
    borderRadius: Radius.lg,
    overflow: "hidden",
    ...Shadow.sm,
  },
  relRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.md,
    padding: Spacing.lg,
  },
  relBorder: {
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  relText: { flex: 1 },
  relName: { fontSize: FontSize.base, color: Colors.ink, fontWeight: "500" },
  relType: { fontSize: FontSize.xs, color: Colors.inkMuted, marginTop: 2 },

  notes: {
    fontSize: FontSize.sm,
    color: Colors.inkSecondary,
    lineHeight: 21,
  },

  actionRow: {
    flexDirection: "row",
    gap: Spacing.sm,
    marginTop: Spacing.lg,
  },
  addRelBtn: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: Spacing.sm,
    padding: Spacing.md,
    borderRadius: Radius.lg,
    backgroundColor: Colors.accentLight,
  },
  addRelBtnText: {
    fontSize: FontSize.sm,
    color: Colors.accent,
    fontWeight: "600",
  },
  networkBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: Spacing.sm,
    padding: Spacing.md,
    borderRadius: Radius.lg,
    backgroundColor: Colors.accentLight,
    marginTop: Spacing.sm,
  },

  deleteBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: Spacing.sm,
    marginTop: Spacing.xxl,
    padding: Spacing.lg,
    borderRadius: Radius.lg,
    backgroundColor: Colors.dangerLight,
  },
  deleteBtnText: {
    fontSize: FontSize.sm,
    color: Colors.danger,
    fontWeight: "600",
  },
});
