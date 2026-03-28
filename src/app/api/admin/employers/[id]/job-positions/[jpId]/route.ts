import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";

const POSITION_TYPES = ["apprenticeship", "skilled_worker", "seasonal"] as const;

async function assertJobPosition(
  supabase: ReturnType<typeof createAdminClient>,
  employerId: string,
  jpId: string
) {
  const { data, error } = await supabase
    .from("job_positions")
    .select("id, employer_id")
    .eq("id", jpId)
    .single();

  if (error || !data || data.employer_id !== employerId) {
    return null;
  }
  return data;
}

export async function PATCH(
  req: Request,
  {
    params,
  }: { params: Promise<{ id: string; jpId: string }> }
) {
  try {
    const { id: employerId, jpId } = await params;
    const supabase = createAdminClient();
    const jp = await assertJobPosition(supabase, employerId, jpId);
    if (!jp) {
      return new NextResponse("Stelle nicht gefunden.", { status: 404 });
    }

    const body = await req.json();
    const patch: Record<string, unknown> = {};

    if (typeof body.title === "string") {
      const t = body.title.trim();
      if (t.length < 2) {
        return new NextResponse("Stellentitel zu kurz.", { status: 400 });
      }
      patch.title = t;
    }
    if (body.position_type !== undefined) {
      if (!POSITION_TYPES.includes(body.position_type)) {
        return new NextResponse("Ungültige Positionsart.", { status: 400 });
      }
      patch.position_type = body.position_type;
    }
    if (body.slots_total !== undefined) {
      const n = Number(body.slots_total);
      if (!Number.isFinite(n) || n < 1) {
        return new NextResponse("Anzahl Plätze ungültig.", { status: 400 });
      }
      patch.slots_total = Math.floor(n);
    }
    if (typeof body.start_date === "string" && body.start_date.trim()) {
      patch.start_date = body.start_date.trim().slice(0, 10);
    }

    if (Object.keys(patch).length === 0) {
      return new NextResponse("Keine Aenderungen.", { status: 400 });
    }

    const { error } = await supabase
      .from("job_positions")
      .update(patch)
      .eq("id", jpId);

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
  {
    params,
  }: { params: Promise<{ id: string; jpId: string }> }
) {
  try {
    const { id: employerId, jpId } = await params;
    const supabase = createAdminClient();
    const jp = await assertJobPosition(supabase, employerId, jpId);
    if (!jp) {
      return new NextResponse("Stelle nicht gefunden.", { status: 404 });
    }

    const { count, error: countErr } = await supabase
      .from("matches")
      .select("id", { count: "exact", head: true })
      .eq("job_position_id", jpId);

    if (countErr) return new NextResponse(countErr.message, { status: 500 });
    if ((count ?? 0) > 0) {
      return new NextResponse(
        "Stelle kann nicht gelöscht werden: Es gibt noch zugeordnete Kandidaten.",
        { status: 409 }
      );
    }

    const { error } = await supabase.from("job_positions").delete().eq("id", jpId);
    if (error) return new NextResponse(error.message, { status: 500 });

    return NextResponse.json({ ok: true });
  } catch (err) {
    return new NextResponse(
      err instanceof Error ? err.message : "Unbekannter Fehler",
      { status: 500 }
    );
  }
}
