import { useEffect, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { ChevronDown, Filter } from "lucide-react";
import { Button, Collapsible, CollapsibleContent, CollapsibleTrigger, DateField, FormField } from "yusr-ui";
import { signal } from "@preact/signals-react";
import { useSignals } from "@preact/signals-react/runtime";
import { ItemsProfitabilityReportRequest } from "./itemsProfitabilityReportRequest";
import StoresSearchableSelect from "@/core/components/searchableSelect/storesSearchableSelect";
import ItemsMultiSearchableSelect from "@/core/components/searchableSelect/itemsMultiSearchableSelect";
import CategoriesMultiSearchableSelect from "@/features/itemCategories/categoriesMultiSearchableSelect";
import BrandsMultiSearchableSelect from "@/core/components/searchableSelect/brandsMultiSearchableSelect";
import { Cubits } from "@/core/services/cubits";


interface ItemsProfitabilityReportFieldsProps
{
	onSubmit: (request: ItemsProfitabilityReportRequest) => void;
	isLoading?: boolean;
}

export function ItemsProfitabilityReportFields({onSubmit, isLoading = false}: ItemsProfitabilityReportFieldsProps)
{
	useSignals();
	const {t} = useTranslation(["erpCommon", "common", "stocking", "accounting"]);
	const isOpen = useMemo(() => signal(true), []);
	const defaults = useMemo(() =>
	{
		const req = new ItemsProfitabilityReportRequest();
		const params = new URLSearchParams(window.location.search);
		if (params.get("fromDate")) req.fromDate = params.get("fromDate")!;
		if (params.get("toDate")) req.toDate = params.get("toDate")!;
		return req;
	}, []);

	const fromDate = useMemo(() => signal<string>(defaults.fromDate), [defaults.fromDate]);
	const toDate = useMemo(() => signal<string>(defaults.toDate), [defaults.toDate]);
	const storeId = useMemo(() => signal<number | undefined>(undefined), []);
	const storeName = useMemo(() => signal<string | undefined>(undefined), []);
	const itemIds = useMemo(() => signal<number[]>([]), []);
	const itemLabels = useMemo(() => signal<Record<number, string>>({}), []);
	const categoryIds = useMemo(() => signal<number[]>([]), []);
	const categoryLabels = useMemo(() => signal<Record<number, string>>({}), []);
	const brandIds = useMemo(() => signal<number[]>([]), []);
	const brandLabels = useMemo(() => signal<Record<number, string>>({}), []);

	useEffect(() =>
	{
		Cubits.categories.init();
		Cubits.brands.init();
		Cubits.stores.init();
		Cubits.items.init();
	}, []);

	const handleClear = () =>
	{
		fromDate.value = defaults.fromDate;
		toDate.value = defaults.toDate;
		storeId.value = undefined;
		storeName.value = undefined;
		itemIds.value = [];
		itemLabels.value = {};
		categoryIds.value = [];
		categoryLabels.value = {};
		brandIds.value = [];
		brandLabels.value = {};
		onSubmit(new ItemsProfitabilityReportRequest({
			fromDate: defaults.fromDate,
			toDate: defaults.toDate
		}));
	};

	const handleApply = () =>
	{
		onSubmit(new ItemsProfitabilityReportRequest({
			fromDate: fromDate.value,
			toDate: toDate.value,
			storeId: storeId.value ?? null,
			storeName: storeName.value ?? null,
			itemCategoryIds: categoryIds.value.length > 0 ? categoryIds.value : null,
			itemBrandIds: brandIds.value.length > 0 ? brandIds.value : null,
			itemIds: itemIds.value.length > 0 ? itemIds.value : null
		}));
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
					<div className="grid grid-cols-1 md:grid-cols-3 gap-3">
						<DateField label={ t("reports.fromDate") } value={ fromDate }/>
						<DateField label={ t("reports.toDate") } value={ toDate }/>
						<FormField label={ t("reports.store", "المستودع") }>
							<StoresSearchableSelect id={ storeId } label={ storeName }/>
						</FormField>
					</div>
					<div className="grid grid-cols-1 md:grid-cols-3 gap-3">
						<FormField label={ t("stocking:items.category", "التصنيف") }>
							<CategoriesMultiSearchableSelect ids={ categoryIds } labels={ categoryLabels }/>
						</FormField>
						<FormField label={ t("stocking:items.brand", "العلامة التجارية") }>
							<BrandsMultiSearchableSelect ids={ brandIds } labels={ brandLabels }/>
						</FormField>
						<FormField label={ t("sidebar.items") }>
							<ItemsMultiSearchableSelect ids={ itemIds } labels={ itemLabels }/>
						</FormField>
					</div>
					<div className="flex justify-end gap-2">
						<Button disabled={ isLoading } variant="outline" onClick={ handleClear }>
							{ t("common:filter.clear") }
						</Button>
						<Button disabled={ isLoading } onClick={ handleApply }>
							{ t("common:filter.apply") }
						</Button>
					</div>
				</div>
			</CollapsibleContent>
		</Collapsible>
	);
}