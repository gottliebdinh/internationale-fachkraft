import { NextResponse } from "next/server";
import sharp from "sharp";
import { createAdminClient } from "@/lib/supabase/admin";

const BUCKET = "candidate-docs";
const MAX_DIMENSION = 1600;
const WEBP_QUALITY = 78;

export async function POST(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const supabase = createAdminClient();

    const formData = await req.formData();
    const input = formData.get("file");
    if (!(input instanceof File)) {
      return new NextResponse("Keine Datei gefunden.", { status: 400 });
    }
    if (!input.type.startsWith("image/")) {
      return new NextResponse("Nur Bilddateien erlaubt.", { status: 400 });
    }

    const original = Buffer.from(await input.arrayBuffer());
    const optimized = await sharp(original)
      .rotate()
      .resize({
        width: MAX_DIMENSION,
        height: MAX_DIMENSION,
        fit: "inside",
        withoutEnlargement: true,
      })
      .webp({ quality: WEBP_QUALITY })
      .toBuffer();

    const storagePath = `${id}/photo/manual-${Date.now()}.webp`;

    const { error: uploadError } = await supabase.storage
      .from(BUCKET)
      .upload(storagePath, optimized, {
        contentType: "image/webp",
        upsert: false,
      });

    if (uploadError) {
      return new NextResponse(uploadError.message, { status: 500 });
    }

    const publicUrl = supabase.storage.from(BUCKET).getPublicUrl(storagePath).data
      .publicUrl;

    const { error: updateError } = await supabase
      .from("candidates")
      .update({ profile_photo_url: storagePath })
      .eq("id", id);

    if (updateError) {
      return new NextResponse(updateError.message, { status: 500 });
    }

    await supabase.from("candidate_documents").insert({
      candidate_id: id,
      document_type: "photo",
      file_url: publicUrl,
      file_name: input.name || "clipboard-image",
      original_file_name: input.name || "clipboard-image",
      file_size_bytes: optimized.byteLength,
      mime_type: "image/webp",
      storage_path: storagePath,
      extracted_data: null,
      extraction_status: "skipped",
      extraction_model: null,
      extraction_error: null,
    });

    return NextResponse.json({ ok: true, storagePath });
  } catch (err) {
    return new NextResponse(
      err instanceof Error ? err.message : "Unbekannter Fehler",
      { status: 500 }
    );
  }
}

