import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";

export async function POST(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: employerId } = await params;
    const supabase = createAdminClient();
    const body = await req.json();

    const { candidate_id, job_position_id: requestedJpId } = body;
    if (!candidate_id) {
      return new NextResponse("candidate_id ist Pflicht.", { status: 400 });
    }

    const { data: employer } = await supabase
      .from("employers")
      .select("id, industry")
      .eq("id", employerId)
      .single();

    if (!employer) {
      return new NextResponse("Unternehmen nicht gefunden.", { status: 404 });
    }

    let jobPosition: { id: string } | null = null;

    if (requestedJpId && typeof requestedJpId === "string") {
      const { data: jp } = await supabase
        .from("job_positions")
        .select("id, slots_total")
        .eq("id", requestedJpId)
        .eq("employer_id", employerId)
        .maybeSingle();

      if (!jp) {
        return new NextResponse("Stelle nicht gefunden.", { status: 404 });
      }

      const { count } = await supabase
        .from("matches")
        .select("id", { count: "exact", head: true })
        .eq("job_position_id", jp.id);

      if ((count ?? 0) >= jp.slots_total) {
        return new NextResponse("Für diese Stelle sind alle Plätze vergeben.", {
          status: 409,
        });
      }

      jobPosition = { id: jp.id };
    }

    if (!jobPosition) {
      const { data: allJp } = await supabase
        .from("job_positions")
        .select("id, slots_total")
        .eq("employer_id", employerId);

      if (allJp && allJp.length > 0) {
        for (const jp of allJp) {
          const { count } = await supabase
            .from("matches")
            .select("id", { count: "exact", head: true })
            .eq("job_position_id", jp.id);

          if ((count ?? 0) < jp.slots_total) {
            jobPosition = { id: jp.id };
            break;
          }
        }
      }
    }

    if (!jobPosition) {
      const { data: hasAnyJp } = await supabase
        .from("job_positions")
        .select("id")
        .eq("employer_id", employerId)
        .limit(1)
        .maybeSingle();

      if (hasAnyJp) {
        return new NextResponse("Alle Stellen sind voll besetzt.", { status: 409 });
      }

      const { data: newJp, error: jpError } = await supabase
        .from("job_positions")
        .insert({
          employer_id: employerId,
          title: "Allgemeine Stelle",
          position_type: "skilled_worker",
          specialization: employer.industry,
          description: "",
          start_date: new Date().toISOString().slice(0, 10),
          status: "active",
        })
        .select("id")
        .single();

      if (jpError) return new NextResponse(jpError.message, { status: 500 });
      jobPosition = newJp;
    }

    const { data: existingMatch } = await supabase
      .from("matches")
      .select("id")
      .eq("candidate_id", candidate_id)
      .eq("job_position_id", jobPosition!.id)
      .maybeSingle();

    if (existingMatch) {
      return new NextResponse("Kandidat ist bereits zugeordnet.", { status: 409 });
    }

    const { data: match, error: matchError } = await supabase
      .from("matches")
      .insert({
        candidate_id,
        job_position_id: jobPosition!.id,
        initiated_by: "admin",
        status: "employer_accepted",
      })
      .select("id")
      .single();

    if (matchError) return new NextResponse(matchError.message, { status: 500 });

    return NextResponse.json({ match_id: match.id });
  } catch (err) {
    return new NextResponse(
      err instanceof Error ? err.message : "Unbekannter Fehler",
      { status: 500 }
    );
  }
}

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await params;
    const supabase = createAdminClient();
    const body = await req.json();

    const { match_id, status } = body;
    if (!match_id || !status) {
      return new NextResponse("match_id und status sind Pflicht.", { status: 400 });
    }

    const VALID_STATUSES = [
      "employer_accepted",
      "both_accepted",
      "ihk_submitted",
      "visa_applied",
      "visa_granted",
      "arrived",
    ];

    if (!VALID_STATUSES.includes(status)) {
      return new NextResponse(`Ungültiger Status: ${status}`, { status: 400 });
    }

    const { error } = await supabase
      .from("matches")
      .update({ status })
      .eq("id", match_id);

    if (error) return new NextResponse(error.message, { status: 500 });

    return NextResponse.json({ ok: true });
  } catch (err) {
    return new NextResponse(
      err instanceof Error ? err.message : "Unbekannter Fehler",
      { status: 500 }
    );
  }
}
