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
	MultiSelectField
} from "yusr-ui";
import { signal } from "@preact/signals-react";
import { useSignals } from "@preact/signals-react/runtime";
import { ProfitAndLossReportRequest } from "@/features/reports/profitAndLoss/profitAndLossReportRequest.ts";
import AccountsSearchableSelect from "@/core/components/searchableSelect/accountsSearchableSelect.tsx";
import { AccountType } from "@/core/data/account.ts";
import VoucherCategoriesMultiSearchableSelect
	from "@/core/components/searchableSelect/voucherCategoriesMultiSearchableSelect.tsx";
import { ProfitAndLossRowDocumentType } from "@/features/reports/profitAndLoss/profitAndLossReportResult.ts";


interface ProfitAndLossReportFieldsProps
{
	onSubmit: (request: ProfitAndLossReportRequest) => void;
	isLoading?: boolean;
}

export function ProfitAndLossReportFields({onSubmit, isLoading = false}: ProfitAndLossReportFieldsProps)
{
	useSignals();
	const {t} = useTranslation(["erpCommon", "common", "accounting"]);

	const isOpen = useMemo(() => signal(true), []);
	const defaults = useMemo(() => new ProfitAndLossReportRequest(), []);
	// eslint-disable-next-line react-hooks/exhaustive-deps
	const fromDate = useMemo(() => signal<string | undefined>(defaults.fromDate ?? undefined), []);
	// eslint-disable-next-line react-hooks/exhaustive-deps
	const toDate = useMemo(() => signal<string | undefined>(defaults.toDate ?? undefined), []);
	const documentTypes = useMemo(() => signal<ProfitAndLossRowDocumentType[]>([]), []);
	const fromAccountId = useMemo(() => signal<number | undefined>(), []);
	const fromAccountName = useMemo(() => signal<string | undefined>(), []);
	const toAccountId = useMemo(() => signal<number | undefined>(), []);
	const toAccountName = useMemo(() => signal<string | undefined>(), []);
	const voucherCategoryIds = useMemo(() => signal<number[]>([]), []);
	const voucherCategoryNames = useMemo(() => signal<Record<number, string>>({}), []);

	const handleClear = () =>
	{
		fromDate.value = defaults.fromDate ?? undefined;
		toDate.value = defaults.toDate ?? undefined;
		fromAccountId.value = undefined;
		fromAccountName.value = undefined;
		toAccountId.value = undefined;
		toAccountName.value = undefined;
		voucherCategoryIds.value = [];
		voucherCategoryNames.value = [];
		documentTypes.value = defaults.documentTypes ?? [];

		onSubmit(new ProfitAndLossReportRequest({
			fromDate: defaults.fromDate,
			toDate: defaults.toDate
		}));
	};

	const handleApply = () => onSubmit(new ProfitAndLossReportRequest({
		fromDate: fromDate.value,
		toDate: toDate.value,
		fromAccountId: fromAccountId.value,
		fromAccountName: fromAccountName.value,
		toAccountId: toAccountId.value,
		toAccountName: toAccountName.value,
		voucherCategoryIds: voucherCategoryIds.value,
		voucherCategoryNames: Object.values(voucherCategoryNames.value),
		documentTypes: documentTypes.value
	}));

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
						<DateField label={ t("reports.fromDate") } value={ fromDate }/>
						<DateField label={ t("reports.toDate") } value={ toDate }/>

						<FormField label={ t("reports.fromAccount") }>
							<AccountsSearchableSelect
								id={ fromAccountId }
								label={ fromAccountName }
								types={ [AccountType.Client, AccountType.Supplier, AccountType.Employee, AccountType.Bank, AccountType.Box] }
							/>
						</FormField>

						<FormField label={ t("reports.toAccount") }>
							<AccountsSearchableSelect
								id={ toAccountId }
								label={ toAccountName }
								types={ [AccountType.Client, AccountType.Supplier, AccountType.Employee, AccountType.Bank, AccountType.Box] }
							/>
						</FormField>

						<MultiSelectField
							label={ t("reports.movementType") }
							value={ documentTypes }
							options={ [
								{label: t("accounting:invoices.sellInvoice"), value: ProfitAndLossRowDocumentType.Sell},
								{
									label: t("accounting:invoices.sellReturn"),
									value: ProfitAndLossRowDocumentType.SellReturn
								},
								{
									label: t("accounting:vouchers.paymentVoucher"),
									value: ProfitAndLossRowDocumentType.Payment
								}
							] }
						/>

						<FormField label="فئات السندات">
							<VoucherCategoriesMultiSearchableSelect
								ids={ voucherCategoryIds }
								labels={ voucherCategoryNames }
							/>
						</FormField>
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