import ReportPage from "@/features/report/reportPage.tsx";
import { InvoicesListReport } from "@/features/reports/invoicesList/invoicesListReport.tsx";
import { useEffect, useMemo } from "react";
import { Cubits } from "@/core/services/cubits.ts";
import { CrudTablePagination, FilterSection, FormField, MultiSearchableSelect } from "yusr-ui";
import { useSignals } from "@preact/signals-react/runtime";
import { effect, useSignal } from "@preact/signals-react";
import { useTranslation } from "react-i18next";
import { InvoiceType } from "@/core/types/invoiceType.ts";
import { RenderInvoiceFilterInput } from "@/features/invoices/invoicesPage.tsx";
import Invoice, { type InvoiceDto } from "@/core/data/invoices/invoice.ts";


export function InvoicesListReportPage()
{
	useSignals();
	const {t} = useTranslation("accounting");

	const selectedTypes = useSignal<number[]>([]);
	const selectedTypeLabels = useSignal<Record<number, string>>({});

	const invoiceTypeOptions = useMemo(() => [
		{id: InvoiceType.Sell, name: t("invoices.sellInvoice")},
		{id: InvoiceType.Purchase, name: t("invoices.purchaseInvoice")},
		{id: InvoiceType.SellReturn, name: t("invoices.sellReturn")},
		{id: InvoiceType.PurchaseReturn, name: t("invoices.purchaseReturn")},
		{id: InvoiceType.Quotation, name: t("invoices.quotation")}
	], [t]);

	useEffect(() =>
	{
		// Initial Load
		Cubits.invoices.init(selectedTypes.value, undefined, 1000);

		// Subscribe to subsequent changes to selectedTypes
		let isFirst = true;
		const dispose = effect(() =>
		{
			const types = selectedTypes.value;
			if (isFirst)
			{
				isFirst = false;
				return;
			}

			// Call filter while preserving search text, query params, and filter groups
			void Cubits.invoices.filter(
				1,
				undefined,
				Cubits.invoices.searchText.value,
				types,
				undefined,
				undefined
			);
		});

		return () => dispose();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	return (
		<ReportPage>

			<ReportPage.ActionButtonsContainer>
				<ReportPage.ExcelButton<InvoiceDto>
					fileName="تقرير_المستندات_والفواتير"
					getRows={ async () => Cubits.invoices.entities.value ?? [] }
					columns={ [
						{header: "التاريخ", accessor: (r) => r.date},
						{header: "نوع الفاتورة", accessor: (r) => Invoice.getTypeName(r.type, t)},
						{header: "الحساب المعني", accessor: (r) => r.actionAccountName},
						{header: "المستودع", accessor: (r) => r.storeName},
						{header: "المبلغ الإجمالي", accessor: (r) => r.fullAmount.toString()},
						{header: "المبلغ المدفوع", accessor: (r) => r.paidAmount.toString()},
						{header: "قيمة التسوية", accessor: (r) => r.settlementAmount.toString()},
						{header: "ملاحظات", accessor: (r) => r.notes ?? ""}
					] }
				/>
				<ReportPage.PrintButton/>
			</ReportPage.ActionButtonsContainer>

			<div className="print:hidden w-full shrink-0 flex flex-col gap-4">
				<div className="w-full ">
					<FormField
						label={ t("invoices.invoiceType") }>
						<MultiSearchableSelect>
							<MultiSearchableSelect.Trigger
								labels={ selectedTypeLabels }
							/>
							<MultiSearchableSelect.Content>
								<MultiSearchableSelect.Command>
									{ invoiceTypeOptions.map((opt) => (
										<MultiSearchableSelect.Option
											key={ opt.id }
											item={ opt }
											ids={ selectedTypes }
											labels={ selectedTypeLabels }
											labelSelector="name"
										>
											<MultiSearchableSelect.OptionBody label={ opt.name }/>
										</MultiSearchableSelect.Option>
									)) }
								</MultiSearchableSelect.Command>
								<MultiSearchableSelect.Footer ids={ selectedTypes } labels={ selectedTypeLabels }/>
							</MultiSearchableSelect.Content>
						</MultiSearchableSelect>
					</FormField>
				</div>

				<FilterSection
					fieldsCubit={ Cubits.invoiceFilterFields }
					onApply={ (groups) => Cubits.invoices.applyFilterGroups(groups) }
					onClear={ () => Cubits.invoices.clearFilterGroups() }
					renderCustomInput={ RenderInvoiceFilterInput }
				/>
			</div>

			<div className="flex-1 min-h-0 flex flex-col print:block">
				<InvoicesListReport/>
			</div>

			<CrudTablePagination
				className="print:hidden w-full bg-card text-card-foreground border border-t-0 p-4 shadow-sm rounded-b-xl shrink-0"
				pageSize={ Cubits.invoices.pageSize.value }
				totalNumber={ Cubits.invoices.count.value }
				currentPage={ Cubits.invoices.currentPage.value }
				onPageChanged={ (newPage) =>
				{
					Cubits.invoices.changePage(newPage);
				} }
			/>

		</ReportPage>
	);
}