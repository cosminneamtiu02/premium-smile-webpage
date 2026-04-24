import type { Decorator, Preview } from "@storybook/react-vite";
import { useEffect } from "react";
import i18n from "../src/i18n/config";
import "../src/index.css";

const THEMES = ["light", "dark", "brand"] as const;
const LANGS = ["en", "ro"] as const;

const withTheme: Decorator = (Story, context) => {
  const theme = (context.globals["theme"] as (typeof THEMES)[number]) ?? "light";
  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
  }, [theme]);
  return (
    <div className="min-h-[60vh] bg-bg p-6 text-fg">
      <Story />
    </div>
  );
};

const withI18n: Decorator = (Story, context) => {
  const lang = (context.globals["locale"] as (typeof LANGS)[number]) ?? "en";
  useEffect(() => {
    if (i18n.language !== lang) i18n.changeLanguage(lang);
    document.documentElement.setAttribute("lang", lang);
  }, [lang]);
  return <Story />;
};

const preview: Preview = {
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
  },
  globalTypes: {
    theme: {
      description: "Theme palette",
      defaultValue: "light",
      toolbar: {
        title: "Theme",
        icon: "paintbrush",
        items: THEMES.map((t) => ({ value: t, title: t })),
        dynamicTitle: true,
      },
    },
    locale: {
      description: "Language",
      defaultValue: "en",
      toolbar: {
        title: "Language",
        icon: "globe",
        items: LANGS.map((l) => ({ value: l, title: l.toUpperCase() })),
        dynamicTitle: true,
      },
    },
  },
  decorators: [withTheme, withI18n],
};

export default preview;
