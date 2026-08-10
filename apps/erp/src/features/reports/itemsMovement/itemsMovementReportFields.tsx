import { useEffect, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { ChevronDown, Filter } from "lucide-react";
import {
	Button,
	Collapsible,
	CollapsibleContent,
	CollapsibleTrigger,
	DateField,
	FormField,
	MultiSelectField
} from "yusr-ui";
import { ItemsMovementReportRequest } from "@/features/reports/itemsMovement/itemsMovementReportRequest.ts";
import StoresSearchableSelect from "@/core/components/searchableSelect/storesSearchableSelect.tsx";
import { PartnersSearchableSelect } from "@/core/components/searchableSelect/partnersSearchableSelect.tsx";
import { signal } from "@preact/signals-react";
import { useSignals } from "@preact/signals-react/runtime";
import ItemsMultiSearchableSelect from "@/core/components/searchableSelect/itemsMultiSearchableSelect.tsx";
import CategoriesMultiSearchableSelect from "@/core/components/searchableSelect/categoriesMultiSearchableSelect.tsx";
import BrandsMultiSearchableSelect from "@/core/components/searchableSelect/brandsMultiSearchableSelect.tsx";
import { DocumentType } from "@/core/types/documentType.ts";
import { Cubits } from "@/core/services/cubits.ts";


interface ItemsMovementReportFieldsProps
{
	onSubmit: (request: ItemsMovementReportRequest) => void;
	isLoading?: boolean;
}

export function ItemsMovementReportFields({onSubmit, isLoading = false}: ItemsMovementReportFieldsProps)
{
	useSignals();
	const {t} = useTranslation(["erpCommon", "common", "stocking", "accounting"]);

	const isOpen = useMemo(() => signal(true), []);

	const fromDate = useMemo(() => signal<string>(), []);
	const toDate = useMemo(() => signal<string>(), []);
	const documentTypes = useMemo(() => signal<DocumentType[]>([]), []);
	const itemIds = useMemo(() => signal<number[]>([]), []);
	const itemLabels = useMemo(() => signal<Record<number, string>>({}), []);
	const partnerId = useMemo(() => signal<number>(), []);
	const partnerName = useMemo(() => signal<string>(), []);
	const storeId = useMemo(() => signal<number>(), []);
	const storeName = useMemo(() => signal<string>(), []);

	const categoryIds = useMemo(() => signal<number[]>([]), []);
	const categoryLabels = useMemo(() => signal<Record<number, string>>({}), []);
	const brandIds = useMemo(() => signal<number[]>([]), []);
	const brandLabels = useMemo(() => signal<Record<number, string>>({}), []);

	useEffect(() =>
	{
		Cubits.categories.init();
		Cubits.brands.init();
	}, []);

	const handleClear = () =>
	{
		fromDate.value = undefined;
		toDate.value = undefined;
		documentTypes.value = [];
		itemIds.value = [];
		itemLabels.value = {};
		partnerId.value = undefined;
		partnerName.value = undefined;
		storeId.value = undefined;
		storeName.value = undefined;
		categoryIds.value = [];
		categoryLabels.value = {};
		brandIds.value = [];
		brandLabels.value = {};

		// Trigger the callback with a clean, default request instance
		onSubmit(new ItemsMovementReportRequest());
	};

	return (
		<Collapsible
			open={ isOpen.value }
			onOpenChange={ (open) => isOpen.value = open }
			className="bg-card border border-border rounded-t-lg"
		>
			<CollapsibleTrigger asChild>
				<button
					type="button"
					className="w-full flex items-center justify-between px-4 py-3 text-sm font-medium bg-muted"
				>
					<span className="flex items-center gap-2">
						<Filter className="h-4 w-4"/>
						{ t("common:filter.title") }
					</span>
					<ChevronDown
						className={ `h-4 w-4 transition-transform duration-200 ${ isOpen.value ? "rotate-180" : "" }` }
					/>
				</button>
			</CollapsibleTrigger>

			<CollapsibleContent>
				<div className="flex flex-col gap-4 p-4 border-t border-border">
					<div className="grid grid-cols-2 gap-3">
						<MultiSelectField
							label={ t("reports.movementType") }
							value={ documentTypes }
							options={ [
								{label: t("accounting:invoices.sellInvoice"), value: DocumentType.Sales},
								{label: t("accounting:invoices.purchaseInvoice"), value: DocumentType.Purchase},
								{label: t("accounting:invoices.sellReturn"), value: DocumentType.SalesReturn},
								{label: t("accounting:invoices.purchaseReturn"), value: DocumentType.PurchaseReturn},
								{label: t("sidebar.itemTransfers"), value: DocumentType.ItemTransfer},
								{label: t("sidebar.itemsSettlements"), value: DocumentType.ItemsSettlement},
								{label: t("sidebar.costAdjustments"), value: DocumentType.CostAdjustment}
							] }
						/>

						<FormField label={ t("sidebar.items") }>
							<ItemsMultiSearchableSelect ids={ itemIds } labels={ itemLabels }/>
						</FormField>
					</div>

					<div className="grid grid-cols-2 gap-3">
						<FormField label={ t("stocking:items.category", "التصنيف") }>
							<CategoriesMultiSearchableSelect ids={ categoryIds } labels={ categoryLabels }/>
						</FormField>

						<FormField label={ t("stocking:items.brand", "العلامة التجارية") }>
							<BrandsMultiSearchableSelect ids={ brandIds } labels={ brandLabels }/>
						</FormField>
					</div>

					<div className="grid grid-cols-2 gap-3">
						<DateField label={ t("reports.fromDate") } value={ fromDate }/>
						<DateField label={ t("reports.toDate") } value={ toDate }/>
					</div>

					<div className="grid grid-cols-2 gap-3">
						<FormField label={ t("reports.partner", "الجهة") }>
							<PartnersSearchableSelect
								id={ partnerId }
								label={ partnerName }
							/>
						</FormField>
						<FormField label={ t("reports.store", "المستودع") }>
							<StoresSearchableSelect id={ storeId } label={ storeName }/>
						</FormField>
					</div>

					<div className="flex justify-end gap-2">
						<Button
							className="self-end"
							disabled={ isLoading }
							variant="outline"
							onClick={ handleClear }
						>
							{ t("common:filter.clear") }
						</Button>
						<Button
							className="self-end"
							disabled={ isLoading }
							onClick={ () => onSubmit(new ItemsMovementReportRequest({
								documentTypes: documentTypes.value.length ? documentTypes.value : null,
								itemIds: itemIds.value.length ? itemIds.value : null,
								categoryIds: categoryIds.value.length ? categoryIds.value : null,
								brandIds: brandIds.value.length ? brandIds.value : null,
								fromDate: fromDate.value ?? null,
								toDate: toDate.value ?? null,
								partnerId: partnerId.value ?? null,
								partnerName: partnerName.value ?? null,
								storeId: storeId.value ?? null,
								storeName: storeName.value ?? null
							})) }
						>
							{ t("common:filter.apply") }
						</Button>
					</div>
				</div>
			</CollapsibleContent>
		</Collapsible>
	);
}