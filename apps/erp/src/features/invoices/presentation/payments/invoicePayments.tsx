import { Plus, Trash2, Wallet } from "lucide-react";
import { useTranslation } from "react-i18next";
import { Button, CrudEmptyTablePreview, NumberField } from "yusr-ui";
import InvoiceItemsMath from "../../logic/invoiceItemsMath";
import type Invoice from "@/core/data/invoices/invoice.ts";
import PaymentMethodsSearchableSelect from "@/core/components/searchableSelect/paymentMethodsSearchableSelect.tsx";
import { InvoiceVoucher } from "@/core/data/invoices/invoiceVoucher.ts";
import ErpCurrencyIcon from "@/core/components/erpCurrencyIcon.tsx";


export default function InvoicePayments({invoice}: { invoice: Invoice })
{
	const {t} = useTranslation("accounting");

	const paymentVouchers = invoice.paymentVouchers();
	const unpaidPrice = InvoiceItemsMath.CalcInvoiceUnpaidPrice(
		invoice.invoiceItems.value ?? [],
		invoice.invoiceVouchers.value ?? []
	);

	return (
		<div className="border border-border rounded-xl bg-background overflow-hidden">

			<div className="flex items-center justify-between px-4 py-3 border-b border-border bg-muted/30">
				<div className="flex items-center gap-2">
					<Wallet className="w-4 h-4 text-muted-foreground"/>
					<h3 className="font-semibold text-sm">
						{ t("invoices.paymentVouchers") }
					</h3>
				</div>

				{ unpaidPrice > 0 && (
					<Button
						type="button"
						size="sm"
						variant="outline"
						className="h-8 gap-1.5 text-xs"
						onClick={ () => invoice.invoiceVouchers.value.push(InvoiceVoucher.createPaymentVoucher(invoice)) }
					>
						<Plus className="w-3.5 h-3.5"/>
					</Button>
				) }
			</div>

			{ paymentVouchers.length > 0 && (
				<div className="flex items-center gap-3 px-4 pt-3 pb-1">
                    <span className="flex-1 text-xs font-medium text-muted-foreground">
                        { t("invoices.paymentMethod") }
                    </span>
					<span className="w-36 shrink-0 text-xs font-medium text-muted-foreground">
                        { t("invoices.amount") }
                    </span>
					<span className="w-8 shrink-0"/>
				</div>
			) }

			{ paymentVouchers.length > 0
				? (
					<div className="divide-y divide-border">
						{ paymentVouchers.map((invoiceVoucher) => (
							<div
								key={ invoiceVoucher.voucherId.value }
								className="flex items-center gap-3 px-4 py-2"
							>
								<div className="flex-1 min-w-0">
									<PaymentMethodsSearchableSelect
										id={ invoiceVoucher.paymentMethodId }
										label={ invoiceVoucher.paymentMethodName }
										onSelect={ (pm) =>
										{
											invoiceVoucher.paymentMethodId.value = pm?.id.value;
											invoiceVoucher.paymentMethodName.value = pm?.name.value;
										} }
									/>
								</div>

								<div className="w-36 shrink-0">
									<NumberField
										min={ 0 }
										max={ unpaidPrice + (invoiceVoucher.amount.value ?? 0) }
										value={ invoiceVoucher.amount }
										currency={ <ErpCurrencyIcon/> }
									/>
								</div>

								<Button
									type="button"
									size="icon"
									variant="ghost"
									className="w-8 shrink-0 text-muted-foreground hover:text-destructive hover:bg-destructive/10"
									onClick={ () => invoice.removeVoucher(invoiceVoucher.voucherId) }
								>
									<Trash2 className="w-4 h-4"/>
								</Button>
							</div>
						)) }
					</div>
				)
				: <CrudEmptyTablePreview mode="empty"/> }
		</div>
	);
}
