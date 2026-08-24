import { useEffect, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { createPortal } from "react-dom";
import { Signal, signal } from "@preact/signals-react";
import { useSignals } from "@preact/signals-react/runtime";
import { Copy, FileTextIcon, Loader2, Printer, RotateCw, Undo2 } from "lucide-react";
import type { TFunction } from "i18next";
import {
	Button,
	ChangeableEntityMode,
	cn,
	ContextMenuItem,
	CrudPage,
	CrudTablePagination,
	DropdownMenuItem,
	FilterLabelWrapper,
	FilterSection,
	type FilterValueInputProps,
	PageError,
	PageLoaded,
	PageLoading,
	SelectField,
	SystemPermissionsActions,
	TablePreview,
	Tooltip,
	TooltipContent,
	TooltipTrigger,
	UnauthorizedPage,
	YusrApiHelper
} from "yusr-ui";
import { SalesInvoiceDto, SalesInvoiceMode } from "@/core/data/commercial/salesInvoice";
import { getSalesInvoiceTypeBadge, getSalesInvoiceTypeName, SalesInvoiceType } from "@/core/types/commercialEnums";
import { EInvoiceStatus } from "@/core/types/eInvoiceStatus";
import { getReturnStatus, InvoiceReturnStatus } from "@/core/types/invoiceReturnStatus";
import { getPaymentStatus, PaymentStatus } from "@/core/types/paymentStatus";
import { EInvoicingEnvironmentType } from "@/core/data/setting";
import { PartnerType } from "@/core/data/partner";
import { Services } from "@/core/services/services";
import { Cubits } from "@/core/services/cubits";
import { SystemPermissionsResources } from "@/core/auth/systemPermissionsResources";
import ChangeSalesInvoiceDialog from "./changeSalesInvoiceDialog";
import ErpCurrencyIcon from "@/core/components/erpCurrencyIcon";
import StoresSearchableSelect from "@/core/components/searchableSelect/storesSearchableSelect";
import { PartnersSearchableSelect } from "@/core/components/searchableSelect/partnersSearchableSelect";
import ItemsMultiSearchableSelect from "@/core/components/searchableSelect/itemsMultiSearchableSelect";
import { PortalReportContainer } from "@/features/report/reportContainer";
import { InvoiceReport } from "@/features/reports/invoice/invoiceReport";
import { InvoicesListReport } from "@/features/reports/invoicesList/invoicesListReport";
import { APP_NAME } from "../../../../appConfig";
import { toast } from "sonner";
import { SalesInvoiceReportRequest } from "@/features/reports/invoice/invoiceReportRequest.ts";
import type { SalesInvoiceReportResult } from "@/features/reports/invoice/invoiceReportResult.ts";


export default function SalesInvoicesPage({initialType}: { initialType?: SalesInvoiceType })
{
	useSignals();
	const {t} = useTranslation(["accounting", "erpCommon"]);
	const activeTypeTab = useMemo(() => signal<SalesInvoiceType | 0>(initialType ?? 0), [initialType]);
	const printedInvoice = useMemo(() => signal<SalesInvoiceReportResult | undefined>(undefined), []);
	const isPrinting = useMemo(() => signal<number | undefined>(undefined), []);
	const resendingEInvoice = useMemo(() => signal(false), []);

	useEffect(() =>
	{
		document.title = `${ t("invoices.salesManagement") } | ${ APP_NAME }`;
	}, [t]);

	useEffect(() =>
	{
		const types =
			activeTypeTab.value === 0
				? [SalesInvoiceType.Invoice, SalesInvoiceType.CreditNote, SalesInvoiceType.DebitNote]
				: [activeTypeTab.value];
		Cubits.salesInvoices.init(types);
		Cubits.partners.init([PartnerType.Customer]);
		Cubits.items.init();
		Cubits.stores.init();
	}, [activeTypeTab.value]);

	const handlePrint = async (invoice: SalesInvoiceDto) =>
	{
		isPrinting.value = invoice.id;
		try
		{
			const res = await YusrApiHelper.Post<SalesInvoiceReportResult>(
				`/api/Reports/SalesInvoice`,
				new SalesInvoiceReportRequest({invoiceId: invoice.id})
			);
			if (res.data)
			{
				printedInvoice.value = res.data;
				requestAnimationFrame(() =>
				{
					requestAnimationFrame(() =>
					{
						window.print();
						isPrinting.value = undefined;
					});
				});
			}
			else
			{
				isPrinting.value = undefined;
			}
		}
		catch
		{
			isPrinting.value = undefined;
		}
	};

	const resendEInvoice = async (invoice: SalesInvoiceDto) =>
	{
		resendingEInvoice.value = true;
		const res = await Services.salesInvoicesApi.ResendEInvoice(invoice.id);
		if (res.status === 200 && res.data !== undefined)
		{
			if (res.data === EInvoiceStatus.NotSent)
			{
				toast.error(t("invoices.resendFailed"));
			}
			else
			{
				toast.success(t("invoices.resendSuccess"));
			}
			invoice.eInvoiceStatus = res.data;
		}
		resendingEInvoice.value = false;
	};

	if (!Services.auth.hasAuth(SystemPermissionsResources.InvoiceSell, SystemPermissionsActions.Get))
	{
		return <UnauthorizedPage/>;
	}

	return (
		<CrudPage<SalesInvoiceDto>>
			<CrudPage.HeaderContainer>
				<h1>{ t("invoices.salesManagement") }</h1>
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
							variant={ activeTypeTab.value === SalesInvoiceType.Invoice ? "default" : "ghost" }
							size="sm"
							onClick={ () => (activeTypeTab.value = SalesInvoiceType.Invoice) }
						>
							فواتير المبيعات
						</Button>
						<Button
							variant={ activeTypeTab.value === SalesInvoiceType.CreditNote ? "default" : "ghost" }
							size="sm"
							onClick={ () => (activeTypeTab.value = SalesInvoiceType.CreditNote) }
						>
							إشعارات دائنة (مرتجعات)
						</Button>
						<Button
							variant={ activeTypeTab.value === SalesInvoiceType.DebitNote ? "default" : "ghost" }
							size="sm"
							onClick={ () => (activeTypeTab.value = SalesInvoiceType.DebitNote) }
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
						title: t("invoices.totalInvoices"),
						data: (Cubits.salesInvoices.count.value ?? 0).toString(),
						icon: <FileTextIcon className="h-4 w-4 text-muted-foreground"/>
					}
				] }
			/>

			<FilterSection
				fieldsCubit={ Cubits.salesInvoiceFilterFields }
				onApply={ (groups) => Cubits.salesInvoices.applyFilterGroups(groups) }
				onClear={ () => Cubits.salesInvoices.clearFilterGroups() }
				renderCustomInput={ (props) => RenderSalesInvoiceFilterInput(props, t) }
			/>

			<CrudPage.SearchInput
				className="rounded-t-none!"
				onSearch={ (searchText) => Cubits.salesInvoices.search(searchText) }
			/>

			{ (() =>
			{
				if (Cubits.salesInvoices.state.value instanceof PageLoading) return <TablePreview.Loading/>;
				if (Cubits.salesInvoices.state.value instanceof PageError) return <TablePreview.Error/>;
				if (Cubits.salesInvoices.state.value instanceof PageLoaded)
				{
					return (
						<CrudPage.Table>
							<CrudPage.TableBody<SalesInvoiceDto>
								isShareablePage={ true }
								data={ Cubits.salesInvoices.entities.value }
								headerRows={ [
									{rowBody: "", rowStyles: "text-left w-12.5"},
									{rowBody: t("invoices.invoiceId"), rowStyles: "w-24"},
									{rowBody: t("invoices.type"), rowStyles: "w-32"},
									{rowBody: t("invoices.date"), rowStyles: "w-32"},
									{rowBody: t("invoices.partner", "العميل"), rowStyles: "w-48"},
									{rowBody: t("invoices.store"), rowStyles: "w-32"},
									{rowBody: t("invoices.total"), rowStyles: "w-32"},
									{rowBody: "حالة الدفع", rowStyles: "w-32"},
									{rowBody: "حالة الإرجاع", rowStyles: "w-32"},
									...(Services.auth.setting?.eInvoicingEnvironmentType.value !== EInvoicingEnvironmentType.NotRegistered
										? [{rowBody: t("invoices.eInvoiceStatus"), rowStyles: "w-50"}]
										: []),
									{rowBody: "", rowStyles: "w-24"}
								] }
								tableRowMapper={ (inv) =>
								{
									const badge = getSalesInvoiceTypeBadge(inv.type, t);
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
												<Link to={ `/clients/${ inv.partnerId }` }
												      className="text-blue-600 hover:underline">
													{ inv.partnerName || "-" }
												</Link>
											),
											rowStyles: ""
										},
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
											rowBody: inv.type === SalesInvoiceType.Invoice ? (
												<span
													className={ cn("inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium", returnStat.styles) }>
													{ returnStat.message }
												</span>
											) : "-",
											rowStyles: ""
										},
										...(Services.auth.setting?.eInvoicingEnvironmentType.value !== EInvoicingEnvironmentType.NotRegistered
											? [
												{
													rowBody: (
														<div className="flex items-center gap-2">
															<span
																className={ cn(
																	"inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium",
																	inv.eInvoiceStatus === EInvoiceStatus.SentCorrectly
																		? "bg-green-100 text-green-800"
																		: inv.eInvoiceStatus === EInvoiceStatus.SentWithWarnings
																			? "bg-orange-100 text-orange-800"
																			: "bg-red-100 text-red-800"
																) }
															>
																{ inv.eInvoiceStatus === EInvoiceStatus.SentCorrectly
																	? t("invoices.sent")
																	: inv.eInvoiceStatus === EInvoiceStatus.SentWithWarnings
																		? t("invoices.sentWithWarnings")
																		: t("invoices.notSent") }
															</span>
															{ inv.eInvoiceStatus === EInvoiceStatus.NotSent && (
																<Button
																	variant="ghost"
																	size="icon"
																	className="h-6 w-6 text-red-500"
																	onClick={ () => resendEInvoice(inv) }
																	disabled={ resendingEInvoice.value }
																>
																	<RotateCw className="h-3.5 w-3.5"/>
																</Button>
															) }
														</div>
													),
													rowStyles: ""
												}
											]
											: []),
										{
											rowBody: (
												<Tooltip delayDuration={ 200 }>
													<TooltipTrigger asChild>
														<Button
															size="sm"
															variant="outline"
															disabled={ !inv.canBePrinted }
															onClick={ () => handlePrint(inv) }
														>
															{ isPrinting.value === inv.id ? (
																<Loader2 className="h-4 w-4 animate-spin"/>
															) : (
																<Printer className="h-4 w-4"/>
															) }
														</Button>
													</TooltipTrigger>
													{ !inv.canBePrinted && (
														<TooltipContent side="top">
															<p>{ t("invoices.invoiceMustBeSentBeforePrint") }</p>
														</TooltipContent>
													) }
												</Tooltip>
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
								onEditClicked={ (entity) => (entity.invoiceMode = SalesInvoiceMode.Normal) }
								dropdownItems={ (dto, openEditDialog) => [
									...(dto.type === SalesInvoiceType.Invoice && dto.returnStatusId !== InvoiceReturnStatus.FullyReturned
										? [
											<DropdownMenuItem
												key="ret"
												className="text-orange-700 font-semibold"
												onSelect={ () =>
												{
													dto.invoiceMode = SalesInvoiceMode.Return;
													openEditDialog(dto);
												} }
											>
												<Undo2 className="h-4 w-4 me-2"/>
												{ t("invoices.return") }
											</DropdownMenuItem>
										]
										: []),
									<DropdownMenuItem
										key="copy"
										className="text-blue-600 font-semibold"
										onSelect={ () =>
										{
											dto.invoiceMode = SalesInvoiceMode.Copy;
											openEditDialog(dto);
										} }
									>
										<Copy className="h-4 w-4 me-2"/>
										{ t("invoices.copyInvoice") }
									</DropdownMenuItem>
								] }
								contextMenuItems={ (dto, openEditDialog) => [
									...(dto.type === SalesInvoiceType.Invoice && dto.returnStatusId !== InvoiceReturnStatus.FullyReturned
										? [
											<ContextMenuItem
												key="ret"
												className="text-orange-700 font-semibold"
												onSelect={ () =>
												{
													dto.invoiceMode = SalesInvoiceMode.Return;
													openEditDialog(dto);
												} }
											>
												<Undo2 className="h-4 w-4 me-2"/>
												{ t("invoices.return") }
											</ContextMenuItem>
										]
										: []),
									<ContextMenuItem
										key="copy"
										className="text-blue-600 font-semibold"
										onSelect={ () =>
										{
											dto.invoiceMode = SalesInvoiceMode.Copy;
											openEditDialog(dto);
										} }
									>
										<Copy className="h-4 w-4 me-2"/>
										{ t("invoices.copyInvoice") }
									</ContextMenuItem>
								] }
							/>
							<CrudTablePagination
								pageSize={ Cubits.salesInvoices.pageSize.value }
								totalNumber={ Cubits.salesInvoices.count.value }
								currentPage={ Cubits.salesInvoices.currentPage.value }
								onPageChanged={ (newPage) => Cubits.salesInvoices.changePage(newPage) }
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
					const result = await Services.salesInvoicesApi.Get(id);
					return result.data;
				} }
				changeDialog={ (dto: SalesInvoiceDto | undefined, closeDialog) => (
					<ChangeSalesInvoiceDialog
						dto={ dto }
						service={ Services.salesInvoicesApi }
						fixedType={ activeTypeTab.value === 0 ? SalesInvoiceType.Invoice : activeTypeTab.value }
						onSuccess={ (data, mode) =>
						{
							if (mode === ChangeableEntityMode.Create)
							{
								Cubits.salesInvoices.add(data);
								closeDialog();
							}
							else
							{
								Cubits.salesInvoices.update(data);
							}
						} }
					/>
				) }
			/>

			{ !printedInvoice.value &&
				createPortal(
					<PortalReportContainer>
						<InvoicesListReport<SalesInvoiceDto>
							cubit={ Cubits.salesInvoices }
							getTypeName={ (type) => getSalesInvoiceTypeName(type as SalesInvoiceType, t) }
							titleAr="قائمة فواتير المبيعات"
							titleEn="Sales Invoices List"
							routePrefix="sales"
							isPortal={ true }
						/>
					</PortalReportContainer>,
					document.body
				) }
			{ printedInvoice.value &&
				createPortal(
					<PortalReportContainer>
						<InvoiceReport data={ printedInvoice.value } isPortal={ true }/>
					</PortalReportContainer>,
					document.body
				) }
		</CrudPage>
	);
}

function RenderSalesInvoiceFilterInput({rule, field}: FilterValueInputProps, t: TFunction<"accounting">)
{
	useSignals();
	if (field.propertyName === "PartnerId")
	{
		return (
			<FilterLabelWrapper rule={ rule }>
				{ (label) => (
					<PartnersSearchableSelect
						id={ rule.value as Signal<number | undefined> }
						label={ label }
						types={ [PartnerType.Customer] }
						onSelect={ (entity) => (rule.value.value = entity ? entity.id : "") }
					/>
				) }
			</FilterLabelWrapper>
		);
	}
	if (field.propertyName === "StoreId")
	{
		return (
			<FilterLabelWrapper rule={ rule }>
				{ (label) => (
					<StoresSearchableSelect
						id={ rule.value as Signal<number | undefined> }
						label={ label }
						onSelect={ (entity) => (rule.value.value = entity ? entity.id : "") }
					/>
				) }
			</FilterLabelWrapper>
		);
	}
	if (field.propertyName === "ReturnStatusId")
	{
		return (
			<SelectField<InvoiceReturnStatus>
				required
				value={ rule.value as Signal<InvoiceReturnStatus | undefined> }
				onValueChange={ (type) => (rule.value.value = type) }
				options={ [
					{label: t("invoices.notReturned"), value: InvoiceReturnStatus.NotReturned},
					{label: t("invoices.partialReturned"), value: InvoiceReturnStatus.PartialReturned},
					{label: t("invoices.fullyReturned"), value: InvoiceReturnStatus.FullyReturned}
				] }
			/>
		);
	}
	if (field.propertyName === "PaymentStatus")
	{
		return (
			<SelectField<PaymentStatus>
				required
				value={ rule.value as Signal<PaymentStatus | undefined> }
				onValueChange={ (type) => (rule.value.value = type) }
				options={ [
					{label: t("invoices.notPaid"), value: PaymentStatus.NotPaid},
					{
						label: t("invoices.partiallyPaid", {amount: "", currency: ""}),
						value: PaymentStatus.PartiallyPaid
					},
					{label: t("invoices.fullyPaid"), value: PaymentStatus.FullyPaid},
					{label: t("invoices.overpaid"), value: PaymentStatus.Overpaid}
				] }
			/>
		);
	}
	if (field.propertyName === "Items")
	{
		return <ItemsMultiSearchableSelect onToggle={ (ids) => (rule.value.value = ids) }/>;
	}
	return undefined;
}