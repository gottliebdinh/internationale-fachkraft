import { redirect } from "next/navigation";
import { getUserProfile } from "@/lib/supabase/actions";

export default async function DashboardPage() {
  let role: "employer" | "school" | "admin" = "employer";
  try {
    const profile = await getUserProfile();
    if (profile?.role) role = profile.role;
  } catch {
    // Supabase nicht konfiguriert oder Fehler → employer als Fallback
  }
  redirect(`/dashboard/${role}`);
}
