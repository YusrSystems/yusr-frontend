import { GripVertical, Trash2 } from "lucide-react";
import React, { useCallback, useMemo } from "react";
import { useTranslation } from "react-i18next";
import {
	cn,
	type ColumnDef,
	ColumnVisibilityToggle,
	i18n,
	NumberField,
	SelectField,
	SystemPermissionsActions,
	TablePreview,
	TextAreaField,
	TextField,
	Tooltip,
	TooltipContent,
	TooltipTrigger,
	useColumnVisibility
} from "yusr-ui";
import { SystemPermissionsResources } from "@/core/auth/systemPermissionsResources.ts";
import { InvoiceType } from "@/core/data/invoiceOld.ts";
import InvoiceItemsMath from "../../logic/invoiceItemsMath";
import { ItemProfitDialog } from "../profit/ItemProfitDialog";
import Invoice, { InvoiceMode } from "@/core/data/invoices/invoice.ts";
import { signal } from "@preact/signals-react";
import { Services } from "@/core/services/services.ts";
import type { InvoiceItem } from "@/core/data/invoices/invoiceItem.ts";


export default function InvoiceItemsTable({invoice}: { invoice: Invoice })
{
	const {t} = useTranslation("accounting");
	const focusedQuantityIndex = useMemo(() => signal<number | undefined>(undefined), []);

	const hasSettlementPerm = Services.auth.hasAuth(
		SystemPermissionsResources.InvoiceAddSettlement,
		SystemPermissionsActions.Get
	);

	const showItemProfitPerm = Services.auth.hasAuth(
		SystemPermissionsResources.InvoiceShowItemProfit,
		SystemPermissionsActions.Get
	);

	const showProfit = showItemProfitPerm
		&& (invoice.type.value === InvoiceType.Sell || invoice.type.value === InvoiceType.Quotation);

	const COLUMNS: ColumnDef[] = [
		{key: "cost", label: t("invoices.cost")},
		{key: "priceWithoutTax", label: t("invoices.priceWithoutTax")},
		{key: "taxPercentage", label: t("invoices.taxPercentage")},
		...(hasSettlementPerm ? [{key: "settlement", label: t("invoices.settlement")}] : []),
		{key: "finalCost", label: t("invoices.finalCost")},
		{key: "finalPriceWithoutTax", label: t("invoices.finalPriceWithoutTax")}
	];

	const {visible, toggle, isVisible} = useColumnVisibility(
		"invoice_columns",
		COLUMNS.map((c) => c.key)
	);

	const getMaxAllowedQuantity = (qtn: number) =>
	{
		if (invoice.mode.value === InvoiceMode.Return)
		{
			return qtn;
		}
		if (invoice.type.value !== InvoiceType.Sell && invoice.type.value !== InvoiceType.Quotation)
		{
			return Number.MAX_SAFE_INTEGER;
		}

		return Services.auth.hasAuth(
			SystemPermissionsResources.InvoiceSellBeyondAvailableQuantity,
			SystemPermissionsActions.Get
		)
			? Number.MAX_SAFE_INTEGER
			: qtn;
	};

	const getMinAllowedTaxInclusivePrice = (originalTaxInclusivePrice: number) =>
	{
		if (invoice.type.value !== InvoiceType.Sell && invoice.type.value !== InvoiceType.Quotation)
		{
			return 0;
		}

		return Services.auth.hasAuth(
			SystemPermissionsResources.InvoiceSellBelowSellingPrice,
			SystemPermissionsActions.Get
		)
			? 0
			: originalTaxInclusivePrice;
	};

	// Move Hooks BEFORE the early return to comply with the Rules of Hooks
	const dragState = useMemo(() => signal<{
		draggedIndex: number | undefined,
		dragOverIndex: number | undefined
	}>({draggedIndex: undefined, dragOverIndex: undefined}), []);

	const handleDragStart = useCallback((index: number) =>
	{
		dragState.value.draggedIndex = index;
		dragState.value.dragOverIndex = undefined;
	}, [dragState.value]);

	const handleDragOver = useCallback((e: React.DragEvent, index: number) =>
	{
		e.preventDefault(); // required to allow the drop
		if (dragState.value.dragOverIndex !== index)
		{
			dragState.value.dragOverIndex = index;
		}
	}, [dragState.value]);

	const handleDrop = useCallback(
		(reorderedItems: InvoiceItem[]) =>
		{
			invoice.invoiceItems.value = reorderedItems;
			dragState.value.draggedIndex = undefined;
			dragState.value.dragOverIndex = undefined;
		},
		[dragState.value, invoice]
	);

	const handleDragEnd = useCallback(() =>
	{
		// Runs when drag is cancelled (e.g. Escape key) without a valid drop
		dragState.value.draggedIndex = undefined;
		dragState.value.dragOverIndex = undefined;
	}, [dragState.value]);

	if (invoice.invoiceItems.value?.length === 0)
	{
		return <TablePreview.Empty/>;
	}

	const fixedColCount = 7; // drag handler + number + item + pricingMethod + quantity + price + totalPrice
	const actionColCount = (showProfit ? 1 : 0) + 1; // profit + delete
	const visibleCount = COLUMNS.filter((c) => isVisible(c.key)).length;
	const totalColSpan = fixedColCount + visibleCount + actionColCount;

	const handleRowDrop = () =>
	{
		const {draggedIndex, dragOverIndex} = dragState.value;

		if (draggedIndex == undefined || dragOverIndex == undefined || draggedIndex === dragOverIndex)
		{
			return;
		}

		const items = [...(invoice.invoiceItems.value ?? [])];
		const [removed] = items.splice(draggedIndex, 1);

		if (removed != undefined)
		{
			items.splice(dragOverIndex, 0, removed);
		}

		handleDrop(items);
	};

	return (
		<div className="w-full border border-border rounded-lg shadow-sm bg-background">
			<div className="flex justify-end p-2 border-b border-border">
				<ColumnVisibilityToggle columns={ COLUMNS } visible={ visible } toggle={ toggle }/>
			</div>

			<div className="max-h-100 overflow-y-auto overflow-x-auto">
				<table className="relative w-full text-sm text-right">
					<thead className="sticky top-0 bg-muted z-50 border-b border-border">
					<tr>
						<th className="p-3 w-5"/>
						<th className="p-3 font-semibold w-16 text-muted-foreground">{ t("invoices.number") }</th>
						<th className="p-3 font-semibold text-start w-40">{ t("invoices.item") }</th>
						<th className="p-3 font-semibold text-start w-20 min-w-20">{ t("invoices.pricingMethod") }</th>
						{ isVisible("cost") && (
							<th className="p-3 font-semibold text-start w-25 min-w-25">{ t("invoices.cost") }</th>
						) }
						<th className="p-3 font-semibold text-start w-25 min-w-25">{ t("invoices.quantity") }</th>
						{ isVisible("priceWithoutTax") && (
							<th className="p-3 font-semibold text-start w-30 min-w-30">{ t("invoices.priceWithoutTax") }</th>
						) }
						{ isVisible("taxPercentage") && (
							<th className="p-3 font-semibold text-start w-18 min-w-18">{ t("invoices.taxPercentage") }</th>
						) }
						<th className="p-3 font-semibold text-start w-30 min-w-30">{ t("invoices.priceAfterTax") }</th>
						{ hasSettlementPerm && isVisible("settlement") && (
							<th className="p-3 font-semibold text-start w-25 min-w-25">{ t("invoices.settlement") }</th>
						) }
						{ isVisible("finalCost") && (
							<th className="p-3 font-semibold text-start w-35 min-w-35">{ t("invoices.finalCost") }</th>
						) }
						{ isVisible("finalPriceWithoutTax") && (
							<th className="p-3 font-semibold text-start w-35 min-w-35">{ t("invoices.finalPriceWithoutTax") }</th>
						) }
						<th className="p-3 font-semibold text-start w-35 min-w-35">{ t("invoices.finalPriceWithTax") }</th>
						{ showProfit && <th className="p-4 font-semibold w-3 text-center"></th> }
						<th className="p-4 font-semibold w-3 text-center"></th>
					</tr>
					</thead>
					<tbody>
					{ invoice.invoiceItems.value?.map((invoiceItem, index) =>
					{
						const isDragging = dragState.value.draggedIndex === index;
						const isDraggingOver = dragState.value.dragOverIndex === index;
						const showToolTip = (invoice.type.value === InvoiceType.Purchase || invoice.type.value === InvoiceType.Sell)
							&& invoice.mode.value != InvoiceMode.Return;
						const multiplier = invoice.type.value === InvoiceType.Sell ? -1 : 1;
						const selectedMethod = invoiceItem.itemUnitPricingMethods.value?.find(
							(p) => p.id.value === invoiceItem.itemUnitPricingMethodId.value);
						const remaining = invoiceItem.originalQuantity.value
							+ invoiceItem.quantity.value * (selectedMethod?.quantityMultiplier.value ?? 1) * multiplier;
						const isLowStock = remaining < 0;

						return (
							<React.Fragment key={ `${ invoiceItem.id.value }-${ index }` }>
								<tr
									draggable={ !invoice.isDisabled }
									onDragStart={ () => handleDragStart(index) }
									onDragOver={ (e) => handleDragOver(e, index) }
									onDrop={ handleRowDrop }
									onDragEnd={ handleDragEnd }
									className={ [
										"border-border last:border-0 transition-colors",
										isDragging ? "opacity-40" : "hover:bg-muted/20",
										isDraggingOver ? "border-t-2 border-t-primary" : ""
									].join(" ") }
								>
									<td className={ `px-2 pt-2 ${ invoice.isDisabled ? "invisible" : "cursor-grab active:cursor-grabbing" }` }>
										<GripVertical className="h-4 w-4 text-muted-foreground"/>
									</td>

									<td className="px-2 pt-2 font-bold text-muted-foreground">
										{ index + 1 }
									</td>

									<td className="px-2 pt-2">
										<div
											className="font-semibold text-start text-foreground">{ invoiceItem.itemName }</div>
									</td>

									<td className="px-2 pt-2">
										{ (invoice.isDisabled || invoice.mode.value === InvoiceMode.Return)
											? <div
												className="font-semibold text-foreground">{ invoiceItem.itemUnitPricingMethodName }</div>
											: (
												<SelectField<number>
													value={ invoiceItem.itemUnitPricingMethodId }
													placeholder={ t("invoices.selectPricingMethod") }
													error={ invoiceItem.getError("itemUnitPricingMethodId") }
													disabled={ invoice.isDisabled }
													options={ invoiceItem.itemUnitPricingMethods.value?.map((m) => ({
														label: m.itemUnitPricingMethodName.value,
														value: m.id.value
													})) || [] }
													onValueChange={ (iupmId) => invoiceItem.changeIupm(iupmId) }
												/>
											) }
									</td>

									{ isVisible("cost") && (
										<td className="px-2 pt-2">
											<NumberField disabled value={ invoiceItem.cost }/>
										</td>
									) }

									<td className="px-2 pt-2">
										<Tooltip open={ focusedQuantityIndex.value === index && showToolTip }>
											<TooltipTrigger asChild>
												<NumberField
													min={ 0 }
													step={ 0.1 }
													max={ getMaxAllowedQuantity(invoiceItem.originalQuantity.value) }
													value={ invoiceItem.quantity }
													onChange={ (newValue) => newValue && invoiceItem.changeQuantity(newValue) }
													disabled={ invoice.mode.value === InvoiceMode.Return ? false : invoice.isDisabled }
													onFocus={ () => focusedQuantityIndex.value = index }
													onBlur={ () => focusedQuantityIndex.value = undefined }
												/>
											</TooltipTrigger>
											<TooltipContent className="flex flex-col gap-1 min-w-40" dir={ i18n.dir() }>
                                                <span className="text-xs">
                                                    { t("invoices.quantityInStore") }
                                                </span>
												<span
													className={ cn("text-lg font-medium", isLowStock && "text-red-600 dark:text-red-400") }>
                                                    { remaining }
                                                </span>
											</TooltipContent>
										</Tooltip>
									</td>

									{ isVisible("priceWithoutTax") && (
										<td className="px-2 pt-2">
											<NumberField disabled value={ invoiceItem.taxExclusivePrice }/>
										</td>
									) }

									{ isVisible("taxPercentage") && (
										<td className="px-2 pt-2">
											<NumberField value={ invoiceItem.totalTaxesPerc } disabled/>
										</td>
									) }

									<td className="px-2 pt-2">
										<NumberField
											min={ getMinAllowedTaxInclusivePrice(invoiceItem.originalTaxInclusivePrice.value) }
											value={ invoiceItem.taxInclusivePrice }
											disabled={ invoice.isDisabled || invoice.mode.value === InvoiceMode.Return }
											onChange={ (newVal) => newVal && invoiceItem.changeTaxInclusivePrice(newVal) }
										/>
									</td>

									{ hasSettlementPerm && isVisible("settlement") && (
										<td className="px-2 pt-2">
											<NumberField
												value={ invoiceItem.settlement }
												disabled={ invoice.isDisabled || invoice.mode.value === InvoiceMode.Return }
												onChange={ (newValue) => newValue && invoiceItem.changeSettlement(newValue) }
											/>
										</td>
									) }

									{ isVisible("finalCost") && (
										<td className="px-2 pt-2">
											<TextField
												value={ InvoiceItemsMath.CalcTotalCost(invoiceItem.cost.value, invoiceItem.quantity.value).toString() }
												disabled
											/>
										</td>
									) }

									{ isVisible("finalPriceWithoutTax") && (
										<td className="px-2 pt-2">
											<TextField value={ invoiceItem.taxExclusiveTotalPrice } disabled/>
										</td>
									) }

									<td className="px-2 pt-2">
										<TextField value={ invoiceItem.taxInclusiveTotalPrice } disabled/>
									</td>

									{ showProfit && (
										<td className="px-2 pt-2 text-center">
											<ItemProfitDialog invoiceItem={ invoiceItem }/>
										</td>
									) }

									<td className="px-2 pt-2 text-center">
										{ !invoice.isDisabled && (
											<button
												type="button"
												onClick={ () => invoice.removeItem(index) }
												className="p-2 text-red-500 hover:text-red-700 hover:bg-red-500/10 rounded-md transition-colors"
												aria-label={ t("invoices.deleteItem") }
											>
												<Trash2 className="h-5 w-5"/>
											</button>
										) }
									</td>
								</tr>

								<tr
									className="bg-muted/10 border-b"
									onDragOver={ (e) => handleDragOver(e, index) }
									onDrop={ handleRowDrop }
								>
									<td colSpan={ totalColSpan } className="px-5 pt-1 pb-3">
										<TextAreaField
											collapsible
											collapsedHeight={ 36 }
											expandedHeight={ 150 }
											label=""
											placeholder={ t("invoices.addDiscription") }
											value={ invoiceItem.notes }
											disabled={ invoice.isDisabled || invoice.mode.value === InvoiceMode.Return }
										/>
									</td>
								</tr>
							</React.Fragment>
						);
					}) }
					</tbody>
				</table>
			</div>
		</div>
	);
}
