import { createAdminClient } from "@/lib/supabase/admin";
import {
  runImportPipeline,
  isSupported,
  type FileInput,
} from "@/lib/candidate-import-pipeline";

export const runtime = "nodejs";
export const maxDuration = 300;

export async function POST(req: Request) {
  const openaiKey = process.env.OPENAI_API_KEY?.trim();
  if (!openaiKey) {
    return new Response("OPENAI_API_KEY fehlt.", { status: 503 });
  }

  const formData = await req.formData();
  const folderName = String(formData.get("folder_name") ?? "Import");

  const files: FileInput[] = [];
  for (const [, value] of formData.entries()) {
    if (!(value instanceof File)) continue;
    if (!isSupported(value.name)) continue;
    const ab = await value.arrayBuffer();
    files.push({
      name: value.name,
      buffer: Buffer.from(ab),
      mime: value.type || "application/octet-stream",
    });
  }

  if (files.length === 0) {
    return new Response("Keine unterstützten Dateien.", { status: 400 });
  }

  const encoder = new TextEncoder();
  const stream = new ReadableStream({
    async start(controller) {
      function emit(event: Record<string, unknown>) {
        controller.enqueue(encoder.encode(`data: ${JSON.stringify(event)}\n\n`));
      }

      try {
        const supabase = createAdminClient();
        await runImportPipeline({
          supabase,
          openaiKey,
          folderName,
          files,
          emit,
        });
      } catch (err) {
        emit({
          type: "error",
          message: err instanceof Error ? err.message : "Unbekannter Fehler",
        });
      } finally {
        controller.close();
      }
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache",
      Connection: "keep-alive",
    },
  });
}
