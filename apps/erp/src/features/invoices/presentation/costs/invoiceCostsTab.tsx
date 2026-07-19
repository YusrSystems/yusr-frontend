import type Invoice from "@/core/data/invoices/invoice.ts";
import { useSignals } from "@preact/signals-react/runtime";
import { Plus, Trash2 } from "lucide-react";
import { useTranslation } from "react-i18next";
import { Button, FormField, NumberField, TextField } from "yusr-ui";
import ErpCurrencyIcon from "@/core/components/erpCurrencyIcon.tsx";
import PaymentMethodsSearchableSelect from "@/core/components/searchableSelect/paymentMethodsSearchableSelect.tsx";
import { Voucher, VoucherType } from "@/core/data/voucher.ts";
import { Services } from "@/core/services/services.ts";
import PartnersSearchableSelect from "@/core/components/searchableSelect/partnersSearchableSelect.tsx";


export default function InvoiceCostsTab({invoice}: { invoice: Invoice })
{
	useSignals();
	const {t} = useTranslation("accounting");

	const costVouchers = invoice.costVouchers.value;

	return (
		<div className="flex flex-col gap-2 items-end">
			<Button
				type="button"
				className="max-w-45"
				size="lg"
				onClick={ () =>
				{
					const newVoucher = Voucher.create({
						invoiceId: invoice.id.value,
						paymentMethodId: Services.auth.setting?.mainPaymentMethodId?.value,
						type: VoucherType.Payment,
						amount: 0
					});
					invoice.costVouchers.value = [...invoice.costVouchers.value, newVoucher];
				} }
			>
				<Plus className="w-4 h-4 me-2"/> { t("invoices.addCostVoucher") }
			</Button>

			<div className="w-full overflow-x-auto border border-border rounded-lg shadow-sm bg-background">
				<table className="w-full text-sm text-right">
					<thead className="bg-muted/40 border-b border-border">
					<tr>
						<th className="p-3 font-semibold w-16 text-center text-muted-foreground">{ t("invoices.number") }</th>
						<th className="p-3 text-start font-semibold">{ t("invoices.account") }</th>
						<th className="p-3 text-start font-semibold">{ t("invoices.paymentMethod") }</th>
						<th className="p-3 text-start font-semibold">{ t("invoices.amount") }</th>
						<th className="p-3 text-start font-semibold">{ t("invoices.description") }</th>
						<th className="p-4 text-start font-semibold w-16"></th>
					</tr>
					</thead>
					<tbody>
					{ costVouchers.map((voucher, index) => (
						<tr
							key={ voucher.id.value }
							className="border-b border-border last:border-0 hover:bg-muted/20 transition-colors"
						>
							<td className="p-2 text-center font-bold text-muted-foreground">{ index + 1 }</td>

							<td className="p-2">
								<FormField label="" error={ voucher.getError("partnerId") }>
									<PartnersSearchableSelect
										label={ voucher.partnerName }
										id={ voucher.partnerId }
									/>
								</FormField>
							</td>

							<td className="p-2">
								<FormField label="" error={ voucher.getError("paymentMethodId") }>
									<PaymentMethodsSearchableSelect
										id={ voucher.paymentMethodId }
										label={ voucher.paymentMethodName }
									/>
								</FormField>
							</td>

							<td className="p-2">
								<NumberField
									label=""
									value={ voucher.amount }
									error={ voucher.getError("amount") }
									currency={ <ErpCurrencyIcon/> }
								/>
							</td>

							<td className="p-2">
								<TextField
									label=""
									value={ voucher.description }
									error={ voucher.getError("description") }
								/>
							</td>

							<td className="p-4 text-center align-top pt-5">
								<button
									type="button"
									onClick={ () =>
									{
										invoice.costVouchers.value = invoice.costVouchers.value.filter((v) => v !== voucher);
									} }
									className="p-2 text-red-500 hover:text-red-700 hover:bg-red-500/10 rounded-md transition-colors"
									aria-label={ t("invoices.deleteVoucher") }
								>
									<Trash2 className="h-5 w-5"/>
								</button>
							</td>
						</tr>
					)) }
					</tbody>
				</table>
			</div>
		</div>
	);
}
