import { useState } from "react";
import {
  ScrollView,
  View,
  Text,
  Pressable,
  StyleSheet,
  Alert,
  ActivityIndicator,
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import * as Print from "expo-print";
import * as Sharing from "expo-sharing";
import { Ionicons } from "@expo/vector-icons";
import { Colors, FontSize, Spacing, Radius, Shadow } from "@/lib/theme";
import { useResearchStore } from "@/stores/research-store";
import { formatHistoricalDate } from "@/lib/utils";
import { getEntityName } from "@/types";
import {
  SOURCE_TYPE_LABELS,
  HYPOTHESIS_STATUS_LABELS,
  CONFIDENCE_LABELS,
  RELATIONSHIP_TYPE_LABELS,
} from "@/lib/constants";

export default function ExportProjectScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const {
    projects,
    persons,
    groups,
    places,
    events,
    sources,
    hypotheses,
    relationships,
    excerpts,
    researchNotes,
  } = useResearchStore();
  const [exporting, setExporting] = useState(false);

  const project = projects.find((p) => p.id === id);

  function generateHTML(): string {
    const allEntities = [...persons, ...groups, ...places, ...events];
    const projectNotes = researchNotes.filter((n) => n.projectId === id);

    return `<!DOCTYPE html>
<html lang="fr">
<head>
<meta charset="utf-8">
<style>
  body { font-family: Georgia, serif; max-width: 700px; margin: 40px auto; padding: 0 20px; color: #1C1917; line-height: 1.6; }
  h1 { font-size: 24px; border-bottom: 2px solid #B45309; padding-bottom: 8px; }
  h2 { font-size: 18px; color: #44403C; margin-top: 32px; border-bottom: 1px solid #E7E5E4; padding-bottom: 4px; }
  h3 { font-size: 15px; color: #B45309; margin-top: 20px; }
  .meta { color: #A8A29E; font-size: 13px; }
  .tag { display: inline-block; background: #FFFBEB; color: #B45309; padding: 2px 8px; border-radius: 12px; font-size: 12px; margin-right: 4px; }
  .badge { display: inline-block; padding: 2px 8px; border-radius: 12px; font-size: 11px; font-weight: 600; }
  .entity-card { border: 1px solid #E7E5E4; border-radius: 8px; padding: 12px; margin: 8px 0; }
  .field-label { color: #A8A29E; font-size: 12px; text-transform: uppercase; letter-spacing: 0.5px; }
  blockquote { border-left: 3px solid #B45309; margin: 12px 0; padding: 8px 16px; color: #44403C; font-style: italic; }
  .note { background: #F5F5F4; padding: 12px; border-radius: 8px; margin: 8px 0; }
  .note-type { font-size: 11px; color: #A8A29E; text-transform: uppercase; }
  table { width: 100%; border-collapse: collapse; margin: 12px 0; }
  th, td { text-align: left; padding: 6px 12px; border-bottom: 1px solid #E7E5E4; font-size: 13px; }
  th { color: #A8A29E; font-size: 11px; text-transform: uppercase; }
  footer { margin-top: 48px; padding-top: 16px; border-top: 1px solid #E7E5E4; color: #A8A29E; font-size: 12px; }
</style>
</head>
<body>
<h1>${project?.title ?? "Dossier"}</h1>
<p class="meta">Exporté le ${new Date().toLocaleDateString("fr-FR", { year: "numeric", month: "long", day: "numeric" })}</p>

${project?.researchQuestion ? `<h2>Question de recherche</h2><p><em>${project.researchQuestion}</em></p>` : ""}

${project?.periodStart ? `<p class="meta">Période : ${project.periodStart}${project.periodEnd ? ` — ${project.periodEnd}` : ""}</p>` : ""}
${project?.geographicScope ? `<p class="meta">Géographie : ${project.geographicScope}</p>` : ""}

${project?.summary ? `<h2>Résumé</h2><p>${project.summary}</p>` : ""}

${project?.tags.length ? `<p>${project.tags.map((t) => `<span class="tag">${t}</span>`).join(" ")}</p>` : ""}

${persons.length > 0 ? `
<h2>Personnes (${persons.length})</h2>
<table>
<tr><th>Nom</th><th>Naissance</th><th>Décès</th><th>Résumé</th></tr>
${persons.map((p) => `<tr><td><strong>${p.primaryName}</strong>${p.alternateNames.length ? `<br><span class="meta">${p.alternateNames.join(", ")}</span>` : ""}</td><td>${formatHistoricalDate(p.birthDate)}</td><td>${formatHistoricalDate(p.deathDate)}</td><td class="meta">${p.summary || "—"}</td></tr>`).join("")}
</table>` : ""}

${events.length > 0 ? `
<h2>Événements (${events.length})</h2>
<table>
<tr><th>Titre</th><th>Type</th><th>Date</th></tr>
${events.map((e) => `<tr><td><strong>${e.title}</strong></td><td>${e.eventType}</td><td>${formatHistoricalDate(e.dateStart)}</td></tr>`).join("")}
</table>` : ""}

${places.length > 0 ? `
<h2>Lieux (${places.length})</h2>
<table>
<tr><th>Nom</th><th>Type</th><th>Description</th></tr>
${places.map((p) => `<tr><td><strong>${p.name}</strong></td><td>${p.placeType}</td><td class="meta">${p.summary || "—"}</td></tr>`).join("")}
</table>` : ""}

${groups.length > 0 ? `
<h2>Groupes (${groups.length})</h2>
<table>
<tr><th>Nom</th><th>Type</th><th>Description</th></tr>
${groups.map((g) => `<tr><td><strong>${g.name}</strong></td><td>${g.groupType}</td><td class="meta">${g.summary || "—"}</td></tr>`).join("")}
</table>` : ""}

${relationships.length > 0 ? `
<h2>Relations (${relationships.length})</h2>
<table>
<tr><th>Source</th><th>Relation</th><th>Cible</th><th>Confiance</th></tr>
${relationships.map((r) => {
  const srcEntity = allEntities.find((e) => e.id === r.sourceEntityId);
  const tgtEntity = allEntities.find((e) => e.id === r.targetEntityId);
  return `<tr><td>${srcEntity ? getEntityName(srcEntity) : r.sourceEntityId}</td><td>${r.label || RELATIONSHIP_TYPE_LABELS[r.relationshipType]}</td><td>${tgtEntity ? getEntityName(tgtEntity) : r.targetEntityId}</td><td>${CONFIDENCE_LABELS[r.confidenceLevel]}</td></tr>`;
}).join("")}
</table>` : ""}

${sources.length > 0 ? `
<h2>Sources (${sources.length})</h2>
${sources.map((s) => `
<div class="entity-card">
<h3>${s.title}</h3>
<p class="field-label">${SOURCE_TYPE_LABELS[s.sourceType]}${s.authorName ? ` · ${s.authorName}` : ""}${s.archiveReference ? ` · ${s.archiveReference}` : ""}</p>
${s.summary ? `<p>${s.summary}</p>` : ""}
${excerpts.filter((e) => e.sourceId === s.id).map((e) => `<blockquote>${e.selectedText}<br><span class="meta">${e.pageOrLocation || ""} — ${e.classification}</span></blockquote>`).join("")}
</div>`).join("")}` : ""}

${hypotheses.length > 0 ? `
<h2>Hypothèses (${hypotheses.length})</h2>
${hypotheses.map((h) => `
<div class="entity-card">
<h3>${h.title}</h3>
<p class="meta">${HYPOTHESIS_STATUS_LABELS[h.status]} · ${CONFIDENCE_LABELS[h.confidenceLevel]}</p>
${h.description ? `<p>${h.description}</p>` : ""}
</div>`).join("")}` : ""}

${projectNotes.length > 0 ? `
<h2>Carnet de recherche (${projectNotes.length})</h2>
${projectNotes.map((n) => `
<div class="note">
<p class="note-type">${n.noteType} · ${new Date(n.createdAt).toLocaleDateString("fr-FR")}</p>
<p>${n.content}</p>
</div>`).join("")}` : ""}

<footer>
<p>Athar (أثر) — Dossier de recherche exporté automatiquement.</p>
</footer>
</body>
</html>`;
  }

  async function exportPDF() {
    setExporting(true);
    try {
      const html = generateHTML();
      const { uri } = await Print.printToFileAsync({ html });
      await Sharing.shareAsync(uri, {
        mimeType: "application/pdf",
        dialogTitle: `Athar — ${project?.title ?? "Export"}`,
      });
    } catch (e) {
      Alert.alert("Erreur", "Impossible de générer le PDF.");
      console.error(e);
    } finally {
      setExporting(false);
    }
  }

  async function exportHTML() {
    setExporting(true);
    try {
      const html = generateHTML();
      const tempPath = `${(await import("expo-file-system")).documentDirectory}export.html`;
      const FileSystem = await import("expo-file-system");
      await FileSystem.writeAsStringAsync(tempPath, html);
      await Sharing.shareAsync(tempPath, {
        mimeType: "text/html",
        dialogTitle: `Athar — ${project?.title ?? "Export"}`,
      });
    } catch (e) {
      Alert.alert("Erreur", "Impossible de générer le fichier.");
      console.error(e);
    } finally {
      setExporting(false);
    }
  }

  if (!project) {
    return (
      <View style={styles.notFound}>
        <Text style={styles.notFoundText}>Dossier introuvable.</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.scroll} contentContainerStyle={styles.content}>
      <View style={styles.previewCard}>
        <Ionicons name="document-text" size={32} color={Colors.accent} />
        <Text style={styles.previewTitle}>{project.title}</Text>
        <Text style={styles.previewMeta}>
          {persons.length} personnes · {events.length} événements · {sources.length} sources · {hypotheses.length} hypothèses
        </Text>
      </View>

      <Text style={styles.sectionLabel}>Format d'export</Text>

      <Pressable
        style={({ pressed }) => [styles.exportBtn, pressed && styles.exportBtnPressed]}
        onPress={exportPDF}
        disabled={exporting}
      >
        <Ionicons name="document-outline" size={22} color={Colors.danger} />
        <View style={styles.exportText}>
          <Text style={styles.exportTitle}>PDF</Text>
          <Text style={styles.exportDesc}>Dossier complet prêt à imprimer</Text>
        </View>
        {exporting ? (
          <ActivityIndicator color={Colors.accent} />
        ) : (
          <Ionicons name="share-outline" size={18} color={Colors.inkMuted} />
        )}
      </Pressable>

      <Pressable
        style={({ pressed }) => [styles.exportBtn, pressed && styles.exportBtnPressed]}
        onPress={exportHTML}
        disabled={exporting}
      >
        <Ionicons name="code-outline" size={22} color={Colors.accent} />
        <View style={styles.exportText}>
          <Text style={styles.exportTitle}>HTML</Text>
          <Text style={styles.exportDesc}>Page web consultable hors-ligne</Text>
        </View>
        {exporting ? (
          <ActivityIndicator color={Colors.accent} />
        ) : (
          <Ionicons name="share-outline" size={18} color={Colors.inkMuted} />
        )}
      </Pressable>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scroll: { flex: 1, backgroundColor: Colors.surfaceSunken },
  content: { padding: Spacing.lg, paddingBottom: Spacing.xxxl, gap: Spacing.sm },
  notFound: { flex: 1, alignItems: "center", justifyContent: "center" },
  notFoundText: { fontSize: FontSize.base, color: Colors.inkMuted },

  previewCard: {
    backgroundColor: Colors.surface,
    borderRadius: Radius.lg,
    padding: Spacing.xxl,
    alignItems: "center",
    gap: Spacing.md,
    ...Shadow.md,
  },
  previewTitle: {
    fontSize: FontSize.lg,
    fontWeight: "700",
    color: Colors.ink,
    textAlign: "center",
  },
  previewMeta: {
    fontSize: FontSize.sm,
    color: Colors.inkMuted,
    textAlign: "center",
  },

  sectionLabel: {
    fontSize: FontSize.sm,
    fontWeight: "600",
    color: Colors.inkSecondary,
    marginTop: Spacing.lg,
    marginBottom: Spacing.xs,
  },

  exportBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.lg,
    backgroundColor: Colors.surface,
    borderRadius: Radius.lg,
    padding: Spacing.lg,
    ...Shadow.sm,
  },
  exportBtnPressed: { opacity: 0.7 },
  exportText: { flex: 1 },
  exportTitle: { fontSize: FontSize.base, fontWeight: "600", color: Colors.ink },
  exportDesc: { fontSize: FontSize.sm, color: Colors.inkMuted, marginTop: 2 },
});
