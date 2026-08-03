import { useEffect, useMemo, useState } from "react";
import { ChevronDown, Filter } from "lucide-react";
import { Button, Collapsible, CollapsibleContent, CollapsibleTrigger, DateField, SelectField } from "yusr-ui";
import { signal } from "@preact/signals-react";
import { useSignals } from "@preact/signals-react/runtime";
import StoresSearchableSelect from "@/core/components/searchableSelect/storesSearchableSelect.tsx";
import { ItemMetadataTempService } from "@/core/networking/itemMetadataTempService.ts";
import { StockValuationReportRequest } from "./stockValuationReportRequest.ts";


interface StockValuationReportFieldsProps
{
	onSubmit: (request: StockValuationReportRequest) => void;
	isLoading?: boolean;
}

export function StockValuationReportFields({onSubmit, isLoading = false}: StockValuationReportFieldsProps)
{
	useSignals();

	const asOfDate = useMemo(() => signal<string | undefined>(new Date().toISOString()), []);
	const storeId = useMemo(() => signal<number | undefined>(undefined), []);
	const itemClass = useMemo(() => signal<string | undefined>(undefined), []);
	const itemBrand = useMemo(() => signal<string | undefined>(undefined), []);

	const [isOpen, setIsOpen] = useState(true);
	const [classes, setClasses] = useState<string[]>([]);
	const [brands, setBrands] = useState<string[]>([]);

	useEffect(() =>
	{
		// Call the methods directly on ItemMetadataTempService without using 'new'
		ItemMetadataTempService.getDistinctClasses().then(setClasses);
		ItemMetadataTempService.getDistinctBrands().then(setBrands);
	}, []);

	const classOptions = useMemo(() => [
		{label: "الكل (All)", value: ""},
		...classes.map(c => ({label: c, value: c}))
	], [classes]);

	const brandOptions = useMemo(() => [
		{label: "الكل (All)", value: ""},
		...brands.map(b => ({label: b, value: b}))
	], [brands]);

	const handleClear = () =>
	{
		asOfDate.value = new Date().toISOString();
		storeId.value = undefined;
		itemClass.value = undefined;
		itemBrand.value = undefined;
		handleApply();
	};

	const handleApply = () =>
	{
		onSubmit(new StockValuationReportRequest({
			asOfDate: asOfDate.value,
			storeId: storeId.value,
			itemClass: itemClass.value || undefined,
			itemBrand: itemBrand.value || undefined
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
					<SelectField
						label="تصنيف المادة (Item Class)"
						value={ itemClass }
						options={ classOptions }
					/>
					<SelectField
						label="العلامة التجارية (Item Brand)"
						value={ itemBrand }
						options={ brandOptions }
					/>
				</div>
				<div className="flex justify-end gap-2 mt-6">
					<Button variant="outline" onClick={ handleClear } disabled={ isLoading }>مسح (Clear)</Button>
					<Button onClick={ handleApply } disabled={ isLoading }>تطبيق (Apply)</Button>
				</div>
			</CollapsibleContent>
		</Collapsible>
	);
}