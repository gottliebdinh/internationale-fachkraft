"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslations } from "next-intl";
import Link from "next/link";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";

import { loginSchema, type LoginFormData } from "@/lib/validators/auth";
import { signIn } from "@/lib/supabase/actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function LoginPage() {
  const t = useTranslations("auth");
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginFormData) => {
    setIsLoading(true);
    try {
      const formData = new FormData();
      formData.set("email", data.email);
      formData.set("password", data.password);

      const result = await signIn(formData);
      if (result?.error) {
        toast.error(result.error);
      }
    } catch {
      toast.error("Ein unerwarteter Fehler ist aufgetreten");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="auth-card-enter w-full rounded-2xl border border-border bg-card p-6 shadow-sm sm:p-8">
      <div className="text-center">
        <h2 className="font-[var(--font-display)] text-xl font-semibold tracking-tight text-foreground sm:text-2xl">
          Zurück zu Ihrem Konto
        </h2>
        <p className="mt-2 text-sm text-muted-foreground">
          Melden Sie sich an und sehen Sie Ihre Kandidaten & Matches
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="mt-8 space-y-5">
        <div className="space-y-2">
          <Label htmlFor="email" className="text-foreground">
            {t("email")}
          </Label>
          <Input
            id="email"
            type="email"
            placeholder="name@example.com"
            className="h-11"
            {...register("email")}
            aria-invalid={!!errors.email}
          />
          {errors.email && (
            <p className="text-xs text-destructive">{errors.email.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label htmlFor="password" className="text-foreground">
              {t("password")}
            </Label>
            <Link
              href="/auth/forgot-password"
              className="text-xs font-medium text-muted-foreground transition-colors hover:text-[oklch(0.50_0.11_195)]"
            >
              {t("forgotPassword")}
            </Link>
          </div>
          <Input
            id="password"
            type="password"
            className="h-11"
            {...register("password")}
            aria-invalid={!!errors.password}
          />
          {errors.password && (
            <p className="text-xs text-destructive">
              {errors.password.message}
            </p>
          )}
        </div>

        <Button
          type="submit"
          className="h-12 w-full text-base font-semibold bg-[oklch(0.50_0.11_195)] text-white hover:bg-[oklch(0.44_0.11_195)] transition-transform hover:scale-[1.01] active:scale-[0.99]"
          size="lg"
          disabled={isLoading}
        >
          {isLoading ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            "Jetzt anmelden"
          )}
        </Button>
        <p className="text-center text-xs text-muted-foreground">
          Ihre Anmeldung ist verschlüsselt und sicher.
        </p>
      </form>

      <div className="mt-8 border-t border-border pt-6 text-center">
        <p className="text-sm text-muted-foreground">{t("noAccount")}</p>
        <p className="mt-1 text-xs text-muted-foreground">
          Kostenlos registrieren – in 2 Minuten passende Kandidaten entdecken.
        </p>
        <p className="mt-2 text-[11px] text-muted-foreground">
          Über 85 Unternehmen nutzen bereits GeVin
        </p>
        <div className="mt-3 flex flex-col gap-2">
          <Link
            href="/auth/register/employer"
            className="text-sm font-semibold text-[oklch(0.50_0.11_195)] transition-colors hover:text-[oklch(0.44_0.11_195)]"
          >
            Jetzt kostenlos registrieren →
          </Link>
          <Link
            href="/auth/register/school"
            className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
          >
            {t("registerAsSchool")}
          </Link>
        </div>
      </div>
    </div>
  );
}
