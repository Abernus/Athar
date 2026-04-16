import { View, Text, Pressable, StyleSheet, ScrollView } from "react-native";
import { useRouter } from "expo-router";
import { Colors, FontSize, Spacing, Radius, Shadow } from "@/lib/theme";
import { Ionicons } from "@expo/vector-icons";

const CAPTURE_OPTIONS = [
  {
    icon: "document-text-outline" as const,
    label: "Nouvelle source",
    description: "Ajoutez une source : archive, témoignage, article, registre",
    route: "/add/source",
    color: Colors.event,
  },
  {
    icon: "camera-outline" as const,
    label: "Photo d'archive",
    description: "Photographiez un document, un acte, une photo d'époque",
    route: "/capture/photo",
    color: Colors.person,
  },
  {
    icon: "mic-outline" as const,
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
    color: Colors.person,
  },
  {
    icon: "people-outline" as const,
    label: "Groupe",
    route: "/add/group",
    color: Colors.group,
  },
  {
    icon: "location-outline" as const,
    label: "Lieu",
    route: "/add/place",
    color: Colors.place,
  },
  {
    icon: "calendar-outline" as const,
    label: "Événement",
    route: "/add/event",
    color: Colors.event,
  },
];

export default function CaptureTab() {
  const router = useRouter();

  return (
    <ScrollView style={styles.scroll} contentContainerStyle={styles.content}>
      {/* Capture section */}
      {CAPTURE_OPTIONS.map((opt) => (
        <Pressable
          key={opt.route}
          style={({ pressed }) => [styles.captureCard, pressed && styles.pressed]}
          onPress={() => router.push(opt.route as never)}
        >
          <View style={[styles.captureIcon, { backgroundColor: opt.color.bg }]}>
            <Ionicons name={opt.icon} size={28} color={opt.color.icon} />
          </View>
          <View style={styles.captureText}>
            <Text style={styles.captureLabel}>{opt.label}</Text>
            <Text style={styles.captureDesc}>{opt.description}</Text>
          </View>
          <Ionicons name="chevron-forward" size={18} color={Colors.borderStrong} />
        </Pressable>
      ))}

      {/* Divider */}
      <View style={styles.dividerRow}>
        <View style={styles.dividerLine} />
        <Text style={styles.dividerText}>Ajouter une entité</Text>
        <View style={styles.dividerLine} />
      </View>

      {/* Add options */}
      <View style={styles.addRow}>
        {ADD_OPTIONS.map((opt) => (
          <Pressable
            key={opt.route}
            style={({ pressed }) => [styles.addBtn, pressed && styles.addPressed]}
            onPress={() => router.push(opt.route as never)}
          >
            <View style={[styles.addIconWrap, { backgroundColor: opt.color.bg }]}>
              <Ionicons name={opt.icon} size={20} color={opt.color.icon} />
            </View>
            <Text style={styles.addLabel}>{opt.label}</Text>
          </Pressable>
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scroll: { flex: 1, backgroundColor: Colors.surfaceSunken },
  content: { padding: Spacing.lg, paddingBottom: Spacing.xxxl, gap: Spacing.sm },

  captureCard: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.lg,
    backgroundColor: Colors.surface,
    borderRadius: Radius.lg,
    padding: Spacing.lg,
    ...Shadow.sm,
  },
  pressed: { opacity: 0.7, transform: [{ scale: 0.98 }] },
  captureIcon: {
    width: 56,
    height: 56,
    borderRadius: Radius.lg,
    alignItems: "center",
    justifyContent: "center",
  },
  captureText: { flex: 1 },
  captureLabel: {
    fontSize: FontSize.base,
    fontWeight: "600",
    color: Colors.ink,
  },
  captureDesc: {
    fontSize: FontSize.sm,
    color: Colors.inkMuted,
    marginTop: 3,
    lineHeight: 18,
  },

  dividerRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.md,
    marginVertical: Spacing.lg,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: Colors.border,
  },
  dividerText: {
    fontSize: FontSize.xs,
    color: Colors.inkMuted,
    fontWeight: "500",
  },

  addRow: { flexDirection: "row", gap: Spacing.sm },
  addBtn: {
    flex: 1,
    backgroundColor: Colors.surface,
    borderRadius: Radius.lg,
    padding: Spacing.lg,
    alignItems: "center",
    gap: Spacing.sm,
    ...Shadow.sm,
  },
  addPressed: { opacity: 0.7, transform: [{ scale: 0.97 }] },
  addIconWrap: {
    width: 40,
    height: 40,
    borderRadius: Radius.md,
    alignItems: "center",
    justifyContent: "center",
  },
  addLabel: {
    fontSize: FontSize.sm,
    color: Colors.ink,
    fontWeight: "500",
  },
});
