import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { sendLeadConfirmationEmail } from "@/lib/email";

function jsonError(message: string, status: number) {
  console.error("[register/employer]", status, message);
  return NextResponse.json({ error: message }, { status });
}

export async function POST(req: Request) {
  try {
    const supabase = createAdminClient();
    const body = await req.json();

    const {
      industry,
      industry_other,
      seeking_type,
      seeking_other,
      start_date,
      slots,
      name,
      email,
      phone,
    } = body;

    const nameTrim = String(name ?? "").trim();
    if (nameTrim.length < 2) {
      return jsonError("Bitte geben Sie Ihren Namen ein.", 400);
    }

    const emailTrim = String(email ?? "").trim().toLowerCase();
    if (!emailTrim || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailTrim)) {
      return jsonError("Bitte eine gültige E-Mail-Adresse angeben.", 400);
    }

    const phoneTrim = String(phone ?? "").trim();
    if (phoneTrim.length < 6) {
      return jsonError("Bitte geben Sie eine gültige Telefonnummer ein.", 400);
    }

    const ind = String(industry ?? "other").trim();
    if (ind === "other" && !String(industry_other ?? "").trim()) {
      return jsonError("Bitte geben Sie Ihre Branche ein.", 400);
    }

    const seekType = String(seeking_type ?? "").trim();
    if (!seekType) {
      return jsonError("Bitte geben Sie an, wonach Sie suchen.", 400);
    }
    if (seekType === "other" && !String(seeking_other ?? "").trim()) {
      return jsonError("Bitte beschreiben Sie, wonach Sie suchen.", 400);
    }

    const slotsNum = Math.max(1, Math.floor(Number(slots)) || 1);
    const startDateStr =
      typeof start_date === "string" && start_date.trim()
        ? start_date.trim().slice(0, 10)
        : null;

    const { error: insertErr } = await supabase.from("leads").insert({
      industry: ind,
      industry_other:
        ind === "other" ? String(industry_other ?? "").trim() || null : null,
      seeking_type: seekType,
      seeking_other:
        seekType === "other"
          ? String(seeking_other ?? "").trim() || null
          : null,
      start_date: startDateStr,
      slots: slotsNum,
      name: nameTrim,
      email: emailTrim,
      phone: phoneTrim,
      status: "new",
    });

    if (insertErr) {
      return jsonError(
        insertErr.message || "Lead konnte nicht gespeichert werden.",
        500
      );
    }

    try {
      await sendLeadConfirmationEmail({ to: emailTrim, name: nameTrim });
    } catch (emailErr) {
      console.error("[register/employer] email send failed:", emailErr);
    }

    return NextResponse.json({ ok: true, email: emailTrim });
  } catch (err) {
    const message =
      err instanceof Error ? err.message : "Unbekannter Fehler";
    return jsonError(message, 500);
  }
}
