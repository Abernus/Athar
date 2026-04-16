// Athar (أثر) — design tokens
// Warm amber/stone palette evoking manuscripts, archives, traces

export const Colors = {
  // Text
  ink: "#1C1917",
  inkSecondary: "#44403C",
  inkMuted: "#A8A29E",

  // Surfaces
  surface: "#FFFFFF",
  surfaceRaised: "#FAFAF9",
  surfaceSunken: "#F5F5F4",

  // Borders
  border: "#E7E5E4",
  borderStrong: "#D6D3D1",

  // Accent — warm amber
  accent: "#B45309",
  accentDark: "#92400E",
  accentLight: "#FFFBEB",
  accentMedium: "#FDE68A",

  // Status
  danger: "#DC2626",
  dangerLight: "#FEF2F2",
  success: "#059669",
  successLight: "#ECFDF5",
  warning: "#D97706",
  warningLight: "#FFFBEB",

  // Entity type colors
  person: { bg: "#DBEAFE", text: "#1D4ED8", icon: "#3B82F6" },
  group: { bg: "#EDE9FE", text: "#7C3AED", icon: "#8B5CF6" },
  place: { bg: "#D1FAE5", text: "#059669", icon: "#10B981" },
  event: { bg: "#FEF3C7", text: "#B45309", icon: "#F59E0B" },

  // Confidence
  confirmed: { bg: "#D1FAE5", text: "#065F46", border: "#A7F3D0" },
  probable: { bg: "#DBEAFE", text: "#1E40AF", border: "#93C5FD" },
  uncertain: { bg: "#FEF3C7", text: "#92400E", border: "#FCD34D" },
  contested: { bg: "#FFEDD5", text: "#9A3412", border: "#FDBA74" },
  abandoned: { bg: "#F5F5F4", text: "#57534E", border: "#D6D3D1" },

  // Overlays
  overlay: "rgba(28, 25, 23, 0.5)",
  shimmer: "rgba(180, 83, 9, 0.06)",
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
};

export const FontWeight = {
  regular: "400" as const,
  medium: "500" as const,
  semibold: "600" as const,
  bold: "700" as const,
};

export const Shadow = {
  sm: {
    shadowColor: "#1C1917",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 3,
    elevation: 1,
  },
  md: {
    shadowColor: "#1C1917",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 3,
  },
  lg: {
    shadowColor: "#1C1917",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 16,
    elevation: 5,
  },
};
