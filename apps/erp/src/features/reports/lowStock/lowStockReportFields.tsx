import { useMemo, useState } from "react";
import { ChevronDown, Filter } from "lucide-react";
import { Button, Collapsible, CollapsibleContent, CollapsibleTrigger } from "yusr-ui";
import { signal } from "@preact/signals-react";
import { useSignals } from "@preact/signals-react/runtime";
import StoresSearchableSelect from "@/core/components/searchableSelect/storesSearchableSelect.tsx";
import { LowStockReportRequest } from "./lowStockReportRequest.ts";


interface LowStockReportFieldsProps
{
	onSubmit: (request: LowStockReportRequest) => void;
	isLoading?: boolean;
}

export function LowStockReportFields({onSubmit, isLoading = false}: LowStockReportFieldsProps)
{
	useSignals();

	const storeId = useMemo(() => signal<number | undefined>(undefined), []);
	const storeName = useMemo(() => signal<string | undefined>(undefined), []);

	const [isOpen, setIsOpen] = useState(true);

	const handleClear = () =>
	{
		storeId.value = undefined;
		storeName.value = undefined;
		handleApply();
	};

	const handleApply = () =>
	{
		onSubmit(new LowStockReportRequest({
			storeId: storeId.value,
			storeName: storeName.value
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
					<div className="flex flex-col gap-1.5">
						<label className="text-sm font-medium">المستودع (Store)</label>
						<StoresSearchableSelect id={ storeId } label={ storeName }/>
					</div>
				</div>
				<div className="flex justify-end gap-2 mt-6">
					<Button variant="outline" onClick={ handleClear } disabled={ isLoading }>مسح (Clear)</Button>
					<Button onClick={ handleApply } disabled={ isLoading }>تطبيق (Apply)</Button>
				</div>
			</CollapsibleContent>
		</Collapsible>
	);
}