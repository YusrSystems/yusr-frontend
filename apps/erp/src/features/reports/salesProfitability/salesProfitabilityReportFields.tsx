import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { ChevronDown, Filter, HelpCircle } from "lucide-react";
import {
	Button,
	CheckboxField,
	Collapsible,
	CollapsibleContent,
	CollapsibleTrigger,
	DateField,
	FormField,
	Tooltip,
	TooltipContent,
	TooltipTrigger
} from "yusr-ui";
import { signal } from "@preact/signals-react";
import { useSignals } from "@preact/signals-react/runtime";
import { SalesProfitabilityReportRequest } from "./salesProfitabilityReportRequest";
import AccountsMultiSearchableSelect from "@/core/components/searchableSelect/accountsMultiSearchableSelect";


interface SalesProfitabilityReportFieldsProps
{
	onSubmit: (request: SalesProfitabilityReportRequest) => void;
	isLoading?: boolean;
}

export function SalesProfitabilityReportFields({onSubmit, isLoading = false}: SalesProfitabilityReportFieldsProps)
{
	useSignals();
	const {t} = useTranslation(["erpCommon", "common"]);

	const isOpen = useMemo(() => signal(true), []);
	const defaults = useMemo(() => new SalesProfitabilityReportRequest(), []);

	const fromDate = useMemo(() => signal<string>(defaults.fromDate), [defaults.fromDate]);
	const toDate = useMemo(() => signal<string>(defaults.toDate), [defaults.toDate]);
	const expenseAccountIds = useMemo(() => signal<number[]>([]), []);
	const expenseAccountLabels = useMemo(() => signal<Record<number, string>>({}), []);

	// Track whether expenses should be included at all
	const includeExpenses = useMemo(() => signal<boolean>(true), []);

	const handleClear = () =>
	{
		fromDate.value = defaults.fromDate;
		toDate.value = defaults.toDate;
		expenseAccountIds.value = [];
		expenseAccountLabels.value = {};
		includeExpenses.value = true;
		onSubmit(new SalesProfitabilityReportRequest({
			fromDate: defaults.fromDate,
			toDate: defaults.toDate,
			expenseAccountIds: null
		}));
	};

	const handleApply = () =>
	{
		let targetExpenseIds: number[] | null = null;

		if (!includeExpenses.value)
		{
			targetExpenseIds = [];
		}
		else if (expenseAccountIds.value.length > 0)
		{
			targetExpenseIds = expenseAccountIds.value;
		}

		onSubmit(new SalesProfitabilityReportRequest({
			fromDate: fromDate.value,
			toDate: toDate.value,
			expenseAccountIds: targetExpenseIds
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
						<DateField label={ t("reports.fromDate") } value={ fromDate }/>
						<DateField label={ t("reports.toDate") } value={ toDate }/>

						<CheckboxField
							id="include-expenses-checkbox"
							checked={ includeExpenses }
							onCheckedChange={ (checkedValue) =>
							{
								if (!checkedValue)
								{
									expenseAccountIds.value = [];
									expenseAccountLabels.value = {};
								}
							} }
							label={
								<div className="flex items-center gap-1.5" onClick={ (e) => e.stopPropagation() }>
									<span>{ t("reports.includeExpenses", "تضمين المصروفات المباشرة") }</span>

									<Tooltip>
										<TooltipTrigger asChild>
											<button
												type="button"
												className="text-muted-foreground hover:text-foreground hover:bg-muted p-0.5 rounded transition-colors focus:outline-none"
											>
												<HelpCircle className="h-3.5 w-3.5"/>
											</button>
										</TooltipTrigger>
										<TooltipContent
											className="max-w-70 p-3 bg-popover text-popover-foreground border border-border shadow-md rounded-md flex flex-col gap-2.5 text-xs z-50">
											<p className="font-semibold text-foreground border-b border-border pb-1.5">
												{ t("reports.hints.title", "خيارات التصفية المتاحة:") }
											</p>
											<div className="flex flex-col gap-2">
												<div className="flex flex-col gap-0.5">
													    <span className="font-medium text-foreground">
													    	{ t("reports.hints.all", "تفعيل الخيار بدون تحديد حسابات:") }
													    </span>
													<span className="text-muted-foreground leading-normal">
													  		{ t("reports.hints.allDesc", "يتم عرض الفواتير مع كافة المصروفات المباشرة.") }
													    </span>
												</div>

												<div className="flex flex-col gap-0.5">
														<span className="font-medium text-foreground">
														  { t("reports.hints.specific", "تفعيل الخيار مع تحديد حسابات:") }
														</span>
													<span className="text-muted-foreground leading-normal">
														  { t("reports.hints.specificDesc", "يتم عرض الفواتير مع مصروفات الحسابات المحددة فقط.") }
													    </span>
												</div>

												<div className="flex flex-col gap-0.5">
														<span className="font-medium text-foreground">
															{ t("reports.hints.none", "إلغاء تفعيل الخيار تماماً:") }
														</span>
													<span className="text-muted-foreground leading-normal">
														   { t("reports.hints.noneDesc", "يتم استبعاد جميع المصروفات وعرض الفواتير والمرتجعات فقط.") }
													    </span>
												</div>
											</div>
										</TooltipContent>
									</Tooltip>
								</div>
							}
						/>

						<FormField label={ t("reports.expenseAccounts", "حسابات المصروفات المباشرة") }>
							<AccountsMultiSearchableSelect
								ids={ expenseAccountIds }
								disabled={ !includeExpenses.value }
								labels={ expenseAccountLabels }
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