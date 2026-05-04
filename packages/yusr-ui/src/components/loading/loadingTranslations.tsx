import { Loader2 } from "lucide-react";

export function LoadingTranslations()
{
  return (
    <div className="flex h-screen w-full items-center justify-center">
      <div className="w-[220px] space-y-3">
        <div className="h-2 w-full animate-pulse rounded bg-muted" />
        <div className="h-2 w-4/5 animate-pulse rounded bg-muted" />
        <div className="flex items-center gap-2 pt-2 text-muted-foreground">
          <Loader2 className="h-4 w-4 animate-spin" />
          <span className="text-sm">Loading translations...</span>
        </div>
      </div>
    </div>
  );
}
