import { InvoiceDto, InvoiceMode } from "@/core/data/invoices/invoice.ts";
import ReportConstants from "@/core/data/report/reportConstants.ts";
import { Cubits } from "@/core/services/cubits";
import { Services } from "@/core/services/services";
import ChangeInvoiceDialog from "@/features/invoices/changeInvoiceDialog.tsx";
import ReportButton from "@/features/reports/reportButton.tsx";
import { Signal, signal } from "@preact/signals-react";
import { useSignals } from "@preact/signals-react/runtime";
import type { TFunction } from "i18next";
import { Copy, FilePlusCorner, FileTextIcon, Printer, RotateCw, Undo2 } from "lucide-react";
import React, { type ReactNode, useEffect, useMemo } from "react";
import { useTranslation } from "react-i18next";
import {
	Button,
	ChangeableEntityMode,
	ContextMenuItem,
	CrudPage,
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
import { SystemPermissionsResources } from "@/core/auth/systemPermissionsResources.ts";
import { InvoiceType } from "@/core/types/invoiceType";
import VerifyAccountWrapper from "@/core/components/verifyAccountWrapper.tsx";
import { EInvoicingEnvironmentType } from "@/core/data/setting.ts";
import { EInvoiceStatus } from "@/core/types/eInvoiceStatus";
import { toast } from "sonner";
import ErpCurrencyIcon from "@/core/components/erpCurrencyIcon.tsx";
import StoresSearchableSelect from "@/core/components/searchableSelect/storesSearchableSelect.tsx";
import { InvoiceReturnStatus } from "@/core/types/invoiceReturnStatus.ts";
import { PaymentStatus } from "@/core/types/paymentStatus.ts";
import ItemsMultiSearchableSelect from "@/core/components/searchableSelect/itemsMultiSearchableSelect.tsx";
import { PartnerType } from "@/core/data/partner.ts";
import { createPortal } from "react-dom";
import { InvoicesListReport } from "@/features/reports/invoicesList/invoicesListReport.tsx";
import { PortalReportContainer } from "@/features/report/reportContainer.tsx";
import { PartnersSearchableSelect } from "@/core/components/searchableSelect/partnersSearchableSelect.tsx";
import { APP_NAME } from "../../../appConfig.ts";
import { InvoiceReport } from "@/features/reports/invoice/invoiceReport";
import type { InvoiceReportResult } from "@/features/reports/invoice/invoiceReportResult";
import { InvoiceReportRequest } from "@/core/data/report/invoiceReportRequest";
import { Link } from "react-router-dom";


export default function InvoicesPage({
	totalInvoicesTitle,
	title,
	fixedType,
	filterTypes,
	hasPagePermission,
	permissionResource
}: {
	entityName?: string;
	addNewItemTitle?: string;
	totalInvoicesTitle?: string;
	title: string;
	fixedType: InvoiceType;
	filterTypes: InvoiceType[];
	hasPagePermission: boolean;
	basePath?: string;
	permissionResource: string;
})
{
	useSignals();
	const {t} = useTranslation(["accounting", "erpCommon"]);

	const printedInvoice = useMemo(() => signal<InvoiceReportResult | undefined>(), []);
	const isPrinting = useMemo(() => signal<number | undefined>(), []);

	useEffect(() =>
	{
		Cubits.invoices.init(filterTypes);
	}, [filterTypes]);

	useEffect(() =>
	{
		Cubits.partners.init(fixedType == InvoiceType.Purchase || fixedType == InvoiceType.PurchaseReturn ? [PartnerType.Supplier] : [PartnerType.Customer]);
	}, [fixedType]);

	useEffect(() =>
	{
		Cubits.items.init();
		Cubits.stores.init();
	}, []);

	useEffect(() =>
	{
		document.title = `${ title } | ${ APP_NAME }`;
		return () =>
		{
			document.title = APP_NAME;
		};
	}, [title]);

	useEffect(() =>
	{
		const handleAfterPrint = () =>
		{
			printedInvoice.value = undefined;
		};
		window.addEventListener("afterprint", handleAfterPrint);
		return () => window.removeEventListener("afterprint", handleAfterPrint);
	}, [printedInvoice]);

	const handlePrint = async (invoice: InvoiceDto) =>
	{
		isPrinting.value = invoice.id;
		try
		{
			const res = await YusrApiHelper.Post<InvoiceReportResult>(`/api/Reports/Invoice`, new InvoiceReportRequest({invoiceId: invoice.id}));
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

	if (!hasPagePermission)
	{
		return <UnauthorizedPage/>;
	}

	return (
		<VerifyAccountWrapper>
			<CrudPage<InvoiceDto>>
				<CrudPage.Header
					title={ title }
					addButtonTitle={ fixedType === InvoiceType.Quotation ? t("invoices.addNewQuotationTitle") : t("invoices.addNewTitle") }
					isAddButtonVisible={ Services.auth.hasAuth(
						SystemPermissionsResources.Invoices,
						SystemPermissionsActions.Add
					) }
					actionButtons={ [
						<Button
							key="print-list"
							variant="outline"
							onClick={ () =>
							{
								setTimeout(() =>
								{
									window.print();
								}, 100);
							} }
						>
							<Printer className="h-4 w-4"/>
							{ t("erpCommon:reports.InvoicesList") }
						</Button>
					] }
				/>

				<Cards totalInvoicesTitle={ totalInvoicesTitle }/>

				<FilterSection
					fieldsCubit={ Cubits.invoiceFilterFields }
					onApply={ (groups) => Cubits.invoices.applyFilterGroups(groups) }
					onClear={ () => Cubits.invoices.clearFilterGroups() }
					renderCustomInput={ RenderInvoiceFilterInput }
				/>

				<CrudPage.SearchInput
					className="rounded-t-none!"
					onSearch={ (searchText) => Cubits.invoices.search(searchText) }
				/>

				<PageTable fixedType={ fixedType } permissionResource={ permissionResource } onPrint={ handlePrint }
				           isPrinting={ isPrinting }/>

				<CrudPage.ChangeDialog
					fetchEntity={ async (id: number) =>
					{
						const result = await Services.invoicesApi.Get(id);
						return result.data;
					} }
					changeDialog={ (dto: InvoiceDto | undefined, closeDialog) =>
					{
						return (
							<ChangeInvoiceDialog
								dto={ dto }
								service={ Services.invoicesApi }
								fixedType={ fixedType }
								onSuccess={ (data, dto) =>
								{
									if (dto === ChangeableEntityMode.Create)
									{
										Cubits.invoices.add(data);
										closeDialog();
									}
									else if (dto === ChangeableEntityMode.Update)
									{
										Cubits.invoices.update(data);
									}
								} }
							/>
						);
					} }
				/>

				<CrudPage.DeleteDialog
					entityNameSelector={ () => `"${ t("invoices.entityName") }"` }
					service={ Services.invoicesApi }
					onSuccess={ (entity) => Cubits.invoices.delete(entity) }
				/>
			</CrudPage>

			{ !printedInvoice.value && createPortal(
				<PortalReportContainer>
					<InvoicesListReport isPortal={ true }/>
				</PortalReportContainer>,
				document.body
			) }

			{ printedInvoice.value && createPortal(
				<PortalReportContainer>
					<InvoiceReport data={ printedInvoice.value } isPortal={ true }/>
				</PortalReportContainer>,
				document.body
			) }
		</VerifyAccountWrapper>
	);
}

function Cards({totalInvoicesTitle}: { totalInvoicesTitle?: string })
{
	useSignals();
	const {t} = useTranslation("accounting");
	return (
		<CrudPage.Cards
			cards={ [{
				title: totalInvoicesTitle ?? t("invoices.totalInvoices"),
				data: (Cubits.invoices.count.value ?? 0).toString(),
				icon: <FileTextIcon className="h-4 w-4 text-muted-foreground"/>
			}] }
		/>
	);
}

function PageTable({fixedType, permissionResource, onPrint, isPrinting}: {
	fixedType: InvoiceType,
	permissionResource: string,
	onPrint: (invoice: InvoiceDto) => void,
	isPrinting: Signal<number | undefined>
})
{
	useSignals();
	const resendingEInvoice = useMemo(() => signal(false), []);
	const {t} = useTranslation(["accounting", "common"]);

	const resendEInvoice = async (invoice: InvoiceDto) =>
	{
		resendingEInvoice.value = true;
		const res = await Services.invoicesApi.ResendEInvoice(invoice.id);
		if (res.status === 200 && res.data != undefined)
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

	if (Cubits.invoices.state.value instanceof PageLoading)
	{
		return <TablePreview.Loading/>;
	}
	const getTableHeadRows = () =>
	{
		const rows = [{rowBody: "", rowStyles: "text-left w-12.5"}, {
			rowBody: t("invoices.invoiceId"),
			rowStyles: "w-24"
		}];

		if (fixedType === InvoiceType.Quotation)
		{
			rows.push({rowBody: t("invoices.notes"), rowStyles: "w-32"});
		}
		else
		{
			rows.push({rowBody: t("invoices.type"), rowStyles: "w-32"});
		}

		rows.push(
			{rowBody: t("invoices.date"), rowStyles: "w-32"},
			{rowBody: t("invoices.partner", "الجهة"), rowStyles: "w-48"},
			{rowBody: t("invoices.store"), rowStyles: "w-32"},
			{rowBody: t("invoices.total"), rowStyles: "w-32"}
		);

		if (fixedType !== InvoiceType.Quotation)
		{
			rows.push(
				{rowBody: "", rowStyles: "w-32"},
				{rowBody: "", rowStyles: "w-32"}
			);
		}

		if (
			Services.auth.setting?.eInvoicingEnvironmentType.value !== EInvoicingEnvironmentType.NotRegistered
			&& fixedType === InvoiceType.Sell
		)
		{
			rows.push({rowBody: t("invoices.eInvoiceStatus"), rowStyles: "w-50"});
		}

		if (
			Services.auth.hasAuth(
				SystemPermissionsResources.ReportInvoice,
				SystemPermissionsActions.Get
			)
		)
		{
			rows.push({rowBody: "", rowStyles: "w-32"});
		}

		return rows;
	};

	const getPaymentStatus = (invoice: InvoiceDto): { message: string; styles: string; } =>
	{
		if (invoice.paymentStatusId === PaymentStatus.NotPaid)
		{
			return {message: t("invoices.notPaid"), styles: "bg-red-100 text-red-800"};
		}

		if (invoice.paymentStatusId === PaymentStatus.FullyPaid)
		{
			return {message: t("invoices.fullyPaid"), styles: "bg-green-100 text-green-800"};
		}

		if (invoice.paymentStatusId === PaymentStatus.Overpaid)
		{
			return {message: t("invoices.overpaid"), styles: "bg-red-100 text-red-800"};
		}

		return {
			message: t("invoices.partiallyPaid", {
				amount: invoice.paidAmount,
				currency: Services.auth.setting?.currency?.value.code.value
			}),
			styles: "bg-orange-100 text-orange-800"
		};
	};

	const getReturnStatus = (invoice: InvoiceDto): { message: string; styles: string; } =>
	{
		if (invoice.returnStatusId === InvoiceReturnStatus.NotReturned)
		{
			return {message: t("invoices.notReturned"), styles: "bg-green-100 text-green-800"};
		}

		if (invoice.returnStatusId === InvoiceReturnStatus.FullyReturned)
		{
			return {message: t("invoices.fullyReturned"), styles: "bg-red-100 text-red-800"};
		}

		return {
			message: t("invoices.partialReturned"),
			styles: "bg-orange-100 text-orange-800"
		};
	};

	const getEInvoiceStatus = (invoice: InvoiceDto): { message: string; styles: string; } =>
	{
		if (
			Services.auth.setting?.eInvoicingEnvironmentType.value === EInvoicingEnvironmentType.NotRegistered
			|| (invoice.type !== InvoiceType.Sell && invoice.type !== InvoiceType.SellReturn)
		)
		{
			return {message: "", styles: ""};
		}

		if (invoice.eInvoiceStatus === EInvoiceStatus.NotSent)
		{
			return {message: t("invoices.notSent"), styles: "bg-red-100 text-red-800"};
		}

		if (invoice.eInvoiceStatus === EInvoiceStatus.SentWithWarnings)
		{
			return {message: t("invoices.sentWithWarnings"), styles: "bg-orange-100 text-orange-800"};
		}

		if (invoice.eInvoiceStatus === EInvoiceStatus.SentCorrectly)
		{
			return {message: t("invoices.sent"), styles: "bg-green-100 text-green-800"};
		}

		return {message: "", styles: ""};
	};

	const getActions = (
		dto: InvoiceDto,
		openEditDialog: (dto: InvoiceDto) => void,
		ItemComponent: typeof DropdownMenuItem | typeof ContextMenuItem
	) =>
	{
		const items: React.ReactNode[] = [];
		if (dto.type === InvoiceType.Sell || dto.type === InvoiceType.Purchase)
		{
			items.push(
				<ItemComponent
					className="text-orange-700 font-semibold"
					onSelect={ () =>
					{
						dto.invoiceMode = InvoiceMode.Return;
						openEditDialog(dto);
					} }
				>
					<Undo2 className="h-4 w-4 me-2"/>
					<h4 className="text-sm">{ t("invoices.return") }</h4>
				</ItemComponent>
			);

			items.push(
				<ItemComponent
					className="text-blue-600 font-semibold"
					onSelect={ () =>
					{
						dto.invoiceMode = InvoiceMode.Copy;
						openEditDialog(dto);
					} }
				>
					<Copy className="h-4 w-4 me-2"/>
					{ t("invoices.copyInvoice") }
				</ItemComponent>
			);
		}

		if (dto.type === InvoiceType.Quotation)
		{
			items.push(
				<ItemComponent
					className="text-green-600 font-semibold"
					onSelect={ () =>
					{
						dto.invoiceMode = InvoiceMode.QuotationToSales;
						openEditDialog(dto);
					} }
				>
					<FilePlusCorner className="h-4 w-4 me-2"/>
					{ t("invoices.convertToSales") }
				</ItemComponent>
			);
		}

		return items;
	};
	const getTableRowMapper = (invoice: InvoiceDto) =>
	{
		const cells: { rowBody: ReactNode, rowStyles: string }[] = [{rowBody: `#${ invoice.id }`, rowStyles: ""}];

		if (fixedType === InvoiceType.Quotation)
		{
			cells.push({rowBody: invoice.notes, rowStyles: "font-semibold"});
		}
		else
		{
			const typeInfo = getInvoiceTypeInfo(invoice.type, t);
			cells.push({
				rowBody: (
					<span
						className={ `inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium ${ typeInfo.styles }` }
					>
				{ typeInfo.isReturn && <Undo2 className="h-3 w-3"/> }
						{ typeInfo.message }
			</span>
				),
				rowStyles: ""
			});
		}

		cells.push(
			{rowBody: invoice.date, rowStyles: ""},
			{
				rowBody: (
					<Link
						to={ `/${ fixedType === InvoiceType.Purchase || fixedType === InvoiceType.PurchaseReturn ? "suppliers" : "clients" }/${ invoice.partnerId }` }
						target="_blank"
						rel="noopener noreferrer"
						className="text-blue-600 hover:underline"
					>
						{ invoice.partnerName || "-" }
					</Link>
				),
				rowStyles: ""
			},
			{rowBody: invoice.storeName || "-", rowStyles: ""},
			{
				rowBody: (
					<div className="flex items-center gap-1">
						{ Number(invoice.fullAmount ?? 0).toLocaleString("en-US") }
						<ErpCurrencyIcon/>
					</div>
				),
				rowStyles: "font-bold text-blue-600"
			}
		);

		if (fixedType !== InvoiceType.Quotation)
		{
			cells.push(
				{
					rowBody: getPaymentStatus(invoice).message,
					rowStyles: `inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
						getPaymentStatus(invoice).styles
					}`
				}
			);

			if (invoice.type === InvoiceType.Sell || invoice.type === InvoiceType.Purchase)
			{
				cells.push({
					rowBody: getReturnStatus(invoice).message,
					rowStyles: `inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
						getReturnStatus(invoice).styles
					}`
				});
			}
			else
			{
				cells.push({rowBody: "", rowStyles: ""});
			}
		}

		if (
			Services.auth.setting?.eInvoicingEnvironmentType.value !== EInvoicingEnvironmentType.NotRegistered
			&& fixedType === InvoiceType.Sell
		)
		{
			if (invoice.eInvoiceStatus === EInvoiceStatus.NotSent && invoice.canBePrinted)
			{
				cells.push({rowBody: "", rowStyles: ""});
			}
			else
			{
				cells.push({
					rowBody: (
						<div className="flex items-center gap-2">
							{ getEInvoiceStatus(invoice).message && (
								<span
									className={ `inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
										getEInvoiceStatus(invoice).styles
									}` }
								>
								{ getEInvoiceStatus(invoice).message }
							</span>
							) }
							{ invoice.eInvoiceStatus === EInvoiceStatus.NotSent
								&& (invoice.type === InvoiceType.Sell || invoice.type === InvoiceType.SellReturn) && (
									<Tooltip>
										<TooltipTrigger asChild>
											<Button
												variant="ghost"
												size="icon"
												className="h-6 w-6 text-red-500 hover:text-red-600 hover:bg-red-50"
												onClick={ () => resendEInvoice(invoice) }
												disabled={ resendingEInvoice.value }
											>
												<RotateCw className="h-3.5 w-3.5"/>
											</Button>
										</TooltipTrigger>
										<TooltipContent side="top">
											<p>{ t("invoices.resendTooltip") }</p>
										</TooltipContent>
									</Tooltip>
								) }
						</div>
					),
					rowStyles: ""
				});
			}
		}

		if (
			Services.auth.hasAuth(
				SystemPermissionsResources.ReportInvoice,
				SystemPermissionsActions.Get
			)
		)
		{
			cells.push({
				rowBody: (
					<Tooltip delayDuration={ 200 }>
						<TooltipTrigger asChild>
							<span className="inline-block layout-fix">
								<ReportButton
									reportName={ ReportConstants.Invoice }
									request={ new InvoiceReportRequest({invoiceId: invoice.id}) }
									fileName={ `${ invoice.id }-${ getInvoiceTypeName(invoice.type, t) }-${ invoice.partnerName }` }
									disabled={ !invoice.canBePrinted }
									onPrint={ () => onPrint(invoice) }
									isPrinting={ isPrinting.value === invoice.id }
								/>
							</span>
						</TooltipTrigger>

						{ !invoice.canBePrinted && (
							<TooltipContent side="top" className="text-right custom-rtl-dir">
								<p>{ t("invoices.invoiceMustBeSentBeforePrint") }</p>
							</TooltipContent>
						) }
					</Tooltip>
				),
				rowStyles: "w-32"
			});

		}

		return cells;
	};

	if (Cubits.invoices.state.value instanceof PageLoaded)
	{
		return (
			<CrudPage.Table>
				<CrudPage.TableBody<InvoiceDto>
					isShareablePage={ true }
					data={ Cubits.invoices.entities.value }
					headerRows={ getTableHeadRows() }
					tableRowMapper={ (invoice) => getTableRowMapper(invoice) }
					hasUpdatePermission={ Services.auth.hasAuth(
						permissionResource,
						SystemPermissionsActions.Update
					) }
					hasDeletePermission={ (entity) => entity.type === InvoiceType.Quotation ?
						Services.auth.hasAuth(
							permissionResource,
							SystemPermissionsActions.Delete
						)
						: false
					}
					onEditClicked={ (entity) => entity.invoiceMode = InvoiceMode.Normal }
					dropdownItems={ (entity, openEditDialog) => getActions(entity, openEditDialog, DropdownMenuItem) }
					contextMenuItems={ (entity, openEditDialog) => getActions(entity, openEditDialog, ContextMenuItem) }
				/>
				<CrudPage.TablePagination
					pageSize={ Cubits.invoices.pageSize.value }
					totalNumber={ Cubits.invoices.count.value }
					currentPage={ Cubits.invoices.currentPage.value }
					onPageChanged={ (newPage) =>
					{
						Cubits.invoices.changePage(newPage);
					} }
				/>
			</CrudPage.Table>
		);
	}

	if (Cubits.invoices.state.value instanceof PageError)
	{
		return <TablePreview.Error/>;
	}

	return <TablePreview.Empty/>;
}

const getInvoiceTypeName = (type: InvoiceType, t: TFunction<"accounting">) =>
{
	switch (type)
	{
		case InvoiceType.Sell:
			return t("invoices.sellInvoice");
		case InvoiceType.Purchase:
			return t("invoices.purchaseInvoice");
		case InvoiceType.SellReturn:
			return t("invoices.sellReturn");
		case InvoiceType.Quotation:
			return t("invoices.quotation");
		case InvoiceType.PurchaseReturn:
			return t("invoices.purchaseReturn");
		default:
			return t("invoices.unknown");
	}
};

const getInvoiceTypeInfo = (type: InvoiceType, t: TFunction<"accounting">): {
	message: string;
	styles: string;
	isReturn: boolean
} =>
{
	switch (type)
	{
		case InvoiceType.Sell:
			return {message: t("invoices.sellInvoice"), styles: "bg-blue-100 text-blue-800", isReturn: false};
		case InvoiceType.Purchase:
			return {message: t("invoices.purchaseInvoice"), styles: "bg-blue-100 text-blue-800", isReturn: false};
		case InvoiceType.SellReturn:
			return {message: t("invoices.sellReturn"), styles: "bg-red-100 text-red-800", isReturn: true};
		case InvoiceType.PurchaseReturn:
			return {message: t("invoices.purchaseReturn"), styles: "bg-red-100 text-red-800", isReturn: true};
		case InvoiceType.Quotation:
			return {message: t("invoices.quotation"), styles: "bg-gray-100 text-gray-800", isReturn: false};
		default:
			return {message: t("invoices.unknown"), styles: "bg-gray-100 text-gray-800", isReturn: false};
	}
};

export function RenderInvoiceFilterInput({rule, field}: FilterValueInputProps)
{
	useSignals();
	const {t} = useTranslation("accounting");

	if (field.propertyName === "PartnerId")
	{
		return (
			<FilterLabelWrapper rule={ rule }>
				{ label => (
					<PartnersSearchableSelect
						id={ rule.value as unknown as Signal<number | undefined> }
						label={ label }
						onSelect={ entity =>
							rule.value.value = entity ? entity.id : ""
						}
					/>
				) }
			</FilterLabelWrapper>
		);
	}

	if (field.propertyName === "StoreId")
	{
		return (
			<FilterLabelWrapper rule={ rule }>
				{ label => (
					<StoresSearchableSelect
						id={ rule.value as unknown as Signal<number | undefined> }
						label={ label }
						onSelect={ entity => rule.value.value = entity ? entity.id : "" }
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
				value={ rule.value as unknown as Signal<InvoiceReturnStatus | undefined> }
				onValueChange={ (type) => rule.value.value = type }
				options={ [{label: t("invoices.notReturned"), value: InvoiceReturnStatus.NotReturned}, {
					label: t("invoices.partialReturned"),
					value: InvoiceReturnStatus.PartialReturned
				}, {
					label: t("invoices.fullyReturned"),
					value: InvoiceReturnStatus.FullyReturned
				}] }
			/>
		);
	}

	if (field.propertyName === "PaymentStatus")
	{
		return (
			<SelectField<PaymentStatus>
				required
				value={ rule.value as unknown as Signal<PaymentStatus | undefined> }
				onValueChange={ (type) => rule.value.value = type }
				options={ [{label: t("invoices.notPaid"), value: PaymentStatus.NotPaid}, {
					label: t("invoices.partiallyPaid", {amount: "", currency: ""}),
					value: PaymentStatus.PartiallyPaid
				}, {
					label: t("invoices.fullyPaid"),
					value: PaymentStatus.FullyPaid
				}, {
					label: t("invoices.overpaid"),
					value: PaymentStatus.Overpaid
				}] }
			/>
		);
	}

	if (field.propertyName === "InvoiceItems")
	{
		return <ItemsMultiSearchableSelect onToggle={ (ids) => rule.value.value = ids }/>;
	}

	return undefined;
}