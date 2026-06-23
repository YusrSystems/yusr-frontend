//TODO: must be tested
import Invoice, { InvoiceDto, InvoiceMode } from "@/core/data/invoices/invoice.ts";
import type { InvoicesListReportRequest } from "@/core/data/report/invoicesListReportType.ts";
import { InvoicesListReportType } from "@/core/data/report/invoicesListReportType.ts";
import ReportConstants from "@/core/data/report/reportConstants.ts";
import { Cubits } from "@/core/services/cubits";
import { Services } from "@/core/services/services";
import ChangeInvoiceDialog from "@/features/invoices/changeInvoiceDialog.tsx";
import ReportButton from "@/features/reports/reportButton.tsx";
import { Signal, signal } from "@preact/signals-react";
import { useSignals } from "@preact/signals-react/runtime";
import type { TFunction } from "i18next";
import { Copy, FilePlusCorner, FileTextIcon, RotateCw, Undo2 } from "lucide-react";
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
	UnauthorizedPage
} from "yusr-ui";
import { SystemPermissionsResources } from "@/core/auth/systemPermissionsResources.ts";
import { InvoiceType } from "@/core/types/invoiceType";
import VerifyAccountWrapper from "@/core/components/verifyAccountWrapper.tsx";
import { EInvoicingEnvironmentType } from "@/core/data/setting.ts";
import { InvoiceStatus } from "@/core/types/invoiceStatus.ts";
import { EInvoiceStatus } from "@/core/types/eInvoiceStatus";
import { toast } from "sonner";
import ErpCurrencyIcon from "@/core/components/erpCurrencyIcon.tsx";
import AccountsSearchableSelect from "@/core/components/searchableSelect/accountsSearchableSelect.tsx";
import StoresSearchableSelect from "@/core/components/searchableSelect/storesSearchableSelect.tsx";
import { InvoiceReturnStatus } from "@/core/types/invoiceReturnStatus.ts";
import { PaymentStatus } from "@/core/types/paymentStatus.ts";
import ItemsMultiSearchableSelect from "@/core/components/searchableSelect/itemsMultiSearchableSelect.tsx";
import { AccountType } from "@/core/data/account.ts";


