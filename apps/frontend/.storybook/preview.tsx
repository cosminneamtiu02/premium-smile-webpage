import type { Decorator, Preview } from "@storybook/react-vite";
import { useEffect } from "react";
import i18n from "../src/i18n/config";
import "../src/index.css";

const LANGS = ["en", "ro"] as const;

const withI18n: Decorator = (Story, context) => {
  const lang = (context.globals["locale"] as (typeof LANGS)[number]) ?? "en";
  useEffect(() => {
    if (i18n.language !== lang) i18n.changeLanguage(lang);
    document.documentElement.setAttribute("lang", lang);
  }, [lang]);
  return (
    <div className="min-h-[60vh] bg-bg p-6 text-fg">
      <Story />
    </div>
  );
};

const preview: Preview = {
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
    a11y: {
      // Default axe config for every story. Override per story by setting
      // `parameters.a11y` on the story object.
      config: {
        rules: [
          // Storybook decorator wraps stories in a single <div>; that wrapper
          // sometimes fails the "must have one main landmark" rule for atom
          // stories that don't render a real page. Skip — pages are tested
          // for landmarks separately.
          { id: "landmark-one-main", enabled: false },
          { id: "page-has-heading-one", enabled: false },
          { id: "region", enabled: false },
        ],
      },
      test: "todo",
    },
  },
  globalTypes: {
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
  decorators: [withI18n],
};

export default preview;
