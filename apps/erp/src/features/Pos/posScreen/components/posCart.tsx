import { useSignals } from "@preact/signals-react/runtime";
import { signal } from "@preact/signals-react";
import { useEffect, useMemo } from "react";
import { Button, NumberInput, SelectInput } from "yusr-ui";
import { Minus, Plus, RotateCcw, ShoppingCart, Trash2, Undo2, User } from "lucide-react";
import ErpCurrencyIcon from "@/core/components/erpCurrencyIcon";
import { PartnersSearchableSelect } from "@/core/components/searchableSelect/partnersSearchableSelect";
import { PartnerType } from "@/core/data/partner";
import { Services } from "@/core/services/services";
import { ItemType } from "@/core/data/item";
import { SalesInvoice } from "@/core/data/commercial/salesInvoice";
import { SalesInvoiceType } from "@/core/types/commercialEnums";
import { CommercialMath } from "@/features/commercial/logic/commercialMath";


interface PosCartProps
{
	invoice: SalesInvoice;
	onCheckout: () => void;
	onCancelReturn?: () => void;
}

export default function PosCart({invoice, onCheckout, onCancelReturn}: PosCartProps)
{
	useSignals();

	const items = invoice.items.value;
	const isReturnMode = invoice.type.value === SalesInvoiceType.CreditNote;

	const basePrice = CommercialMath.calcDocumentBaseTaxInclusivePrice(
		items.map((i) => ({
			taxExclusivePrice: i.taxExclusivePrice.value,
			taxInclusivePrice: i.taxInclusivePrice.value,
			settlement: 0,
			quantity: i.quantity.value,
			totalTaxesPerc: i.totalTaxesPerc.value
		}))
	);

	const finalTotal = invoice.fullAmount.value;

	const mainTaxPerc = Number(Services.auth.setting?.mainTax?.value?.percentage) || 0;
	const baseTaxExclusive = mainTaxPerc > 0 ? finalTotal / (1 + mainTaxPerc / 100) : finalTotal;
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
			{ isReturnMode && (
				<div
					className="bg-red-500/10 border-b border-red-500/20 p-2.5 sm:p-3 flex items-center justify-between text-red-600 dark:text-red-400 shrink-0">
					<div className="flex items-center gap-2 font-bold text-xs">
						<Undo2 className="w-4 h-4 animate-pulse"/>
						<span>وضع مرتجع (الفاتورة #{ invoice.originalSalesInvoiceId.value })</span>
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

			<div className="p-3 sm:p-4 border-b border-border shrink-0 bg-muted/10">
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

			<div className="flex-1 min-h-0 overflow-y-auto p-2 space-y-2">
				{ items.length === 0 ? (
					<div
						className="h-full flex flex-col items-center justify-center text-muted-foreground opacity-50 py-12">
						<ShoppingCart className="w-14 h-14 sm:w-16 sm:h-16 mb-3"/>
						<p className="text-sm">{ isReturnMode ? "لا توجد مواد سريعة للإرجاع" : "السلة فارغة" }</p>
					</div>
				) : (
					items.map((item, index) => (
						<div
							key={ `${ item.itemId.value }-${ index }` }
							className={ `flex flex-col p-2.5 sm:p-3 border rounded-lg shadow-sm transition-colors ${
								isReturnMode ? "bg-red-500/5 border-red-500/20" : "bg-background border-border"
							}` }
						>
							<div className="flex justify-between items-start mb-2 gap-2">
								<div className="flex flex-col pr-1 min-w-0 flex-1">
									<span
										className="font-semibold text-xs sm:text-sm leading-tight truncate">{ item.itemName.value }</span>
								</div>
								<span
									className={ `font-bold flex items-center gap-1 shrink-0 text-sm sm:text-base ${
										isReturnMode ? "text-red-600 dark:text-red-400" : "text-primary"
									}` }
								>
									{ item.taxInclusiveTotalPrice.value.toLocaleString(undefined, {
										minimumFractionDigits: 2,
										maximumFractionDigits: 2
									}) } <ErpCurrencyIcon className="w-3 h-3"/>
								</span>
							</div>

							<div className="flex flex-wrap sm:flex-nowrap items-end gap-2 mt-auto pt-1">
								<div className="flex flex-col gap-1 shrink-0">
									<span className="text-[10px] text-muted-foreground font-medium px-1">الكمية</span>
									<div
										className="flex items-center bg-muted rounded-md border border-border h-8 sm:h-9">
										<button
											type="button"
											className="w-7 h-full flex items-center justify-center hover:bg-background rounded-r-md transition-colors"
											onClick={ () =>
											{
												const maxAllowed = isReturnMode
													? item.originalQuantity.value
													: Number.MAX_SAFE_INTEGER;
												if (item.quantity.value < maxAllowed)
												{
													item.changeQuantity(Number(item.quantity.value) + 1);
												}
											} }
										>
											<Plus className="w-3 h-3"/>
										</button>
										<div className="w-7 sm:w-8 text-center font-semibold text-xs sm:text-sm">
											{ item.quantity.value }
										</div>
										<button
											type="button"
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

								<div className="flex-1 min-w-[85px] flex flex-col gap-1">
									<span className="text-[10px] text-muted-foreground font-medium px-1">الوحدة</span>
									{ isReturnMode ? (
										<div
											className="h-8 sm:h-9 px-2 flex items-center bg-muted/50 border border-border rounded-md text-xs sm:text-sm text-muted-foreground cursor-not-allowed truncate">
											{ item.unitName.value || "—" }
										</div>
									) : (
										<SelectInput<number>
											value={ item.itemUoMId }
											disabled={ item.itemType.value === ItemType.Service }
											options={
												item.uoMDtos.value?.map((m) => ({
													label: m.unitName.value,
													value: m.id.value
												})) || []
											}
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

								<div className="flex-1 min-w-[95px] flex flex-col gap-1">
									<span className="text-[10px] text-muted-foreground font-medium px-1 truncate">
										طريقة التسعير
									</span>
									{ isReturnMode ? (
										<div
											className="h-8 sm:h-9 px-2 flex items-center bg-muted/50 border border-border rounded-md text-xs sm:text-sm text-muted-foreground cursor-not-allowed truncate">
											{ item.pricingMethodName.value || "—" }
										</div>
									) : (
										<SelectInput<number>
											value={ item.pricingMethodId }
											disabled={ item.itemType.value === ItemType.Service }
											options={
												item.uoMDtos.value
													?.find((u) => u.id.value === item.itemUoMId.value)
													?.prices.value?.map((p) => ({
													label: p.pricingMethodName.value,
													value: p.pricingMethodId.value
												})) || []
											}
											onValueChange={ (pmId) =>
											{
												if (pmId)
												{
													const uom = item.uoMDtos.value?.find((u) => u.id.value === item.itemUoMId.value);
													const pmName = uom?.prices.value?.find(
														(p) => p.pricingMethodId.value === pmId
													)?.pricingMethodName.value;
													item.changePricingMethod(pmId, pmName);
												}
											} }
										/>
									) }
								</div>

								{/* Delete Button */ }
								<button
									type="button"
									className="p-1.5 sm:p-2 text-red-500 hover:bg-red-50 rounded-md transition-colors shrink-0 h-8 sm:h-9 flex items-center justify-center"
									onClick={ () => invoice.removeItem(index) }
								>
									<Trash2 className="w-4 h-4"/>
								</button>
							</div>
						</div>
					))
				) }
			</div>

			<div className="p-3 sm:p-4 bg-muted/20 border-t border-border shrink-0">
				<div className="space-y-2.5 mb-3 text-xs sm:text-sm">
					<div className="flex justify-between items-center text-muted-foreground">
						<span>المجموع (بدون ضريبة)</span>
						<span>
							{ baseTaxExclusive.toLocaleString(undefined, {
								minimumFractionDigits: 2,
								maximumFractionDigits: 2
							}) } <ErpCurrencyIcon className="w-3 h-3 inline"/>
						</span>
					</div>

					<div className="flex justify-between items-center text-muted-foreground">
						<span>الضريبة ({ mainTaxPerc }%)</span>
						<span>
							{ baseTaxAmount.toLocaleString(undefined, {
								minimumFractionDigits: 2,
								maximumFractionDigits: 2
							}) } <ErpCurrencyIcon className="w-3 h-3 inline"/>
						</span>
					</div>

					{ !isReturnMode && (
						<div
							className="flex flex-wrap sm:flex-nowrap justify-between items-center text-muted-foreground gap-2">
							<div className="flex items-center gap-1.5">
								<span>التسوية</span>
								<div className="flex items-center gap-1">
									<Button
										type="button"
										size="sm"
										variant={ isAddition.value ? "default" : "outline" }
										className="h-6 sm:h-7 px-2 text-[11px]"
										onClick={ () => onSwitchToggle(true) }
									>
										إضافة
									</Button>
									<Button
										type="button"
										size="sm"
										variant={ !isAddition.value ? "default" : "outline" }
										className="h-6 sm:h-7 px-2 text-[11px]"
										onClick={ () => onSwitchToggle(false) }
									>
										خصم
									</Button>
								</div>
							</div>
							<div className="w-24 sm:w-28">
								<NumberInput
									value={ displaySettlement }
									onChange={ onSettlementInput }
									min={ 0 }
									max={ isAddition.value ? undefined : basePrice }
									disabled={ items.length === 0 }
									className="h-7 sm:h-8 text-xs sm:text-sm"
								/>
							</div>
						</div>
					) }

					<div
						className="flex justify-between items-center font-bold text-base sm:text-lg pt-2 border-t border-border">
						<span>{ isReturnMode ? "إجمالي المسترد" : "الإجمالي المطلوب" }</span>
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
					className="w-full h-12 sm:h-14 text-base sm:text-lg font-bold gap-2"
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