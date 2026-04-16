import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useEffect } from "react";
import { Colors } from "@/lib/theme";
import { useResearchStore } from "@/stores/research-store";

export default function RootLayout() {
  const fetchAll = useResearchStore((s) => s.fetchAll);

  useEffect(() => {
    fetchAll();
  }, []);

  return (
    <>
      <StatusBar style="dark" />
      <Stack
        screenOptions={{
          headerStyle: { backgroundColor: Colors.surface },
          headerTintColor: Colors.accent,
          headerTitleStyle: { color: Colors.ink, fontWeight: "600", fontSize: 17 },
          headerShadowVisible: false,
          headerBackTitle: "Retour",
          contentStyle: { backgroundColor: Colors.surfaceSunken },
        }}
      >
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen
          name="capture/photo"
          options={{ title: "Photo d'archive", presentation: "modal" }}
        />
        <Stack.Screen
          name="capture/voice"
          options={{ title: "Enregistrement", presentation: "modal" }}
        />
        <Stack.Screen
          name="add/person"
          options={{ title: "Nouvelle personne", presentation: "modal" }}
        />
        <Stack.Screen
          name="add/place"
          options={{ title: "Nouveau lieu", presentation: "modal" }}
        />
        <Stack.Screen
          name="add/event"
          options={{ title: "Nouvel événement", presentation: "modal" }}
        />
        <Stack.Screen name="entity/[type]/[id]" options={{ title: "" }} />
      </Stack>
    </>
  );
}
