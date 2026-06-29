// Athar (أثر) — design tokens
// Two palettes (warm parchment "light", lamplit "dark"), both ink & amber.
// Colors/Shadow are LIVE mutable objects: applyScheme() rewrites them in place
// so inline `Colors.x` reads pick up the new theme on the next render, and
// useThemedStyles() recomputes StyleSheets. The choice persists synchronously
// to disk so it is restored at the next launch with no flash.

import { Appearance } from "react-native";
import { File, Paths } from "expo-file-system";

export type Scheme = "light" | "dark";

export type Palette = {
  ink: string;
  inkSecondary: string;
  inkMuted: string;
  surface: string;
  surfaceRaised: string;
  surfaceSunken: string;
  surfaceWarm: string;
  border: string;
  borderStrong: string;
  accent: string;
  accentDark: string;
  accentLight: string;
  accentMedium: string;
  danger: string;
  dangerLight: string;
  success: string;
  successLight: string;
  warning: string;
  warningLight: string;
  person: { bg: string; text: string; icon: string };
  group: { bg: string; text: string; icon: string };
  place: { bg: string; text: string; icon: string };
  event: { bg: string; text: string; icon: string };
  confirmed: { bg: string; text: string; border: string };
  probable: { bg: string; text: string; border: string };
  uncertain: { bg: string; text: string; border: string };
  contested: { bg: string; text: string; border: string };
  abandoned: { bg: string; text: string; border: string };
  overlay: string;
  shimmer: string;
  onAccent: string;
};

// Warm parchment — manuscripts in daylight.
export const LightColors: Palette = {
  ink: "#1C1917",
  inkSecondary: "#44403C",
  inkMuted: "#A8A29E",
  surface: "#FFFFFF",
  surfaceRaised: "#FAFAF9",
  surfaceSunken: "#F5F5F4",
  surfaceWarm: "#FEF7ED",
  border: "#E7E5E4",
  borderStrong: "#D6D3D1",
  accent: "#B45309",
  accentDark: "#92400E",
  accentLight: "#FFFBEB",
  accentMedium: "#FDE68A",
  danger: "#DC2626",
  dangerLight: "#FEF2F2",
  success: "#059669",
  successLight: "#ECFDF5",
  warning: "#D97706",
  warningLight: "#FFFBEB",
  person: { bg: "#DBEAFE", text: "#1D4ED8", icon: "#3B82F6" },
  group: { bg: "#EDE9FE", text: "#7C3AED", icon: "#8B5CF6" },
  place: { bg: "#D1FAE5", text: "#059669", icon: "#10B981" },
  event: { bg: "#FEF3C7", text: "#B45309", icon: "#F59E0B" },
  confirmed: { bg: "#D1FAE5", text: "#065F46", border: "#A7F3D0" },
  probable: { bg: "#DBEAFE", text: "#1E40AF", border: "#93C5FD" },
  uncertain: { bg: "#FEF3C7", text: "#92400E", border: "#FCD34D" },
  contested: { bg: "#FFEDD5", text: "#9A3412", border: "#FDBA74" },
  abandoned: { bg: "#F5F5F4", text: "#57534E", border: "#D6D3D1" },
  overlay: "rgba(28, 25, 23, 0.5)",
  shimmer: "rgba(180, 83, 9, 0.06)",
  onAccent: "#FFFFFF",
};

