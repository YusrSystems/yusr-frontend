import { useMemo } from "react";
import { ChevronDown, Filter, List, Users } from "lucide-react";
import {
	Button,
	Collapsible,
	CollapsibleContent,
	CollapsibleTrigger,
	DateField,
	FormField,
	SelectField
} from "yusr-ui";
import { signal } from "@preact/signals-react";
import { useSignals } from "@preact/signals-react/runtime";
import { ReceivablesAgingReportRequest } from "./receivablesAgingReportRequest";
import { ReceivablesAgingBucket, ReceivablesAgingViewMode } from "@/core/types/receivablesAging";
import { PartnersSearchableSelect } from "@/core/components/searchableSelect/partnersSearchableSelect";
import StoresSearchableSelect from "@/core/components/searchableSelect/storesSearchableSelect";
import { PartnerType } from "@/core/data/partner";


interface ReceivablesAgingReportFieldsProps
{
	onSubmit: (request: ReceivablesAgingReportRequest) => void;
	isLoading?: boolean;
	currentViewMode: ReceivablesAgingViewMode;
	onViewModeChange: (mode: ReceivablesAgingViewMode) => void;
}

export function ReceivablesAgingReportFields({
	onSubmit,
	isLoading = false,
	currentViewMode,
	onViewModeChange
}: ReceivablesAgingReportFieldsProps)
{
	useSignals();
	const isOpen = useMemo(() => signal(true), []);
	const defaults = useMemo(() => new ReceivablesAgingReportRequest(), []);

	const asOfDate = useMemo(() => signal<string>(defaults.asOfDate), [defaults.asOfDate]);
	const partnerId = useMemo(() => signal<number | undefined>(undefined), []);
	const partnerName = useMemo(() => signal<string | undefined>(undefined), []);
	const storeId = useMemo(() => signal<number | undefined>(undefined), []);
	const storeName = useMemo(() => signal<string | undefined>(undefined), []);
	const bucketFilter = useMemo(() => signal<ReceivablesAgingBucket | undefined>(undefined), []);

	const handleClear = () =>
	{
		asOfDate.value = defaults.asOfDate;
		partnerId.value = undefined;
		partnerName.value = undefined;
		storeId.value = undefined;
		storeName.value = undefined;
		bucketFilter.value = undefined;

		onSubmit(new ReceivablesAgingReportRequest({
			viewMode: currentViewMode,
			asOfDate: defaults.asOfDate
		}));
	};

	const handleApply = () =>
	{
		onSubmit(new ReceivablesAgingReportRequest({
			viewMode: currentViewMode,
			asOfDate: asOfDate.value,
			partnerId: partnerId.value ?? null,
			partnerName: partnerName.value ?? null,
			storeId: storeId.value ?? null,
			storeName: storeName.value ?? null,
			bucketFilter: bucketFilter.value ?? null
		}));
	};

	return (
		<Collapsible
			open={ isOpen.value }
			onOpenChange={ (open) => (isOpen.value = open) }
			className="bg-card border border-border rounded-t-lg"
		>
			<CollapsibleTrigger asChild>
				<button
					type="button"
					className="w-full flex items-center justify-between px-4 py-3 text-sm font-medium bg-muted"
				>
					<span className="flex items-center gap-2">
						<Filter className="h-4 w-4"/>
						تصفية تقرير أعمار ديون العملاء
					</span>
					<ChevronDown
						className={ `h-4 w-4 transition-transform duration-200 ${ isOpen.value ? "rotate-180" : "" }` }
					/>
				</button>
			</CollapsibleTrigger>
			<CollapsibleContent>
				<div className="flex flex-col gap-4 p-4 border-t border-border">
					{/* Mode Switcher */ }
					<div className="flex items-center justify-between pb-2 border-b border-border/60">
						<span className="text-xs font-semibold text-muted-foreground">طريقة عرض التقرير:</span>
						<div className="flex bg-muted rounded-lg p-1 border">
							<Button
								type="button"
								variant={ currentViewMode === ReceivablesAgingViewMode.Summary ? "default" : "ghost" }
								size="sm"
								className="h-8 text-xs gap-1.5"
								onClick={ () => onViewModeChange(ReceivablesAgingViewMode.Summary) }
							>
								<Users className="h-3.5 w-3.5"/>
								ملخص بالعملاء
							</Button>
							<Button
								type="button"
								variant={ currentViewMode === ReceivablesAgingViewMode.Detailed ? "default" : "ghost" }
								size="sm"
								className="h-8 text-xs gap-1.5"
								onClick={ () => onViewModeChange(ReceivablesAgingViewMode.Detailed) }
							>
								<List className="h-3.5 w-3.5"/>
								تفصيلي بالفواتير
							</Button>
						</div>
					</div>

					<div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
						<DateField label="كما في تاريخ" value={ asOfDate }/>
						<FormField label="العميل">
							<PartnersSearchableSelect
								id={ partnerId }
								label={ partnerName }
								types={ [PartnerType.Customer] }
							/>
						</FormField>
						<FormField label="المستودع">
							<StoresSearchableSelect id={ storeId } label={ storeName }/>
						</FormField>
						<SelectField<ReceivablesAgingBucket>
							label="فترة التقادم"
							value={ bucketFilter }
							options={ [
								{label: "جميع الفترات", value: ReceivablesAgingBucket.All},
								{label: "حالي (غير مستحق)", value: ReceivablesAgingBucket.Current},
								{label: "1 - 30 يوم", value: ReceivablesAgingBucket.Days1To30},
								{label: "31 - 60 يوم", value: ReceivablesAgingBucket.Days31To60},
								{label: "61 - 90 يوم", value: ReceivablesAgingBucket.Days61To90},
								{label: "+90 يوم", value: ReceivablesAgingBucket.Days90Plus}
							] }
						/>
					</div>
					<div className="flex justify-end gap-2">
						<Button disabled={ isLoading } variant="outline" onClick={ handleClear }>
							مسح
						</Button>
						<Button disabled={ isLoading } onClick={ handleApply }>
							تطبيق
						</Button>
					</div>
				</div>
			</CollapsibleContent>
		</Collapsible>
	);
}