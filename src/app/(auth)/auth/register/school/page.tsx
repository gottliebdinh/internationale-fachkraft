"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslations } from "next-intl";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";

import {
  registerSchoolSchema,
  type RegisterSchoolFormData,
} from "@/lib/validators/auth";
import { signUp } from "@/lib/supabase/actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function RegisterSchoolPage() {
  const t = useTranslations("auth");
  const tSchool = useTranslations("school");
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterSchoolFormData>({
    resolver: zodResolver(registerSchoolSchema),
  });

  const onSubmit = async (data: RegisterSchoolFormData) => {
    setIsLoading(true);
    try {
      const formData = new FormData();
      formData.set("email", data.email);
      formData.set("password", data.password);

      const result = await signUp(formData, "school", {
        inviteCode: data.inviteCode,
        schoolName: data.schoolName,
        region: data.region,
        contactPerson: data.contactPerson,
        phone: data.phone,
      });

      if (result?.error) {
        toast.error(result.error);
      } else {
        toast.success(
          "Registrierung erfolgreich! Bitte überprüfen Sie Ihre E-Mail."
        );
        router.push("/auth/login");
      }
    } catch {
      toast.error("Ein unerwarteter Fehler ist aufgetreten");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="auth-card-enter w-full max-w-md rounded-2xl border border-border bg-card p-6 shadow-sm sm:p-8">
      <div className="text-center">
        <h2 className="font-[var(--font-display)] text-xl font-semibold tracking-tight text-foreground sm:text-2xl">
          {t("registerAsSchool")}
        </h2>
        <p className="mt-2 text-sm text-muted-foreground">
          {t("schoolInviteOnly")}
        </p>
        <p className="mt-1 text-xs text-muted-foreground">
          Mit Einladungscode – Daten werden DSGVO-konform verarbeitet.
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="mt-8 space-y-5">
        <div className="space-y-2">
          <Label htmlFor="inviteCode" className="text-foreground">
            {t("inviteCode")}
          </Label>
          <Input
            id="inviteCode"
            className="h-11"
            placeholder="XXXX-XXXX"
            {...register("inviteCode")}
            aria-invalid={!!errors.inviteCode}
          />
          {errors.inviteCode && (
            <p className="text-xs text-destructive">
              {errors.inviteCode.message}
            </p>
          )}
        </div>

        <div className="my-2 h-px bg-border" />

        <div className="space-y-2">
          <Label htmlFor="email" className="text-foreground">
            {t("email")}
          </Label>
          <Input
            id="email"
            type="email"
            className="h-11"
            placeholder="kontakt@schule.edu"
            {...register("email")}
            aria-invalid={!!errors.email}
          />
          {errors.email && (
            <p className="text-xs text-destructive">{errors.email.message}</p>
          )}
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-2">
            <Label htmlFor="password" className="text-foreground">
              {t("password")}
            </Label>
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
          <div className="space-y-2">
            <Label htmlFor="confirmPassword" className="text-foreground">
              {t("confirmPassword")}
            </Label>
            <Input
              id="confirmPassword"
              type="password"
              className="h-11"
              {...register("confirmPassword")}
              aria-invalid={!!errors.confirmPassword}
            />
            {errors.confirmPassword && (
              <p className="text-xs text-destructive">
                {errors.confirmPassword.message}
              </p>
            )}
          </div>
        </div>

        <div className="my-2 h-px bg-border" />

        <div className="space-y-2">
          <Label htmlFor="schoolName" className="text-foreground">
            {tSchool("schoolName")}
          </Label>
          <Input
            id="schoolName"
            className="h-11"
            {...register("schoolName")}
            aria-invalid={!!errors.schoolName}
          />
          {errors.schoolName && (
            <p className="text-xs text-destructive">
              {errors.schoolName.message}
            </p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="region" className="text-foreground">
            {tSchool("region")}
          </Label>
          <Input
            id="region"
            className="h-11"
            {...register("region")}
            aria-invalid={!!errors.region}
          />
          {errors.region && (
            <p className="text-xs text-destructive">
              {errors.region.message}
            </p>
          )}
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-2">
            <Label htmlFor="contactPerson" className="text-foreground">
              {tSchool("contactPerson")}
            </Label>
            <Input
              id="contactPerson"
              className="h-11"
              {...register("contactPerson")}
              aria-invalid={!!errors.contactPerson}
            />
            {errors.contactPerson && (
              <p className="text-xs text-destructive">
                {errors.contactPerson.message}
              </p>
            )}
          </div>
          <div className="space-y-2">
            <Label htmlFor="phone" className="text-foreground">
              {tSchool("phone")}
            </Label>
            <Input
              id="phone"
              type="tel"
              className="h-11"
              {...register("phone")}
              aria-invalid={!!errors.phone}
            />
            {errors.phone && (
              <p className="text-xs text-destructive">
                {errors.phone.message}
              </p>
            )}
          </div>
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
            t("registerTitle")
          )}
        </Button>
        <p className="text-center text-xs text-muted-foreground">
          Kostenlos und unverbindlich.
        </p>
      </form>

      <div className="mt-8 border-t border-border pt-6 text-center text-sm">
        <p className="text-muted-foreground">
          {t("hasAccount")}{" "}
          <Link
            href="/auth/login"
            className="font-medium text-[oklch(0.50_0.11_195)] transition-colors hover:text-[oklch(0.44_0.11_195)]"
          >
            {t("loginTitle")}
          </Link>
        </p>
      </div>
    </div>
  );
}
