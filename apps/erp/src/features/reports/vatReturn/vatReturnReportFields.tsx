import { useMemo } from "react";
import { ChevronDown, Filter } from "lucide-react";
import { Button, Collapsible, CollapsibleContent, CollapsibleTrigger, DateField } from "yusr-ui";
import { signal } from "@preact/signals-react";
import { useSignals } from "@preact/signals-react/runtime";
import { VatReturnReportRequest } from "./vatReturnReportRequest";


interface VatReturnReportFieldsProps
{
	onSubmit: (request: VatReturnReportRequest) => void;
	isLoading?: boolean;
}

export function VatReturnReportFields({onSubmit, isLoading = false}: VatReturnReportFieldsProps)
{
	useSignals();

	const isOpen = useMemo(() => signal(true), []);
	const defaultRequest = useMemo(() => new VatReturnReportRequest(), []);
	const fromDate = useMemo(() => signal<string>(defaultRequest.fromDate), [defaultRequest.fromDate]);
	const toDate = useMemo(() => signal<string>(defaultRequest.toDate), [defaultRequest.toDate]);

	const handleClear = () =>
	{
		const freshRequest = new VatReturnReportRequest();
		fromDate.value = freshRequest.fromDate;
		toDate.value = freshRequest.toDate;
		onSubmit(freshRequest);
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
						تصفية التقرير
					</span>
					<ChevronDown
						className={ `h-4 w-4 transition-transform duration-200 ${ isOpen.value ? "rotate-180" : "" }` }
					/>
				</button>
			</CollapsibleTrigger>

			<CollapsibleContent>
				<div className="flex flex-col gap-4 p-4 border-t border-border">
					<div className="grid grid-cols-2 gap-3">
						<DateField label="من تاريخ" value={ fromDate }/>
						<DateField label="إلى تاريخ" value={ toDate }/>
					</div>

					<div className="flex justify-end gap-2">
						<Button disabled={ isLoading } variant="outline" onClick={ handleClear }>
							مسح
						</Button>
						<Button
							disabled={ isLoading }
							onClick={ () => onSubmit(new VatReturnReportRequest({
								fromDate: fromDate.value ?? undefined,
								toDate: toDate.value ?? undefined
							})) }
						>
							تطبيق
						</Button>
					</div>
				</div>
			</CollapsibleContent>
		</Collapsible>
	);
}