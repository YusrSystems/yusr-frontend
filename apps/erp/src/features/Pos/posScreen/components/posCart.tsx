import { useSignals } from "@preact/signals-react/runtime";
import Invoice from "@/core/data/invoices/invoice";
import { Button, NumberInput } from "yusr-ui";
import { Minus, Plus, ShoppingCart, Trash2, User } from "lucide-react";
import ErpCurrencyIcon from "@/core/components/erpCurrencyIcon";
import InvoiceItemsMath from "@/features/invoices/logic/invoiceItemsMath";
import { PartnersSearchableSelect } from "@/core/components/searchableSelect/partnersSearchableSelect";
import { PartnerType } from "@/core/data/partner";
import { Services } from "@/core/services/services";
import { useEffect, useMemo } from "react";
import { signal } from "@preact/signals-react";
import { useTranslation } from "react-i18next";


interface PosCartProps
{
	invoice: Invoice;
	onCheckout: () => void;
}

export default function PosCart({invoice, onCheckout}: PosCartProps)
{
	useSignals();
	const {i18n} = useTranslation();

	const items = invoice.invoiceItems.value;

	// basePrice = tax-inclusive total BEFORE settlement. We still need this
	// as a cap so a discount can never exceed the order's original total.
	const basePrice = InvoiceItemsMath.CalcInvoiceBaseTaxInclusivePrice(items);

	// finalTotal = the tax-inclusive total AFTER settlement (discount/addition)
	// is applied. This is our "source of truth" number.
	const finalTotal = InvoiceItemsMath.CalcInvoiceTaxInclusivePrice(items);

	const mainTaxPerc = Services.auth.setting?.mainTax?.value?.percentage || 15;

	// Instead of computing the pre-tax total and tax amount from the raw
	// items (which ignores settlement), we derive them FROM finalTotal.
	// Formula: if finalTotal already includes tax, then
	//   preTaxTotal = finalTotal / (1 + taxRate/100)
	//   taxAmount   = finalTotal - preTaxTotal
	// This way, whenever the settlement changes finalTotal, these two
	// values automatically recalculate and stay in sync.
	const baseTaxExclusive = finalTotal / (1 + mainTaxPerc / 100);
	const baseTaxAmount = finalTotal - baseTaxExclusive;

	const isAddition = useMemo(() => signal(false), []);
	const displaySettlement = useMemo(() => signal<number | undefined>(0), []);

	useEffect(() =>
	{
		const currentSettlement = invoice.settlementAmount.value || 0;
		displaySettlement.value = Math.abs(currentSettlement);
		if (currentSettlement !== 0)
		{
			isAddition.value = currentSettlement > 0;
		}
	}, [invoice.settlementAmount.value]);

	const onSettlementInput = (val: number | undefined) =>
	{
		const absVal = Math.abs(val || 0);
		displaySettlement.value = absVal;
		invoice.changeSettlementAmount(isAddition.value ? absVal : -absVal);
	};

	const onSwitchToggle = (checked: boolean) =>
	{
		isAddition.value = checked;
		const absVal = displaySettlement.value || 0;
		invoice.changeSettlementAmount(checked ? absVal : -absVal);
	};

	return (
		<div className="flex flex-col h-full">
			{/* Customer Selection */ }
			<div className="p-4 border-b border-border shrink-0 bg-muted/10">
				<div className="flex items-center gap-2 mb-2 text-sm font-semibold text-muted-foreground">
					<User className="w-4 h-4"/>
					العميل
				</div>
				<PartnersSearchableSelect
					id={ invoice.partnerId }
					label={ invoice.partnerName }
					types={ [PartnerType.Customer] }
				/>
			</div>

			{/* Cart Items */ }
			<div className="flex-1 overflow-y-auto p-2 space-y-2">
				{ items.length === 0 ? (
					<div className="h-full flex flex-col items-center justify-center text-muted-foreground opacity-50">
						<ShoppingCart className="w-16 h-16 mb-4"/>
						<p>السلة فارغة</p>
					</div>
				) : (
					items.map((item, index) => (
						<div key={ `${ item.itemId.value }-${ index }` }
						     className="flex flex-col p-3 bg-background border border-border rounded-lg shadow-sm">
							<div className="flex justify-between items-start mb-2">
								<div className="flex flex-col">
									<span className="font-semibold text-sm">{ item.itemName.value }</span>
									<span className="text-xs text-muted-foreground">{ item.unitName.value }</span>
								</div>
								<span className="font-bold text-primary flex items-center gap-1">
									{ item.taxInclusiveTotalPrice.value.toLocaleString(undefined, {
										minimumFractionDigits: 2,
										maximumFractionDigits: 2
									}) } <ErpCurrencyIcon
									className="w-3 h-3"/>
								</span>
							</div>

							<div className="flex items-center justify-between mt-2">
								<div className="flex items-center bg-muted rounded-md border border-border">
									<button
										className="w-8 h-8 flex items-center justify-center hover:bg-background rounded-r-md transition-colors"
										onClick={ () => item.changeQuantity(item.quantity.value + 1) }
									>
										<Plus className="w-4 h-4"/>
									</button>
									<div className="w-10 text-center font-semibold text-sm">
										{ item.quantity.value }
									</div>
									<button
										className="w-8 h-8 flex items-center justify-center hover:bg-background rounded-l-md transition-colors"
										onClick={ () =>
										{
											if (item.quantity.value > 1)
											{
												item.changeQuantity(item.quantity.value - 1);
											}
										} }
									>
										<Minus className="w-4 h-4"/>
									</button>
								</div>

								<button
									className="p-2 text-red-500 hover:bg-red-50 rounded-md transition-colors"
									onClick={ () => invoice.removeItem(index) }
								>
									<Trash2 className="w-4 h-4"/>
								</button>
							</div>
						</div>
					))
				) }
			</div>

			{/* Totals & Checkout */ }
			<div className="p-4 bg-muted/20 border-t border-border shrink-0">
				<div className="space-y-3 mb-4 text-sm">
					<div className="flex justify-between items-center text-muted-foreground">
						<span>المجموع (بدون ضريبة)</span>
						<span>{ baseTaxExclusive.toLocaleString(undefined, {
							minimumFractionDigits: 2,
							maximumFractionDigits: 2
						}) } <ErpCurrencyIcon className="w-3 h-3 inline"/></span>
					</div>

					<div className="flex justify-between items-center text-muted-foreground">
						<span>الضريبة ({ mainTaxPerc }%)</span>
						<span>{ baseTaxAmount.toLocaleString(undefined, {
							minimumFractionDigits: 2,
							maximumFractionDigits: 2
						}) } <ErpCurrencyIcon className="w-3 h-3 inline"/></span>
					</div>
					<div className="flex justify-between items-center text-muted-foreground">
						<div className="flex items-center gap-2">
							<span>التسوية بعد الضريبة</span>
							<div className="flex items-center gap-1">
								<Button
									type="button"
									size="sm"
									variant={ isAddition.value ? "default" : "outline" }
									className="h-7 px-2 text-xs"
									onClick={ () => onSwitchToggle(true) }
								>
									إضافة
								</Button>
								<Button
									type="button"
									size="sm"
									variant={ !isAddition.value ? "default" : "outline" }
									className="h-7 px-2 text-xs"
									onClick={ () => onSwitchToggle(false) }
								>
									خصم
								</Button>
							</div>
						</div>
						<div className="w-28">
							<NumberInput
								value={ displaySettlement }
								onChange={ onSettlementInput }
								min={ 0 }
								max={ isAddition.value ? undefined : basePrice }
								disabled={ items.length === 0 }
								className="h-8 text-sm"
							/>
						</div>
					</div>
					<div className="flex justify-between items-center font-bold text-lg pt-2 border-t border-border">
						<span>الإجمالي المطلوب</span>
						<span className="text-primary">{ finalTotal.toLocaleString(undefined, {
							minimumFractionDigits: 2,
							maximumFractionDigits: 2
						}) } <ErpCurrencyIcon
							className="w-4 h-4 inline"/></span>
					</div>
				</div>

				<Button
					size="lg"
					className="w-full h-14 text-lg font-bold"
					disabled={ items.length === 0 }
					onClick={ onCheckout }
				>
					الدفع
				</Button>
			</div>
		</div>
	);
}