import type { Locale } from "@/types/database";

export const locales: Locale[] = ["de", "vi", "en"];
export const defaultLocale: Locale = "de";

export function getMessages(locale: Locale) {
  switch (locale) {
    case "vi":
      return import("./vi.json").then((m) => m.default);
    case "en":
      return import("./en.json").then((m) => m.default);
    default:
      return import("./de.json").then((m) => m.default);
  }
}
