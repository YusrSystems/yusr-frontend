import { Check, Copy } from "lucide-react";
import { useState } from "react";
import { Button } from "../../../components/pure";

export function CopyButton({ value }: { value: string; })
{
  const [copied, setCopied] = useState(false);

  const handleCopy = async () =>
  {
    await navigator.clipboard.writeText(value);
    setCopied(true);
    setTimeout(() => setCopied(false), 1800);
  };

  return (
    <Button
      onClick={ handleCopy }
      variant="ghost"
    >
      { copied
        ? <Check className="w-3.5 h-3.5 text-emerald-500" />
        : <Copy className="w-3.5 h-3.5" /> }
    </Button>
  );
}
