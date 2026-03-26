import { getOpenAI } from "@/lib/openai";
import { EXTRACTION_PROMPTS } from "./prompts";
import { extractionSchemas, isExtractable } from "./schemas";
import type { DocumentType } from "@/types/database";
import fs from "node:fs/promises";
import path from "node:path";

const MODEL = "gpt-4o";

function mimeForExt(ext: string): string {
  const map: Record<string, string> = {
    ".pdf": "application/pdf",
    ".jpg": "image/jpeg",
    ".jpeg": "image/jpeg",
    ".png": "image/png",
    ".webp": "image/webp",
  };
  return map[ext.toLowerCase()] ?? "application/octet-stream";
}

export async function extractFromFile(
  filePath: string,
  documentType: DocumentType
): Promise<{
  data: Record<string, unknown> | null;
  model: string;
  error: string | null;
}> {
  if (!isExtractable(documentType)) {
    return { data: null, model: MODEL, error: null };
  }

  const ext = path.extname(filePath).toLowerCase();
  const mime = mimeForExt(ext);

  const fileBuffer = await fs.readFile(filePath);
  const base64 = fileBuffer.toString("base64");
  const dataUrl = `data:${mime};base64,${base64}`;

  const prompt = EXTRACTION_PROMPTS[documentType];
  const schema = extractionSchemas[documentType];

  try {
    const openai = getOpenAI();
    const response = await openai.chat.completions.create({
      model: MODEL,
      messages: [
        {
          role: "user",
          content: [
            { type: "text", text: prompt },
            { type: "image_url", image_url: { url: dataUrl, detail: "high" } },
          ],
        },
      ],
      max_tokens: 2000,
      temperature: 0,
    });

    const raw = response.choices[0]?.message?.content ?? "";

    const jsonMatch = raw.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      return { data: null, model: MODEL, error: `No JSON found in response: ${raw.slice(0, 200)}` };
    }

    const parsed = JSON.parse(jsonMatch[0]);
    const validated = schema.parse(parsed);

    return { data: validated as Record<string, unknown>, model: MODEL, error: null };
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    return { data: null, model: MODEL, error: msg };
  }
}
