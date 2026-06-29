import {
  ScrollView,
  View,
  Text,
  Pressable,
  StyleSheet,
  Alert,
  Linking,
} from "react-native";
import { useLocalSearchParams, useNavigation, useRouter } from "expo-router";
import { useEffect } from "react";
import { Ionicons } from "@expo/vector-icons";
import { Colors, FontSize, Spacing, Radius, Shadow } from "@/lib/theme";
import { useThemedStyles } from "@/lib/useTheme";
import { useResearchStore } from "@/stores/research-store";
import { Card } from "@/components/Card";

const ENTRY_TYPE_LABELS: Record<string, string> = {
  book: "Livre",
  article: "Article",
  thesis: "Thèse",
  chapter: "Chapitre",
  report: "Rapport",
  website: "Site web",
  archive_guide: "Guide d'archives",
};

export default function BibliographyDetailScreen() {
  const styles = useThemedStyles(makeStyles);
  const { id } = useLocalSearchParams<{ id: string }>();
  const navigation = useNavigation();
  const router = useRouter();
  const { bibliography } = useResearchStore();

  const entry = bibliography.find((b) => b.id === id);

  useEffect(() => {
    if (entry) navigation.setOptions({ title: entry.title });
  }, [entry]);

  if (!entry) {
    return (
      <View style={styles.notFound}>
        <Text style={styles.notFoundText}>Entrée introuvable.</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.scroll} contentContainerStyle={styles.content}>
      <Card>
        <View style={styles.header}>
          <View style={styles.icon}>
            <Ionicons name="book" size={22} color={Colors.accent} />
          </View>
          <View style={styles.headerText}>
            <Text style={styles.title}>{entry.title}</Text>
            <Text style={styles.typeText}>
              {ENTRY_TYPE_LABELS[entry.entryType] ?? entry.entryType}
              {entry.year ? ` · ${entry.year}` : ""}
            </Text>
          </View>
        </View>

        <View style={styles.metaGrid}>
          {entry.authors ? (
            <View style={styles.metaFull}>
              <Text style={styles.metaLabel}>Auteurs</Text>
              <Text style={styles.metaValue}>{entry.authors}</Text>
            </View>
          ) : null}
          {entry.publisher ? (
            <View style={styles.metaItem}>
              <Text style={styles.metaLabel}>Éditeur</Text>
              <Text style={styles.metaValue}>{entry.publisher}</Text>
            </View>
          ) : null}
          {entry.journal ? (
            <View style={styles.metaItem}>
              <Text style={styles.metaLabel}>Revue</Text>
              <Text style={styles.metaValue}>{entry.journal}</Text>
            </View>
          ) : null}
          {entry.volume ? (
            <View style={styles.metaItem}>
              <Text style={styles.metaLabel}>Volume</Text>
              <Text style={styles.metaValue}>{entry.volume}</Text>
            </View>
          ) : null}
          {entry.pages ? (
            <View style={styles.metaItem}>
              <Text style={styles.metaLabel}>Pages</Text>
              <Text style={styles.metaValue}>{entry.pages}</Text>
            </View>
          ) : null}
          {entry.isbn ? (
            <View style={styles.metaItem}>
              <Text style={styles.metaLabel}>ISBN</Text>
              <Text style={styles.metaValue}>{entry.isbn}</Text>
            </View>
          ) : null}
        </View>

        {entry.abstract ? (
          <>
            <View style={styles.separator} />
            <Text style={styles.sectionLabel}>Résumé</Text>
            <Text style={styles.bodyText}>{entry.abstract}</Text>
          </>
        ) : null}

        {entry.notes ? (
          <>
            <View style={styles.separator} />
            <Text style={styles.sectionLabel}>Notes</Text>
            <Text style={styles.bodyText}>{entry.notes}</Text>
          </>
        ) : null}

        {entry.url ? (
          <Pressable
            style={styles.urlBtn}
            onPress={() => Linking.openURL(entry.url)}
          >
            <Ionicons name="open-outline" size={16} color={Colors.accent} />
            <Text style={styles.urlText} numberOfLines={1}>{entry.url}</Text>
          </Pressable>
        ) : null}

        {entry.tags.length > 0 && (
          <View style={styles.tags}>
            {entry.tags.map((tag) => (
              <View key={tag} style={styles.tag}>
                <Text style={styles.tagText}>{tag}</Text>
              </View>
            ))}
          </View>
        )}
      </Card>

      <View style={styles.actionRow}>
        <Pressable style={styles.actionBtn} onPress={() => router.push(`/add/bibliography?editId=${id}` as never)}>
          <Ionicons name="create-outline" size={16} color={Colors.accent} />
          <Text style={styles.actionBtnText}>Modifier</Text>
        </Pressable>
      </View>
    </ScrollView>
  );
}

