import * as Localization from "expo-localization";
import i18n from "i18next";
import { initReactI18next } from "react-i18next";

import enUS from "@/assets/i18n/en-US.json";
import plPL from "@/assets/i18n/pl-PL.json";

const translations = {
  "en-US": {
    translation: enUS,
    displayName: "English (US) 🇺🇸",
  },
  "pl-PL": {
    translation: plPL,
    displayName: "Polski 🇵🇱",
  },
} as const;

export const locales = Object.keys(translations).map((locale) => ({
  code: locale as keyof typeof translations,
  displayName: translations[locale as keyof typeof translations].displayName,
}));

const preferredLocale = (Localization.getLocales().find((locale) =>
  locales
    .map((l) => l.code)
    .includes(locale.languageTag as (typeof locales)[number]["code"]),
)?.languageTag || "en-US") as (typeof locales)[number]["code"];

const initiateLocalization = async () => {
  if (i18n.isInitialized) return;

  // eslint-disable-next-line import/no-named-as-default-member
  i18n.use(initReactI18next).init({
    resources: translations,
    lng: preferredLocale,
    fallbackLng: "en-US",
    interpolation: { escapeValue: false },
  });

  i18n.services.formatter!.add("optionalName", (value) => {
    return value ? `, ${value}` : "";
  });
};

export default initiateLocalization;
