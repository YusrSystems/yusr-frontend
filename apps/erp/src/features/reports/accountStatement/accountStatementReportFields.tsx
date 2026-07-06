import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { ChevronDown, Filter } from "lucide-react";
import { Button, Collapsible, CollapsibleContent, CollapsibleTrigger, DateField, FormField } from "yusr-ui";
import { signal } from "@preact/signals-react";
import { useSignals } from "@preact/signals-react/runtime";
import AccountsSearchableSelect from "@/core/components/searchableSelect/accountsSearchableSelect.tsx";
import { AccountStatementReportRequest } from "@/features/reports/accountStatement/accountStatementReportRequest.ts";
import { AccountType } from "@/core/data/account.ts";


interface AccountStatementReportFieldsProps
{
	onSubmit: (request: AccountStatementReportRequest) => void;
	isLoading?: boolean;
	initialAccountId?: number;
	initialAccountName?: string;
}

export function AccountStatementReportFields({
	onSubmit,
	initialAccountId,
	initialAccountName,
	isLoading = false
}: AccountStatementReportFieldsProps)
{
	useSignals();
	const {t} = useTranslation(["erpCommon", "common"]);

	const isOpen = useMemo(() => signal(true), []);
	const accountId = useMemo(() => signal<number | undefined>(initialAccountId), [initialAccountId]);
	const accountName = useMemo(() => signal<string | undefined>(initialAccountName), [initialAccountName]);
	const fromDate = useMemo(() => signal<string>(""), []);
	const toDate = useMemo(() => signal<string>(""), []);

	const handleClear = () =>
	{
		accountId.value = undefined;
		accountName.value = undefined;
		fromDate.value = "";
		toDate.value = "";
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
					<div className="grid grid-cols-1 md:grid-cols-3 gap-3">
						<FormField label="الحساب">
							<AccountsSearchableSelect
								id={ accountId }
								label={ accountName }
								types={ [AccountType.Client, AccountType.Supplier, AccountType.Employee, AccountType.Bank, AccountType.Box] }
							/>
						</FormField>

						<DateField
							label="من تاريخ"
							value={ fromDate }
						/>

						<DateField
							label="إلى تاريخ"
							value={ toDate }
						/>
					</div>

					<div className="flex justify-end gap-2">
						<Button disabled={ isLoading } variant="outline" onClick={ handleClear }>
							{ t("common:filter.clear") }
						</Button>
						<Button
							disabled={ isLoading || !accountId.value }
							onClick={ () => onSubmit(new AccountStatementReportRequest({
								accountId: accountId.value!,
								fromDate: fromDate.value || null,
								toDate: toDate.value || null
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