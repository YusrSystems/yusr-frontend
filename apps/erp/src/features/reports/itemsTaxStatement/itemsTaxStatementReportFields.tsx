import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { ChevronDown, Filter } from "lucide-react";
import {
	Button,
	Collapsible,
	CollapsibleContent,
	CollapsibleTrigger,
	DateField,
	FormField,
	SelectField
} from "yusr-ui";
import ItemsMultiSearchableSelect from "@/core/components/searchableSelect/itemsMultiSearchableSelect.tsx";
import { signal } from "@preact/signals-react";
import { useSignals } from "@preact/signals-react/runtime";
import { ItemsTaxStatementReportRequest, ItemsTaxStatementReportType } from "./itemsTaxStatementReportRequest";


interface ItemsTaxStatementReportFieldsProps
{
	onSubmit: (request: ItemsTaxStatementReportRequest) => void;
	isLoading?: boolean;
}

export function ItemsTaxStatementReportFields({onSubmit, isLoading = false}: ItemsTaxStatementReportFieldsProps)
{
	useSignals();
	const {t} = useTranslation(["erpCommon", "common"]);

	const isOpen = useMemo(() => signal(true), []);
	const type = useMemo(() => signal<ItemsTaxStatementReportType>(ItemsTaxStatementReportType.Sales), []);
	const fromDate = useMemo(() => signal<string>(), []);
	const toDate = useMemo(() => signal<string>(), []);
	const itemIds = useMemo(() => signal<number[]>([]), []);
	const itemLabels = useMemo(() => signal<Record<number, string>>([]), []);

	const handleClear = () =>
	{
		type.value = ItemsTaxStatementReportType.Sales;
		fromDate.value = undefined;
		toDate.value = undefined;
		itemIds.value = [];
		itemLabels.value = {};
		onSubmit(new ItemsTaxStatementReportRequest());
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
						<SelectField
							label={ t("reports.invoiceType") }
							value={ type }
							options={ [
								{label: t("reports.salesTaxReport"), value: ItemsTaxStatementReportType.Sales},
								{label: t("reports.purchasesTaxReport"), value: ItemsTaxStatementReportType.Purchases}
							] }
						/>

						<FormField label={ t("reports.item") }>
							<ItemsMultiSearchableSelect ids={ itemIds } labels={ itemLabels }/>
						</FormField>
					</div>

					<div className="grid grid-cols-2 gap-3">
						<DateField label={ t("reports.fromDate") } value={ fromDate }/>
						<DateField label={ t("reports.toDate") } value={ toDate }/>
					</div>

					<div className="flex justify-end gap-2">
						<Button disabled={ isLoading } variant="outline" onClick={ handleClear }>
							{ t("common:filter.clear") }
						</Button>
						<Button
							disabled={ isLoading }
							onClick={ () => onSubmit(new ItemsTaxStatementReportRequest({
								type: type.value ?? ItemsTaxStatementReportType.Sales,
								fromDate: fromDate.value ?? null,
								toDate: toDate.value ?? null,
								itemIds: itemIds.value.length ? itemIds.value : null
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