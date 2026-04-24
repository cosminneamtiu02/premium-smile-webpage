import { Moon, Palette, Sun } from "lucide-react";
import { useTranslation } from "react-i18next";
import { type Theme, useThemeStore } from "@/stores/theme-store";

const ICONS: Record<Theme, typeof Sun> = {
  light: Sun,
  dark: Moon,
  brand: Palette,
};

export function ThemeToggle() {
  const { t } = useTranslation();
  const theme = useThemeStore((s) => s.theme);
  const cycleTheme = useThemeStore((s) => s.cycleTheme);
  const Icon = ICONS[theme];

  return (
    <button
      type="button"
      onClick={cycleTheme}
      aria-label={t("theme.toggle_label", { theme: t(`theme.${theme}`) })}
      className="inline-flex h-9 w-9 items-center justify-center rounded text-fg transition-colors hover:bg-bg-subtle"
    >
      <Icon size={18} aria-hidden />
    </button>
  );
}
