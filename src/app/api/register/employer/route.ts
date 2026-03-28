import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import {
  generateEmployerInviteActionLink,
  sendEmployerInviteEmail,
} from "@/lib/employer-invite";

const TRAINEE_KEYS = new Set(["trainee_h", "trainee_f", "trainee_n", "trainee"]);

const POSITION_LABELS: Record<string, string> = {
  chef: "Koch / Köchin",
  service: "Servicekraft",
  hotel: "Hotelfachkraft",
  trainee_h: "Auszubildende/r",
  hairdresser: "Friseur/in",
  trainee_f: "Auszubildende/r",
  salon: "Salon-Assistent/in",
  nurse: "Pflegefachkraft",
  assistant: "Pflegehelfer/in",
  trainee_n: "Auszubildende/r Pflege",
  specialist: "Fachkraft",
  trainee: "Auszubildende/r",
};

function jsonError(message: string, status: number, extra?: Record<string, unknown>) {
  console.error("[register/employer]", status, message, extra ?? "");
  return NextResponse.json({ error: message, ...extra }, { status });
}

export async function POST(req: Request) {
  let userIdForRollback: string | null = null;

  try {
    const supabase = createAdminClient();
    const body = await req.json();

    const {
      email,
      company_name,
      industry,
      industry_other,
      contact_person,
      address,
      city,
      plz,
      phone,
      position_types,
      position_custom,
      slots_total,
      start_date,
    } = body;

    const emailTrim = String(email ?? "").trim().toLowerCase();
    if (!emailTrim || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailTrim)) {
      return jsonError("Bitte eine gültige E-Mail-Adresse angeben.", 400);
    }

    const phoneTrim = String(phone ?? "").trim();
    if (phoneTrim.length < 6) {
      return jsonError("Bitte geben Sie eine gültige Telefonnummer ein.", 400);
    }

    if (!String(company_name ?? "").trim()) {
      return jsonError("Firmenname ist Pflicht.", 400);
    }

    const ind = (industry as string) || "other";
    if (ind === "other" && !String(industry_other ?? "").trim()) {
      return jsonError("Bitte geben Sie Ihre Branche ein.", 400);
    }

    if (!String(contact_person ?? "").trim()) {
      return jsonError("Kontaktperson ist Pflicht.", 400);
    }

    if (!String(address ?? "").trim()) {
      return jsonError("Adresse ist Pflicht.", 400);
    }
    if (!String(city ?? "").trim()) {
      return jsonError("Stadt ist Pflicht.", 400);
    }
    if (!String(plz ?? "").trim()) {
      return jsonError("PLZ ist Pflicht.", 400);
    }

    const { data: authData, error: authError } =
      await supabase.auth.admin.createUser({
        email: emailTrim,
        email_confirm: false,
        user_metadata: { must_set_password: true },
      });

    if (authError) {
      const msg = authError.message ?? "";
      if (
        msg.includes("already been registered") ||
        msg.includes("already registered") ||
        msg.includes("User already registered")
      ) {
        return jsonError("Diese E-Mail-Adresse ist bereits registriert.", 409);
      }
      return jsonError(msg || "Auth: Benutzer konnte nicht angelegt werden.", 500, {
        code: authError.code,
      });
    }

    const userId = authData.user?.id;
    if (!userId) {
      return jsonError("Auth: Keine Benutzer-ID zurückgegeben.", 500);
    }
    userIdForRollback = userId;

    // Trigger legt public.users an; falls Trigger fehlt (leeres Projekt), nachziehen.
    const { data: existingProfile } = await supabase
      .from("users")
      .select("id")
      .eq("id", userId)
      .maybeSingle();

    if (!existingProfile) {
      const { error: profileErr } = await supabase.from("users").insert({
        id: userId,
        email: emailTrim,
        role: "employer",
      });
      if (profileErr) {
        await supabase.auth.admin.deleteUser(userId);
        userIdForRollback = null;
        return jsonError(
          profileErr.message || "Profil konnte nicht angelegt werden.",
          500,
          { code: profileErr.code, hint: profileErr.hint }
        );
      }
    }

    const { data: employer, error: empErr } = await supabase
      .from("employers")
      .insert({
        user_id: userId,
        company_name: String(company_name).trim(),
        industry: ind,
        industry_other:
          ind === "other" ? String(industry_other ?? "").trim() || null : null,
        contact_person: String(contact_person).trim(),
        phone: phoneTrim,
        email: emailTrim,
        address: String(address).trim(),
        city: String(city).trim(),
        plz: String(plz).trim(),
        accommodation_type: "none",
      })
      .select("id")
      .single();

    if (empErr) {
      await supabase.auth.admin.deleteUser(userId);
      userIdForRollback = null;
      return jsonError(empErr.message || "Arbeitgeber konnte nicht gespeichert werden.", 500, {
        code: empErr.code,
        hint: empErr.hint,
        details: empErr.details,
      });
    }

    const types = Array.isArray(position_types) ? position_types : [];
    const custom = String(position_custom ?? "").trim();
    const title =
      custom ||
      (types.length > 0
        ? POSITION_LABELS[types[0]] ?? types[0]
        : "Allgemeine Stelle");
    const posType = types.some((t: string) => TRAINEE_KEYS.has(t))
      ? "apprenticeship"
      : "skilled_worker";
    const slotsNum = Math.max(1, Math.floor(Number(slots_total)) || 1);
    const startDateStr =
      typeof start_date === "string" && start_date.trim()
        ? start_date.trim().slice(0, 10)
        : new Date().toISOString().slice(0, 10);

    const { error: jpErr } = await supabase.from("job_positions").insert({
      employer_id: employer.id,
      title,
      position_type: posType,
      specialization: ind,
      description: "",
      start_date: startDateStr,
      urgency: "flexible",
      slots_total: slotsNum,
      status: "active",
    });

    if (jpErr) {
      await supabase.from("employers").delete().eq("id", employer.id);
      await supabase.auth.admin.deleteUser(userId);
      userIdForRollback = null;
      return jsonError(jpErr.message || "Stelle konnte nicht angelegt werden.", 500, {
        code: jpErr.code,
        hint: jpErr.hint,
        details: jpErr.details,
      });
    }

    const linkResult = await generateEmployerInviteActionLink(
      supabase,
      emailTrim
    );
    if ("error" in linkResult) {
      await supabase.from("job_positions").delete().eq("employer_id", employer.id);
      await supabase.from("employers").delete().eq("id", employer.id);
      await supabase.auth.admin.deleteUser(userId);
      userIdForRollback = null;
      return jsonError(linkResult.error, 500);
    }

    const sent = await sendEmployerInviteEmail({
      to: emailTrim,
      actionLink: linkResult.actionLink,
      companyName: String(company_name).trim(),
    });
    if (!sent.ok) {
      await supabase.from("job_positions").delete().eq("employer_id", employer.id);
      await supabase.from("employers").delete().eq("id", employer.id);
      await supabase.auth.admin.deleteUser(userId);
      userIdForRollback = null;
      return jsonError(sent.error, 500);
    }

    userIdForRollback = null;
    return NextResponse.json({
      employer_id: employer.id,
      email: emailTrim,
    });
  } catch (err) {
    if (userIdForRollback) {
      try {
        const supabase = createAdminClient();
        await supabase.auth.admin.deleteUser(userIdForRollback);
      } catch {
        // ignore cleanup errors
      }
    }
    const message =
      err instanceof Error ? err.message : "Unbekannter Fehler";
    if (message.includes("SUPABASE_SERVICE_ROLE_KEY")) {
      return jsonError(
        "Server: SUPABASE_SERVICE_ROLE_KEY oder NEXT_PUBLIC_SUPABASE_URL fehlt.",
        503
      );
    }
    return jsonError(message, 500);
  }
}
