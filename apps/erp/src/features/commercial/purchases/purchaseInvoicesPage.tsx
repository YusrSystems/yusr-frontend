import { useEffect, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { Link, useNavigate } from "react-router-dom";
import { createPortal } from "react-dom";
import { signal } from "@preact/signals-react";
import { useSignals } from "@preact/signals-react/runtime";
import { Copy, FileTextIcon, Loader2, Printer, Undo2 } from "lucide-react";
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
import { PurchaseInvoiceDto } from "@/core/data/commercial/purchaseInvoice";
import {
	getPurchaseInvoiceTypeBadge,
	getPurchaseInvoiceTypeName,
	PurchaseInvoiceType
} from "@/core/types/commercialEnums";
import { getReturnStatus, InvoiceReturnStatus } from "@/core/types/invoiceReturnStatus";
import { getPaymentStatus } from "@/core/types/paymentStatus";
import { PartnerType } from "@/core/data/partner";
import { Services } from "@/core/services/services";
import { Cubits } from "@/core/services/cubits";
import { SystemPermissionsResources } from "@/core/auth/systemPermissionsResources";
import ChangePurchaseInvoiceDialog from "./changePurchaseInvoiceDialog";
import ErpCurrencyIcon from "@/core/components/erpCurrencyIcon";
import { PortalReportContainer } from "@/features/report/reportContainer";
import { InvoiceReport } from "@/features/reports/invoice/invoiceReport";
import type { PurchaseInvoiceReportResult } from "@/features/reports/invoice/invoiceReportResult";
import { InvoicesListReport } from "@/features/reports/invoicesList/invoicesListReport";
import { APP_NAME } from "../../../../appConfig";
import { PurchaseInvoiceReportRequest } from "@/features/reports/invoice/invoiceReportRequest.ts";
import { useCommercialPrint } from "../hooks/useCommercialPrint";
import { CommercialFilterInput } from "@/features/commercial/components/commercialFilterInput.tsx";


export default function PurchaseInvoicesPage({initialType}: { initialType?: PurchaseInvoiceType })
{
	useSignals();
	const {t} = useTranslation(["accounting", "erpCommon"]);
	const navigate = useNavigate();
	const activeTypeTab = useMemo(() => signal<PurchaseInvoiceType | 0>(initialType ?? 0), [initialType]);
	const {printedReport, isPrinting, handlePrint} = useCommercialPrint<PurchaseInvoiceReportResult>();

	useEffect(() =>
	{
		const printed = printedReport.value;
		if (printed?.invoice)
		{
			document.title = `${ printed.invoice.id } - ${ getPurchaseInvoiceTypeName(printed.invoice.type, t) } - ${ printed.partner?.name || printed.invoice.partnerName || "" }`;
		}
		else
		{
			document.title = `${ t("invoices.purchasesManagement") } | ${ APP_NAME }`;
		}

		return () =>
		{
			document.title = APP_NAME;
		};
	}, [printedReport.value, t]);

	useEffect(() =>
	{
		const types =
			activeTypeTab.value === 0
				? [PurchaseInvoiceType.Bill, PurchaseInvoiceType.CreditNote, PurchaseInvoiceType.DebitNote]
				: [activeTypeTab.value];
		Cubits.purchaseInvoices.init(types);
	}, [activeTypeTab.value]);

	useEffect(() =>
	{
		Cubits.partners.init([PartnerType.Supplier]);
		Cubits.items.init();
		Cubits.stores.init();
		Cubits.paymentMethods.init();
	}, []);

	const printInvoice = (invoice: PurchaseInvoiceDto) =>
	{
		void handlePrint(
			invoice.id,
			"/api/Reports/PurchaseInvoice",
			new PurchaseInvoiceReportRequest({purchaseInvoiceId: invoice.id})
		);
	};

	const handleReturnPurchase = (dto: PurchaseInvoiceDto) =>
	{
		navigate(`/purchases/new?returnFromId=${ dto.id }`);
	};

	const handleCopyPurchase = (dto: PurchaseInvoiceDto) =>
	{
		navigate(`/purchases/new?copyFromId=${ dto.id }`);
	};

	if (!Services.auth.hasAuth(SystemPermissionsResources.Invoices, SystemPermissionsActions.Get))
	{
		return <UnauthorizedPage/>;
	}

	return (
		<CrudPage<PurchaseInvoiceDto>>
			<CrudPage.HeaderContainer>
				<h1>{ t("invoices.purchasesManagement") }</h1>
				<CrudPage.HeaderButtonsContainer>
					<div className="flex bg-muted/40 rounded-lg p-1 border">
						<Button
							variant={ activeTypeTab.value === 0 ? "default" : "ghost" }
							size="sm"
							onClick={ () => (activeTypeTab.value = 0) }
						>
							الكل
						</Button>
						<Button
							variant={ activeTypeTab.value === PurchaseInvoiceType.Bill ? "default" : "ghost" }
							size="sm"
							onClick={ () => (activeTypeTab.value = PurchaseInvoiceType.Bill) }
						>
							فواتير الشراء
						</Button>
						<Button
							variant={ activeTypeTab.value === PurchaseInvoiceType.CreditNote ? "default" : "ghost" }
							size="sm"
							onClick={ () => (activeTypeTab.value = PurchaseInvoiceType.CreditNote) }
						>
							إشعارات دائنة (مرتجعات)
						</Button>
						<Button
							variant={ activeTypeTab.value === PurchaseInvoiceType.DebitNote ? "default" : "ghost" }
							size="sm"
							onClick={ () => (activeTypeTab.value = PurchaseInvoiceType.DebitNote) }
						>
							إشعارات مدينة
						</Button>
					</div>
					{ Services.auth.hasAuth(SystemPermissionsResources.Invoices, SystemPermissionsActions.Add) && (
						<CrudPage.AddButton title={ t("invoices.addNewTitle") }/>
					) }
				</CrudPage.HeaderButtonsContainer>
			</CrudPage.HeaderContainer>

			<CrudPage.Cards
				cards={ [
					{
						title: "إجمالي فواتير المشتريات",
						data: (Cubits.purchaseInvoices.count.value ?? 0).toString(),
						icon: <FileTextIcon className="h-4 w-4 text-muted-foreground"/>
					}
				] }
			/>

			<FilterSection
				fieldsCubit={ Cubits.purchaseInvoiceFilterFields }
				onApply={ (groups) => Cubits.purchaseInvoices.applyFilterGroups(groups) }
				onClear={ () => Cubits.purchaseInvoices.clearFilterGroups() }
				renderCustomInput={ (props) => CommercialFilterInput({...props, partnerTypes: [PartnerType.Supplier]}) }
			/>

			<CrudPage.SearchInput
				className="rounded-t-none!"
				onSearch={ (searchText) => Cubits.purchaseInvoices.search(searchText) }
			/>

			{ (() =>
			{
				if (Cubits.purchaseInvoices.state.value instanceof PageLoading) return <TablePreview.Loading/>;
				if (Cubits.purchaseInvoices.state.value instanceof PageError) return <TablePreview.Error/>;
				if (Cubits.purchaseInvoices.state.value instanceof PageLoaded)
				{
					return (
						<CrudPage.Table>
							<CrudPage.TableBody<PurchaseInvoiceDto>
								isShareablePage={ true }
								data={ Cubits.purchaseInvoices.entities.value }
								headerRows={ [
									{rowBody: "", rowStyles: "text-left w-12.5"},
									{rowBody: t("invoices.invoiceId"), rowStyles: "w-24"},
									{rowBody: t("invoices.type"), rowStyles: "w-32"},
									{rowBody: t("invoices.date"), rowStyles: "w-32"},
									{rowBody: t("invoices.partner", "المورد"), rowStyles: "w-48"},
									{rowBody: "رقم فاتورة المورد", rowStyles: "w-36"},
									{rowBody: t("invoices.store"), rowStyles: "w-32"},
									{rowBody: t("invoices.total"), rowStyles: "w-32"},
									{rowBody: "حالة الدفع", rowStyles: "w-32"},
									{rowBody: "حالة الإرجاع", rowStyles: "w-32"},
									{rowBody: "", rowStyles: "w-24"}
								] }
								tableRowMapper={ (inv) =>
								{
									const badge = getPurchaseInvoiceTypeBadge(inv.type, t);
									const paymentStat = getPaymentStatus(inv, t);
									const returnStat = getReturnStatus(inv, t);
									return [
										{rowBody: `#${ inv.id }`, rowStyles: ""},
										{
											rowBody: <span
												className={ cn("inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold", badge.className) }>{ badge.label }</span>,
											rowStyles: ""
										},
										{rowBody: inv.date, rowStyles: ""},
										{
											rowBody: (
												<Link to={ `/suppliers/${ inv.partnerId }` }
												      className="text-blue-600 hover:underline">
													{ inv.partnerName || "-" }
												</Link>
											),
											rowStyles: ""
										},
										{rowBody: inv.vendorInvoiceNumber || "-", rowStyles: ""},
										{rowBody: inv.storeName || "-", rowStyles: ""},
										{
											rowBody: (
												<div className="flex items-center gap-1 font-bold text-blue-600">
													{ Number(inv.fullAmount ?? 0).toLocaleString("en-US", {minimumFractionDigits: 2}) }
													<ErpCurrencyIcon/>
												</div>
											),
											rowStyles: ""
										},
										{
											rowBody: (
												<span
													className={ cn("inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium", paymentStat.styles) }>
													{ paymentStat.message }
												</span>
											),
											rowStyles: ""
										},
										{
											rowBody: inv.type === PurchaseInvoiceType.Bill ? (
												<span
													className={ cn("inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium", returnStat.styles) }>
													{ returnStat.message }
												</span>
											) : "-",
											rowStyles: ""
										},
										{
											rowBody: (
												<Button size="sm" variant="outline" onClick={ () => printInvoice(inv) }>
													{ isPrinting.value === inv.id ? (
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
									SystemPermissionsResources.Invoices,
									SystemPermissionsActions.Update
								) }
								hasDeletePermission={ false }
								dropdownItems={ (dto) => [
									...(dto.type === PurchaseInvoiceType.Bill && dto.returnStatusId !== InvoiceReturnStatus.FullyReturned
										? [
											<DropdownMenuItem
												key="ret"
												className="text-orange-700 font-semibold"
												onSelect={ () => handleReturnPurchase(dto) }
											>
												<Undo2 className="h-4 w-4 me-2"/>
												{ t("invoices.return") }
											</DropdownMenuItem>
										]
										: []),
									...(dto.type !== PurchaseInvoiceType.CreditNote
										? [
											<DropdownMenuItem
												key="copy"
												className="text-blue-600 font-semibold"
												onSelect={ () => handleCopyPurchase(dto) }
											>
												<Copy className="h-4 w-4 me-2"/>
												{ t("invoices.copyInvoice") }
											</DropdownMenuItem>
										]
										: [])
								] }
								contextMenuItems={ (dto) => [
									...(dto.type === PurchaseInvoiceType.Bill && dto.returnStatusId !== InvoiceReturnStatus.FullyReturned
										? [
											<ContextMenuItem
												key="ret"
												className="text-orange-700 font-semibold"
												onSelect={ () => handleReturnPurchase(dto) }
											>
												<Undo2 className="h-4 w-4 me-2"/>
												{ t("invoices.return") }
											</ContextMenuItem>
										]
										: []),
									...(dto.type !== PurchaseInvoiceType.CreditNote
										? [
											<ContextMenuItem
												key="copy"
												className="text-blue-600 font-semibold"
												onSelect={ () => handleCopyPurchase(dto) }
											>
												<Copy className="h-4 w-4 me-2"/>
												{ t("invoices.copyInvoice") }
											</ContextMenuItem>
										]
										: [])
								] }
							/>
							<CrudPage.TablePagination
								pageSize={ Cubits.purchaseInvoices.pageSize.value }
								totalNumber={ Cubits.purchaseInvoices.count.value }
								currentPage={ Cubits.purchaseInvoices.currentPage.value }
								onPageChanged={ (newPage) => Cubits.purchaseInvoices.changePage(newPage) }
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
					const result = await Services.purchaseInvoicesApi.Get(id);
					return result.data;
				} }
				changeDialog={ (dto: PurchaseInvoiceDto | undefined, closeDialog) => (
					<ChangePurchaseInvoiceDialog
						dto={ dto }
						service={ Services.purchaseInvoicesApi }
						fixedType={ activeTypeTab.value === 0 ? PurchaseInvoiceType.Bill : activeTypeTab.value }
						onSuccess={ (data, mode) =>
						{
							if (mode === ChangeableEntityMode.Create)
							{
								Cubits.purchaseInvoices.add(data);
								closeDialog();
							}
							else
							{
								Cubits.purchaseInvoices.update(data);
							}
						} }
					/>
				) }
			/>

			{ !printedReport.value &&
				createPortal(
					<PortalReportContainer>
						<InvoicesListReport<PurchaseInvoiceDto>
							cubit={ Cubits.purchaseInvoices }
							getTypeName={ (type) => getPurchaseInvoiceTypeName(type as PurchaseInvoiceType, t) }
							titleAr="قائمة فواتير المشتريات"
							titleEn="Purchase Invoices List"
							routePrefix="purchases"
							isPortal={ true }
						/>
					</PortalReportContainer>,
					document.body
				) }
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