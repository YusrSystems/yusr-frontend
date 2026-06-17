import { CurrencyIcon } from "yusr-ui";
import { Services } from "@/core/services/services.ts";


export default function ErpCurrencyIcon({className}: { className?: string; })
{
	if (!Services.auth.setting?.currency)
	{
		throw Error("Currency is not set.");
	}

	return <CurrencyIcon currency={ Services.auth.setting.currency } className={ className }/>;
}