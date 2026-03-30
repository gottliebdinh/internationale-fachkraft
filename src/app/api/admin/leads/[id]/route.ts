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

    const updates: Record<string, unknown> = {};
    if (typeof body.status === "string") updates.status = body.status;
    if (typeof body.notes === "string") updates.notes = body.notes;

    if (Object.keys(updates).length === 0) {
      return NextResponse.json({ error: "Keine Änderungen." }, { status: 400 });
    }

    const { error } = await supabase
      .from("leads")
      .update(updates)
      .eq("id", id);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ ok: true });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unbekannter Fehler";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
