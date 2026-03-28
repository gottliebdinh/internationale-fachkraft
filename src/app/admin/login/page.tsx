import { Suspense } from "react";
import { AdminLoginForm } from "./admin-login-form";

export default function AdminLoginPage() {
  const defaultEmail =
    process.env.NODE_ENV === "development"
      ? (process.env.ADMIN_EMAIL?.trim() ?? "")
      : "";

  return (
    <Suspense fallback={null}>
      <AdminLoginForm defaultEmail={defaultEmail} />
    </Suspense>
  );
}
