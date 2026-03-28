import { Suspense } from "react";
import { Loader2 } from "lucide-react";

import { RegisterEmployerPendingContent } from "./pending-content";

export default function RegisterEmployerPendingPage() {
  return (
    <Suspense
      fallback={
        <div className="auth-card-enter flex min-h-[40vh] w-full items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      }
    >
      <RegisterEmployerPendingContent />
    </Suspense>
  );
}
