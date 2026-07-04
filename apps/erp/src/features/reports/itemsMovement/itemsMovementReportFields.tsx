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
import {
	ItemsMovementReportGroupOption,
	ItemsMovementReportRequest,
	ItemsMovementReportTransType
} from "@/core/data/report/itemsMovementReportRequest.ts";
import ItemsSearchableSelect from "@/core/components/searchableSelect/itemsSearchableSelect.tsx";
import AccountsSearchableSelect from "@/core/components/searchableSelect/accountsSearchableSelect.tsx";
import StoresSearchableSelect from "@/core/components/searchableSelect/storesSearchableSelect.tsx";
import { AccountType } from "@/core/data/account.ts";
import { signal } from "@preact/signals-react";
import { useSignals } from "@preact/signals-react/runtime";


interface ItemsMovementReportFieldsProps
{
	onSubmit: (request: ItemsMovementReportRequest) => void;
	isLoading?: boolean;
}

export function ItemsMovementReportFields({onSubmit, isLoading = false}: ItemsMovementReportFieldsProps)
{
	useSignals();
	const {t} = useTranslation(["erpCommon", "common"]);

	const isOpen = useMemo(() => signal(true), []);

	const fromDate = useMemo(() => signal<string>(), []);
	const toDate = useMemo(() => signal<string>(), []);
	const transType = useMemo(() => signal<ItemsMovementReportTransType>(), []);
	const itemId = useMemo(() => signal<number>(), []);
	const itemName = useMemo(() => signal<string>(), []);
	const fromAccountId = useMemo(() => signal<number>(), []);
	const fromAccountName = useMemo(() => signal<string>(), []);
	const toAccountId = useMemo(() => signal<number>(), []);
	const toAccountName = useMemo(() => signal<string>(), []);
	const fromStoreId = useMemo(() => signal<number>(), []);
	const fromStoreName = useMemo(() => signal<string>(), []);
	const toStoreId = useMemo(() => signal<number>(), []);
	const toStoreName = useMemo(() => signal<string>(), []);
	const groupOption = useMemo(() => signal<ItemsMovementReportGroupOption>(), []);

	const handleClear = () =>
	{
		fromDate.value = undefined;
		toDate.value = undefined;
		transType.value = undefined;
		itemId.value = undefined;
		itemName.value = undefined;
		fromAccountId.value = undefined;
		fromAccountName.value = undefined;
		toAccountId.value = undefined;
		toAccountName.value = undefined;
		fromStoreId.value = undefined;
		fromStoreName.value = undefined;
		toStoreId.value = undefined;
		toStoreName.value = undefined;
		groupOption.value = undefined;

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
						<SelectField
							label={ t("reports.movementType") }
							value={ transType }
							options={ [
								{label: t("common:searchableSelect.nullOption"), value: undefined},
								{label: t("reports.sell"), value: ItemsMovementReportTransType.Sell},
								{label: t("reports.purchase"), value: ItemsMovementReportTransType.Purchase},
								{label: t("reports.sellReturn"), value: ItemsMovementReportTransType.SellReturn},
								{
									label: t("reports.purchaseReturn"),
									value: ItemsMovementReportTransType.PurchaseReturn
								},
								{label: t("reports.transfer"), value: ItemsMovementReportTransType.Transfer},
								{label: t("reports.settlement"), value: ItemsMovementReportTransType.Settlement}
							] }
						/>

						<FormField label={ t("reports.item") }>
							<ItemsSearchableSelect id={ itemId } label={ itemName }/>
						</FormField>
					</div>

					<div className="grid grid-cols-2 gap-3">
						<DateField label={ t("reports.fromDate") } value={ fromDate }/>
						<DateField label={ t("reports.toDate") } value={ toDate }/>
					</div>

					<div className="grid grid-cols-2 gap-3">
						<FormField label={ t("reports.fromAccount") }>
							<AccountsSearchableSelect
								id={ fromAccountId }
								label={ fromAccountName }
								types={ [AccountType.Client, AccountType.Supplier] }
							/>
						</FormField>
						<FormField label={ t("reports.toAccount") }>
							<AccountsSearchableSelect
								id={ toAccountId }
								label={ toAccountName }
								types={ [AccountType.Client, AccountType.Supplier] }
							/>
						</FormField>
					</div>

					<div className="grid grid-cols-2 gap-3">
						<FormField label={ t("reports.fromStore") }>
							<StoresSearchableSelect id={ fromStoreId } label={ fromStoreName }/>
						</FormField>
						<FormField label={ t("reports.toStore") }>
							<StoresSearchableSelect id={ toStoreId } label={ toStoreName }/>
						</FormField>
					</div>

					<SelectField
						label={ t("reports.groupBy") }
						value={ groupOption }
						options={ [
							{label: t("common:searchableSelect.nullOption"), value: undefined},
							{label: t("reports.item"), value: ItemsMovementReportGroupOption.Item},
							{label: t("reports.from"), value: ItemsMovementReportGroupOption.From},
							{label: t("reports.to"), value: ItemsMovementReportGroupOption.To},
							{label: t("reports.day"), value: ItemsMovementReportGroupOption.Day},
							{label: t("reports.month"), value: ItemsMovementReportGroupOption.Month},
							{label: t("reports.year"), value: ItemsMovementReportGroupOption.Year}
						] }
					/>

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
								transTypeId: transType.value ?? null,
								itemId: itemId.value ?? null,
								fromDate: fromDate.value ?? null,
								toDate: toDate.value ?? null,
								fromAccountId: fromAccountId.value ?? null,
								toAccountId: toAccountId.value ?? null,
								fromStoreId: fromStoreId.value ?? null,
								toStoreId: toStoreId.value ?? null,
								groupOption: groupOption.value ?? null
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