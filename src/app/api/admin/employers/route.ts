import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import {
  generateEmployerInviteActionLink,
  sendEmployerInviteEmail,
} from "@/lib/employer-invite";

type PositionInput = {
  title?: string;
  position_type?: string;
  slots_total?: number;
  start_date?: string;
};

export async function POST(req: Request) {
  let userIdForRollback: string | null = null;

  try {
    const supabase = createAdminClient();
    const body = await req.json();

    const {
      company_name,
      industry,
      industry_other,
      contact_person,
      phone,
      email,
      address,
      city,
      plz,
      trade_license_number,
      accommodation_type,
      initial_position,
      initial_positions,
    } = body;

    if (!company_name?.trim()) {
      return new NextResponse("Firmenname ist Pflicht.", { status: 400 });
    }

    const ind = (industry as string) || "other";
    if (ind === "other" && !(industry_other as string)?.trim()) {
      return new NextResponse("Branche (Freitext) ist Pflicht.", { status: 400 });
    }

    if (!(contact_person as string)?.trim()) {
      return new NextResponse("Kontaktperson ist Pflicht.", { status: 400 });
    }
    if (!(phone as string)?.trim()) {
      return new NextResponse("Telefon ist Pflicht.", { status: 400 });
    }
    const emailTrim = String(email ?? "").trim();
    if (!emailTrim) {
      return new NextResponse("E-Mail ist Pflicht.", { status: 400 });
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailTrim)) {
      return new NextResponse("Bitte eine gültige E-Mail-Adresse angeben.", { status: 400 });
    }
    if (!(address as string)?.trim()) {
      return new NextResponse("Adresse ist Pflicht.", { status: 400 });
    }
    if (!(city as string)?.trim()) {
      return new NextResponse("Stadt ist Pflicht.", { status: 400 });
    }
    if (!(plz as string)?.trim()) {
      return new NextResponse("PLZ ist Pflicht.", { status: 400 });
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
        return new NextResponse("Diese E-Mail-Adresse ist bereits registriert.", {
          status: 409,
        });
      }
      return new NextResponse(msg || "Auth: Benutzer konnte nicht angelegt werden.", {
        status: 500,
      });
    }

    const userId = authData.user?.id;
    if (!userId) {
      return new NextResponse("Auth: Keine Benutzer-ID zurückgegeben.", { status: 500 });
    }
    userIdForRollback = userId;

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
        return new NextResponse(
          profileErr.message || "Profil konnte nicht angelegt werden.",
          { status: 500 }
        );
      }
    }

    const { data: employer, error } = await supabase
      .from("employers")
      .insert({
        user_id: userId,
        company_name: company_name.trim(),
        industry: ind,
        industry_other: ind === "other" ? (industry_other?.trim() || null) : null,
        contact_person: (contact_person as string).trim(),
        phone: (phone as string).trim(),
        email: emailTrim,
        address: (address as string).trim(),
        city: (city as string).trim(),
        plz: (plz as string).trim(),
        trade_license_number: trade_license_number?.trim() || null,
        accommodation_type: accommodation_type || "none",
      })
      .select("id")
      .single();

    if (error) {
      await supabase.auth.admin.deleteUser(userId);
      userIdForRollback = null;
      return new NextResponse(error.message, { status: 500 });
    }

    const rawPositions: PositionInput[] = [];
    if (Array.isArray(initial_positions)) {
      rawPositions.push(...initial_positions);
    } else if (initial_position && typeof initial_position === "object") {
      rawPositions.push(initial_position as PositionInput);
    }

    const validPositions = rawPositions.filter(
      (ip) => ip.title && String(ip.title).trim().length >= 2
    );

    if (validPositions.length > 0) {
      const rows = validPositions.map((ip) => ({
        employer_id: employer.id,
        title: String(ip.title).trim(),
        position_type: ["apprenticeship", "skilled_worker", "seasonal"].includes(
          String(ip.position_type)
        )
          ? ip.position_type!
          : "skilled_worker",
        specialization: ind,
        description: "",
        start_date:
          typeof ip.start_date === "string" && ip.start_date.trim()
            ? ip.start_date.trim().slice(0, 10)
            : new Date().toISOString().slice(0, 10),
        urgency: "flexible",
        slots_total: Math.max(1, Math.floor(Number(ip.slots_total)) || 1),
        status: "active",
      }));

      const { error: jpErr } = await supabase.from("job_positions").insert(rows);
      if (jpErr) {
        await supabase.from("employers").delete().eq("id", employer.id);
        await supabase.auth.admin.deleteUser(userId);
        userIdForRollback = null;
        return new NextResponse(jpErr.message, { status: 500 });
      }
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
      return new NextResponse(linkResult.error, { status: 500 });
    }

    const sent = await sendEmployerInviteEmail({
      to: emailTrim,
      actionLink: linkResult.actionLink,
      companyName: company_name.trim(),
    });
    if (!sent.ok) {
      await supabase.from("job_positions").delete().eq("employer_id", employer.id);
      await supabase.from("employers").delete().eq("id", employer.id);
      await supabase.auth.admin.deleteUser(userId);
      userIdForRollback = null;
      return new NextResponse(sent.error, { status: 500 });
    }

    userIdForRollback = null;
    return NextResponse.json({ id: employer.id });
  } catch (err) {
    if (userIdForRollback) {
      try {
        const supabase = createAdminClient();
        await supabase.auth.admin.deleteUser(userIdForRollback);
      } catch {
        // ignore
      }
    }
    const message =
      err instanceof Error ? err.message : "Unbekannter Fehler";
    if (message.includes("SUPABASE_SERVICE_ROLE_KEY")) {
      return new NextResponse(
        "Server: SUPABASE_SERVICE_ROLE_KEY oder NEXT_PUBLIC_SUPABASE_URL fehlt.",
        { status: 503 }
      );
    }
    return new NextResponse(message, { status: 500 });
  }
}
