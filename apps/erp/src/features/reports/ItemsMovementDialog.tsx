import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import {
	Button,
	DateField,
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	FormField,
	SelectField
} from "yusr-ui";
import {
	ItemsMovementReportGroupOption,
	ItemsMovementReportRequest,
	ItemsMovementReportTransType
} from "@/core/data/report/itemsMovementReportRequest.ts";
import ReportConstants from "../../core/data/report/reportConstants";
import ReportButton from "./reportButton";
import { signal } from "@preact/signals-react";
import ItemsSearchableSelect from "@/core/components/searchableSelect/itemsSearchableSelect.tsx";
import AccountsSearchableSelect from "@/core/components/searchableSelect/accountsSearchableSelect.tsx";
import { AccountType } from "@/core/data/account.ts";
import StoresSearchableSelect from "@/core/components/searchableSelect/storesSearchableSelect.tsx";


export default function ItemsMovementDialog()
{
	const {t, i18n} = useTranslation("erpCommon");

	const isOpen = useMemo(() => signal(false), []);
	const fromDate = useMemo(() => signal<Date>(), []);
	const toDate = useMemo(() => signal<Date>(), []);
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

	return (
		<>
			<Button variant="outline" size="sm" onClick={ () => isOpen.value = true }>
				{ t("reports.create") }
			</Button>
			<Dialog open={ isOpen.value } onOpenChange={ (open) => isOpen.value = open }>
				<DialogContent dir={ i18n.dir() } className="sm:max-w-md">
					<DialogHeader>
						<DialogTitle>{ t("reports.itemsMovement") }</DialogTitle>
						<DialogDescription>{ t("reports.itemsMovementDescription") }</DialogDescription>
					</DialogHeader>

					<div className="flex flex-col gap-4 py-2">
						<SelectField
							label={ t("reports.movementType") }
							value={ transType }
							options={ [
								{label: t("reports.sell"), value: ItemsMovementReportTransType.Sell},
								{label: t("reports.purchase"), value: ItemsMovementReportTransType.Purchase},
								{
									label: t("reports.sellReturn"),
									value: ItemsMovementReportTransType.SellReturn
								},
								{
									label: t("reports.purchaseReturn"),
									value: ItemsMovementReportTransType.PurchaseReturn
								},
								{label: t("reports.transfer"), value: ItemsMovementReportTransType.Transfer},
								{
									label: t("reports.settlement"),
									value: ItemsMovementReportTransType.Settlement
								}
							] }
						/>

						<FormField label={ t("reports.item") }>
							<ItemsSearchableSelect
								id={ itemId }
								label={ itemName }
							/>
						</FormField>

						<div className="grid grid-cols-2 gap-3">
							<DateField
								label={ t("reports.fromDate") }
								value={ fromDate }
							/>
							<DateField
								label={ t("reports.toDate") }
								value={ toDate }
							/>
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
								<StoresSearchableSelect
									id={ fromStoreId }
									label={ fromStoreName }
								/>
							</FormField>

							<FormField label={ t("reports.toStore") }>
								<StoresSearchableSelect
									id={ toStoreId }
									label={ toStoreName }
								/>
							</FormField>
						</div>

						<SelectField
							label={ t("reports.groupBy") }
							value={ groupOption }
							options={ [
								{label: t("reports.item"), value: ItemsMovementReportGroupOption.Item},
								{label: t("reports.from"), value: ItemsMovementReportGroupOption.From},
								{label: t("reports.to"), value: ItemsMovementReportGroupOption.To},
								{label: t("reports.day"), value: ItemsMovementReportGroupOption.Day},
								{label: t("reports.month"), value: ItemsMovementReportGroupOption.Month},
								{label: t("reports.year"), value: ItemsMovementReportGroupOption.Year}
							] }
						/>
					</div>

					<DialogFooter>
						<ReportButton
							reportName={ ReportConstants.ItemsMovement }
							request={ new ItemsMovementReportRequest({
								transTypeId: transType.value ?? null,
								itemId: itemId.value ?? null,
								fromDate: fromDate.value?.toLocaleDateString("en-CA") ?? null,
								toDate: toDate.value?.toLocaleDateString("en-CA") ?? null,
								fromAccountId: fromAccountId.value ?? null,
								toAccountId: toAccountId.value ?? null,
								fromStoreId: fromStoreId.value ?? null,
								toStoreId: toStoreId.value ?? null,
								groupOption: groupOption.value ?? null
							}) }
						/>
					</DialogFooter>
				</DialogContent>
			</Dialog>
		</>
	);
}
