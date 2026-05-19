import i18n from "i18next";
import { initReactI18next } from "react-i18next";

import LanguageDetector from "i18next-browser-languagedetector";

const resources = {
  en: {
    translation: {
      settings: "Settings",
      themeMode: "Theme Mode",
      language: "Language",
      notifications: "Notifications",
      emailUpdates: "Email Updates",
      profileVisibility: "Profile Visibility",
      public: "Public",
      private: "Private",
      friendsOnly: "Friends Only",
      save: "Save Settings",
    },
  },
  bn: {
    translation: {
      settings: "সেটিংস",
      themeMode: "থিম মোড",
      language: "ভাষা",
      notifications: "বিজ্ঞপ্তি",
      emailUpdates: "ইমেইল আপডেট",
      profileVisibility: "প্রোফাইল দৃশ্যমানতা",
      public: "সবার জন্য",
      private: "নিজস্ব",
      friendsOnly: "বন্ধুরা",
      save: "সেভ করুন",
    },
  },
  hi: {
    translation: {
      settings: "सेटिंग्स",
      themeMode: "थीम मोड",
      language: "भाषा",
      notifications: "सूचनाएं",
      emailUpdates: "ईमेल अपडेट",
      profileVisibility: "प्रोफ़ाइल दृश्यता",
      public: "सार्वजनिक",
      private: "निजी",
      friendsOnly: "केवल दोस्त",
      save: "सेटिंग सहेजें",
    },
  },
};

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: "en",
    interpolation: {
      escapeValue: false,
    },
  });

export default i18n;
