import { NextResponse } from "next/server";
import { z } from "zod";
import { sendContactFormEmail } from "@/lib/email";

const bodySchema = z.object({
  name: z.string().min(2).max(200),
  email: z.string().email().max(320),
  subject: z.string().min(2).max(300),
  message: z.string().min(10).max(20_000),
});

export async function POST(req: Request) {
  if (!process.env.RESEND_API_KEY?.trim()) {
    return NextResponse.json(
      { error: "E-Mail-Versand ist nicht konfiguriert." },
      { status: 503 }
    );
  }

  try {
    const json = await req.json();
    const parsed = bodySchema.safeParse(json);
    if (!parsed.success) {
      return NextResponse.json(
        { error: "Bitte prüfen Sie Ihre Eingaben." },
        { status: 400 }
      );
    }

    await sendContactFormEmail(parsed.data);
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("[api/contact]", err);
    return NextResponse.json(
      { error: "Die Nachricht konnte nicht gesendet werden. Bitte versuchen Sie es später erneut." },
      { status: 500 }
    );
  }
}
