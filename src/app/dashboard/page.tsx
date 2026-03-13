import { redirect } from "next/navigation";
import { getUserProfile } from "@/lib/supabase/actions";

export default async function DashboardPage() {
  const profile = await getUserProfile();

  if (!profile) {
    redirect("/auth/login");
  }

  redirect(`/dashboard/${profile.role}`);
}
