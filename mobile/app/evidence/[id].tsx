import {
  ScrollView,
  View,
  Text,
  Pressable,
  StyleSheet,
  Alert,
} from "react-native";
import { useLocalSearchParams, useNavigation, useRouter } from "expo-router";
import { useEffect } from "react";
import { Ionicons } from "@expo/vector-icons";
import { Colors, FontSize, Spacing, Radius, Shadow } from "@/lib/theme";
import { useThemedStyles } from "@/lib/useTheme";
import { useResearchStore } from "@/stores/research-store";
import { Card } from "@/components/Card";

const STATUS_COLORS: Record<string, string> = {
  unverified: Colors.inkMuted,
  supported: Colors.success,
  weakly_supported: Colors.warning,
  contested: "#EA580C",
  refuted: Colors.danger,
};

const STATUS_LABELS: Record<string, string> = {
  unverified: "Non vérifié",
  supported: "Étayé",
  weakly_supported: "Faiblement étayé",
  contested: "Contesté",
  refuted: "Réfuté",
};

const STRENGTH_LABELS: Record<string, string> = {
  strong: "Fort",
  moderate: "Modéré",
  weak: "Faible",
};

export default function EvidenceChainDetailScreen() {
  const styles = useThemedStyles(makeStyles);
  const { id } = useLocalSearchParams<{ id: string }>();
  const navigation = useNavigation();
  const router = useRouter();
  const { evidenceChains, chainLinks } = useResearchStore();

  const chain = evidenceChains.find((c) => c.id === id);
  const links = chainLinks.filter((l) => l.chainId === id).sort((a, b) => a.position - b.position);

  useEffect(() => {
    if (chain) navigation.setOptions({ title: chain.title });
  }, [chain]);

  if (!chain) {
    return (
      <View style={styles.notFound}>
        <Text style={styles.notFoundText}>Chaîne introuvable.</Text>
      </View>
    );
  }

  const statusColor = STATUS_COLORS[chain.claimStatus] ?? Colors.inkMuted;

  return (
    <ScrollView style={styles.scroll} contentContainerStyle={styles.content}>
      <Card>
        <View style={styles.header}>
          <View style={[styles.icon, { backgroundColor: `${statusColor}18` }]}>
            <Ionicons name="link" size={22} color={statusColor} />
          </View>
          <View style={styles.headerText}>
            <Text style={styles.title}>{chain.title}</Text>
            <View style={styles.statusRow}>
              <View style={[styles.statusDot, { backgroundColor: statusColor }]} />
              <Text style={styles.statusText}>
                {STATUS_LABELS[chain.claimStatus] ?? chain.claimStatus}
              </Text>
            </View>
          </View>
        </View>

        <View style={styles.separator} />
        <Text style={styles.sectionLabel}>Affirmation</Text>
        <Text style={styles.claimText}>{chain.claimText}</Text>

        {chain.conclusion ? (
          <>
            <View style={styles.separator} />
            <Text style={styles.sectionLabel}>Conclusion</Text>
            <Text style={styles.bodyText}>{chain.conclusion}</Text>
          </>
        ) : null}

        {chain.tags.length > 0 && (
          <View style={styles.tags}>
            {chain.tags.map((tag) => (
              <View key={tag} style={styles.tag}>
                <Text style={styles.tagText}>{tag}</Text>
              </View>
            ))}
          </View>
        )}
      </Card>

      {/* Chain links */}
      {links.length > 0 && (
        <>
          <View style={styles.sectionRow}>
            <View style={styles.sectionBar} />
            <Text style={styles.sectionTitle}>Maillons ({links.length})</Text>
          </View>
          <View style={styles.listCard}>
            {links.map((link, i) => (
              <View
                key={link.id}
                style={[styles.linkRow, i < links.length - 1 && styles.linkBorder]}
              >
                <View style={styles.linkPos}>
                  <Text style={styles.linkPosText}>{link.position + 1}</Text>
                </View>
                <View style={styles.linkContent}>
                  <View style={styles.linkHeader}>
                    <Ionicons
                      name={link.isSupporting ? "checkmark-circle" : "close-circle"}
                      size={16}
                      color={link.isSupporting ? Colors.success : Colors.danger}
                    />
                    <Text style={styles.linkType}>{link.linkType}</Text>
                    <Text style={styles.linkStrength}>
                      {STRENGTH_LABELS[link.strength] ?? link.strength}
                    </Text>
                  </View>
                  {link.description ? (
                    <Text style={styles.linkDesc}>{link.description}</Text>
                  ) : null}
                  {link.notes ? (
                    <Text style={styles.linkNotes}>{link.notes}</Text>
                  ) : null}
                </View>
              </View>
            ))}
          </View>
        </>
      )}

      <Pressable
        style={styles.addBtn}
        onPress={() => router.push(`/add/evidence-chain` as never)}
      >
        <Ionicons name="add-circle-outline" size={16} color={Colors.accent} />
        <Text style={styles.addBtnText}>Ajouter un maillon</Text>
      </Pressable>
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
    alignItems: "center", justifyContent: "center",
  },
  headerText: { flex: 1 },
  title: { fontSize: FontSize.xl, fontWeight: "700", color: Colors.ink },
  statusRow: { flexDirection: "row", alignItems: "center", gap: 6, marginTop: 4 },
  statusDot: { width: 8, height: 8, borderRadius: 4 },
  statusText: { fontSize: FontSize.xs, color: Colors.inkMuted, textTransform: "uppercase", letterSpacing: 0.5 },

  separator: { height: 1, backgroundColor: Colors.border, marginVertical: Spacing.md },
  sectionLabel: { fontSize: FontSize.xs, color: Colors.inkMuted, textTransform: "uppercase", letterSpacing: 0.5, marginBottom: Spacing.xs },
  claimText: { fontSize: FontSize.base, color: Colors.ink, fontWeight: "500", lineHeight: 22, fontStyle: "italic" },
  bodyText: { fontSize: FontSize.sm, color: Colors.inkSecondary, lineHeight: 21 },

  tags: { flexDirection: "row", flexWrap: "wrap", gap: Spacing.xs, marginTop: Spacing.lg },
  tag: { backgroundColor: Colors.accentLight, borderRadius: Radius.full, paddingHorizontal: Spacing.sm + 2, paddingVertical: 4 },
  tagText: { fontSize: FontSize.xs, color: Colors.accent, fontWeight: "500" },

  sectionRow: { flexDirection: "row", alignItems: "center", gap: Spacing.sm, marginTop: Spacing.lg, marginBottom: Spacing.xs },
  sectionBar: { width: 3, height: 14, borderRadius: 2, backgroundColor: Colors.accent },
  sectionTitle: { fontSize: FontSize.sm, fontWeight: "600", color: Colors.inkSecondary, letterSpacing: 0.3 },

  listCard: { backgroundColor: Colors.surface, borderRadius: Radius.lg, overflow: "hidden", ...Shadow.sm },
  linkRow: { flexDirection: "row", gap: Spacing.md, padding: Spacing.lg },
  linkBorder: { borderBottomWidth: 1, borderBottomColor: Colors.border },
  linkPos: {
    width: 28, height: 28, borderRadius: 14, backgroundColor: Colors.surfaceSunken,
    alignItems: "center", justifyContent: "center",
  },
  linkPosText: { fontSize: FontSize.sm, fontWeight: "700", color: Colors.inkMuted },
  linkContent: { flex: 1 },
  linkHeader: { flexDirection: "row", alignItems: "center", gap: Spacing.sm, marginBottom: 4 },
  linkType: { fontSize: FontSize.xs, color: Colors.inkMuted, textTransform: "uppercase", fontWeight: "600" },
  linkStrength: { fontSize: FontSize.xs, color: Colors.inkMuted, marginLeft: "auto" },
  linkDesc: { fontSize: FontSize.sm, color: Colors.ink, lineHeight: 20 },
  linkNotes: { fontSize: FontSize.xs, color: Colors.inkMuted, fontStyle: "italic", marginTop: 4 },

  addBtn: {
    flexDirection: "row", alignItems: "center", justifyContent: "center",
    gap: Spacing.sm, padding: Spacing.md, borderRadius: Radius.lg,
    backgroundColor: Colors.accentLight, marginTop: Spacing.lg,
  },
  addBtnText: { fontSize: FontSize.sm, color: Colors.accent, fontWeight: "600" },
});
