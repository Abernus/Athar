// Athar (أثر) — design tokens
// Dark editorial palette: warm ink & amber, evoking lamplit archives at night.

export const Colors = {
  // Text — warm parchment on dark
  ink: "#F5EFE6",
  inkSecondary: "#C7BCAD",
  inkMuted: "#897F72",

  // Surfaces — deep warm charcoal, layered for elevation
  surface: "#1E1A16",
  surfaceRaised: "#272019",
  surfaceSunken: "#14110D",
  surfaceWarm: "#2A2014",

  // Borders — visible hairlines on dark
  border: "#322B23",
  borderStrong: "#453C31",

  // Accent — luminous amber
  accent: "#F59E0B",
  accentDark: "#D97706",
  accentLight: "#2A2010",
  accentMedium: "#B45309",

  // Status — brightened for dark
  danger: "#F87171",
  dangerLight: "#2A1714",
  success: "#34D399",
  successLight: "#102A20",
  warning: "#FBBF24",
  warningLight: "#2A2010",

  // Entity type colors — vivid chips on dark
  person: { bg: "#15233D", text: "#93C5FD", icon: "#60A5FA" },
  group: { bg: "#241A3D", text: "#C4B5FD", icon: "#A78BFA" },
  place: { bg: "#0F2E24", text: "#6EE7B7", icon: "#34D399" },
  event: { bg: "#2E2410", text: "#FCD34D", icon: "#FBBF24" },

  // Confidence
  confirmed: { bg: "#102A20", text: "#6EE7B7", border: "#1C4A38" },
  probable: { bg: "#15233D", text: "#93C5FD", border: "#1E3A5F" },
  uncertain: { bg: "#2A2010", text: "#FCD34D", border: "#4A3A14" },
  contested: { bg: "#2E1C10", text: "#FDBA74", border: "#4A301A" },
  abandoned: { bg: "#201C18", text: "#897F72", border: "#322B23" },

  // Overlays
  overlay: "rgba(8, 6, 4, 0.7)",
  shimmer: "rgba(245, 158, 11, 0.08)",

  // Pure values (button fills, etc.)
  onAccent: "#1A1206",
};

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

// On dark surfaces shadows read faintly — we lean on layered surface lightness
// and hairline borders for separation, with shadows adding subtle depth.
export const Shadow = {
  sm: {
    shadowColor: "#000000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 2,
  },
  md: {
    shadowColor: "#000000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.35,
    shadowRadius: 12,
    elevation: 5,
  },
  lg: {
    shadowColor: "#000000",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.45,
    shadowRadius: 24,
    elevation: 10,
  },
  glow: {
    shadowColor: "#F59E0B",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.45,
    shadowRadius: 16,
    elevation: 6,
  },
};
