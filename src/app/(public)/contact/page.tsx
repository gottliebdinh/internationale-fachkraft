"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Mail, Phone, MapPin, Send, CheckCircle2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import {
  CONTACT_EMAIL,
  CONTACT_PHONE_DISPLAY,
  CONTACT_PHONE_TEL,
  LEGAL_ADDRESS_LINES,
  LEGAL_ENTITY_NAME,
} from "@/lib/contact-info";

const contactSchema = z.object({
  name: z.string().min(2, "Name muss mindestens 2 Zeichen lang sein"),
  email: z.email("Bitte geben Sie eine gültige E-Mail-Adresse ein"),
  subject: z
    .string()
    .min(2, "Bitte geben Sie einen Betreff ein (mindestens 2 Zeichen)"),
  message: z.string().min(10, "Nachricht muss mindestens 10 Zeichen lang sein"),
});

type ContactFormData = z.infer<typeof contactSchema>;

export default function ContactPage() {
  const [submitted, setSubmitted] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ContactFormData>({
    resolver: zodResolver(contactSchema),
    defaultValues: {
      name: "",
      email: "",
      subject: "",
      message: "",
    },
  });

  async function onSubmit(data: ContactFormData) {
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const json = await res.json().catch(() => ({}));
      if (!res.ok) {
        toast.error(
          typeof json.error === "string"
            ? json.error
            : "Versand fehlgeschlagen."
        );
        return;
      }
      setSubmitted(true);
    } catch {
      toast.error(
        "Verbindungsfehler. Bitte prüfen Sie Ihre Internetverbindung und versuchen Sie es erneut."
      );
    }
  }

  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-br from-primary/5 via-background to-accent/5">
        <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 sm:py-28 lg:px-8">
          <div className="text-center max-w-3xl mx-auto">
            <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
              Sprechen Sie{" "}
              <span className="text-accent">mit uns</span>
            </h1>
            <p className="mt-6 text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              Haben Sie Fragen zur Plattform, zum Vermittlungsprozess oder
              möchten Sie eine Partnerschaft anfragen? Wir freuen uns auf Ihre
              Nachricht.
            </p>
          </div>
        </div>
      </section>

      {/* Contact form + sidebar */}
      <section className="py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 gap-12 lg:grid-cols-3">
            {/* Form */}
            <div className="lg:col-span-2">
              {submitted ? (
                <Card className="border-0 shadow-sm">
                  <CardContent className="flex flex-col items-center justify-center py-20">
                    <CheckCircle2 className="h-16 w-16 text-accent mb-6" />
                    <h2 className="text-2xl font-bold mb-2">
                      Nachricht gesendet!
                    </h2>
                    <p className="text-muted-foreground text-center max-w-md">
                      Vielen Dank für Ihre Nachricht. Wir melden uns
                      schnellstmöglich bei Ihnen – in der Regel innerhalb von
                      1–2 Werktagen.
                    </p>
                  </CardContent>
                </Card>
              ) : (
                <Card className="border-0 shadow-sm">
                  <CardHeader>
                    <CardTitle className="text-xl">
                      Kontaktformular
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <form
                      onSubmit={handleSubmit(onSubmit)}
                      className="space-y-6"
                    >
                      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                        <div className="space-y-2">
                          <Label htmlFor="name">Name *</Label>
                          <Input
                            id="name"
                            placeholder="Ihr Name"
                            aria-invalid={!!errors.name}
                            {...register("name")}
                          />
                          {errors.name && (
                            <p className="text-xs text-destructive">
                              {errors.name.message}
                            </p>
                          )}
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="email">E-Mail *</Label>
                          <Input
                            id="email"
                            type="email"
                            placeholder="ihre@email.de"
                            aria-invalid={!!errors.email}
                            {...register("email")}
                          />
                          {errors.email && (
                            <p className="text-xs text-destructive">
                              {errors.email.message}
                            </p>
                          )}
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="subject">Betreff *</Label>
                        <Input
                          id="subject"
                          placeholder="z. B. Frage zum Vermittlungsprozess"
                          aria-invalid={!!errors.subject}
                          {...register("subject")}
                        />
                        {errors.subject && (
                          <p className="text-xs text-destructive">
                            {errors.subject.message}
                          </p>
                        )}
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="message">Nachricht *</Label>
                        <Textarea
                          id="message"
                          placeholder="Ihre Nachricht an uns..."
                          className="min-h-32"
                          aria-invalid={!!errors.message}
                          {...register("message")}
                        />
                        {errors.message && (
                          <p className="text-xs text-destructive">
                            {errors.message.message}
                          </p>
                        )}
                      </div>

                      <Button
                        type="submit"
                        size="lg"
                        disabled={isSubmitting}
                        className="h-12 min-h-12 px-8 text-base font-semibold shadow-sm bg-[oklch(0.28_0.06_255)] text-white hover:bg-[oklch(0.22_0.06_255)]"
                      >
                        {isSubmitting ? (
                          "Wird gesendet..."
                        ) : (
                          <>
                            Nachricht senden
                            <Send className="ml-2 h-4 w-4 shrink-0" />
                          </>
                        )}
                      </Button>
                    </form>
                  </CardContent>
                </Card>
              )}
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              <Card className="border-0 shadow-sm bg-muted/30">
                <CardContent className="pt-6">
                  <div className="space-y-6">
                    <div className="flex items-start gap-4">
                      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-accent/10 shrink-0">
                        <MapPin className="h-5 w-5 text-accent" />
                      </div>
                      <div>
                        <h3 className="font-semibold mb-1">Adresse</h3>
                        <p className="text-sm text-muted-foreground">
                          {LEGAL_ENTITY_NAME}
                          <br />
                          {LEGAL_ADDRESS_LINES.map((line) => (
                            <span key={line}>
                              {line}
                              <br />
                            </span>
                          ))}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start gap-4">
                      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-accent/10 shrink-0">
                        <Mail className="h-5 w-5 text-accent" />
                      </div>
                      <div>
                        <h3 className="font-semibold mb-1">E-Mail</h3>
                        <a
                          href={`mailto:${CONTACT_EMAIL}`}
                          className="text-sm text-accent hover:underline"
                        >
                          {CONTACT_EMAIL}
                        </a>
                      </div>
                    </div>
                    <div className="flex items-start gap-4">
                      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-accent/10 shrink-0">
                        <Phone className="h-5 w-5 text-accent" />
                      </div>
                      <div>
                        <h3 className="font-semibold mb-1">Telefon</h3>
                        <a
                          href={`tel:${CONTACT_PHONE_TEL}`}
                          className="text-sm text-accent hover:underline"
                        >
                          {CONTACT_PHONE_DISPLAY}
                        </a>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-0 shadow-sm bg-muted/30">
                <CardContent className="pt-6">
                  <h3 className="font-semibold mb-2">Geschäftszeiten</h3>
                  <div className="space-y-1 text-sm text-muted-foreground">
                    <div className="flex justify-between">
                      <span>Montag – Freitag</span>
                      <span>09:00 – 18:00</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Samstag – Sonntag</span>
                      <span>Geschlossen</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
