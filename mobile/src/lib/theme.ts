// Historiens mobile — design tokens
export const Colors = {
  ink: "#1a1a1a",
  inkSecondary: "#4a4a4a",
  inkMuted: "#8a8a8a",
  surface: "#ffffff",
  surfaceRaised: "#fafafa",
  surfaceSunken: "#f5f4f2",
  border: "#e5e3df",
  borderStrong: "#d0cdc6",
  accent: "#3b5998",
  accentLight: "#eef1f8",
  danger: "#dc2626",
  dangerLight: "#fef2f2",
  success: "#059669",
  successLight: "#f0fdf4",
  warning: "#d97706",
  warningLight: "#fffbeb",

  // Entity type colors
  person: { bg: "#eff6ff", text: "#1d4ed8" },
  group: { bg: "#f5f3ff", text: "#7c3aed" },
  place: { bg: "#f0fdf4", text: "#15803d" },
  event: { bg: "#fffbeb", text: "#b45309" },

  // Confidence
  confirmed: { bg: "#f0fdf4", text: "#065f46", border: "#bbf7d0" },
  probable: { bg: "#eff6ff", text: "#1e40af", border: "#bfdbfe" },
  uncertain: { bg: "#fffbeb", text: "#92400e", border: "#fde68a" },
  contested: { bg: "#fff7ed", text: "#9a3412", border: "#fed7aa" },
  abandoned: { bg: "#fafaf9", text: "#57534e", border: "#e7e5e4" },
};

export const Spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  xxl: 32,
};

export const Radius = {
  sm: 6,
  md: 10,
  lg: 14,
  full: 999,
};

export const FontSize = {
  xs: 11,
  sm: 13,
  base: 15,
  lg: 17,
  xl: 20,
  xxl: 24,
};

export const FontWeight = {
  regular: "400" as const,
  medium: "500" as const,
  semibold: "600" as const,
  bold: "700" as const,
};
