import { View, Text, Pressable, StyleSheet, ScrollView } from "react-native";
import { useRouter } from "expo-router";
import { Colors, FontSize, Spacing, Radius } from "@/lib/theme";
import { Ionicons } from "@expo/vector-icons";

const CAPTURE_OPTIONS = [
  {
    icon: "camera" as const,
    label: "Photo d'archive",
    description: "Photographiez un document, un acte, une photo d'époque",
    route: "/capture/photo",
    color: Colors.person,
  },
  {
    icon: "mic" as const,
    label: "Témoignage vocal",
    description: "Enregistrez un entretien ou un récit oral",
    route: "/capture/voice",
    color: Colors.group,
  },
];

const ADD_OPTIONS = [
  {
    icon: "person-add-outline" as const,
    label: "Personne",
    route: "/add/person",
  },
  {
    icon: "location-outline" as const,
    label: "Lieu",
    route: "/add/place",
  },
  {
    icon: "calendar-outline" as const,
    label: "Événement",
    route: "/add/event",
  },
];

export default function CaptureTab() {
  const router = useRouter();

  return (
    <ScrollView style={styles.scroll} contentContainerStyle={styles.content}>
      <Text style={styles.sectionTitle}>CAPTURER</Text>

      {CAPTURE_OPTIONS.map((opt) => (
        <Pressable
          key={opt.route}
          style={({ pressed }) => [styles.captureCard, pressed && styles.pressed]}
          onPress={() => router.push(opt.route as never)}
        >
          <View style={[styles.captureIcon, { backgroundColor: opt.color.bg }]}>
            <Ionicons name={opt.icon} size={28} color={opt.color.text} />
          </View>
          <View style={styles.captureText}>
            <Text style={styles.captureLabel}>{opt.label}</Text>
            <Text style={styles.captureDesc}>{opt.description}</Text>
          </View>
          <Ionicons name="chevron-forward" size={18} color={Colors.inkMuted} />
        </Pressable>
      ))}

      <Text style={[styles.sectionTitle, { marginTop: Spacing.xl }]}>AJOUTER</Text>

      <View style={styles.addRow}>
        {ADD_OPTIONS.map((opt) => (
          <Pressable
            key={opt.route}
            style={({ pressed }) => [styles.addBtn, pressed && styles.pressed]}
            onPress={() => router.push(opt.route as never)}
          >
            <Ionicons name={opt.icon} size={22} color={Colors.accent} />
            <Text style={styles.addLabel}>{opt.label}</Text>
          </Pressable>
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scroll: { flex: 1, backgroundColor: Colors.surfaceSunken },
  content: { padding: Spacing.lg, paddingBottom: Spacing.xxl },
  sectionTitle: {
    fontSize: FontSize.xs,
    fontWeight: "600",
    color: Colors.inkMuted,
    letterSpacing: 0.8,
    marginBottom: Spacing.sm,
  },
  captureCard: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.lg,
    backgroundColor: Colors.surface,
    borderRadius: Radius.md,
    borderWidth: 1,
    borderColor: Colors.border,
    padding: Spacing.lg,
    marginBottom: Spacing.sm,
  },
  pressed: { opacity: 0.7 },
  captureIcon: {
    width: 52,
    height: 52,
    borderRadius: Radius.md,
    alignItems: "center",
    justifyContent: "center",
  },
  captureText: { flex: 1 },
  captureLabel: { fontSize: FontSize.base, fontWeight: "600", color: Colors.ink },
  captureDesc: { fontSize: FontSize.xs, color: Colors.inkSecondary, marginTop: 3 },
  addRow: { flexDirection: "row", gap: Spacing.sm },
  addBtn: {
    flex: 1,
    backgroundColor: Colors.surface,
    borderRadius: Radius.md,
    borderWidth: 1,
    borderColor: Colors.border,
    padding: Spacing.lg,
    alignItems: "center",
    gap: Spacing.sm,
  },
  addLabel: { fontSize: FontSize.xs, color: Colors.inkSecondary, fontWeight: "500" },
});
