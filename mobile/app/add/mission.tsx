import { useState } from "react";
import { ScrollView, View, Text, TextInput, Pressable, StyleSheet, Alert } from "react-native";
import { useRouter } from "expo-router";
import { Colors, FontSize, Spacing, Radius, Shadow } from "@/lib/theme";
import { useResearchStore } from "@/stores/research-store";
import type { MissionStatus } from "@/types";

const STATUSES: { key: MissionStatus; label: string }[] = [
  { key: "planned", label: "Planifiée" },
  { key: "in_progress", label: "En cours" },
  { key: "completed", label: "Terminée" },
];

export default function AddMissionScreen() {
  const router = useRouter();
  const { addFieldMission } = useResearchStore();
  const [title, setTitle] = useState("");
  const [location, setLocation] = useState("");
  const [dateStart, setDateStart] = useState("");
  const [dateEnd, setDateEnd] = useState("");
  const [objectives, setObjectives] = useState("");
  const [persons, setPersons] = useState("");
  const [places, setPlaces] = useState("");
  const [archives, setArchives] = useState("");
  const [equipment, setEquipment] = useState("");
  const [status, setStatus] = useState<MissionStatus>("planned");
  const [tags, setTags] = useState("");

  async function save() {
    if (!title.trim()) { Alert.alert("Titre requis"); return; }
    const result = await addFieldMission({
      title: title.trim(), location: location.trim(),
      dateStart: dateStart.trim(), dateEnd: dateEnd.trim(),
      objectives: objectives.trim(), personsToMeet: persons.trim(),
      placesToVisit: places.trim(), archivesToConsult: archives.trim(),
      equipmentChecklist: equipment.trim(), debriefNotes: "",
      status, tags: tags.split(",").map((s) => s.trim()).filter(Boolean),
    });
    if (!result) { Alert.alert("Erreur"); return; }
    Alert.alert("Mission créée", title.trim(), [{ text: "OK", onPress: () => router.back() }]);
  }

  return (
    <ScrollView style={styles.scroll} contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
      <View style={styles.card}>
        <Text style={styles.label}>Titre de la mission *</Text>
        <TextInput style={styles.input} value={title} onChangeText={setTitle} placeholder="ex. Mission terrain Kabylie — août 2024" placeholderTextColor={Colors.inkMuted} autoFocus />

        <View style={styles.row}>
          <View style={styles.half}>
            <Text style={styles.label}>Lieu</Text>
            <TextInput style={styles.input} value={location} onChangeText={setLocation} placeholder="Région, ville" placeholderTextColor={Colors.inkMuted} />
          </View>
          <View style={styles.half}>
            <Text style={styles.label}>Statut</Text>
            <View style={styles.pillGrid}>
              {STATUSES.map((s) => (
                <Pressable key={s.key} style={[styles.pill, status === s.key && styles.pillActive]} onPress={() => setStatus(s.key)}>
                  <Text style={[styles.pillText, status === s.key && styles.pillTextActive]}>{s.label}</Text>
                </Pressable>
              ))}
            </View>
          </View>
        </View>

        <View style={styles.row}>
          <View style={styles.half}>
            <Text style={styles.label}>Date début</Text>
            <TextInput style={styles.input} value={dateStart} onChangeText={setDateStart} placeholder="01/08/2024" placeholderTextColor={Colors.inkMuted} />
          </View>
          <View style={styles.half}>
            <Text style={styles.label}>Date fin</Text>
            <TextInput style={styles.input} value={dateEnd} onChangeText={setDateEnd} placeholder="15/08/2024" placeholderTextColor={Colors.inkMuted} />
          </View>
        </View>

        <Text style={styles.label}>Objectifs</Text>
        <TextInput style={[styles.input, styles.multiline]} value={objectives} onChangeText={setObjectives} placeholder="Ce que vous voulez accomplir sur le terrain..." placeholderTextColor={Colors.inkMuted} multiline numberOfLines={3} textAlignVertical="top" />

        <Text style={styles.label}>Personnes à rencontrer</Text>
        <TextInput style={[styles.input, styles.multiline]} value={persons} onChangeText={setPersons} placeholder="Noms, rôles, coordonnées..." placeholderTextColor={Colors.inkMuted} multiline numberOfLines={2} textAlignVertical="top" />

        <Text style={styles.label}>Lieux à visiter</Text>
        <TextInput style={styles.input} value={places} onChangeText={setPlaces} placeholder="Archives, cimetières, bâtiments..." placeholderTextColor={Colors.inkMuted} />

        <Text style={styles.label}>Archives à consulter</Text>
        <TextInput style={styles.input} value={archives} onChangeText={setArchives} placeholder="Fonds, cotes, registres..." placeholderTextColor={Colors.inkMuted} />

        <Text style={styles.label}>Matériel</Text>
        <TextInput style={styles.input} value={equipment} onChangeText={setEquipment} placeholder="Appareil photo, enregistreur, cartes..." placeholderTextColor={Colors.inkMuted} />

        <Text style={styles.label}>Tags</Text>
        <TextInput style={styles.input} value={tags} onChangeText={setTags} placeholder="terrain, kabylie, archives" placeholderTextColor={Colors.inkMuted} />
      </View>

      <Pressable style={({ pressed }) => [styles.saveBtn, pressed && styles.saveBtnPressed]} onPress={save}>
        <Text style={styles.saveBtnText}>Créer la mission</Text>
      </Pressable>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scroll: { flex: 1, backgroundColor: Colors.surfaceSunken },
  content: { padding: Spacing.lg, paddingBottom: Spacing.xxxl },
  card: { backgroundColor: Colors.surface, borderRadius: Radius.lg, padding: Spacing.lg, ...Shadow.sm },
  label: { fontSize: FontSize.sm, fontWeight: "600", color: Colors.inkSecondary, marginBottom: Spacing.xs, marginTop: Spacing.lg },
  input: { backgroundColor: Colors.surfaceSunken, borderRadius: Radius.md, paddingHorizontal: Spacing.md, paddingVertical: Spacing.sm + 2, fontSize: FontSize.base, color: Colors.ink },
  multiline: { minHeight: 70, paddingTop: Spacing.sm + 2 },
  row: { flexDirection: "row", gap: Spacing.sm },
  half: { flex: 1 },
  pillGrid: { flexDirection: "row", flexWrap: "wrap", gap: Spacing.xs },
  pill: { paddingHorizontal: Spacing.sm, paddingVertical: Spacing.xs + 1, borderRadius: Radius.full, backgroundColor: Colors.surfaceSunken },
  pillActive: { backgroundColor: Colors.accentLight },
  pillText: { fontSize: FontSize.xs, color: Colors.inkMuted, fontWeight: "500" },
  pillTextActive: { color: Colors.accent, fontWeight: "600" },
  saveBtn: { backgroundColor: Colors.accent, borderRadius: Radius.lg, padding: Spacing.lg, alignItems: "center", marginTop: Spacing.xl, ...Shadow.md },
  saveBtnPressed: { opacity: 0.85, transform: [{ scale: 0.98 }] },
  saveBtnText: { color: "white", fontSize: FontSize.base, fontWeight: "600" },
});