// Lamplit archives at night.
export const DarkColors: Palette = {
  ink: "#F5EFE6",
  inkSecondary: "#C7BCAD",
  inkMuted: "#897F72",
  surface: "#1E1A16",
  surfaceRaised: "#272019",
  surfaceSunken: "#14110D",
  surfaceWarm: "#2A2014",
  border: "#322B23",
  borderStrong: "#453C31",
  accent: "#F59E0B",
  accentDark: "#D97706",
  accentLight: "#2A2010",
  accentMedium: "#B45309",
  danger: "#F87171",
  dangerLight: "#2A1714",
  success: "#34D399",
  successLight: "#102A20",
  warning: "#FBBF24",
  warningLight: "#2A2010",
  person: { bg: "#15233D", text: "#93C5FD", icon: "#60A5FA" },
  group: { bg: "#241A3D", text: "#C4B5FD", icon: "#A78BFA" },
  place: { bg: "#0F2E24", text: "#6EE7B7", icon: "#34D399" },
  event: { bg: "#2E2410", text: "#FCD34D", icon: "#FBBF24" },
  confirmed: { bg: "#102A20", text: "#6EE7B7", border: "#1C4A38" },
  probable: { bg: "#15233D", text: "#93C5FD", border: "#1E3A5F" },
  uncertain: { bg: "#2A2010", text: "#FCD34D", border: "#4A3A14" },
  contested: { bg: "#2E1C10", text: "#FDBA74", border: "#4A301A" },
  abandoned: { bg: "#201C18", text: "#897F72", border: "#322B23" },
  overlay: "rgba(8, 6, 4, 0.7)",
  shimmer: "rgba(245, 158, 11, 0.08)",
  onAccent: "#1A1206",
};

export type Shadows = {
  sm: object;
  md: object;
  lg: object;
  glow: object;
};

const LightShadow: Shadows = {
  sm: { shadowColor: "#1C1917", shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.05, shadowRadius: 3, elevation: 1 },
  md: { shadowColor: "#1C1917", shadowOffset: { width: 0, height: 3 }, shadowOpacity: 0.08, shadowRadius: 10, elevation: 3 },
  lg: { shadowColor: "#1C1917", shadowOffset: { width: 0, height: 6 }, shadowOpacity: 0.12, shadowRadius: 20, elevation: 6 },
  glow: { shadowColor: "#B45309", shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.2, shadowRadius: 12, elevation: 4 },
};

const DarkShadow: Shadows = {
  sm: { shadowColor: "#000000", shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.25, shadowRadius: 4, elevation: 2 },
  md: { shadowColor: "#000000", shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.35, shadowRadius: 12, elevation: 5 },
  lg: { shadowColor: "#000000", shadowOffset: { width: 0, height: 8 }, shadowOpacity: 0.45, shadowRadius: 24, elevation: 10 },
  glow: { shadowColor: "#F59E0B", shadowOffset: { width: 0, height: 0 }, shadowOpacity: 0.45, shadowRadius: 16, elevation: 6 },
};

// ── Synchronous persistence (new expo-file-system API) ──────────────────────
let prefFile: File | null = null;
try {
  prefFile = new File(Paths.document, "athar-theme.txt");
} catch {
  prefFile = null;
}

function readStoredScheme(): Scheme | null {
  try {
    if (prefFile && prefFile.exists) {
      const v = prefFile.textSync().trim();
      if (v === "light" || v === "dark") return v;
    }
  } catch {}
  return null;
}

function persistScheme(s: Scheme) {
  try {
    prefFile?.write(s);
  } catch {}
}

export const initialScheme: Scheme =
  readStoredScheme() ?? (Appearance.getColorScheme() === "light" ? "light" : "dark");

// Live mutable token objects — same reference for the app's lifetime.
export const Colors: Palette = { ...(initialScheme === "light" ? LightColors : DarkColors) };
export const Shadow: Shadows = { ...(initialScheme === "light" ? LightShadow : DarkShadow) };

/** Rewrite the live token objects in place and persist the choice. */
export function applyScheme(s: Scheme) {
  Object.assign(Colors, s === "light" ? LightColors : DarkColors);
  Object.assign(Shadow, s === "light" ? LightShadow : DarkShadow);
  persistScheme(s);
}

export const Spacing = {
  xxs: 2,
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  xxl: 32,
  xxxl: 48,
};

export const Radius = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 24,
  full: 999,
};

export const FontSize = {
  xs: 11,
  sm: 13,
  base: 15,
  lg: 17,
  xl: 20,
  xxl: 26,
  xxxl: 32,
  hero: 38,
};

export const FontWeight = {
  regular: "400" as const,
  medium: "500" as const,
  semibold: "600" as const,
  bold: "700" as const,
  heavy: "800" as const,
};
