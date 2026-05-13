import {
  ScrollView,
  View,
  Text,
  StyleSheet,
} from "react-native";
import { useLocalSearchParams, useNavigation } from "expo-router";
import { useEffect } from "react";
import { Ionicons } from "@expo/vector-icons";
import { Colors, FontSize, Spacing, Radius, Shadow } from "@/lib/theme";
import { useResearchStore } from "@/stores/research-store";
import { Card } from "@/components/Card";

const DOC_TYPE_LABELS: Record<string, string> = {
  text: "Texte",
  image: "Image",
  pdf: "PDF",
  audio: "Audio",
  video: "Video",
};

const OCR_LABELS: Record<string, { label: string; color: string }> = {
  none: { label: "Non requis", color: Colors.inkMuted },
  pending: { label: "En attente", color: Colors.warning },
  completed: { label: "Terminee", color: Colors.success },
  failed: { label: "Echoue", color: Colors.danger },
};

export default function CorpusDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const navigation = useNavigation();
  const { corpusDocuments, sources } = useResearchStore();

  const doc = corpusDocuments.find((d) => d.id === id);
  const linkedSource = doc?.sourceId
    ? sources.find((s) => s.id === doc.sourceId)
    : undefined;

  useEffect(() => {
    if (doc) navigation.setOptions({ title: doc.title });
  }, [doc]);

  if (!doc) {
    return (
      <View style={styles.notFound}>
        <Text style={styles.notFoundText}>Document introuvable.</Text>
      </View>
    );
  }

  const ocr = OCR_LABELS[doc.ocrStatus] ?? OCR_LABELS.none;

  const hasEntities =
    doc.detectedNames.length > 0 ||
    doc.detectedPlaces.length > 0 ||
    doc.detectedOrganizations.length > 0 ||
    doc.detectedDates.length > 0;

  return (
    <ScrollView style={styles.scroll} contentContainerStyle={styles.content}>
      <Card>
        <View style={styles.header}>
          <View style={styles.icon}>
            <Ionicons name="document-text" size={22} color={Colors.accent} />
          </View>
          <View style={styles.headerText}>
            <Text style={styles.title}>{doc.title}</Text>
            <Text style={styles.subtitle}>
              {DOC_TYPE_LABELS[doc.documentType] ?? doc.documentType}
              {doc.language ? ` · ${doc.language}` : ""}
            </Text>
          </View>
        </View>

        <View style={styles.badgeRow}>
          <View style={[styles.badge, { backgroundColor: `${ocr.color}18` }]}>
            <View style={[styles.badgeDot, { backgroundColor: ocr.color }]} />
            <Text style={[styles.badgeText, { color: ocr.color }]}>
              OCR : {ocr.label}
            </Text>
          </View>
        </View>

        {linkedSource && (
          <View style={styles.metaGrid}>
            <View style={styles.metaItem}>
              <Text style={styles.metaLabel}>Source liee</Text>
              <Text style={styles.metaValue}>{linkedSource.title}</Text>
            </View>
          </View>
        )}

        {doc.contentText ? (
          <>
            <View style={styles.separator} />
            <Text style={styles.sectionLabel}>Contenu</Text>
            <Text style={styles.bodyText}>{doc.contentText}</Text>
          </>
        ) : null}

        {doc.transcription ? (
          <>
            <View style={styles.separator} />
            <Text style={styles.sectionLabel}>Transcription</Text>
            <Text style={styles.bodyText}>{doc.transcription}</Text>
          </>
        ) : null}

        {doc.translation ? (
          <>
            <View style={styles.separator} />
            <Text style={styles.sectionLabel}>Traduction</Text>
            <Text style={styles.bodyText}>{doc.translation}</Text>
          </>
        ) : null}

        {doc.notes ? (
          <>
            <View style={styles.separator} />
            <Text style={styles.sectionLabel}>Notes</Text>
            <Text style={styles.bodyText}>{doc.notes}</Text>
          </>
        ) : null}

        {doc.tags.length > 0 && (
          <View style={styles.tags}>
            {doc.tags.map((tag) => (
              <View key={tag} style={styles.tag}>
                <Text style={styles.tagText}>{tag}</Text>
              </View>
            ))}
          </View>
        )}
      </Card>

      {/* Detected entities */}
      {hasEntities && (
        <>
          <View style={styles.sectionRow}>
            <View style={styles.sectionBar} />
            <Text style={styles.sectionTitleText}>Entites detectees</Text>
          </View>
          <View style={styles.listCard}>
            {doc.detectedNames.map((name, i) => (
              <View
                key={`name-${i}`}
                style={[
                  styles.entityRow,
                  i < doc.detectedNames.length - 1 ||
                  doc.detectedPlaces.length > 0 ||
                  doc.detectedOrganizations.length > 0 ||
                  doc.detectedDates.length > 0
                    ? styles.entityBorder
                    : undefined,
                ]}
              >
                <Ionicons name="person" size={16} color={Colors.person.icon} />
                <Text style={styles.entityName}>{name}</Text>
              </View>
            ))}
            {doc.detectedPlaces.map((place, i) => (
              <View
                key={`place-${i}`}
                style={[
                  styles.entityRow,
                  i < doc.detectedPlaces.length - 1 ||
                  doc.detectedOrganizations.length > 0 ||
                  doc.detectedDates.length > 0
                    ? styles.entityBorder
                    : undefined,
                ]}
              >
                <Ionicons name="location" size={16} color={Colors.place.icon} />
                <Text style={styles.entityName}>{place}</Text>
              </View>
            ))}
            {doc.detectedOrganizations.map((org, i) => (
              <View
                key={`org-${i}`}
                style={[
                  styles.entityRow,
                  i < doc.detectedOrganizations.length - 1 ||
                  doc.detectedDates.length > 0
                    ? styles.entityBorder
                    : undefined,
                ]}
              >
                <Ionicons name="people" size={16} color={Colors.group.icon} />
                <Text style={styles.entityName}>{org}</Text>
              </View>
            ))}
            {doc.detectedDates.map((date, i) => (
              <View
                key={`date-${i}`}
                style={[
                  styles.entityRow,
                  i < doc.detectedDates.length - 1
                    ? styles.entityBorder
                    : undefined,
                ]}
              >
                <Ionicons
                  name="calendar"
                  size={16}
                  color={Colors.event.icon}
                />
                <Text style={styles.entityName}>{date}</Text>
              </View>
            ))}
          </View>
        </>
      )}
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

  header: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.md,
    marginBottom: Spacing.md,
  },
  icon: {
    width: 44,
    height: 44,
    borderRadius: Radius.lg,
    backgroundColor: Colors.accentLight,
    alignItems: "center",
    justifyContent: "center",
  },
  headerText: { flex: 1 },
  title: { fontSize: FontSize.xl, fontWeight: "700", color: Colors.ink },
  subtitle: { fontSize: FontSize.xs, color: Colors.inkMuted, marginTop: 2 },

  badgeRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: Spacing.sm,
    marginBottom: Spacing.md,
  },
  badge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: Spacing.sm + 2,
    paddingVertical: 4,
    borderRadius: Radius.full,
  },
  badgeDot: { width: 6, height: 6, borderRadius: 3 },
  badgeText: { fontSize: FontSize.xs, fontWeight: "600" },

  metaGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: Spacing.md,
    paddingTop: Spacing.md,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
  },
  metaItem: { minWidth: "45%", marginBottom: Spacing.sm },
  metaLabel: {
    fontSize: FontSize.xs,
    color: Colors.inkMuted,
    textTransform: "uppercase",
    letterSpacing: 0.5,
    marginBottom: 2,
  },
  metaValue: { fontSize: FontSize.sm, color: Colors.ink, fontWeight: "500" },

  separator: {
    height: 1,
    backgroundColor: Colors.border,
    marginVertical: Spacing.md,
  },
  sectionLabel: {
    fontSize: FontSize.xs,
    color: Colors.inkMuted,
    textTransform: "uppercase",
    letterSpacing: 0.5,
    marginBottom: Spacing.xs,
  },
  bodyText: {
    fontSize: FontSize.sm,
    color: Colors.inkSecondary,
    lineHeight: 21,
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
  tagText: { fontSize: FontSize.xs, color: Colors.accent, fontWeight: "500" },

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
  sectionTitleText: {
    fontSize: FontSize.sm,
    fontWeight: "600",
    color: Colors.inkSecondary,
    letterSpacing: 0.3,
  },

  listCard: {
    backgroundColor: Colors.surface,
    borderRadius: Radius.lg,
    overflow: "hidden",
    ...Shadow.sm,
  },
  entityRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.sm,
    padding: Spacing.lg,
  },
  entityBorder: { borderBottomWidth: 1, borderBottomColor: Colors.border },
  entityName: { fontSize: FontSize.sm, color: Colors.ink, flex: 1 },
});
