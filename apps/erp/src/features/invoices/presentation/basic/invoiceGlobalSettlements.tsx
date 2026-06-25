import { useTranslation } from "react-i18next";
import { FieldsSection, NumberField, TextAreaField } from "yusr-ui";
import Invoice from "@/core/data/invoices/invoice.ts";
import { useSignals } from "@preact/signals-react/runtime";
import InvoiceItemsMath from "@/features/invoices/logic/invoiceItemsMath.ts";


export default function InvoiceGlobalSettlements({invoice}: { invoice: Invoice })
{
	useSignals();
	const {t} = useTranslation("accounting");

	const basePrice = InvoiceItemsMath.CalcInvoiceBaseTaxInclusivePrice(invoice.invoiceItems.value ?? []);

	return (
		<div className="border border-border rounded-xl bg-background overflow-hidden">
			<div className="px-4 py-3 border-b border-border bg-muted/30">
				<h3 className="font-semibold">
					{ t("invoices.globalSettlement") }
				</h3>
			</div>

			<div className="p-4 flex flex-col gap-3">
				<FieldsSection columns={ 2 }>
					<NumberField
						label={ t("paymentMethods.fixedAmount") }
						className="mt-1"
						value={ invoice.settlementAmount }
						min={ -basePrice }
						onChange={ (newValue) =>
						{
							if (newValue == undefined) return;
							invoice.changeSettlementAmount(newValue);
							invoice.syncPaymentVouchers();
						} }
						disabled={ invoice.isDisabled || invoice.invoiceItems.value?.length === 0 }
					/>
					<NumberField
						label={ t("paymentMethods.percentage") }
						min={ -100 }
						className="mt-1"
						value={ invoice.settlementPercent }
						onChange={ (newValue) =>
						{
							if (newValue == undefined) return;
							invoice.changeSettlementPercent(newValue);
							invoice.syncPaymentVouchers();
						} }
						disabled={ invoice.isDisabled || invoice.invoiceItems.value?.length === 0 }
					/>
				</FieldsSection>

				<TextAreaField
					label={ t("invoices.settlementReason") }
					value={ invoice.settlementReason }
					disabled={ invoice.isDisabled || invoice.invoiceItems.value?.length === 0
						|| (invoice.settlementPercent.value === 0 && invoice.settlementAmount.value === 0) }
					collapsible
				/>
			</div>
		</div>
	);
}
