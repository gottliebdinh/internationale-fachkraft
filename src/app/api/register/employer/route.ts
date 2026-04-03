import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import {
  sendLeadConfirmationEmail,
  sendNewLeadTeamEmail,
} from "@/lib/email";

const INDUSTRY_LABELS: Record<string, string> = {
  hospitality: "Hotellerie / Gastronomie",
  healthcare: "Gesundheitsbranche",
  trade: "Handwerk",
  retail: "Einzelhandel",
  other: "Andere",
  // Legacy-Werte älterer Leads
  hairdressing: "Friseurhandwerk",
  nursing: "Pflege",
};

const SEEKING_LABELS: Record<string, string> = {
  fachkraft: "Fachkraft",
  auszubildender: "Auszubildende/r",
  other: "Andere",
};

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
      seeking_type,
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

    const ind = String(industry ?? "").trim();
    const allowedIndustries = new Set([
      "hospitality",
      "healthcare",
      "trade",
      "retail",
      "other",
    ]);
    if (!allowedIndustries.has(ind)) {
      return jsonError("Ungültige Branche.", 400);
    }

    const seekType = String(seeking_type ?? "").trim();
    const allowedSeeking = new Set([
      "fachkraft",
      "auszubildender",
      "other",
    ]);
    if (!allowedSeeking.has(seekType)) {
      return jsonError("Ungültige Angabe zur Suche.", 400);
    }

    const slotsNum = Math.max(1, Math.floor(Number(slots)) || 1);
    const startDateStr =
      typeof start_date === "string" && start_date.trim()
        ? start_date.trim().slice(0, 10)
        : null;

    const { error: insertErr } = await supabase.from("leads").insert({
      industry: ind,
      industry_other: null,
      seeking_type: seekType,
      seeking_other: null,
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

    const industryDisplay = INDUSTRY_LABELS[ind] ?? ind;

    const seekingDisplay = SEEKING_LABELS[seekType] ?? seekType;

    let startDateDisplay: string | null = null;
    if (startDateStr) {
      const d = new Date(`${startDateStr}T12:00:00`);
      if (!Number.isNaN(d.getTime())) {
        startDateDisplay = d.toLocaleDateString("de-DE", {
          day: "2-digit",
          month: "long",
          year: "numeric",
        });
      } else {
        startDateDisplay = startDateStr;
      }
    }

    try {
      await sendLeadConfirmationEmail({ to: emailTrim, name: nameTrim });
    } catch (emailErr) {
      console.error("[register/employer] email send failed:", emailErr);
    }

    try {
      await sendNewLeadTeamEmail({
        name: nameTrim,
        email: emailTrim,
        phone: phoneTrim,
        industryDisplay,
        seekingDisplay,
        startDateDisplay,
        slots: slotsNum,
      });
    } catch (teamMailErr) {
      console.error("[register/employer] team notify email failed:", teamMailErr);
    }

    return NextResponse.json({ ok: true, email: emailTrim });
  } catch (err) {
    const message =
      err instanceof Error ? err.message : "Unbekannter Fehler";
    return jsonError(message, 500);
  }
}
