import { Plus, Trash2, Wallet } from "lucide-react";
import { useTranslation } from "react-i18next";
import { Button, FormField, NumberField } from "yusr-ui";
import { useSignals } from "@preact/signals-react/runtime";
import PaymentMethodsSearchableSelect from "@/core/components/searchableSelect/paymentMethodsSearchableSelect";
import ErpCurrencyIcon from "@/core/components/erpCurrencyIcon";
import type {
	CommercialInvoiceDocument,
	ICommercialInvoiceDocumentDto
} from "@/core/data/commercial/commercialInvoiceDocument";
import type { CommercialItem, ICommercialItemDto } from "@/core/data/commercial/commercialItem";


export interface CommercialPaymentVouchersProps<
	TDto extends ICommercialInvoiceDocumentDto,
	TItem extends CommercialItem<TItemDto, CommercialInvoiceDocument<TDto, TItem, TItemDto>>,
	TItemDto extends ICommercialItemDto
>
{
	document: CommercialInvoiceDocument<TDto, TItem, TItemDto>;
}

export function CommercialPaymentVouchers<
	TDto extends ICommercialInvoiceDocumentDto,
	TItem extends CommercialItem<TItemDto, CommercialInvoiceDocument<TDto, TItem, TItemDto>>,
	TItemDto extends ICommercialItemDto
>({
	document
}: CommercialPaymentVouchersProps<TDto, TItem, TItemDto>)
{
	useSignals();
	const {t} = useTranslation("accounting");

	const handleAddVoucher = () =>
	{
		const unpaid = Math.max(0, document.fullAmount.value - document.paidAmount.value);
		const voucher = document.createInitialPaymentVoucher(unpaid);
		document.paymentVouchers.value = [...document.paymentVouchers.value, voucher];
		document.updatePaidAmount();
	};

	const handleRemoveVoucher = (index: number) =>
	{
		document.paymentVouchers.value = document.paymentVouchers.value.filter((_, i) => i !== index);
		document.updatePaidAmount();
	};

	return (
		<div className="border border-border rounded-xl bg-background overflow-hidden">
			<div className="flex items-center justify-between px-4 py-3 border-b border-border bg-muted/30">
				<div className="flex items-center gap-2">
					<Wallet className="w-4 h-4 text-muted-foreground"/>
					<h3 className="font-semibold text-sm">{ t("invoices.paymentVouchers") }</h3>
				</div>
				<Button
					type="button"
					size="sm"
					variant="outline"
					className="h-8 gap-1.5 text-xs"
					onClick={ handleAddVoucher }
				>
					<Plus className="w-3.5 h-3.5"/>
				</Button>
			</div>
			<div className="divide-y divide-border">
				{ document.paymentVouchers.value.map((voucher, idx) => (
					<div key={ idx } className="flex items-center gap-3 px-4 py-2">
						<div className="flex-1 min-w-0">
							<FormField label="" error={ voucher.getError("paymentMethodId") }>
								<PaymentMethodsSearchableSelect
									id={ voucher.paymentMethodId }
									label={ voucher.paymentMethodName }
								/>
							</FormField>
						</div>
						<div className="w-36 shrink-0">
							<NumberField
								min={ 0 }
								value={ voucher.amount }
								error={ voucher.getError("amount") }
								currency={ <ErpCurrencyIcon/> }
								onChange={ () => document.updatePaidAmount() }
							/>
						</div>
						<Button
							type="button"
							size="icon"
							variant="ghost"
							className="w-8 shrink-0 text-muted-foreground hover:text-destructive"
							onClick={ () => handleRemoveVoucher(idx) }
						>
							<Trash2 className="w-4 h-4"/>
						</Button>
					</div>
				)) }
			</div>
		</div>
	);
}