export default function InvoicesPage({
	totalInvoicesTitle,
	title,
	fixedType,
	hasPagePermission,
	permissionResource
}: {
	entityName?: string;
	addNewItemTitle?: string;
	totalInvoicesTitle?: string;
	title: string;
	fixedType: InvoiceType;
	hasPagePermission: boolean;
	basePath?: string;
	permissionResource: string;
})
{
	useSignals();
	const {t} = useTranslation("accounting");

	useEffect(() =>
	{
		Cubits.invoices.init([fixedType]);
		Cubits.accounts.init(fixedType == InvoiceType.Purchase || fixedType == InvoiceType.PurchaseReturn ? [AccountType.Supplier] : [AccountType.Client]);
	}, [fixedType]);

	useEffect(() =>
	{
		Cubits.items.init();
		Cubits.stores.init();
	}, []);

	if (!hasPagePermission)
	{
		return <UnauthorizedPage/>;
	}

	return (
		<VerifyAccountWrapper>
			<CrudPage>
				<CrudPage.Header
					title={ title }
					addButtonTitle={ t("invoices.addNewTitle") }
					isAddButtonVisible={ Services.auth.hasAuth(
						SystemPermissionsResources.Invoices,
						SystemPermissionsActions.Add
					) }
					actionButtons={
						Services.auth.hasAuth(
							SystemPermissionsResources.ReportInvoiceList,
							SystemPermissionsActions.Get
						)
							? [<InvoicesReportButton fixedType={ fixedType }/>]
							: []
					}
				/>

				<Cards totalInvoicesTitle={ totalInvoicesTitle }/>

				<FilterSection
					fieldsCubit={ Cubits.invoiceFilterFields }
					onApply={ (groups) => Cubits.invoices.applyFilterGroups(groups) }
					onClear={ () => Cubits.invoices.clearFilterGroups() }
					renderCustomInput={ (props: FilterValueInputProps) => RenderInvoiceFilterInput({
						rule: props.rule,
						field: props.field,
						fixedType: fixedType
					}) }
				/>

				<CrudPage.SearchInput
					className="rounded-t-none!"
					onSearch={ (searchText) => Cubits.invoices.search(searchText) }
				/>

				<PageTable fixedType={ fixedType } permissionResource={ permissionResource }/>

				<CrudPage.ChangeDialog
					changeDialog={ (dto: InvoiceDto | undefined, closeDialog) =>
					{
						return (
							<ChangeInvoiceDialog
								entity={ dto
									? Invoice.load(dto)
									: Invoice.create({type: fixedType}) }
								service={ Services.invoicesApi }
								fixedType={ fixedType }
								onSuccess={ (data: Invoice) =>
								{
									if (data.mode.value === ChangeableEntityMode.Create)
									{
										Cubits.invoices.add(data);
										closeDialog();
									}
									else if (data.mode.value === ChangeableEntityMode.Update)
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

function PageTable({fixedType, permissionResource}: {
	fixedType: InvoiceType,
	permissionResource: string,
})
{
	useSignals();
	const resendingEInvoice = useMemo(() => signal(false), []);
	const {t} = useTranslation(["accounting", "common"]);

	const resendEInvoice = async (invoice: Invoice) =>
	{
		resendingEInvoice.value = true;
		const res = await Services.invoicesApi.ResendEInvoice(invoice.id.value);
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
			invoice.eInvoiceStatus.value = res.data;
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
			{rowBody: t("invoices.account"), rowStyles: "w-48"},
			{rowBody: t("invoices.store"), rowStyles: "w-32"},
			{rowBody: t("invoices.total"), rowStyles: "w-32"}
		);

		if (fixedType === InvoiceType.Sell)
		{
			rows.push(
				{rowBody: t("invoices.status"), rowStyles: "w-32"},
				{rowBody: "", rowStyles: "w-32"}
			);
		}

		rows.push({rowBody: "", rowStyles: "w-32"});

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

	const getPaymentStatus = (invoice: Invoice): { message: string; styles: string; } =>
	{
		if (invoice.paidAmount.value === 0)
		{
			return {message: t("invoices.notPaid"), styles: "bg-red-100 text-red-800"};
		}

		if (invoice.paidAmount.value === invoice.fullAmount.value)
		{
			return {message: t("invoices.fullyPaid"), styles: "bg-green-100 text-green-800"};
		}

		if (invoice.paidAmount.value > invoice.fullAmount.value)
		{
			return {message: t("invoices.overpaid"), styles: "bg-red-100 text-red-800"};
		}

		return {
			message: t("invoices.partiallyPaid", {
				amount: invoice.paidAmount.value,
				currency: Services.auth.setting?.currency?.value.code.value
			}),
			styles: "bg-orange-100 text-orange-800"
		};
	};

	const getReturnStatus = (invoice: Invoice): { message: string; styles: string; } =>
	{
		if (invoice.returnStatusId.value === InvoiceReturnStatus.NotReturned)
		{
			return {message: t("invoices.notReturned"), styles: "bg-green-100 text-green-800"};
		}

		if (invoice.returnStatusId.value === InvoiceReturnStatus.FullyReturned)
		{
			return {message: t("invoices.fullyReturned"), styles: "bg-red-100 text-red-800"};
		}

		return {
			message: t("invoices.partialReturned"),
			styles: "bg-orange-100 text-orange-800"
		};
	};

	const getEInvoiceStatus = (invoice: Invoice): { message: string; styles: string; } =>
	{
		if (
			Services.auth.setting?.eInvoicingEnvironmentType.value === EInvoicingEnvironmentType.NotRegistered
			|| invoice.statusId.value !== InvoiceStatus.Valid
			|| (invoice.type.value !== InvoiceType.Sell && invoice.type.value !== InvoiceType.SellReturn)
		)
		{
			return {message: "", styles: ""};
		}

		if (invoice.eInvoiceStatus.value === EInvoiceStatus.NotSent)
		{
			return {message: t("invoices.notSent"), styles: "bg-red-100 text-red-800"};
		}

		if (invoice.eInvoiceStatus.value === EInvoiceStatus.SentWithWarnings)
		{
			return {message: t("invoices.sentWithWarnings"), styles: "bg-orange-100 text-orange-800"};
		}

		if (invoice.eInvoiceStatus.value === EInvoiceStatus.SentCorrectly)
		{
			return {message: t("invoices.sent"), styles: "bg-green-100 text-green-800"};
		}

		return {message: "", styles: ""};
	};

	const getActions = (
		entity: Invoice,
		openEditDialog: (entity: Invoice) => void,
		ItemComponent: typeof DropdownMenuItem | typeof ContextMenuItem
	) =>
	{
		const items: React.ReactNode[] = [];
		if (entity.type.value === InvoiceType.Sell || entity.type.value === InvoiceType.Purchase)
		{
			items.push(
				<ItemComponent
					className="text-orange-700 font-semibold"
					onSelect={ () =>
					{
						entity.invoiceMode.value = InvoiceMode.Return;
						openEditDialog(entity);
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
						entity.invoiceMode.value = InvoiceMode.Copy;
						openEditDialog(entity);
					} }
				>
					<Copy className="h-4 w-4 me-2"/>
					{ t("invoices.copyInvoice") }
				</ItemComponent>
			);
		}

		if (entity.type.value === InvoiceType.Quotation)
		{
			items.push(
				<ItemComponent
					className="text-green-600 font-semibold"
					onSelect={ () =>
					{
						entity.invoiceMode.value = InvoiceMode.QuotationToSales;
						openEditDialog(entity);
					} }
				>
					<FilePlusCorner className="h-4 w-4 me-2"/>
					{ t("invoices.convertToSales") }
				</ItemComponent>
			);
		}

		return items;
	};
	const getTableRowMapper = (invoice: Invoice) =>
	{
		const cells: { rowBody: ReactNode, rowStyles: string }[] = [{rowBody: `#${ invoice.id }`, rowStyles: ""}];

		if (fixedType === InvoiceType.Quotation)
		{
			cells.push({rowBody: invoice.notes, rowStyles: "font-semibold"});
		}
		else
		{
			cells.push({rowBody: getInvoiceTypeName(invoice.type.value, t), rowStyles: "font-semibold"});
		}

		cells.push(
			{rowBody: new Date(invoice.date.value).toLocaleDateString("en-CA"), rowStyles: ""},
			// {rowBody: new Date(invoice.date.value).toLocaleDateString("en-CA", {timeZone: "UTC"}), rowStyles: ""},
			{rowBody: invoice.actionAccountName || "-", rowStyles: ""},
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

		if (fixedType === InvoiceType.Sell)
		{
			cells.push(
				{
					rowBody: invoice.statusId.value === InvoiceStatus.Valid
						? t("invoices.valid")
						: t("invoices.deleted"),
					rowStyles: `inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
						invoice.statusId.value === InvoiceStatus.Valid
							? "bg-green-100 text-green-800"
							: "bg-red-100 text-red-800"
					}`
				},
				{
					rowBody: getPaymentStatus(invoice).message,
					rowStyles: `inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
						getPaymentStatus(invoice).styles
					}`
				},
				{
					rowBody: getReturnStatus(invoice).message,
					rowStyles: `inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
						getReturnStatus(invoice).styles
					}`
				}
			);
		}

		if (
			Services.auth.setting?.eInvoicingEnvironmentType.value !== EInvoicingEnvironmentType.NotRegistered
			&& fixedType === InvoiceType.Sell
		)
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
						{ invoice.eInvoiceStatus.value === EInvoiceStatus.NotSent
							&& invoice.statusId.value === InvoiceStatus.Valid
							&& (invoice.type.value === InvoiceType.Sell || invoice.type.value === InvoiceType.SellReturn) && (
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

		if (
			Services.auth.hasAuth(
				SystemPermissionsResources.ReportAccountStatement,
				SystemPermissionsActions.Get
			) && invoice.statusId.value === InvoiceStatus.Valid
		)
		{
			cells.push({
				rowBody: (
					<ReportButton
						reportName={ ReportConstants.Invoice }
						request={ {invoiceId: invoice.id} }
						fileName={ `${ invoice.id }-${ getInvoiceTypeName(invoice.type.value, t) }-${ invoice.actionAccountName }` }
					/>
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
				<CrudPage.TableBody<Invoice, InvoiceDto>
					data={ Cubits.invoices.entities.value }
					headerRows={ getTableHeadRows() }
					tableRowMapper={ (invoice: Invoice) => getTableRowMapper(invoice) }
					hasUpdatePermission={ Services.auth.hasAuth(
						permissionResource,
						SystemPermissionsActions.Update
					) }
					hasDeletePermission={ (entity) => entity.type.value === InvoiceType.Quotation ?
						Services.auth.hasAuth(
							permissionResource,
							SystemPermissionsActions.Delete
						)
						: false
					}
					onEditClicked={ (entity) => entity.invoiceMode.value = InvoiceMode.Normal }
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

function InvoicesReportButton({fixedType}: { fixedType?: InvoiceType })
{
	useSignals();
	return (
		<ReportButton<InvoicesListReportRequest>
			reportName={ ReportConstants.InvoicesList }
			request={ {
				// Sell page covers Sell + SellReturn + Quotation;
				// Purchase page covers Purchase + PurchaseReturn.
				types:
					fixedType === InvoiceType.Sell
						? [InvoiceType.Sell, InvoiceType.SellReturn, InvoiceType.Quotation]
						: [InvoiceType.Purchase, InvoiceType.PurchaseReturn],
				// Read the live search text from the cubit so the report is scoped
				searchText: Cubits.invoices.searchText.value,
				reportType: InvoicesListReportType.InvoicesList
			} }
		/>
	);
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

function RenderInvoiceFilterInput({rule, field, fixedType}: FilterValueInputProps & { fixedType: InvoiceType })
{
	useSignals();
	const {t} = useTranslation("accounting");

	if (field.propertyName === "ActionAccountId")
	{
		return (
			<FilterLabelWrapper rule={ rule }>
				{ label => (
					<AccountsSearchableSelect
						id={ rule.value as unknown as Signal<number | undefined> }
						label={ label }
						onSelect={ entity =>
							rule.value.value = entity ? entity.id.value : ""
						}
						types={ [fixedType] }
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
						onSelect={ entity => rule.value.value = entity ? entity.id.value : "" }
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