import { AccountDto } from "@/core/data/account.ts";
import { ReportField } from "@/features/report/components/reportField.tsx";


interface BuyerBoxProps
{
	account: AccountDto;
}

export function ReportBuyerBox({account}: BuyerBoxProps)
{
	return (
		<div className="rounded-xl border border-border bg-card text-card-foreground shadow-xs overflow-hidden w-full">
			<div
				className="bg-accent/60 px-4 py-1.5 flex justify-between items-center border-b border-border select-none text-xs font-bold font-sans tracking-wider uppercase">
				<span>المشتري</span>
				<span dir="ltr">Buyer</span>
			</div>

			<div className="p-3 flex flex-col gap-2.5 w-full" dir="rtl">
				<div className="grid grid-cols-2 gap-3 w-full">
					<ReportField labelAr="الاسم" labelEn="Name" value={ account.name }/>
					<ReportField labelAr="السجل التجاري" labelEn="CRN" value={ account.crn || "-" }/>
				</div>

				{ account.vatNumber && (
					<div className="grid grid-cols-2 gap-3 w-full">
						<ReportField
							labelAr="العنوان"
							labelEn="Address"
							value={ `${ account.cityName || "" } - ${ account.district || "" } - ${ account.postalCode || "" }` }
						/>
						<ReportField labelAr="الرقم الضريبي" labelEn="VAT" value={ account.vatNumber || "-" }/>
					</div>
				) }
			</div>
		</div>
	);
}