import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector"; // Import the language detector
import translationEN from "./locales/en/translation.json";
import translationES from "./locales/es/translation.json";

const resources = {
  en: {
    translation: translationEN,
  },
  es: {
    translation: translationES,
  },
};

i18n
  .use(LanguageDetector) // Use the imported language detector
  .use(initReactI18next) // Pass the i18n instance to react-i18next
  .init({
    resources,
    fallbackLng: "en", // Set fallback language
    interpolation: {
      escapeValue: false, // React already safely escapes values
    },
    detection: {
      order: ["localStorage", "navigator"], // Specify the order of detection
      caches: ["localStorage"], // Cache the language in localStorage
    },
  });

export default i18n;
