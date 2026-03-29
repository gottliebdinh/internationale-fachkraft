import { Suspense } from "react";
import { Loader2 } from "lucide-react";

import { AuthCallbackContent } from "./callback-content";

export default function AuthCallbackPage() {
  return (
    <Suspense
      fallback={
        <div className="flex h-full min-h-[40vh] w-full items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      }
    >
      <AuthCallbackContent />
    </Suspense>
  );
}
