"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import {
  forgotPasswordSchema,
  type ForgotPasswordFormData,
} from "@/lib/validators/auth";
import { requestPasswordReset } from "@/lib/supabase/actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function ForgotPasswordPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ForgotPasswordFormData>({
    resolver: zodResolver(forgotPasswordSchema),
  });

  const onSubmit = async (data: ForgotPasswordFormData) => {
    setIsLoading(true);
    try {
      const fd = new FormData();
      fd.append("email", data.email.trim().toLowerCase());
      const result = await requestPasswordReset(fd);
      if (result && "error" in result && result.error) {
        toast.error(result.error);
        return;
      }
      setSent(true);
      toast.success("Wenn ein Konto existiert, erhalten Sie eine E-Mail.");
    } catch {
      toast.error("Ein Fehler ist aufgetreten.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="auth-card-enter w-full rounded-2xl border border-border bg-card p-6 shadow-sm sm:p-8">
      <div className="text-center">
        <h1 className="font-[var(--font-display)] text-xl font-semibold tracking-tight text-foreground sm:text-2xl">
          Passwort zurücksetzen
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Wir senden Ihnen einen Link zum Festlegen eines neuen Passworts. In
          Gmail: Link mit Rechtsklick in neuem Tab öffnen oder Adresse kopieren
          (nicht den Google-Weiterleitungs-Link), falls der Browser hängen
          bleibt.
        </p>
      </div>

      {sent ? (
        <p className="mt-8 text-center text-sm text-muted-foreground">
          Bitte Posteingang und Spam prüfen. Der Link führt zurück zu dieser
          Website, um ein neues Passwort zu wählen.
        </p>
      ) : (
        <form onSubmit={handleSubmit(onSubmit)} className="mt-8 space-y-5">
          <div className="space-y-2">
            <Label htmlFor="forgot-email" className="text-foreground">
              E-Mail
            </Label>
            <Input
              id="forgot-email"
              type="email"
              autoComplete="email"
              placeholder="name@example.com"
              className="h-11"
              {...register("email")}
              aria-invalid={!!errors.email}
            />
            {errors.email && (
              <p className="text-xs text-destructive">{errors.email.message}</p>
            )}
          </div>

          <Button
            type="submit"
            className="h-12 w-full text-base font-semibold"
            size="lg"
            disabled={isLoading}
          >
            {isLoading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              "Link senden"
            )}
          </Button>
        </form>
      )}

      <p className="mt-8 text-center text-sm text-muted-foreground">
        <Link
          href="/auth/login"
          className="font-medium text-foreground underline-offset-2 hover:underline"
        >
          Zurück zur Anmeldung
        </Link>
      </p>
    </div>
  );
}
