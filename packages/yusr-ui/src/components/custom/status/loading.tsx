import { Loader2 } from "lucide-react";
import { useTranslation } from "react-i18next";

export function Loading({ entityName }: { entityName: string; })
{
  const { t } = useTranslation("common");

  return (
    <div className="flex flex-col items-center justify-center py-20">
      <Loader2 className="h-10 w-10 animate-spin text-primary" />
      <p className="mt-4 text-sm text-muted-foreground">
        { t("loading.message", { entityName }) }
      </p>
    </div>
  );
}
