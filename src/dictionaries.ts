import "server-only";

const dictionaries = {
  fr: () => import("./dictionaries/fr.json").then((module) => module.default),
  en: () => import("./dictionaries/en.json").then((module) => module.default),
  ar: () => import("./dictionaries/ar.json").then((module) => module.default),
};

export type Locale = "fr" | "en" | "ar";

export const getDictionary = async (locale: Locale) => {
  // Fallback to French if the locale is not supported
  const loadDict = dictionaries[locale] || dictionaries.fr;
  return loadDict();
};
