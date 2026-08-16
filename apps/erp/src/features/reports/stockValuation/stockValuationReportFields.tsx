import { useEffect, useMemo, useState } from "react";
import { ChevronDown, Filter } from "lucide-react";
import {
	Button,
	Collapsible,
	CollapsibleContent,
	CollapsibleTrigger,
	DateField,
	DateService,
	FormField
} from "yusr-ui";
import { signal } from "@preact/signals-react";
import { useSignals } from "@preact/signals-react/runtime";
import StoresSearchableSelect from "@/core/components/searchableSelect/storesSearchableSelect.tsx";
import BrandsSearchableSelect from "@/core/components/searchableSelect/brandsSearchableSelect.tsx";
import CategoriesMultiSearchableSelect from "@/features/itemCategories/categoriesMultiSearchableSelect.tsx";
import { StockValuationReportRequest } from "./stockValuationReportRequest.ts";
import { Cubits } from "@/core/services/cubits.ts";


interface StockValuationReportFieldsProps
{
	onSubmit: (request: StockValuationReportRequest) => void;
	isLoading?: boolean;
}

export function StockValuationReportFields({onSubmit, isLoading = false}: StockValuationReportFieldsProps)
{
	useSignals();

	const asOfDate = useMemo(() => signal<string>(DateService.formatDateOnly(new Date())), []);
	const storeId = useMemo(() => signal<number | undefined>(undefined), []);
	const storeName = useMemo(() => signal<string | undefined>(undefined), []);

	const categoryIds = useMemo(() => signal<number[]>([]), []);
	const categoryLabels = useMemo(() => signal<Record<number, string>>({}), []);

	const brandId = useMemo(() => signal<number | undefined>(undefined), []);
	const brandName = useMemo(() => signal<string | undefined>(undefined), []);

	const [isOpen, setIsOpen] = useState(true);

	useEffect(() =>
	{
		Cubits.categories.init();
		Cubits.brands.init();
		Cubits.stores.init();
	}, []);

	const handleClear = () =>
	{
		asOfDate.value = DateService.formatDateOnly(new Date());
		storeId.value = undefined;
		storeName.value = undefined;
		categoryIds.value = [];
		categoryLabels.value = {};
		brandId.value = undefined;
		brandName.value = undefined;
		handleApply();
	};

	const handleApply = () =>
	{
		onSubmit(new StockValuationReportRequest({
			asOfDate: asOfDate.value,
			storeId: storeId.value ?? null,
			itemCategoryIds: categoryIds.value.length > 0 ? categoryIds.value : null,
			itemBrandId: brandId.value ?? null
		}));
	};

	return (
		<Collapsible open={ isOpen } onOpenChange={ setIsOpen }
		             className="bg-card border border-border rounded-lg shadow-sm mb-4 print:hidden">
			<CollapsibleTrigger asChild>
				<Button variant="ghost"
				        className="w-full flex justify-between items-center p-4 h-auto hover:bg-accent/50 rounded-lg">
					<div className="flex items-center gap-2 text-primary">
						<Filter className="h-5 w-5"/>
						<span className="font-semibold">تصفية التقرير</span>
					</div>
					<ChevronDown
						className={ `h-5 w-5 text-muted-foreground transition-transform duration-300 ${ isOpen ? "rotate-180" : "" }` }/>
				</Button>
			</CollapsibleTrigger>
			<CollapsibleContent className="px-4 pb-4">
				<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mt-2 items-end">
					<DateField
						label="إلى تاريخ"
						value={ asOfDate }
					/>
					<div className="flex flex-col gap-1.5">
						<label className="text-sm font-medium">المستودع</label>
						<StoresSearchableSelect id={ storeId } label={ storeName }/>
					</div>
					<FormField label="تصنيفات المادة">
						<CategoriesMultiSearchableSelect ids={ categoryIds } labels={ categoryLabels }/>
					</FormField>
					<FormField label="العلامة التجارية">
						<BrandsSearchableSelect id={ brandId } label={ brandName }/>
					</FormField>
				</div>
				<div className="flex justify-end gap-2 mt-6">
					<Button variant="outline" onClick={ handleClear } disabled={ isLoading }>مسح</Button>
					<Button onClick={ handleApply } disabled={ isLoading }>تطبيق</Button>
				</div>
			</CollapsibleContent>
		</Collapsible>
	);
}