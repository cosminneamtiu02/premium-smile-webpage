import { create } from "zustand";
import { persist } from "zustand/middleware";

export const THEMES = ["light", "dark", "brand"] as const;
export type Theme = (typeof THEMES)[number];

type ThemeStore = {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  cycleTheme: () => void;
};

function detectSystemTheme(): Theme {
  if (typeof window === "undefined") return "light";
  return window.matchMedia?.("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}

export const useThemeStore = create<ThemeStore>()(
  persist(
    (set, get) => ({
      theme: detectSystemTheme(),
      setTheme: (theme) => set({ theme }),
      cycleTheme: () => {
        const current = get().theme;
        const next = THEMES[(THEMES.indexOf(current) + 1) % THEMES.length] ?? "light";
        set({ theme: next });
      },
    }),
    {
      name: "app.theme",
    },
  ),
);
