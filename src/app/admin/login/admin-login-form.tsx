"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { useSearchParams } from "next/navigation";
import { loginSchema, type LoginFormData } from "@/lib/validators/auth";
import { signIn } from "@/lib/supabase/actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

type Props = {
  defaultEmail?: string;
};

export function AdminLoginForm({ defaultEmail = "" }: Props) {
  const searchParams = useSearchParams();
  const [isLoading, setIsLoading] = useState(false);
  const redirectTo =
    searchParams.get("redirect")?.startsWith("/admin") &&
    !searchParams.get("redirect")?.startsWith("//")
      ? searchParams.get("redirect")!
      : "/admin";

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: defaultEmail,
      password: "",
    },
  });

  const onSubmit = async (data: LoginFormData) => {
    setIsLoading(true);
    try {
      const formData = new FormData();
      formData.append("email", data.email.trim().toLowerCase());
      formData.append("password", data.password);
      formData.append("redirect", redirectTo);
      const result = await signIn(formData);
      if (result && "error" in result && result.error) {
        toast.error(result.error);
      }
    } catch {
      toast.error("Ein unerwarteter Fehler ist aufgetreten");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-1 flex-col items-center justify-center px-4 py-10">
      <div className="auth-card-enter w-full max-w-md rounded-2xl border border-border bg-card p-6 shadow-sm sm:p-8">
        <div className="text-center">
          <h1 className="font-[var(--font-display)] text-xl font-semibold tracking-tight text-foreground sm:text-2xl">
            Admin-Anmeldung
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Nur für autorisierte GeVin-Administratoren. Bitte melden Sie sich
            mit Ihrem Admin-Konto an.
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="mt-8 space-y-5">
          <div className="space-y-2">
            <Label htmlFor="admin-email" className="text-foreground">
              E-Mail
            </Label>
            <Input
              id="admin-email"
              type="email"
              autoComplete="username"
              placeholder="admin@example.com"
              className="h-11"
              {...register("email")}
              aria-invalid={!!errors.email}
            />
            {errors.email && (
              <p className="text-xs text-destructive">{errors.email.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="admin-password" className="text-foreground">
              Passwort
            </Label>
            <Input
              id="admin-password"
              type="password"
              autoComplete="current-password"
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
            className="h-12 w-full text-base font-semibold"
            size="lg"
            disabled={isLoading}
          >
            {isLoading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              "Anmelden"
            )}
          </Button>
        </form>

        <p className="mt-6 text-center text-xs text-muted-foreground">
          <Link
            href="/auth/login"
            className="font-medium text-foreground underline-offset-2 hover:underline"
          >
            Zur normalen Anmeldung (Arbeitgeber &amp; Schule)
          </Link>
        </p>
      </div>
    </div>
  );
}
