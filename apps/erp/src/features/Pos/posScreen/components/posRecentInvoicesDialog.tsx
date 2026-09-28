import { useSignals } from "@preact/signals-react/runtime";
import { signal } from "@preact/signals-react";
import { useEffect, useMemo } from "react";
import { createPortal } from "react-dom";
import {
	Button,
	cn,
	CrudTablePagination,
	DateField,
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
	type FilterGroupDto,
	FilterOperator,
	type FilterRuleDto,
	FormField,
	NumberField,
	TablePreview
} from "yusr-ui";
import { PosSessionDto } from "@/core/data/posSession";
import { PosTerminalDto } from "@/core/data/posTerminal";
import ErpCurrencyIcon from "@/core/components/erpCurrencyIcon";
import { Clock, Loader2, Printer, ReceiptText, RotateCcw, Store, Undo2 } from "lucide-react";
import { InvoiceReportRequest } from "@/features/reports/invoice/invoiceReportRequest.ts";
import { InvoiceReport } from "@/features/reports/invoice/invoiceReport";
import { PortalReportContainer } from "@/features/report/reportContainer";
import { getPaymentStatus } from "@/core/types/paymentStatus";
import { InvoiceType } from "@/core/types/invoiceType";
import { PartnersSearchableSelect } from "@/core/components/searchableSelect/partnersSearchableSelect";
import { PartnerType } from "@/core/data/partner";
import { useTranslation } from "react-i18next";
import { Cubits } from "@/core/services/cubits.ts";
import { getReturnStatus, InvoiceReturnStatus } from "@/core/types/invoiceReturnStatus.ts";
import type { SalesInvoiceDto } from "@/core/data/commercial/salesInvoice.ts";
import type { SalesInvoiceReportResult } from "@/features/reports/invoice/invoiceReportResult.ts";
import { useCommercialPrint } from "@/features/commercial/hooks/useCommercialPrint";


interface PosRecentInvoicesDialogProps
{
	open: boolean;
	onOpenChange: (open: boolean) => void;
	terminal: PosTerminalDto;
	session: PosSessionDto;
	onProcessReturn?: (invoice: SalesInvoiceDto) => void;
}

