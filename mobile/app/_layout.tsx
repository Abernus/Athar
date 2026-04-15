import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { Colors } from "@/lib/theme";

export default function RootLayout() {
  return (
    <>
      <StatusBar style="dark" />
      <Stack
        screenOptions={{
          headerStyle: { backgroundColor: Colors.surface },
          headerTintColor: Colors.accent,
          headerTitleStyle: { color: Colors.ink, fontWeight: "600", fontSize: 16 },
          headerShadowVisible: false,
          headerBackTitle: "Retour",
          contentStyle: { backgroundColor: Colors.surfaceSunken },
        }}
      >
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="capture/photo" options={{ title: "Photographier une archive", presentation: "modal" }} />
        <Stack.Screen name="capture/voice" options={{ title: "Enregistrement vocal", presentation: "modal" }} />
        <Stack.Screen name="add/person" options={{ title: "Ajouter une personne", presentation: "modal" }} />
        <Stack.Screen name="add/place" options={{ title: "Ajouter un lieu", presentation: "modal" }} />
        <Stack.Screen name="add/event" options={{ title: "Ajouter un événement", presentation: "modal" }} />
        <Stack.Screen name="entity/[type]/[id]" options={{ title: "" }} />
      </Stack>
    </>
  );
}
