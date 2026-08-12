import { useSignals } from "@preact/signals-react/runtime";
import Invoice from "@/core/data/invoices/invoice";
import { Button, NumberInput, SelectInput } from "yusr-ui";
import { Minus, Plus, RotateCcw, ShoppingCart, Trash2, Undo2, User } from "lucide-react";
import ErpCurrencyIcon from "@/core/components/erpCurrencyIcon";
import InvoiceItemsMath from "@/features/invoices/logic/invoiceItemsMath";
import { PartnersSearchableSelect } from "@/core/components/searchableSelect/partnersSearchableSelect";
import { PartnerType } from "@/core/data/partner";
import { Services } from "@/core/services/services";
import { useEffect, useMemo } from "react";
import { signal } from "@preact/signals-react";
import { ItemType } from "@/core/data/item";
import { InvoiceType } from "@/core/types/invoiceType";


interface PosCartProps
{
	invoice: Invoice;
	onCheckout: () => void;
	onCancelReturn?: () => void;
}

export default function PosCart({invoice, onCheckout, onCancelReturn}: PosCartProps)
{
	useSignals();

	const items = invoice.invoiceItems.value;
	const isReturnMode = invoice.type.value === InvoiceType.SellReturn;

	// basePrice = tax-inclusive total BEFORE settlement. We still need this
	// as a cap so a discount can never exceed the order's original total.
	const basePrice = InvoiceItemsMath.CalcInvoiceBaseTaxInclusivePrice(items);

	// finalTotal = the tax-inclusive total AFTER settlement (discount/addition)
	// is applied. This is our "source of truth" number.
	const finalTotal = InvoiceItemsMath.CalcInvoiceTaxInclusivePrice(items);

	// Wrapped in Number() to ensure it's treated as a number for arithmetic operations
	const mainTaxPerc = Number(Services.auth.setting?.mainTax?.value?.percentage) || 15;

	// Formula for VAT calculations
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
	}, [invoice.settlementAmount.value, displaySettlement, isAddition]);

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
			{/* Return Mode Alert Banner */ }
			{ isReturnMode && (
				<div
					className="bg-red-500/10 border-b border-red-500/20 p-3 flex items-center justify-between text-red-600 dark:text-red-400 shrink-0">
					<div className="flex items-center gap-2 font-bold text-xs">
						<Undo2 className="w-4 h-4 animate-pulse"/>
						<span>وضع مرتجع المبيعات (الفاتورة #{ invoice.originalInvoiceId.value })</span>
					</div>
					{ onCancelReturn && (
						<Button
							type="button"
							size="sm"
							variant="ghost"
							className="h-7 px-2 text-xs text-red-600 hover:text-red-700 hover:bg-red-500/20 gap-1"
							onClick={ onCancelReturn }
						>
							<RotateCcw className="w-3 h-3"/>
							إلغاء المرتجع
						</Button>
					) }
				</div>
			) }

			{/* Customer Selection */ }
			<div className="p-4 border-b border-border shrink-0 bg-muted/10">
				<div className="flex items-center gap-2 mb-2 text-sm font-semibold text-muted-foreground">
					<User className="w-4 h-4"/>
					العميل
				</div>
				<PartnersSearchableSelect
					id={ invoice.partnerId }
					label={ invoice.partnerName }
					disabled={ isReturnMode }
					types={ [PartnerType.Customer] }
				/>
			</div>

			{/* Cart Items */ }
			<div className="flex-1 overflow-y-auto p-2 space-y-2">
				{ items.length === 0 ? (
					<div className="h-full flex flex-col items-center justify-center text-muted-foreground opacity-50">
						<ShoppingCart className="w-16 h-16 mb-4"/>
						<p>{ isReturnMode ? "لا توجد مواد سريعة للإرجاع" : "السلة فارغة" }</p>
					</div>
				) : (
					items.map((item, index) => (
						<div key={ `${ item.itemId.value }-${ index }` }
						     className={ `flex flex-col p-3 border rounded-lg shadow-sm transition-colors ${
								 isReturnMode ? "bg-red-500/5 border-red-500/20" : "bg-background border-border"
							 }` }>
							<div className="flex justify-between items-start mb-2">
								<div className="flex flex-col pr-2">
									<span className="font-semibold text-sm leading-tight">{ item.itemName.value }</span>
								</div>
								<span
									className={ `font-bold flex items-center gap-1 shrink-0 ${ isReturnMode ? "text-red-600 dark:text-red-400" : "text-primary" }` }>
									{ item.taxInclusiveTotalPrice.value.toLocaleString(undefined, {
										minimumFractionDigits: 2,
										maximumFractionDigits: 2
									}) } <ErpCurrencyIcon className="w-3 h-3"/>
								</span>
							</div>

							{/* Combined Controls Row (Quantity, Unit, Pricing Method, Trash) */ }
							<div className="flex items-end gap-2 mt-auto pt-1">

								{/* Quantity Controls */ }
								<div className="flex flex-col gap-1 shrink-0">
									<span className="text-[10px] text-muted-foreground font-medium px-1">الكمية</span>
									<div className="flex items-center bg-muted rounded-md border border-border h-9">
										<button
											className="w-7 h-full flex items-center justify-center hover:bg-background rounded-r-md transition-colors"
											onClick={ () =>
											{
												const maxAllowed = isReturnMode ? item.originalQuantity.value : Number.MAX_SAFE_INTEGER;
												if (item.quantity.value < maxAllowed)
												{
													item.changeQuantity(Number(item.quantity.value) + 1);
												}
											} }
										>
											<Plus className="w-3 h-3"/>
										</button>
										<div className="w-8 text-center font-semibold text-sm">
											{ item.quantity.value }
										</div>
										<button
											className="w-7 h-full flex items-center justify-center hover:bg-background rounded-l-md transition-colors"
											onClick={ () =>
											{
												if (item.quantity.value > 1)
												{
													item.changeQuantity(Number(item.quantity.value) - 1);
												}
											} }
										>
											<Minus className="w-3 h-3"/>
										</button>
									</div>
								</div>

								{/* Unit Display / Selector */ }
								<div className="flex-1 min-w-0 flex flex-col gap-1">
									<span className="text-[10px] text-muted-foreground font-medium px-1">الوحدة</span>
									{ isReturnMode ? (
										<div
											className="h-9 px-3 flex items-center bg-muted/50 border border-border rounded-md text-sm text-muted-foreground cursor-not-allowed">
											{ item.unitName.value || "—" }
										</div>
									) : (
										<SelectInput<number>
											value={ item.itemUoMId }
											disabled={ item.itemType.value === ItemType.Service }
											options={ item.uoMDtos.value?.map((m) => ({
												label: m.unitName.value,
												value: m.id.value
											})) || [] }
											onValueChange={ (uomId) =>
											{
												if (uomId)
												{
													item.changeUoM(uomId);
												}
											} }
										/>
									) }
								</div>

								{/* Pricing Method Display / Selector */ }
								<div className="flex-1 min-w-0 flex flex-col gap-1">
									<span className="text-[10px] text-muted-foreground font-medium px-1 truncate">طريقة التسعير</span>
									{ isReturnMode ? (
										<div
											className="h-9 px-3 flex items-center bg-muted/50 border border-border rounded-md text-sm text-muted-foreground cursor-not-allowed truncate">
											{ item.pricingMethodName.value || "—" }
										</div>
									) : (
										<SelectInput<number>
											value={ item.pricingMethodId }
											disabled={ item.itemType.value === ItemType.Service }
											options={ item.uoMDtos.value?.find(u => u.id.value === item.itemUoMId.value)?.prices.value?.map((p) => ({
												label: p.pricingMethodName.value,
												value: p.pricingMethodId.value
											})) || [] }
											onValueChange={ (pmId) =>
											{
												if (pmId)
												{
													const uom = item.uoMDtos.value?.find(u => u.id.value === item.itemUoMId.value);
													const pmName = uom?.prices.value?.find(p => p.pricingMethodId.value === pmId)?.pricingMethodName.value;
													item.changePricingMethod(pmId, pmName);
												}
											} }
										/>
									) }
								</div>

								{/* Delete Button */ }
								<button
									className="p-2 text-red-500 hover:bg-red-50 rounded-md transition-colors shrink-0 h-9 flex items-center justify-center"
									onClick={ () => invoice.removeItem(index) }
								>
									<Trash2 className="w-4 h-4"/>
								</button>
							</div>
						</div>
					))
				) }
			</div>

			{/* Totals & Checkout Button */ }
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

					{ !isReturnMode && (
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
					) }

					<div className="flex justify-between items-center font-bold text-lg pt-2 border-t border-border">
						<span>{ isReturnMode ? "إجمالي المبلغ المراد إرجاعه" : "الإجمالي المطلوب" }</span>
						<span className={ isReturnMode ? "text-red-600 dark:text-red-400" : "text-primary" }>
							{ finalTotal.toLocaleString(undefined, {
								minimumFractionDigits: 2,
								maximumFractionDigits: 2
							}) } <ErpCurrencyIcon className="w-4 h-4 inline"/>
						</span>
					</div>
				</div>

				<Button
					size="lg"
					variant={ isReturnMode ? "destructive" : "default" }
					className="w-full h-14 text-lg font-bold gap-2"
					disabled={ items.length === 0 }
					onClick={ onCheckout }
				>
					{ isReturnMode ? <Undo2 className="w-5 h-5"/> : null }
					{ isReturnMode ? "إرجاع المبلغ" : "الدفع" }
				</Button>
			</div>
		</div>
	);
}