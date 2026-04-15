import { Label } from "../../pure/label";
import { Separator } from "../../pure/separator";

interface TitleSeparatorProps
{
  title: string;
}

export function TitleSeparator({ title }: TitleSeparatorProps)
{
  return (
    <div className="flex items-center gap-4">
      <Separator className="flex-1" />
      <Label className="shrink-0 text-sm font-semibold">{ title }</Label>
      <Separator className="flex-1" />
    </div>
  );
}
