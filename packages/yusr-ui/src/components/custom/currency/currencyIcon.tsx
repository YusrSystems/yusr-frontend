import { SaudiRiyal } from "lucide-react";
import { useSelector } from "react-redux";

export default function CurrencyIcon({ className }: { className?: string; })
{
  const authState = useSelector((state: any) => state.auth);

  return (authState.setting?.currencyId === 1
    ? <SaudiRiyal className={ className ?? "w-4 h-4 shrink-0" } />
    : <span className="text-[10px]">{ authState.setting?.currency?.code }</span>);
}
