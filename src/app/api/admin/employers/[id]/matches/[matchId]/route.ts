import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";

/**
 * Entfernt die Zuordnung eines Kandidaten zu einer Stelle (Match löschen).
 */
export async function DELETE(
  _req: Request,
  { params }: { params: Promise<{ id: string; matchId: string }> }
) {
  try {
    const { id: employerId, matchId } = await params;
    const supabase = createAdminClient();

    const { data: match, error: fetchErr } = await supabase
      .from("matches")
      .select("id, job_position_id")
      .eq("id", matchId)
      .maybeSingle();

    if (fetchErr) return new NextResponse(fetchErr.message, { status: 500 });
    if (!match) {
      return new NextResponse("Zuordnung nicht gefunden.", { status: 404 });
    }

    const { data: jpData } = await supabase
      .from("job_positions")
      .select("id")
      .eq("id", match.job_position_id)
      .eq("employer_id", employerId)
      .maybeSingle();

    if (!jpData) {
      return new NextResponse("Zuordnung nicht gefunden.", { status: 404 });
    }

    const { error: delErr } = await supabase.from("matches").delete().eq("id", matchId);

    if (delErr) return new NextResponse(delErr.message, { status: 500 });

    return NextResponse.json({ ok: true });
  } catch (err) {
    return new NextResponse(
      err instanceof Error ? err.message : "Unbekannter Fehler",
      { status: 500 }
    );
  }
}
