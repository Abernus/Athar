import { useState } from "react";
import {
  View,
  Text,
  FlatList,
  Pressable,
  StyleSheet,
  RefreshControl,
  Linking,
} from "react-native";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { Colors, FontSize, Spacing, Radius, Shadow } from "@/lib/theme";
import { useResearchStore } from "@/stores/research-store";
import { PLACE_TYPE_LABELS } from "@/lib/constants";
import type { Place } from "@/types";

function PlaceCard({ place, onPress }: { place: Place; onPress: () => void }) {
  const hasCoords = place.coordinates?.lat && place.coordinates?.lng;

  return (
    <Pressable
      style={({ pressed }) => [styles.card, pressed && styles.cardPressed]}
      onPress={onPress}
    >
      <View style={styles.cardHeader}>
        <View style={styles.placeIcon}>
          <Ionicons name="location" size={18} color={Colors.place.icon} />
        </View>
        <View style={styles.cardText}>
          <Text style={styles.cardTitle} numberOfLines={1}>{place.name}</Text>
          <Text style={styles.cardType}>{PLACE_TYPE_LABELS[place.placeType]}</Text>
        </View>
        {hasCoords && (
          <Pressable
            style={styles.mapBtn}
            onPress={(e) => {
              e.stopPropagation();
              Linking.openURL(
                `https://maps.apple.com/?ll=${place.coordinates!.lat},${place.coordinates!.lng}&q=${encodeURIComponent(place.name)}`
              );
            }}
          >
            <Ionicons name="navigate-outline" size={16} color={Colors.accent} />
          </Pressable>
        )}
      </View>
      {place.summary ? (
        <Text style={styles.cardSummary} numberOfLines={2}>{place.summary}</Text>
      ) : null}
      {hasCoords && (
        <Text style={styles.coords}>
          {place.coordinates!.lat.toFixed(4)}, {place.coordinates!.lng.toFixed(4)}
        </Text>
      )}
      {place.tags.length > 0 && (
        <View style={styles.tags}>
          {place.tags.slice(0, 3).map((tag) => (
            <View key={tag} style={styles.tag}>
              <Text style={styles.tagText}>{tag}</Text>
            </View>
          ))}
        </View>
      )}
    </Pressable>
  );
}

export default function MapScreen() {
  const router = useRouter();
  const { places, events, fetchAll, loading } = useResearchStore();

  const placesWithEvents = places.map((place) => ({
    ...place,
    eventCount: events.filter((e) => e.placeId === place.id).length,
  }));

  return (
    <View style={styles.container}>
      <FlatList
        data={placesWithEvents}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <PlaceCard
            place={item}
            onPress={() => router.push(`/entity/place/${item.id}` as never)}
          />
        )}
        contentContainerStyle={styles.list}
        refreshing={loading}
        onRefresh={fetchAll}
        ListHeaderComponent={() => (
          <View style={styles.header}>
            <Ionicons name="map-outline" size={18} color={Colors.inkMuted} />
            <Text style={styles.headerText}>
              {places.length} lieu{places.length !== 1 ? "x" : ""} enregistré{places.length !== 1 ? "s" : ""}
            </Text>
          </View>
        )}
        ListEmptyComponent={() => (
          <View style={styles.emptyState}>
            <View style={styles.emptyIcon}>
              <Ionicons name="map-outline" size={36} color={Colors.borderStrong} />
            </View>
            <Text style={styles.emptyTitle}>Aucun lieu</Text>
            <Text style={styles.emptyHint}>
              Ajoutez des lieux pour les explorer sur la carte
            </Text>
            <Pressable
              style={styles.emptyBtn}
              onPress={() => router.push("/add/place" as never)}
            >
              <Ionicons name="add" size={18} color="white" />
              <Text style={styles.emptyBtnText}>Ajouter un lieu</Text>
            </Pressable>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.surfaceSunken },
  list: { padding: Spacing.lg, gap: Spacing.sm },

  header: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.sm,
    marginBottom: Spacing.sm,
  },
  headerText: { fontSize: FontSize.sm, color: Colors.inkMuted },

  card: {
    backgroundColor: Colors.surface,
    borderRadius: Radius.lg,
    padding: Spacing.lg,
    gap: Spacing.sm,
    ...Shadow.sm,
  },
  cardPressed: { opacity: 0.7 },
  cardHeader: { flexDirection: "row", alignItems: "center", gap: Spacing.md },
  placeIcon: {
    width: 36,
    height: 36,
    borderRadius: Radius.md,
    backgroundColor: Colors.place.bg,
    alignItems: "center",
    justifyContent: "center",
  },
  cardText: { flex: 1 },
  cardTitle: { fontSize: FontSize.base, fontWeight: "600", color: Colors.ink },
  cardType: { fontSize: FontSize.xs, color: Colors.inkMuted, marginTop: 1 },
  mapBtn: {
    width: 36,
    height: 36,
    borderRadius: Radius.md,
    backgroundColor: Colors.accentLight,
    alignItems: "center",
    justifyContent: "center",
  },
  cardSummary: { fontSize: FontSize.sm, color: Colors.inkSecondary, lineHeight: 19 },
  coords: { fontSize: FontSize.xs, color: Colors.inkMuted, fontFamily: "monospace" },
  tags: { flexDirection: "row", gap: Spacing.xs },
  tag: { backgroundColor: Colors.place.bg, borderRadius: Radius.full, paddingHorizontal: Spacing.sm, paddingVertical: 2 },
  tagText: { fontSize: FontSize.xs, color: Colors.place.text, fontWeight: "500" },

  emptyState: { alignItems: "center", gap: Spacing.sm, paddingVertical: Spacing.xxxl },
  emptyIcon: {
    width: 72,
    height: 72,
    borderRadius: Radius.full,
    backgroundColor: Colors.surfaceSunken,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: Spacing.sm,
  },
  emptyTitle: { fontSize: FontSize.lg, fontWeight: "600", color: Colors.inkSecondary },
  emptyHint: { fontSize: FontSize.sm, color: Colors.inkMuted, textAlign: "center", maxWidth: 260 },
  emptyBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.xs,
    backgroundColor: Colors.accent,
    borderRadius: Radius.lg,
    paddingHorizontal: Spacing.xl,
    paddingVertical: Spacing.md,
    marginTop: Spacing.md,
    ...Shadow.md,
  },
  emptyBtnText: { color: "white", fontWeight: "600", fontSize: FontSize.sm },
});
