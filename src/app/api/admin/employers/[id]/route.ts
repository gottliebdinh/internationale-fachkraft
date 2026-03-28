import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const supabase = createAdminClient();
    const body = await req.json();

    const allowed = [
      "company_name",
      "industry",
      "industry_other",
      "contact_person",
      "phone",
      "email",
      "address",
      "city",
      "plz",
      "trade_license_number",
      "accommodation_type",
      "verified",
    ];

    const update: Record<string, unknown> = {};
    for (const key of allowed) {
      if (key in body) update[key] = body[key];
    }

    if (update.email !== undefined) {
      const em = String(update.email ?? "").trim();
      if (!em) {
        return new NextResponse("E-Mail ist Pflicht.", { status: 400 });
      }
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(em)) {
        return new NextResponse("Bitte eine gültige E-Mail-Adresse angeben.", { status: 400 });
      }
      update.email = em;
    }

    if (Object.keys(update).length === 0) {
      return new NextResponse("Keine Felder zum Aktualisieren.", { status: 400 });
    }

    const { error } = await supabase
      .from("employers")
      .update(update)
      .eq("id", id);

    if (error) return new NextResponse(error.message, { status: 500 });

    return NextResponse.json({ ok: true });
  } catch (err) {
    return new NextResponse(
      err instanceof Error ? err.message : "Unbekannter Fehler",
      { status: 500 }
    );
  }
}

export async function DELETE(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const supabase = createAdminClient();

    const { data: employer, error: fetchErr } = await supabase
      .from("employers")
      .select("user_id")
      .eq("id", id)
      .maybeSingle();

    if (fetchErr) return new NextResponse(fetchErr.message, { status: 500 });
    if (!employer) {
      return new NextResponse("Arbeitgeber nicht gefunden.", { status: 404 });
    }

    const userId = employer.user_id as string;

    const { data: profile } = await supabase
      .from("users")
      .select("role")
      .eq("id", userId)
      .maybeSingle();

    if (!profile) {
      return new NextResponse("Benutzerprofil nicht gefunden.", { status: 404 });
    }
    if (profile.role !== "employer") {
      return new NextResponse(
        "Löschen nur für Arbeitgeber-Konten möglich.",
        { status: 403 }
      );
    }

    // FK ohne ON DELETE CASCADE blockieren sonst löschen von auth.users
    await supabase.from("audit_log").delete().eq("user_id", userId);
    await supabase
      .from("candidate_extractions")
      .update({ verified_by: null })
      .eq("verified_by", userId);
    await supabase
      .from("match_documents")
      .update({ uploaded_by: null })
      .eq("uploaded_by", userId);

    const { error: authErr } = await supabase.auth.admin.deleteUser(userId);
    if (authErr) {
      return new NextResponse(
        authErr.message || "Auth-Benutzer konnte nicht gelöscht werden.",
        { status: 500 }
      );
    }

    return NextResponse.json({ ok: true });
  } catch (err) {
    return new NextResponse(
      err instanceof Error ? err.message : "Unbekannter Fehler",
      { status: 500 }
    );
  }
}
