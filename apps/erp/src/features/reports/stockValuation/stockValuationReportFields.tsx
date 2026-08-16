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
import { StockValuationReportRequest } from "./stockValuationReportRequest.ts";
import { Cubits } from "@/core/services/cubits.ts";
import CategoriesSearchableSelect from "@/features/itemCategories/categoriesSearchableSelect.tsx";

interface StockValuationReportFieldsProps
{
	onSubmit: (request: StockValuationReportRequest) => void;
	isLoading?: boolean;
}

export function StockValuationReportFields({onSubmit, isLoading = false}: StockValuationReportFieldsProps)
{
	useSignals();

	const defaultDate = useMemo(() =>
	{
		const params = new URLSearchParams(window.location.search);
		return params.get("asOfDate") || DateService.formatDateOnly(new Date());
	}, []);

	const asOfDate = useMemo(() => signal<string>(defaultDate), [defaultDate]);
	const storeId = useMemo(() => signal<number | undefined>(undefined), []);
	const categoryId = useMemo(() => signal<number | undefined>(undefined), []);
	const categoryName = useMemo(() => signal<string | undefined>(undefined), []);
	const brandId = useMemo(() => signal<number | undefined>(undefined), []);
	const brandName = useMemo(() => signal<string | undefined>(undefined), []);
	const [isOpen, setIsOpen] = useState(true);

	useEffect(() =>
	{
		Cubits.categories.init();
		Cubits.brands.init();
	}, []);

	const handleClear = () =>
	{
		asOfDate.value = defaultDate;
		storeId.value = undefined;
		categoryId.value = undefined;
		categoryName.value = undefined;
		brandId.value = undefined;
		brandName.value = undefined;

		onSubmit(new StockValuationReportRequest({
			asOfDate: defaultDate
		}));
	};

	const handleApply = () =>
	{
		onSubmit(new StockValuationReportRequest({
			asOfDate: asOfDate.value,
			storeId: storeId.value,
			categoryId: categoryId.value,
			brandId: brandId.value
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
						<span className="font-semibold">تصفية التقرير (Filters)</span>
					</div>
					<ChevronDown
						className={ `h-5 w-5 text-muted-foreground transition-transform duration-300 ${ isOpen ? "rotate-180" : "" }` }/>
				</Button>
			</CollapsibleTrigger>
			<CollapsibleContent className="px-4 pb-4">
				<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mt-2 items-end">
					<DateField
						label="إلى تاريخ (As Of Date)"
						value={ asOfDate }
					/>
					<div className="flex flex-col gap-1.5">
						<label className="text-sm font-medium">المستودع (Store)</label>
						<StoresSearchableSelect id={ storeId }/>
					</div>
					<FormField label="تصنيف المادة (Item Category)">
						<CategoriesSearchableSelect id={ categoryId } label={ categoryName }/>
					</FormField>
					<FormField label="العلامة التجارية (Item Brand)">
						<BrandsSearchableSelect id={ brandId } label={ brandName }/>
					</FormField>
				</div>
				<div className="flex justify-end gap-2 mt-6">
					<Button variant="outline" onClick={ handleClear } disabled={ isLoading }>مسح (Clear)</Button>
					<Button onClick={ handleApply } disabled={ isLoading }>تطبيق (Apply)</Button>
				</div>
			</CollapsibleContent>
		</Collapsible>
	);
}