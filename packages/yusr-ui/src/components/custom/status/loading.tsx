import { Loader2 } from "lucide-react";

export function Loading({ entityName }: { entityName: string; })
{
  return (
    <div className="sm:max-w-xl flex flex-col items-center justify-center py-20">
      <Loader2 className="h-10 w-10 animate-spin text-primary" />
      <p className="mt-4 text-sm text-muted-foreground">جاري تحميل بيانات { entityName }...</p>
    </div>
  );
}
