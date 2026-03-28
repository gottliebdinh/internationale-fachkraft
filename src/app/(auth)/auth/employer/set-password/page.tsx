"use client";

import { useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const schema = z
  .object({
    password: z.string().min(8, "Mindestens 8 Zeichen"),
    confirm: z.string().min(1, "Bitte bestätigen"),
  })
  .refine((d) => d.password === d.confirm, {
    message: "Passwörter stimmen nicht überein",
    path: ["confirm"],
  });

type FormData = z.infer<typeof schema>;

export default function EmployerSetPasswordPage() {
  const router = useRouter();
  const supabase = useMemo(() => createClient(), []);
  const [ready, setReady] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (cancelled) return;
      if (!user) {
        router.replace("/auth/login");
        return;
      }
      // Nur wegschicken, wenn explizit false: bei undefined fehlt Metadaten im JWT noch
      // → sonst Schleife mit Middleware (Server sieht must_set_password, Client nicht).
      if (user.user_metadata?.must_set_password === false) {
        router.replace("/dashboard/employer");
        return;
      }
      setReady(true);
    })();
    return () => {
      cancelled = true;
    };
  }, [router, supabase]);

  const onSubmit = async (data: FormData) => {
    const { error } = await supabase.auth.updateUser({
      password: data.password,
      data: { must_set_password: false },
    });
    if (error) {
      toast.error(error.message || "Passwort konnte nicht gespeichert werden.");
      return;
    }
    await supabase.auth.refreshSession();
    toast.success("Passwort gespeichert.");
    router.refresh();
    router.replace("/dashboard/employer");
  };

  if (!ready) {
    return (
      <div className="auth-card-enter flex w-full items-center justify-center rounded-2xl border border-border bg-card p-12 shadow-sm">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="auth-card-enter w-full rounded-2xl border border-border bg-card p-6 shadow-sm sm:p-8">
      <div className="text-center">
        <h2 className="font-[var(--font-display)] text-xl font-semibold tracking-tight text-foreground sm:text-2xl">
          Passwort festlegen
        </h2>
        <p className="mt-2 text-sm text-muted-foreground">
          Wählen Sie ein sicheres Passwort für Ihr Arbeitgeber-Konto.
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="mt-8 space-y-5">
        <div className="space-y-2">
          <Label htmlFor="password">Passwort</Label>
          <Input
            id="password"
            type="password"
            className="h-11"
            autoComplete="new-password"
            {...register("password")}
            aria-invalid={!!errors.password}
          />
          {errors.password && (
            <p className="text-xs text-destructive">{errors.password.message}</p>
          )}
        </div>
        <div className="space-y-2">
          <Label htmlFor="confirm">Passwort bestätigen</Label>
          <Input
            id="confirm"
            type="password"
            className="h-11"
            autoComplete="new-password"
            {...register("confirm")}
            aria-invalid={!!errors.confirm}
          />
          {errors.confirm && (
            <p className="text-xs text-destructive">{errors.confirm.message}</p>
          )}
        </div>
        <Button
          type="submit"
          className="h-12 w-full text-base font-semibold"
          size="lg"
        >
          Speichern und zum Dashboard
        </Button>
      </form>
    </div>
  );
}
