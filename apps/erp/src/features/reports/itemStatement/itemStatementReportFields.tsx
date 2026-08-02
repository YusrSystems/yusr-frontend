import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { ChevronDown, Filter } from "lucide-react";
import { Button, Collapsible, CollapsibleContent, CollapsibleTrigger, FormField } from "yusr-ui";
import { signal } from "@preact/signals-react";
import { useSignals } from "@preact/signals-react/runtime";
import ItemsSearchableSelect from "@/core/components/searchableSelect/itemsSearchableSelect.tsx";
import StoresSearchableSelect from "@/core/components/searchableSelect/storesSearchableSelect.tsx";
import { ItemStatementReportRequest } from "@/features/reports/itemStatement/itemStatementReportRequest.ts";


interface ItemStatementReportFieldsProps
{
	onSubmit: (request: ItemStatementReportRequest) => void;
	isLoading?: boolean;
	initialItemId?: number;
	initialItemName?: string;
}

export function ItemStatementReportFields({
	onSubmit,
	initialItemId,
	initialItemName,
	isLoading = false
}: ItemStatementReportFieldsProps)
{
	useSignals();
	const {t} = useTranslation(["erpCommon", "common"]);

	const isOpen = useMemo(() => signal(true), []);
	const itemId = useMemo(() => signal<number | undefined>(initialItemId), [initialItemId]);
	const itemName = useMemo(() => signal<string | undefined>(initialItemName), [initialItemName]);
	const storeId = useMemo(() => signal<number>(), []);
	const storeName = useMemo(() => signal<string>(), []);

	const handleClear = () =>
	{
		itemId.value = undefined;
		itemName.value = undefined;
		storeId.value = undefined;
		storeName.value = undefined;
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
						<FormField label={ t("reports.item") }>
							<ItemsSearchableSelect id={ itemId } label={ itemName }/>
						</FormField>
						<FormField label={ t("itemStatement.store") }>
							<StoresSearchableSelect id={ storeId } label={ storeName }/>
						</FormField>
					</div>

					<div className="flex justify-end gap-2">
						<Button disabled={ isLoading } variant="outline" onClick={ handleClear }>
							{ t("common:filter.clear") }
						</Button>
						<Button
							disabled={ isLoading || !itemId.value }
							onClick={ () => onSubmit(new ItemStatementReportRequest({
								itemId: itemId.value!,
								storeId: storeId.value,
								storeName: storeName.value
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