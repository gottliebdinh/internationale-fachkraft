import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import {
  fetchAuthUserForEmployer,
  getEmployerAccountAuthStatus,
} from "@/lib/employer-auth-account-status";

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const admin = createAdminClient();

  const { data: employer, error } = await admin
    .from("employers")
    .select("user_id")
    .eq("id", id)
    .maybeSingle();

  if (error || !employer) {
    return NextResponse.json({ error: "Nicht gefunden." }, { status: 404 });
  }

  const user = await fetchAuthUserForEmployer(admin, employer.user_id);
  const status = getEmployerAccountAuthStatus(user);
  return NextResponse.json(status);
}
