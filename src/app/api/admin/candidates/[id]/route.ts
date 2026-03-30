import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { createAdminClient } from "@/lib/supabase/admin";

const BUCKET = "candidate-docs";

export async function DELETE(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const supabase = createAdminClient();

    const { data: candidate, error: fetchErr } = await supabase
      .from("candidates")
      .select("id, profile_photo_url")
      .eq("id", id)
      .maybeSingle();

    if (fetchErr) return new NextResponse(fetchErr.message, { status: 500 });
    if (!candidate) {
      return new NextResponse("Kandidat nicht gefunden.", { status: 404 });
    }

    const { data: docs } = await supabase
      .from("candidate_documents")
      .select("storage_path")
      .eq("candidate_id", id);

    const paths = new Set<string>();
    for (const row of docs ?? []) {
      const p = row.storage_path as string | null;
      if (p) paths.add(p);
    }
    const profilePath = candidate.profile_photo_url as string | null;
    if (profilePath) paths.add(profilePath);

    const toRemove = [...paths];
    if (toRemove.length > 0) {
      const chunk = 100;
      for (let i = 0; i < toRemove.length; i += chunk) {
        const slice = toRemove.slice(i, i + chunk);
        await supabase.storage.from(BUCKET).remove(slice);
      }
    }

    const { error: delErr } = await supabase.from("candidates").delete().eq("id", id);

    if (delErr) return new NextResponse(delErr.message, { status: 500 });

    revalidatePath("/admin/candidates");
    revalidatePath(`/admin/candidates/${id}`);

    return NextResponse.json({ ok: true });
  } catch (err) {
    return new NextResponse(
      err instanceof Error ? err.message : "Unbekannter Fehler",
      { status: 500 }
    );
  }
}
