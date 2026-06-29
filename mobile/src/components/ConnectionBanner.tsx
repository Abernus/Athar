import { View, Text, StyleSheet, ActivityIndicator } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Colors, FontSize, Spacing, Radius } from "@/lib/theme";
import { useThemedStyles } from "@/lib/useTheme";
import { useResearchStore } from "@/stores/research-store";
import { PressableScale } from "./PressableScale";

/**
 * Shown when the last sync with Supabase failed. Reassures the user their data
 * isn't lost (it's safe on the server / in local cache) and offers a retry.
 * Renders nothing when the connection is healthy.
 */
export function ConnectionBanner() {
  const styles = useThemedStyles(makeStyles);
  const loadError = useResearchStore((s) => s.loadError);
  const loading = useResearchStore((s) => s.loading);
  const fetchAll = useResearchStore((s) => s.fetchAll);

  if (!loadError) return null;

  return (
    <View style={styles.banner}>
      <Ionicons name="cloud-offline-outline" size={20} color={Colors.warning} />
      <View style={styles.text}>
        <Text style={styles.title}>Connexion impossible</Text>
        <Text style={styles.sub}>
          Tes données sont en sécurité. Vérifie ta connexion ou réessaie.
        </Text>
      </View>
      <PressableScale
        style={styles.retry}
        haptics="medium"
        onPress={() => fetchAll()}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator size="small" color={Colors.onAccent} />
        ) : (
          <Text style={styles.retryText}>Réessayer</Text>
        )}
      </PressableScale>
    </View>
  );
}

const makeStyles = () => StyleSheet.create({
  banner: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.md,
    backgroundColor: Colors.warningLight,
    borderWidth: 1,
    borderColor: Colors.warning,
    borderRadius: Radius.lg,
    padding: Spacing.md,
    marginHorizontal: Spacing.lg,
    marginTop: Spacing.lg,
  },
  text: { flex: 1 },
  title: {
    fontSize: FontSize.sm,
    fontWeight: "700",
    color: Colors.ink,
  },
  sub: {
    fontSize: FontSize.xs,
    color: Colors.inkSecondary,
    marginTop: 1,
  },
  retry: {
    backgroundColor: Colors.accent,
    borderRadius: Radius.md,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    minWidth: 84,
    alignItems: "center",
  },
  retryText: {
    fontSize: FontSize.xs,
    fontWeight: "700",
    color: Colors.onAccent,
  },
});
