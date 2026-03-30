import { Suspense } from "react";
import { Loader2 } from "lucide-react";

import { RegisterEmployerPendingContent } from "./pending-content";

export default function RegisterEmployerPendingPage() {
  return (
    <div className="flex h-full min-h-0 flex-1 flex-col">
      <Suspense
        fallback={
          <div className="auth-card-enter flex min-h-0 flex-1 w-full items-center justify-center">
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          </div>
        }
      >
        <RegisterEmployerPendingContent />
      </Suspense>
    </div>
  );
}
