import i18n from "i18next";
import LanguageDetector from "i18next-browser-languagedetector";
import { initReactI18next } from "react-i18next";

import enCommon from "./locales/en/common.json";
import roCommon from "./locales/ro/common.json";

export const SUPPORTED_LANGUAGES = ["en", "ro"] as const;
export type SupportedLanguage = (typeof SUPPORTED_LANGUAGES)[number];
export const DEFAULT_LANGUAGE: SupportedLanguage = "en";

const resources = {
  en: { common: enCommon },
  ro: { common: roCommon },
};

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: DEFAULT_LANGUAGE,
    supportedLngs: SUPPORTED_LANGUAGES,
    defaultNS: "common",
    ns: ["common"],
    interpolation: {
      escapeValue: false,
    },
    detection: {
      // Browser language only — no localStorage. The page picks `navigator.language`
      // on every visit. Falls through to `fallbackLng` when the detected
      // locale isn't in `supportedLngs`.
      order: ["navigator"],
      caches: [],
    },
  });

export default i18n;