const makeStyles = () => StyleSheet.create({
  scroll: { flex: 1, backgroundColor: Colors.surfaceSunken },
  content: { padding: Spacing.lg, paddingBottom: Spacing.xxxl, gap: Spacing.sm },
  notFound: { flex: 1, alignItems: "center", justifyContent: "center" },
  notFoundText: { fontSize: FontSize.base, color: Colors.inkMuted },

  header: { flexDirection: "row", alignItems: "center", gap: Spacing.md, marginBottom: Spacing.md },
  icon: {
    width: 44, height: 44, borderRadius: Radius.lg,
    backgroundColor: Colors.accentLight, alignItems: "center", justifyContent: "center",
  },
  headerText: { flex: 1 },
  title: { fontSize: FontSize.xl, fontWeight: "700", color: Colors.ink },
  typeText: { fontSize: FontSize.xs, color: Colors.inkMuted, marginTop: 2, textTransform: "uppercase", letterSpacing: 0.5 },

  metaGrid: { flexDirection: "row", flexWrap: "wrap", gap: Spacing.md, paddingTop: Spacing.md, borderTopWidth: 1, borderTopColor: Colors.border },
  metaItem: { minWidth: "45%", marginBottom: Spacing.sm },
  metaFull: { width: "100%", marginBottom: Spacing.sm },
  metaLabel: { fontSize: FontSize.xs, color: Colors.inkMuted, textTransform: "uppercase", letterSpacing: 0.5, marginBottom: 2 },
  metaValue: { fontSize: FontSize.sm, color: Colors.ink, fontWeight: "500" },

  separator: { height: 1, backgroundColor: Colors.border, marginVertical: Spacing.md },
  sectionLabel: { fontSize: FontSize.xs, color: Colors.inkMuted, textTransform: "uppercase", letterSpacing: 0.5, marginBottom: Spacing.xs },
  bodyText: { fontSize: FontSize.sm, color: Colors.inkSecondary, lineHeight: 21 },

  urlBtn: {
    flexDirection: "row", alignItems: "center", gap: Spacing.sm,
    marginTop: Spacing.lg, padding: Spacing.md,
    backgroundColor: Colors.accentLight, borderRadius: Radius.md,
  },
  urlText: { flex: 1, fontSize: FontSize.sm, color: Colors.accent },

  actionRow: { flexDirection: "row", gap: Spacing.sm, marginTop: Spacing.lg },
  actionBtn: {
    flex: 1, flexDirection: "row", alignItems: "center", justifyContent: "center",
    gap: Spacing.sm, padding: Spacing.md, borderRadius: Radius.lg, backgroundColor: Colors.accentLight,
  },
  actionBtnText: { fontSize: FontSize.sm, color: Colors.accent, fontWeight: "600" },

  tags: { flexDirection: "row", flexWrap: "wrap", gap: Spacing.xs, marginTop: Spacing.lg },
  tag: { backgroundColor: Colors.accentLight, borderRadius: Radius.full, paddingHorizontal: Spacing.sm + 2, paddingVertical: 4 },
  tagText: { fontSize: FontSize.xs, color: Colors.accent, fontWeight: "500" },
});