export default function PosRecentInvoicesDialog({
	open,
	onOpenChange,
	terminal,
	session,
	onProcessReturn
}: PosRecentInvoicesDialogProps)
{
	useSignals();

	const {t, i18n} = useTranslation("accounting");
	const activeTab = useMemo(() => signal<"shift" | "store">("shift"), []);
	const filterDate = useMemo(() => signal<string | undefined>(undefined), []);
	const filterInvoiceId = useMemo(() => signal<number | undefined>(undefined), []);
	const filterPartnerId = useMemo(() => signal<number | undefined>(undefined), []);

	const isLoading = useMemo(() => signal<boolean>(false), []);
	const {printedReport, isPrinting, handlePrint} = useCommercialPrint<SalesInvoiceReportResult>();

	const fetchInvoices = async () =>
	{
		isLoading.value = true;
		try
		{
			const rules: FilterRuleDto[] = [];

			if (activeTab.value === "shift")
			{
				rules.push({id: 0, field: "PosSessionId", operator: FilterOperator.Equal, value: session.id});
			}
			else
			{
				rules.push({id: 0, field: "StoreId", operator: FilterOperator.Equal, value: terminal.storeId});
			}

			if (filterDate.value)
			{
				rules.push({id: 0, field: "IssueDate", operator: FilterOperator.Equal, value: filterDate.value});
			}

			if (filterInvoiceId.value && filterInvoiceId.value > 0)
			{
				rules.push({id: 0, field: "Id", operator: FilterOperator.Equal, value: filterInvoiceId.value});
			}

			if (filterPartnerId.value && filterPartnerId.value > 0)
			{
				rules.push({id: 0, field: "PartnerId", operator: FilterOperator.Equal, value: filterPartnerId.value});
			}

			const groups: FilterGroupDto[] = [{id: 0, rules}];

			await Cubits.salesInvoices.filter(
				Cubits.salesInvoices.currentPage.value,
				Cubits.salesInvoices.pageSize.value,
				undefined,
				[InvoiceType.Sell, InvoiceType.SellReturn],
				undefined,
				groups
			);

		}
		finally
		{
			isLoading.value = false;
		}
	};

	useEffect(() =>
	{
		if (open)
		{
			void fetchInvoices();
		}
	}, [open, activeTab.value, filterDate.value, filterInvoiceId.value, filterPartnerId.value]);

	const onPrintInvoice = (inv: SalesInvoiceDto) =>
	{
		void handlePrint(
			inv.id,
			"/api/Reports/SalesInvoice",
			new InvoiceReportRequest({invoiceId: inv.id})
		);
	};

	const handleClearFilters = () =>
	{
		filterDate.value = undefined;
		filterInvoiceId.value = undefined;
		filterPartnerId.value = undefined;
	};

	return (
		<>
			<Dialog open={ open } onOpenChange={ onOpenChange }>
				<DialogContent className="sm:max-w-5xl w-[95vw] max-h-[90vh] p-0 flex flex-col overflow-hidden gap-0"
				               dir={ i18n.dir() }>
					{/* Header Controls */ }
					<DialogHeader
						className="p-3 sm:p-4 border-b border-border bg-muted/30 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 space-y-0 shrink-0">
						<div className="flex items-center gap-2">
							<ReceiptText className="w-5 h-5 text-primary"/>
							<DialogTitle className="text-base font-bold">
								الفواتير الأخيرة
							</DialogTitle>
						</div>

						{/* Scope Tabs (Centered in middle column) */ }
						<div className="flex items-center justify-center">
							<div className="flex items-center gap-1.5 bg-muted p-1 rounded-lg border">
								<Button
									type="button"
									size="sm"
									variant={ activeTab.value === "shift" ? "default" : "ghost" }
									className="h-7 sm:h-8 text-xs gap-1.5"
									onClick={ () => (activeTab.value = "shift") }
								>
									<Clock className="w-3.5 h-3.5"/>
									وردية الكاشير
								</Button>
								<Button
									type="button"
									size="sm"
									variant={ activeTab.value === "store" ? "default" : "ghost" }
									className="h-7 sm:h-8 text-xs gap-1.5"
									onClick={ () => (activeTab.value = "store") }
								>
									<Store className="w-3.5 h-3.5"/>
									فواتير الفرع
								</Button>
							</div>
						</div>
					</DialogHeader>

					{/* Filter Section Bar */ }
					<div
						className="p-3 bg-muted/20 border-b border-border grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-10 gap-2 items-end shrink-0">
						<div className="lg:col-span-3">
							<NumberField
								label="رقم الفاتورة"
								value={ filterInvoiceId }
							/>
						</div>

						<div className="lg:col-span-3">
							<DateField
								label="تاريخ الفاتورة"
								value={ filterDate }
								placeholder="التاريخ..."
							/>
						</div>

						<div className="lg:col-span-3">
							<FormField label="العميل">
								<PartnersSearchableSelect
									id={ filterPartnerId }
									types={ [PartnerType.Customer] }
								/>
							</FormField>
						</div>

						<div className="flex justify-end lg:col-span-1">
							<Button
								type="button"
								size="sm"
								variant="ghost"
								className="h-8 text-xs gap-1 text-red-600 hover:text-foreground w-full sm:w-auto"
								onClick={ handleClearFilters }
							>
								<RotateCcw className="w-3.5 h-3.5"/>
								مسح
							</Button>
						</div>
					</div>

					<div className="flex-1 min-h-0 overflow-y-auto p-2 sm:p-4">
						{ isLoading.value ? (
							<div className="flex items-center justify-center p-12 text-muted-foreground gap-2">
								<Loader2 className="w-6 h-6 animate-spin text-primary"/>
								<span>جاري جلب الفواتير...</span>
							</div>
						) : Cubits.salesInvoices.entities.value.length === 0 ? (
							<TablePreview.Empty title="لا توجد فواتير مطابقة"/>
						) : (
							<div className="border border-border rounded-lg overflow-x-auto shadow-xs">
								<table className="w-full min-w-[650px] text-sm text-start">
									<thead
										className="bg-muted text-muted-foreground font-semibold border-b border-border">
									<tr>
										<th className="p-3 text-start w-24">رقم الفاتورة</th>
										<th className="p-3 text-start w-28">التاريخ</th>
										<th className="p-3 text-start w-28">النوع</th>
										<th className="p-3 text-start min-w-[140px]">العميل</th>
										<th className="p-3 text-start w-28">الإجمالي</th>
										<th className="p-3 text-start w-32">الحالة</th>
										<th className="p-3 text-center w-28">الإجراءات</th>
									</tr>
									</thead>
									<tbody className="divide-y divide-border">
									{ Cubits.salesInvoices.entities.value.map((inv) =>
									{
										const isReturn = inv.type === InvoiceType.SellReturn;
										const paymentStatus = getPaymentStatus(inv, t);
										const returnStatus = getReturnStatus(inv, t);

										return (
											<tr key={ inv.id } className="hover:bg-muted/30 transition-colors">
												<td className="p-3 font-bold text-foreground tabular-nums">#{ inv.id }</td>
												<td className="p-3 text-muted-foreground text-xs">{ inv.date }</td>
												<td className="p-3">
													<span
														className={ cn(
															"inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium",
															isReturn ? "bg-red-100 text-red-800 dark:bg-red-950 dark:text-red-300" : "bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300"
														) }
													>
														{ isReturn ? "مرتجع مبيعات" : "مبيعات" }
													</span>
												</td>
												<td className="p-3 text-foreground font-medium truncate max-w-[160px]">
													{ inv.partnerName || "عميل نقدي" }
												</td>
												<td className="p-3 font-bold text-primary tabular-nums">
													<div className="flex items-center gap-1">
														<span>{ inv.fullAmount.toLocaleString("en-US", {minimumFractionDigits: 2}) }</span>
														<ErpCurrencyIcon className="w-3.5 h-3.5"/>
													</div>
												</td>
												<td className="p-3">
													<div className="flex flex-col items-start gap-1">
														<span
															className={ cn("inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-medium", paymentStatus.styles) }>
															{ paymentStatus.message }
														</span>
														{ inv.type === InvoiceType.Sell && (
															<span
																className={ cn("inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-medium", returnStatus.styles) }>
																{ returnStatus.message }
															</span>
														) }
													</div>
												</td>
												<td className="p-3">
													<div className="flex items-center justify-center gap-1.5">
														<Button
															type="button"
															size="icon-sm"
															variant="outline"
															title="طباعة الإيصال"
															disabled={ isPrinting.value === inv.id }
															onClick={ () => onPrintInvoice(inv) }
														>
															{ isPrinting.value === inv.id ? (
																<Loader2 className="w-3.5 h-3.5 animate-spin"/>
															) : (
																<Printer className="w-3.5 h-3.5"/>
															) }
														</Button>

														{/* Return Invoice Button */ }
														{ inv.type === InvoiceType.Sell && inv.returnStatusId !== InvoiceReturnStatus.FullyReturned && (
															<Button
																size="sm"
																variant="destructive"
																className="h-8 px-2.5 text-xs gap-1"
																onClick={ () =>
																{
																	onProcessReturn?.(inv);
																	onOpenChange(false);
																} }
															>
																إرجاع
																<Undo2 className="w-3.5 h-3.5"/>
															</Button>
														) }

													</div>
												</td>
											</tr>
										);
									}) }
									</tbody>
								</table>
							</div>
						) }
					</div>

					{/* Table Pagination Footer */ }
					<div
						className="w-full border-t border-border bg-muted/20 flex items-center justify-between shrink-0">
						<CrudTablePagination
							className="w-full"
							pageSize={ Cubits.salesInvoices.pageSize.value }
							totalNumber={ Cubits.salesInvoices.count.value }
							currentPage={ Cubits.salesInvoices.currentPage.value }
							onPageChanged={ () =>
							{
								void fetchInvoices();
							} }
						/>
					</div>
				</DialogContent>
			</Dialog>

			{/* Thermal Receipt Print Portal */ }
			{ printedReport.value &&
				createPortal(
					<PortalReportContainer>
						<InvoiceReport data={ printedReport.value } isPortal={ true } forceThermal={ true }/>
					</PortalReportContainer>,
					document.body
				) }
		</>
	);
}