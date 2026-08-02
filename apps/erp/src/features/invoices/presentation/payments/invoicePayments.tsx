import { Plus, Trash2, Wallet } from "lucide-react";
import { useTranslation } from "react-i18next";
import { Button, CrudEmptyTablePreview, FormField, NumberField } from "yusr-ui";
import InvoiceItemsMath from "../../logic/invoiceItemsMath";
import type Invoice from "@/core/data/invoices/invoice.ts";
import PaymentMethodsSearchableSelect from "@/core/components/searchableSelect/paymentMethodsSearchableSelect.tsx";
import ErpCurrencyIcon from "@/core/components/erpCurrencyIcon.tsx";
import { useSignals } from "@preact/signals-react/runtime";
import { Voucher, VoucherType } from "@/core/data/voucher.ts";
import { Services } from "@/core/services/services.ts";
import { InvoiceType } from "@/core/types/invoiceType.ts";


export default function InvoicePayments({invoice}: { invoice: Invoice })
{
	useSignals();
	const {t} = useTranslation("accounting");

	const paymentVouchers = invoice.paymentVouchers.value;
	const unpaidPrice = InvoiceItemsMath.CalcInvoiceUnpaidPrice(
		invoice.invoiceItems.value ?? [],
		invoice.paymentVouchers.value ?? []
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
						onClick={ () =>
						{
							const newVoucher = Voucher.create({
								invoiceId: invoice.id.value,
								partnerId: invoice.partnerId.value,
								partnerName: invoice.partnerName.value,
								paymentMethodId: Services.auth.setting?.mainPaymentMethodId?.value,
								paymentMethodName: Services.auth.setting?.mainPaymentMethodName?.value,
								type: invoice.type.value === InvoiceType.Sell || invoice.type.value === InvoiceType.PurchaseReturn ? VoucherType.Receipt : VoucherType.Payment,
								amount: unpaidPrice
							});
							invoice.paymentVouchers.value = [...invoice.paymentVouchers.value, newVoucher];
							invoice.updatePaidAmount();
						} }
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
						{ paymentVouchers.map((voucher) => (
							<div
								key={ voucher.id.value }
								className="flex items-center gap-3 px-4 py-2"
							>
								<div className="flex-1 min-w-0">
									<FormField label="" error={ voucher.getError("paymentMethodId") }>
										<PaymentMethodsSearchableSelect
											id={ voucher.paymentMethodId }
											label={ voucher.paymentMethodName }
											onSelect={ (pm) =>
											{
												if (pm == undefined) return;
												voucher.paymentMethodId.value = pm?.id;
												voucher.paymentMethodName.value = pm?.name;
											} }
										/>
									</FormField>
								</div>

								<div className="w-36 shrink-0">
									<NumberField
										min={ 0 }
										max={ unpaidPrice + (voucher.amount.value ?? 0) }
										value={ voucher.amount }
										error={ voucher.getError("amount") }
										currency={ <ErpCurrencyIcon/> }
										onChange={ () => invoice.updatePaidAmount() }
									/>
								</div>

								<Button
									type="button"
									size="icon"
									variant="ghost"
									className="w-8 shrink-0 text-muted-foreground hover:text-destructive hover:bg-destructive/10"
									onClick={ () =>
									{
										invoice.paymentVouchers.value = invoice.paymentVouchers.value.filter((v) => v !== voucher);
										invoice.updatePaidAmount();
									} }
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
