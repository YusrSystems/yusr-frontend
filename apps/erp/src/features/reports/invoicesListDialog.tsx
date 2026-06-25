import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import {
	Button,
	DateField,
	DateService,
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	FormField,
	FormFieldOld
} from "yusr-ui";
import { InvoicesListReportRequest, InvoicesListReportType } from "@/core/data/report/invoicesListReportType.ts";
import ReportConstants from "../../core/data/report/reportConstants";
import ReportButton from "./reportButton";
import { signal } from "@preact/signals-react";
import type Item from "@/core/data/item.ts";
import StoresSearchableSelect from "@/core/components/searchableSelect/storesSearchableSelect.tsx";
import AccountsSearchableSelect from "@/core/components/searchableSelect/accountsSearchableSelect.tsx";
import { AccountType } from "@/core/data/account.ts";
import ItemsSearchableSelect from "@/core/components/searchableSelect/itemsSearchableSelect.tsx";
import { InvoiceType } from "@/core/types/invoiceType.ts";
import { useSignals } from "@preact/signals-react/runtime";


export default function InvoicesListDialog()
{
	useSignals();
	const {t, i18n} = useTranslation(["erpCommon", "accounting"]);

	const isOpen = useMemo(() => signal(false), []);
	const fromDate = useMemo(() =>
	{
		const date = new Date();
		date.setMonth(date.getMonth() - 1);
		return signal<string>(DateService.formatDateOnly(date));
	}, []);
	const toDate = useMemo(() => signal<string>(DateService.formatDateOnly(new Date())), []);
	const accountId = useMemo(() => signal<number>(), []);
	const accountName = useMemo(() => signal<string>(), []);
	const storeId = useMemo(() => signal<number>(), []);
	const itemId = useMemo(() => signal<number>(), []);
	const storeName = useMemo(() => signal<string>(), []);
	const items = useMemo(() => signal<Item[]>([]), []);

	return (
		<>
			<Button variant="outline" size="sm" onClick={ () => isOpen.value = true }>
				{ t("reports.create") }
			</Button>
			<Dialog open={ isOpen.value } onOpenChange={ (open) => isOpen.value = open }>
				<DialogContent dir={ i18n.dir() } className="sm:max-w-lg">
					<DialogHeader>
						<DialogTitle>{ t("reports.InvoicesList") }</DialogTitle>
						<DialogDescription>{ t("reports.InvoicesListDescription") }</DialogDescription>
					</DialogHeader>

					<div className="flex flex-col gap-4 py-2">
						<div className="flex gap-3">
							<DateField
								label={ t("reports.fromDate") }
								value={ fromDate }
							/>
							<DateField
								label={ t("reports.toDate") }
								value={ toDate }
							/>
						</div>

						<FormFieldOld label={ t("accounting:invoices.store") }>
							<StoresSearchableSelect
								id={ storeId }
								label={ storeName }
							/>
						</FormFieldOld>

						<FormFieldOld label={ t("accounting:invoices.account") }>
							<AccountsSearchableSelect
								id={ accountId }
								label={ accountName }
								types={ [AccountType.Client, AccountType.Supplier] }/>
						</FormFieldOld>

						<FormField label={ t("sidebar.items") }>
							<ItemsSearchableSelect
								id={ itemId }
								label={ undefined }
								onSelect={ (item) =>
								{
									if (item && !items.value.some((i) => i.id.value === item.id.value))
									{
										items.value = [...items.value, item];
									}
								} }
							/>
							{ items.value.length > 0 && (
								<div className="mt-2 flex flex-wrap gap-1.5">
									{ items.value.map((item) => (
										<span
											key={ item.id.value }
											className="flex items-center gap-1 rounded-md border border-border bg-muted px-2 py-0.5 text-xs text-foreground"
										>
                                            { item.name }
											<button
												type="button"
												className="text-destructive text-sm font-semibold hover:text-foreground"
												onClick={ () => items.value = items.value.filter((i) => i.id.value !== item.id.value) }
											>
                                            ×
                                          </button>
                                        </span>
									)) }
								</div>
							) }
						</FormField>
					</div>

					<DialogFooter>
						<ReportButton
							reportName={ ReportConstants.InvoicesList }
							request={ new InvoicesListReportRequest({
								fromDate: fromDate.value ?? undefined,
								toDate: toDate.value ?? undefined,
								reportType: InvoicesListReportType.ProfitAndLoss,
								types: [InvoiceType.Sell, InvoiceType.SellReturn, InvoiceType.Purchase, InvoiceType.PurchaseReturn],
								actionAccountId: accountId.value,
								storeId: storeId.value,
								itemIds: items.value.map((i) => i.id.value)
							}) }
						/>
					</DialogFooter>
				</DialogContent>
			</Dialog>
		</>
	);
}
