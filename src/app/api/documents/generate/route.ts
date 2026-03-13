import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { generateIHKDocument } from "@/lib/pdf-generator";
import type { MatchWithRelations } from "@/types/database";

export async function POST(request: NextRequest) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();
  const { matchId, documentType } = body;

  if (!matchId || !documentType) {
    return NextResponse.json(
      { error: "matchId and documentType are required" },
      { status: 400 }
    );
  }

  const { data: match, error: matchError } = await supabase
    .from("matches")
    .select(
      `
      *,
      candidate:candidates(*, school:schools(*)),
      job_position:job_positions(*, employer:employers(*))
    `
    )
    .eq("id", matchId)
    .single();

  if (matchError || !match) {
    return NextResponse.json({ error: "Match not found" }, { status: 404 });
  }

  try {
    const documentData = generateIHKDocument(
      match as unknown as MatchWithRelations,
      documentType
    );

    await supabase.from("audit_log").insert({
      user_id: user.id,
      action: "generated_document",
      entity_type: "match_document",
      entity_id: matchId,
      metadata: { document_type: documentType },
    });

    return NextResponse.json({
      success: true,
      document: documentData,
    });
  } catch (error) {
    console.error("Document generation error:", error);
    return NextResponse.json(
      { error: "Failed to generate document" },
      { status: 500 }
    );
  }
}
