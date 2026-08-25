import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Link, useNavigate } from "react-router-dom";
import { createPortal } from "react-dom";
import { useSignals } from "@preact/signals-react/runtime";
import { Copy, FilePlusCorner, FileTextIcon, Loader2, Printer } from "lucide-react";
import {
	Button,
	ChangeableEntityMode,
	cn,
	ContextMenuItem,
	CrudPage,
	DropdownMenuItem,
	FilterSection,
	PageError,
	PageLoaded,
	PageLoading,
	SystemPermissionsActions,
	TablePreview,
	UnauthorizedPage
} from "yusr-ui";
import { QuotationDto } from "@/core/data/commercial/quotation";
import { getQuotationStatusBadge, QuotationStatus } from "@/core/types/commercialEnums";
import { PartnerType } from "@/core/data/partner";
import { Services } from "@/core/services/services";
import { Cubits } from "@/core/services/cubits";
import { SystemPermissionsResources } from "@/core/auth/systemPermissionsResources";
import ChangeQuotationDialog from "./changeQuotationDialog";
import ErpCurrencyIcon from "@/core/components/erpCurrencyIcon";
import { PortalReportContainer } from "@/features/report/reportContainer";
import { InvoiceReport } from "@/features/reports/invoice/invoiceReport";
import { APP_NAME } from "../../../../appConfig";
import { QuotationReportRequest } from "@/features/reports/invoice/invoiceReportRequest.ts";
import type { QuotationReportResult } from "@/features/reports/invoice/invoiceReportResult.ts";
import { useCommercialPrint } from "../hooks/useCommercialPrint";
import { CommercialFilterInput } from "@/features/commercial/components/commercialFilterInput.tsx";


