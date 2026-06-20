import { SaudiRiyal } from "lucide-react";
import { Currency } from "../../../entities";
import type { Signal } from "@preact/signals-react";


export function CurrencyIcon({className, currency}: { className?: string; currency: Signal<Currency> })
{
	return (currency.value.id.value === 1
		? <SaudiRiyal className={ className ?? "w-4 h-4 shrink-0" }/>
		: <span className="text-[10px]">{ currency.value.code.value }</span>);
}
