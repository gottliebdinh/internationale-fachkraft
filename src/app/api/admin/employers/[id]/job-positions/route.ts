import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";

const POSITION_TYPES = ["apprenticeship", "skilled_worker", "seasonal"] as const;

export async function POST(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: employerId } = await params;
    const supabase = createAdminClient();
    const body = await req.json();

    const title = typeof body.title === "string" ? body.title.trim() : "";
    const position_type = body.position_type;
    const slots_total = Number(body.slots_total);
    let start_date =
      typeof body.start_date === "string" && body.start_date.trim()
        ? body.start_date.trim().slice(0, 10)
        : new Date().toISOString().slice(0, 10);
    if (title.length < 2) {
      return new NextResponse("Stellentitel ist Pflicht (min. 2 Zeichen).", {
        status: 400,
      });
    }
    if (!POSITION_TYPES.includes(position_type)) {
      return new NextResponse("Ungültige Positionsart.", { status: 400 });
    }
    if (!Number.isFinite(slots_total) || slots_total < 1) {
      return new NextResponse("Anzahl Plätze muss mindestens 1 sein.", {
        status: 400,
      });
    }

    const { data: employer, error: empErr } = await supabase
      .from("employers")
      .select("id, industry")
      .eq("id", employerId)
      .single();

    if (empErr || !employer) {
      return new NextResponse("Unternehmen nicht gefunden.", { status: 404 });
    }

    const { data: row, error } = await supabase
      .from("job_positions")
      .insert({
        employer_id: employerId,
        title,
        position_type,
        specialization: employer.industry,
        description: "",
        start_date,
        urgency: "flexible",
        slots_total: Math.floor(slots_total),
        status: "active",
      })
      .select("id")
      .single();

    if (error) return new NextResponse(error.message, { status: 500 });

    return NextResponse.json({ id: row.id });
  } catch (err) {
    return new NextResponse(
      err instanceof Error ? err.message : "Unbekannter Fehler",
      { status: 500 }
    );
  }
}
