import { AccountsSearchableSelect } from "@/core/components/searchableSelect/accountsSearchableSelect.tsx";
import { AccountType } from "@/core/data/account.ts";
import type Invoice from "@/core/data/invoices/invoice.ts";
import { InvoiceVoucher } from "@/core/data/invoices/invoiceVoucher.ts";
import { useSignals } from "@preact/signals-react/runtime";
import { Plus, Trash2 } from "lucide-react";
import { useTranslation } from "react-i18next";
import { Button, CurrencyIcon, FormField, NumberField, TextField } from "yusr-ui";


export default function InvoiceCostsTab({invoice}: { invoice: Invoice })
{
	useSignals();
	const {t} = useTranslation("accounting");

	const costVouchers = invoice.costVouchers();

	return (
		<div className="flex flex-col gap-2 items-end">
			<Button
				type="button"
				className="max-w-45"
				size="lg"
				onClick={ () => invoice.invoiceVouchers.value.push(InvoiceVoucher.createCostVoucher(invoice)) }
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
					{ costVouchers.map((invoiceVoucher, index) => (
						<tr
							key={ invoiceVoucher.voucherId.value }
							className="border-b border-border last:border-0 hover:bg-muted/20 transition-colors"
						>
							<td className="p-2 text-center font-bold text-muted-foreground">{ index + 1 }</td>

							<td className="p-2">
								<FormField label="">
									<AccountsSearchableSelect
										label={ invoiceVoucher.accountName }
										id={ invoiceVoucher.accountId }
										types={ [AccountType.Client, AccountType.Supplier] }

									/>
								</FormField>
							</td>

							<td className="p-2">
								<FormField label="">
									{/*TODO: create payment methods searchable select*/ }
									{/*<PaymentMethodsSearchableSelect*/ }
									{/*    selectedId={invoiceVoucher.paymentMethodId}*/ }
									{/*    selectedLabel={invoiceVoucher.paymentMethodName}*/ }
									{/*    onValueChange={(pm) => {*/ }
									{/*        dispatch(slice.formActions.updateVoucher({*/ }
									{/*            ...invoiceVoucher,*/ }
									{/*            paymentMethodId: pm?.id,*/ }
									{/*            paymentMethodName: pm?.name*/ }
									{/*        }));*/ }
									{/*    }}*/ }
									{/*/>*/ }
								</FormField>
							</td>

							<td className="p-2">
								<NumberField
									label=""
									value={ invoiceVoucher.amount }
									currency={ <CurrencyIcon/> }
								/>
							</td>

							<td className="p-2">
								<TextField
									label=""
									value={ invoiceVoucher.description }
								/>
							</td>

							<td className="p-4 text-center align-top pt-5">
								<button
									type="button"
									onClick={ () =>
									{
										invoice.removeVoucher(invoiceVoucher.voucherId);
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
