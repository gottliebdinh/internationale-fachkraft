import { AuthLayoutContent } from "./auth-layout-content";
import { AuthLayoutRoot } from "./auth-layout-root";
import { AuthLayoutWrapper } from "./auth-layout-wrapper";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AuthLayoutRoot>
      <AuthLayoutWrapper>
        <AuthLayoutContent>{children}</AuthLayoutContent>
      </AuthLayoutWrapper>
    </AuthLayoutRoot>
  );
}
