import { useMemo } from "react";
import { create } from "zustand";
import { Colors, Shadow, initialScheme, applyScheme, type Scheme } from "./theme";

type ThemeState = {
  scheme: Scheme;
  setScheme: (s: Scheme) => void;
  toggle: () => void;
};

export const useThemeStore = create<ThemeState>((set, get) => ({
  scheme: initialScheme,
  setScheme: (s) => {
    applyScheme(s);
    set({ scheme: s });
  },
  toggle: () => {
    const next: Scheme = get().scheme === "light" ? "dark" : "light";
    applyScheme(next);
    set({ scheme: next });
  },
}));

/**
 * Subscribe a component to the active theme and (re)build its StyleSheet.
 * The factory closes over the live `Colors`/`Shadow`, which are rewritten in
 * place before the scheme state updates, so the rebuilt styles reflect the new
 * palette. Subscribing also re-renders the component so inline `Colors.x` reads
 * pick up the change.
 */
export function useThemedStyles<T>(factory: () => T): T {
  const scheme = useThemeStore((s) => s.scheme);
  return useMemo(factory, [scheme]);
}

/** Access the active scheme + toggle, e.g. for a settings control. */
export function useTheme() {
  const scheme = useThemeStore((s) => s.scheme);
  const toggle = useThemeStore((s) => s.toggle);
  const setScheme = useThemeStore((s) => s.setScheme);
  return { scheme, toggle, setScheme, colors: Colors, shadow: Shadow };
}
