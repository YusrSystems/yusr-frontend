import { useEffect, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { ChevronDown, Filter } from "lucide-react";
import { Button, Collapsible, CollapsibleContent, CollapsibleTrigger } from "yusr-ui";
import { signal } from "@preact/signals-react";
import { useSignals } from "@preact/signals-react/runtime";
import StoresSearchableSelect from "@/core/components/searchableSelect/storesSearchableSelect.tsx";
import { LowStockReportRequest } from "./lowStockReportRequest.ts";
import { Cubits } from "@/core/services/cubits.ts";


interface LowStockReportFieldsProps
{
	onSubmit: (request: LowStockReportRequest) => void;
	isLoading?: boolean;
}

export function LowStockReportFields({onSubmit, isLoading = false}: LowStockReportFieldsProps)
{
	useSignals();
	const {t} = useTranslation(["erpCommon", "common"]);

	const isOpen = useMemo(() => signal(true), []);
	const storeId = useMemo(() => signal<number | undefined>(undefined), []);
	const storeName = useMemo(() => signal<string | undefined>(undefined), []);

	useEffect(() =>
	{
		Cubits.stores.init();
	}, []);

	const handleClear = () =>
	{
		storeId.value = undefined;
		storeName.value = undefined;
		handleApply();
	};

	const handleApply = () =>
	{
		onSubmit(new LowStockReportRequest({
			storeId: storeId.value ?? null,
			storeName: storeName.value ?? null
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
					<div className="grid grid-cols-1 md:grid-cols-2 gap-3">
						<div className="flex flex-col gap-1.5">
							<label className="text-sm font-medium">{ t("reports.store", "المستودع") }</label>
							<StoresSearchableSelect id={ storeId } label={ storeName }/>
						</div>
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