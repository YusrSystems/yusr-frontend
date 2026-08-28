import ReportPage from "@/features/report/reportPage";
import { InvoicesListReport } from "@/features/reports/invoicesList/invoicesListReport";
import { useEffect, useState } from "react";
import { Cubits } from "@/core/services/cubits";
import { Button, CrudTablePagination, FilterSection, SystemPermissionsActions } from "yusr-ui";
import { useSignals } from "@preact/signals-react/runtime";
import { useTranslation } from "react-i18next";
import { APP_NAME } from "../../../../appConfig";
import { SystemPermissionsResources } from "@/core/auth/systemPermissionsResources";
import { Services } from "@/core/services/services";
import { SalesInvoiceDto } from "@/core/data/commercial/salesInvoice";
import { PurchaseInvoiceDto } from "@/core/data/commercial/purchaseInvoice";
import {
	getPurchaseInvoiceTypeName,
	getSalesInvoiceTypeName,
	PurchaseInvoiceType,
	SalesInvoiceType
} from "@/core/types/commercialEnums";


export function InvoicesListReportPage()
{
	useSignals();
	const {t} = useTranslation(["accounting", "erpCommon"]);
	const [domain, setDomain] = useState<"sales" | "purchases">("sales");

	useEffect(() =>
	{
		document.title = `${ t("erpCommon:reports.InvoicesList") } | ${ APP_NAME }`;
	}, [t]);

	useEffect(() =>
	{
		if (!Services.auth.hasAuth(SystemPermissionsResources.ReportInvoiceList, SystemPermissionsActions.Get)) return;
		if (domain === "sales")
		{
			Cubits.salesInvoices.init([SalesInvoiceType.Invoice, SalesInvoiceType.CreditNote, SalesInvoiceType.DebitNote], undefined, 1000);
		}
		else
		{
			Cubits.purchaseInvoices.init([PurchaseInvoiceType.Bill, PurchaseInvoiceType.CreditNote, PurchaseInvoiceType.DebitNote], undefined, 1000);
		}
	}, [domain]);

	const cubit = domain === "sales" ? Cubits.salesInvoices : Cubits.purchaseInvoices;
	const filterFields = domain === "sales" ? Cubits.salesInvoiceFilterFields : Cubits.purchaseInvoiceFilterFields;

	return (
		<ReportPage permissionResource={ SystemPermissionsResources.ReportInvoiceList }>
			<ReportPage.ActionButtonsContainer>
				<div className="flex bg-muted/40 rounded-lg p-1 border me-auto">
					<Button
						variant={ domain === "sales" ? "default" : "ghost" }
						size="sm"
						onClick={ () => setDomain("sales") }
					>
						فواتير المبيعات
					</Button>
					<Button
						variant={ domain === "purchases" ? "default" : "ghost" }
						size="sm"
						onClick={ () => setDomain("purchases") }
					>
						فواتير المشتريات
					</Button>
				</div>

				<ReportPage.ExcelButton<SalesInvoiceDto | PurchaseInvoiceDto>
					fileName={ domain === "sales" ? "تقرير_قائمة_فواتير_المبيعات" : "تقرير_قائمة_فواتير_المشتريات" }
					getRows={ async () => (domain === "sales" ? Cubits.salesInvoices.entities.value : Cubits.purchaseInvoices.entities.value) ?? [] }
					columns={ [
						{header: "التاريخ", accessor: (r) => r.date},
						{
							header: "نوع الفاتورة",
							accessor: (r) =>
								domain === "sales"
									? getSalesInvoiceTypeName((r as SalesInvoiceDto).type, t)
									: getPurchaseInvoiceTypeName((r as PurchaseInvoiceDto).type, t)
						},
						{header: "الجهة", accessor: (r) => r.partnerName ?? ""},
						{header: "المستودع", accessor: (r) => r.storeName ?? ""},
						{header: "المبلغ الإجمالي", accessor: (r) => r.fullAmount.toString()},
						{header: "المبلغ المدفوع", accessor: (r) => r.paidAmount.toString()},
						{header: "قيمة التسوية", accessor: (r) => r.settlementAmount.toString()},
						{header: "ملاحظات", accessor: (r) => r.notes ?? ""}
					] }
				/>
				<ReportPage.PrintButton/>
			</ReportPage.ActionButtonsContainer>

			<div className="print:hidden w-full shrink-0 flex flex-col gap-4">
				<FilterSection
					fieldsCubit={ filterFields }
					onApply={ (groups) => cubit.applyFilterGroups(groups) }
					onClear={ () => cubit.clearFilterGroups() }
				/>
			</div>

			<div className="flex-1 min-h-0 flex flex-col print:block">
				{ domain === "sales" ? (
					<InvoicesListReport<SalesInvoiceDto>
						cubit={ Cubits.salesInvoices }
						getTypeName={ (type) => getSalesInvoiceTypeName(type, t) }
						titleAr="قائمة فواتير المبيعات"
						titleEn="Sales Invoices List"
						routePrefix="sales"
					/>
				) : (
					<InvoicesListReport<PurchaseInvoiceDto>
						cubit={ Cubits.purchaseInvoices }
						getTypeName={ (type) => getPurchaseInvoiceTypeName(type, t) }
						titleAr="قائمة فواتير المشتريات"
						titleEn="Purchase Invoices List"
						routePrefix="purchases"
					/>
				) }
			</div>

			<CrudTablePagination
				className="print:hidden w-full bg-card text-card-foreground border border-t-0 p-4 shadow-sm rounded-b-xl shrink-0"
				pageSize={ cubit.pageSize.value }
				totalNumber={ cubit.count.value }
				currentPage={ cubit.currentPage.value }
				onPageChanged={ (newPage) => cubit.changePage(newPage) }
			/>
		</ReportPage>
	);
}