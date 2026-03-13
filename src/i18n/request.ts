import { getRequestConfig } from "next-intl/server";
import { cookies } from "next/headers";
import type { Locale } from "@/types/database";

export default getRequestConfig(async () => {
  const cookieStore = await cookies();
  const locale = (cookieStore.get("locale")?.value as Locale) || "de";

  return {
    locale,
    messages: (await import(`./${locale}.json`)).default,
  };
});