export default function QuotationsPage()
{
	useSignals();
	const {t} = useTranslation(["accounting", "erpCommon"]);
	const navigate = useNavigate();
	const {printedReport, isPrinting, handlePrint} = useCommercialPrint<QuotationReportResult>();

	useEffect(() =>
	{
		document.title = `${ t("invoices.quotationsManagement") } | ${ APP_NAME }`;
	}, [t]);

	useEffect(() =>
	{
		Cubits.quotations.init();
		Cubits.partners.init([PartnerType.Customer]);
		Cubits.items.init();
		Cubits.stores.init();
	}, []);

	const printQuotation = (quote: QuotationDto) =>
	{
		void handlePrint(
			quote.id,
			"/api/Reports/Quotation",
			new QuotationReportRequest({quotationId: quote.id})
		);
	};

	const handleConvertToSales = (quote: QuotationDto) =>
	{
		navigate(`/sales/new?fromQuotationId=${ quote.id }`);
	};

	const handleCopyQuotation = (quote: QuotationDto) =>
	{
		navigate(`/quotations/new?copyFromId=${ quote.id }`);
	};

	if (!Services.auth.hasAuth(SystemPermissionsResources.Quotations, SystemPermissionsActions.Get))
	{
		return <UnauthorizedPage/>;
	}

	return (
		<CrudPage<QuotationDto>>
			<CrudPage.Header
				title={ t("invoices.quotationsManagement") }
				addButtonTitle={ t("invoices.addNewQuotationTitle") }
				isAddButtonVisible={ Services.auth.hasAuth(
					SystemPermissionsResources.Quotations,
					SystemPermissionsActions.Add
				) }
			/>

			<CrudPage.Cards
				cards={ [
					{
						title: t("invoices.totalQuotations"),
						data: (Cubits.quotations.count.value ?? 0).toString(),
						icon: <FileTextIcon className="h-4 w-4 text-muted-foreground"/>
					}
				] }
			/>

			<FilterSection
				fieldsCubit={ Cubits.quotationFilterFields }
				onApply={ (groups) => Cubits.quotations.applyFilterGroups(groups) }
				onClear={ () => Cubits.quotations.clearFilterGroups() }
				renderCustomInput={ (props) => <CommercialFilterInput { ...props }
				                                                      partnerTypes={ [PartnerType.Customer] }/> }
			/>

			<CrudPage.SearchInput
				className="rounded-t-none!"
				onSearch={ (searchText) => Cubits.quotations.search(searchText) }
			/>

			{ (() =>
			{
				if (Cubits.quotations.state.value instanceof PageLoading) return <TablePreview.Loading/>;
				if (Cubits.quotations.state.value instanceof PageError) return <TablePreview.Error/>;
				if (Cubits.quotations.state.value instanceof PageLoaded)
				{
					return (
						<CrudPage.Table>
							<CrudPage.TableBody<QuotationDto>
								isShareablePage={ true }
								data={ Cubits.quotations.entities.value }
								headerRows={ [
									{rowBody: "", rowStyles: "text-left w-12.5"},
									{rowBody: t("invoices.invoiceId"), rowStyles: "w-24"},
									{rowBody: "الحالة", rowStyles: "w-32"},
									{rowBody: t("invoices.date"), rowStyles: "w-32"},
									{rowBody: "تاريخ الانتهاء", rowStyles: "w-32"},
									{rowBody: t("invoices.partner", "العميل"), rowStyles: "w-48"},
									{rowBody: t("invoices.store"), rowStyles: "w-32"},
									{rowBody: t("invoices.total"), rowStyles: "w-32"},
									{rowBody: "", rowStyles: "w-24"}
								] }
								tableRowMapper={ (quote) =>
								{
									const badge = getQuotationStatusBadge(quote.status, t);
									return [
										{rowBody: `#${ quote.id }`, rowStyles: ""},
										{
											rowBody: (
												<span
													className={ cn("inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold", badge.className) }>
													{ badge.label }
												</span>
											),
											rowStyles: ""
										},
										{rowBody: quote.date, rowStyles: ""},
										{rowBody: quote.expiryDate || "-", rowStyles: ""},
										{
											rowBody: (
												<Link to={ `/clients/${ quote.partnerId }` }
												      className="text-blue-600 hover:underline">
													{ quote.partnerName || "-" }
												</Link>
											),
											rowStyles: ""
										},
										{rowBody: quote.storeName || "-", rowStyles: ""},
										{
											rowBody: (
												<div className="flex items-center gap-1 font-bold text-blue-600">
													{ Number(quote.fullAmount ?? 0).toLocaleString("en-US", {minimumFractionDigits: 2}) }
													<ErpCurrencyIcon/>
												</div>
											),
											rowStyles: ""
										},
										{
											rowBody: (
												<Button size="sm" variant="outline"
												        onClick={ () => printQuotation(quote) }>
													{ isPrinting.value === quote.id ? (
														<Loader2 className="h-4 w-4 animate-spin"/>
													) : (
														<Printer className="h-4 w-4"/>
													) }
												</Button>
											),
											rowStyles: ""
										}
									];
								} }
								hasUpdatePermission={ Services.auth.hasAuth(
									SystemPermissionsResources.Quotations,
									SystemPermissionsActions.Update
								) }
								hasDeletePermission={ (q) =>
									q.status !== QuotationStatus.Converted &&
									Services.auth.hasAuth(
										SystemPermissionsResources.Quotations,
										SystemPermissionsActions.Delete
									)
								}
								dropdownItems={ (quote) => [
									quote.status === QuotationStatus.Active ? (
										<DropdownMenuItem
											key="conv"
											className="text-emerald-600 font-semibold"
											onSelect={ () => handleConvertToSales(quote) }
										>
											<FilePlusCorner className="h-4 w-4 me-2"/>
											تحويل إلى فاتورة مبيعات
										</DropdownMenuItem>
									) : null,
									<DropdownMenuItem
										key="copy"
										className="text-blue-600 font-semibold"
										onSelect={ () => handleCopyQuotation(quote) }
									>
										<Copy className="h-4 w-4 me-2"/>
										نسخ عرض السعر
									</DropdownMenuItem>
								] }
								contextMenuItems={ (quote) => [
									quote.status === QuotationStatus.Active ? (
										<ContextMenuItem
											key="conv"
											className="text-emerald-600 font-semibold"
											onSelect={ () => handleConvertToSales(quote) }
										>
											<FilePlusCorner className="h-4 w-4 me-2"/>
											تحويل إلى فاتورة مبيعات
										</ContextMenuItem>
									) : null,
									<ContextMenuItem
										key="copy"
										className="text-blue-600 font-semibold"
										onSelect={ () => handleCopyQuotation(quote) }
									>
										<Copy className="h-4 w-4 me-2"/>
										نسخ عرض السعر
									</ContextMenuItem>
								] }
							/>
							<CrudPage.TablePagination
								pageSize={ Cubits.quotations.pageSize.value }
								totalNumber={ Cubits.quotations.count.value }
								currentPage={ Cubits.quotations.currentPage.value }
								onPageChanged={ (newPage) => Cubits.quotations.changePage(newPage) }
							/>
						</CrudPage.Table>
					);
				}
				return <TablePreview.Empty/>;
			})() }

			<CrudPage.ChangeDialog
				fetchEntity={ async (id: number) =>
				{
					if (!id || id <= 0) return undefined;
					const result = await Services.quotationsApi.Get(id);
					return result.data;
				} }
				changeDialog={ (dto: QuotationDto | undefined, closeDialog) => (
					<ChangeQuotationDialog
						dto={ dto }
						service={ Services.quotationsApi }
						onSuccess={ (data, mode) =>
						{
							if (mode === ChangeableEntityMode.Create)
							{
								Cubits.quotations.add(data);
								closeDialog();
							}
							else
							{
								Cubits.quotations.update(data);
							}
						} }
					/>
				) }
			/>

			<CrudPage.DeleteDialog
				entityNameSelector={ () => `"${ t("invoices.quotation") }"` }
				service={ Services.quotationsApi }
				onSuccess={ (entity) => Cubits.quotations.delete(entity) }
			/>

			{ printedReport.value &&
				createPortal(
					<PortalReportContainer>
						<InvoiceReport data={ printedReport.value } isPortal={ true }/>
					</PortalReportContainer>,
					document.body
				) }
		</CrudPage>
	);
}