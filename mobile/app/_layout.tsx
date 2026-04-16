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
        <Stack.Screen
          name="add/group"
          options={{ title: "Nouveau groupe", presentation: "modal" }}
        />
        <Stack.Screen
          name="add/project"
          options={{ title: "Nouveau dossier", presentation: "modal" }}
        />
        <Stack.Screen
          name="add/source"
          options={{ title: "Nouvelle source", presentation: "modal" }}
        />
        <Stack.Screen name="project/[id]" options={{ title: "" }} />
        <Stack.Screen name="source/[id]" options={{ title: "" }} />
        <Stack.Screen
          name="add/hypothesis"
          options={{ title: "Nouvelle hypothèse", presentation: "modal" }}
        />
        <Stack.Screen
          name="add/note"
          options={{ title: "Nouvelle note", presentation: "modal" }}
        />
        <Stack.Screen
          name="add/relationship"
          options={{ title: "Nouvelle relation", presentation: "modal" }}
        />
        <Stack.Screen name="entity/[type]/[id]" options={{ title: "" }} />
        <Stack.Screen
          name="export/project"
          options={{ title: "Exporter le dossier", presentation: "modal" }}
        />
      </Stack>
    </>
  );
}
