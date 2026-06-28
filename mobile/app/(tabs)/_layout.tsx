import { Tabs } from "expo-router";
import { View } from "react-native";
import { Colors, FontSize, Shadow } from "@/lib/theme";
import { Ionicons } from "@expo/vector-icons";

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors.accent,
        tabBarInactiveTintColor: Colors.inkMuted,
        tabBarStyle: {
          backgroundColor: Colors.surface,
          borderTopColor: Colors.border,
          borderTopWidth: 1,
          paddingTop: 6,
          paddingBottom: 2,
          height: 56,
          ...Shadow.md,
        },
        tabBarLabelStyle: { fontSize: 10, fontWeight: "600", marginTop: -2 },
        headerStyle: { backgroundColor: Colors.surface },
        headerTitleStyle: { color: Colors.ink, fontWeight: "700", fontSize: 18 },
        headerShadowVisible: false,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Accueil",
          headerShown: false,
          tabBarIcon: ({ color, focused }) => (
            <Ionicons name={focused ? "home" : "home-outline"} size={22} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="projects"
        options={{
          title: "Dossiers",
          tabBarIcon: ({ color, focused }) => (
            <Ionicons name={focused ? "folder" : "folder-outline"} size={22} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="capture"
        options={{
          title: "Ajouter",
          tabBarIcon: ({ color, focused }) => (
            <View style={{
              width: 38,
              height: 38,
              borderRadius: 19,
              backgroundColor: focused ? Colors.accent : Colors.accentLight,
              alignItems: "center",
              justifyContent: "center",
              marginTop: -4,
            }}>
              <Ionicons name="add" size={24} color={focused ? "white" : Colors.accent} />
            </View>
          ),
        }}
      />
      <Tabs.Screen
        name="timeline"
        options={{
          title: "Frise",
          tabBarIcon: ({ color, focused }) => (
            <Ionicons name={focused ? "time" : "time-outline"} size={22} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="search"
        options={{
          title: "Chercher",
          tabBarIcon: ({ color, focused }) => (
            <Ionicons name={focused ? "search" : "search-outline"} size={22} color={color} />
          ),
        }}
      />
      {/* Hidden tabs */}
      <Tabs.Screen name="browse" options={{ href: null, title: "Explorer" }} />
      <Tabs.Screen name="map" options={{ href: null, title: "Lieux" }} />
    </Tabs>
  );
}
