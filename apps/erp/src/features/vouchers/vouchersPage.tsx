import { Services } from "@/core/services/services.ts";
import { SystemPermissionsResources } from "@/core/auth/systemPermissionsResources.ts";
import {
	Button,
	ChangeableEntityMode,
	CrudPage,
	FilterLabelWrapper,
	FilterSection,
	type FilterValueInputProps,
	PageError,
	PageLoaded,
	PageLoading,
	SelectField,
	SystemPermissionsActions,
	TableHeaderActionButtons,
	TablePreview,
	UnauthorizedPage
} from "yusr-ui";
import { useTranslation } from "react-i18next";
import { useEffect, useMemo } from "react";
import { Cubits } from "@/core/services/cubits.ts";
import { useSignals } from "@preact/signals-react/runtime";
import { FileText, Printer } from "lucide-react";
import { type VoucherDto, VoucherType } from "@/core/data/voucher.ts";
import ChangeVoucherDialog from "@/features/vouchers/changeVoucherDialog.tsx";
import ErpCurrencyIcon from "@/core/components/erpCurrencyIcon.tsx";
import { createPortal } from "react-dom";
import { PortalReportContainer } from "@/features/report/reportContainer.tsx";
import { VoucherReport } from "@/features/reports/voucher/voucherReport.tsx";
import { type Signal, signal } from "@preact/signals-react";
import { APP_NAME } from "../../../appConfig.ts";
import { getTransactionStatusColor, getTransactionStatusName, TransactionStatus } from "#/types/transactionStatus.ts";
import { VouchersListReport } from "@/features/reports/vouchersList/vouchersListReport.tsx";
import { PartnersSearchableSelect } from "@/core/components/searchableSelect/partnersSearchableSelect.tsx";
import AccountsSearchableSelect from "@/core/components/searchableSelect/accountsSearchableSelect.tsx";
import PaymentMethodsSearchableSelect from "@/core/components/searchableSelect/paymentMethodsSearchableSelect.tsx";


export default function VouchersPage()
{
	useSignals();
	const {t} = useTranslation("accounting");
	useEffect(() => Cubits.vouchers.init(), []);
	const printedVoucher = useMemo(() => signal<VoucherDto | undefined>(undefined), []);

	useEffect(() =>
	{
		const voucher = printedVoucher.value;
		if (voucher)
		{
			const voucherTypeName = voucher.type === VoucherType.Payment
				? t("vouchers.paymentVoucher")
				: t("vouchers.receiptVoucher");
			document.title = `${ voucherTypeName } رقم #${ voucher.id } | ${ APP_NAME }`;
		}
		else
		{
			document.title = `${ t("vouchers.title") } | ${ APP_NAME }`;
		}
		return () =>
		{
			document.title = APP_NAME;
		};
	}, [printedVoucher.value, t]);

	if (!Services.auth.hasAuth(SystemPermissionsResources.Vouchers, SystemPermissionsActions.Get))
	{
		return <UnauthorizedPage/>;
	}

	return (
		<>
			<CrudPage<VoucherDto>>
				<CrudPage.HeaderContainer>
					<h1>{ t("vouchers.title") }</h1>
					<CrudPage.HeaderButtonsContainer>
						<TableHeaderActionButtons actionButtons={
							Services.auth.hasAuth(
								SystemPermissionsResources.ReportVoucherList,
								SystemPermissionsActions.Get
							) ? [
								<Button
									key="print-list"
									variant="outline"
									onClick={ () => setTimeout(() => window.print(), 100) }
								>
									<Printer className="h-4 w-4"/>
									{ t("vouchers.vouchersList", "قائمة السندات") }
								</Button>
							] : []
						}/>
						{ Services.auth.hasAuth(SystemPermissionsResources.Vouchers, SystemPermissionsActions.Add) && (
							<CrudPage.AddButton title={ t("vouchers.addNewTitle") }/>
						) }
					</CrudPage.HeaderButtonsContainer>
				</CrudPage.HeaderContainer>

				<Cards/>

				<div className="print:hidden">
					<FilterSection
						fieldsCubit={ Cubits.voucherFilterFields }
						onApply={ (groups) => Cubits.vouchers.applyFilterGroups(groups) }
						onClear={ () => Cubits.vouchers.clearFilterGroups() }
						renderCustomInput={ RenderVoucherFilterInput }
					/>
				</div>

				<CrudPage.SearchInput onSearch={ (searchText) => Cubits.vouchers.search(searchText) }/>

				<PageTable onPrint={ (voucher) =>
				{
					printedVoucher.value = voucher;
					const handleAfterPrint = () =>
					{
						printedVoucher.value = undefined;
						window.removeEventListener("afterprint", handleAfterPrint);
					};
					window.addEventListener("afterprint", handleAfterPrint);

					requestAnimationFrame(() =>
					{
						requestAnimationFrame(() =>
						{
							window.print();
						});
					});
				} }/>

				<CrudPage.ChangeDialog
					fetchEntity={ async (id: number) =>
					{
						const result = await Services.voucherApi.Get(id);
						return result.data;
					} }
					changeDialog={ (dto: VoucherDto | undefined, closeDialog) =>
					{
						return (
							<ChangeVoucherDialog
								dto={ dto }
								service={ Services.voucherApi }
								onSuccess={ (data, mode) =>
								{
									if (mode === ChangeableEntityMode.Create)
									{
										Cubits.vouchers.add(data);
										closeDialog();
									}
									else if (mode === ChangeableEntityMode.Update)
									{
										Cubits.vouchers.update(data);
									}
								} }
							/>
						);
					} }
				/>

				<CrudPage.DeleteDialog
					entityNameSelector={ () => `"${ t("vouchers.entityName") }"` }
					service={ Services.voucherApi }
					onSuccess={ (entity) =>
					{
						if (entity.transactionStatus !== TransactionStatus.Draft)
						{
							entity.transactionStatus = TransactionStatus.Voided;
							Cubits.vouchers.update(entity);
						}
						else
						{
							Cubits.vouchers.delete(entity);
						}
					} }
				/>
			</CrudPage>

			{ createPortal(
				<PortalReportContainer>
					{ printedVoucher.value ? (
						<VoucherReport voucher={ printedVoucher.value }/>
					) : (
						<VouchersListReport isPortal={ true }/>
					) }
				</PortalReportContainer>,
				document.body
			) }
		</>
	);
}

function Cards()
{
	useSignals();
	const {t} = useTranslation("accounting");
	return (
		<CrudPage.Cards
			cards={ [{
				title: t("vouchers.totalVouchers"),
				data: (Cubits.vouchers.count.value ?? 0).toString(),
				icon: <FileText className="h-4 w-4 text-muted-foreground"/>
			}] }
		/>
	);
}

function PageTable({onPrint}: { onPrint: (voucher: VoucherDto) => void })
{
	useSignals();
	const {t} = useTranslation(["accounting", "common"]);

	if (Cubits.vouchers.state.value instanceof PageLoading)
	{
		return <TablePreview.Loading/>;
	}

	if (Cubits.vouchers.state.value instanceof PageLoaded)
	{
		return (
			<CrudPage.Table>
				<CrudPage.TableBody<VoucherDto>
					isShareablePage={ true }
					data={ Cubits.vouchers.entities.value }
					headerRows={ [
						{rowBody: "", rowStyles: "text-left w-12.5"},
						{rowBody: t("vouchers.voucherId"), rowStyles: "w-24"},
						{rowBody: t("common:status.title", "الحالة"), rowStyles: "w-24"},
						{rowBody: t("vouchers.voucherType"), rowStyles: "w-24"},
						{rowBody: t("vouchers.date"), rowStyles: "w-24"},
						{rowBody: t("vouchers.partyOrCategory", "الجهة / الحساب"), rowStyles: "w-48"},
						{rowBody: t("vouchers.amount"), rowStyles: "w-32"},
						{rowBody: t("vouchers.paymentMethod"), rowStyles: "w-32"},
						...(Services.auth.hasAuth(
							SystemPermissionsResources.ReportVoucher,
							SystemPermissionsActions.Get
						) ? [{rowBody: "", rowStyles: "w-32"}] : [])
					] }
					tableRowMapper={ (voucher: VoucherDto) => [
						{rowBody: `#${ voucher.id }`, rowStyles: ""},
						{
							rowBody: (
								<span
									className={ `inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${ getTransactionStatusColor(voucher.transactionStatus) }` }>
									{ getTransactionStatusName(voucher.transactionStatus) }
								</span>
							),
							rowStyles: ""
						},
						{
							rowBody: voucher.type === VoucherType.Payment ? t("vouchers.paymentVoucher") : t("vouchers.receiptVoucher"),
							rowStyles: `inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${
								voucher.type === VoucherType.Payment ? "bg-red-100 text-red-800" : "bg-green-100 text-green-800"
							}`
						},
						{rowBody: voucher.date, rowStyles: ""},
						{rowBody: voucher.partnerName || voucher.glAccountName || "-", rowStyles: "font-semibold"},
						{
							rowBody: (
								<div className="flex items-center gap-1">
									{ (voucher.amount ?? 0).toLocaleString("en-US") }
									<ErpCurrencyIcon/>
								</div>
							),
							rowStyles: "font-mono font-bold"
						},
						{rowBody: voucher.paymentMethod?.name ?? "-", rowStyles: "text-sm text-gray-600"},
						...(Services.auth.hasAuth(
							SystemPermissionsResources.ReportVoucher,
							SystemPermissionsActions.Get
						) ? [{
							rowBody: (
								<Button onClick={ () => onPrint(voucher) }>
									<Printer className="h-4 w-4"/>
								</Button>
							),
							rowStyles: "w-32"
						}] : [])
					] }
					hasUpdatePermission={ Services.auth.hasAuth(
						SystemPermissionsResources.Vouchers,
						SystemPermissionsActions.Update
					) }
					hasDeletePermission={ (voucher) =>
						voucher.transactionStatus !== TransactionStatus.Voided &&
						Services.auth.hasAuth(
							SystemPermissionsResources.Vouchers,
							SystemPermissionsActions.Delete
						)
					}
				/>
				<CrudPage.TablePagination
					pageSize={ Cubits.vouchers.pageSize.value }
					totalNumber={ Cubits.vouchers.count.value }
					currentPage={ Cubits.vouchers.currentPage.value }
					onPageChanged={ (newPage) =>
					{
						Cubits.vouchers.changePage(newPage);
					} }
				/>
			</CrudPage.Table>
		);
	}

	if (Cubits.vouchers.state.value instanceof PageError)
	{
		return <TablePreview.Error/>;
	}

	return <TablePreview.Empty/>;
}

export function RenderVoucherFilterInput({rule, field}: FilterValueInputProps)
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

	if (field.propertyName === "GlAccountId")
	{
		return (
			<FilterLabelWrapper rule={ rule }>
				{ label => (
					<AccountsSearchableSelect
						id={ rule.value as unknown as Signal<number | undefined> }
						label={ label }
						onSelect={ entity => rule.value.value = entity ? entity.id : "" }
					/>
				) }
			</FilterLabelWrapper>
		);
	}

	if (field.propertyName === "PaymentMethodId")
	{
		return (
			<FilterLabelWrapper rule={ rule }>
				{ label => (
					<PaymentMethodsSearchableSelect
						id={ rule.value as unknown as Signal<number | undefined> }
						label={ label }
						onSelect={ entity => rule.value.value = entity ? entity.id : "" }
					/>
				) }
			</FilterLabelWrapper>
		);
	}

	if (field.propertyName === "Type")
	{
		return (
			<SelectField<VoucherType>
				required
				value={ rule.value as unknown as Signal<VoucherType | undefined> }
				onValueChange={ (type) => rule.value.value = type }
				options={ [
					{label: t("vouchers.paymentVoucher"), value: VoucherType.Payment},
					{label: t("vouchers.receiptVoucher"), value: VoucherType.Receipt}
				] }
			/>
		);
	}

	if (field.propertyName === "TransactionStatus")
	{
		return (
			<SelectField<TransactionStatus>
				required
				value={ rule.value as unknown as Signal<TransactionStatus | undefined> }
				onValueChange={ (status) => rule.value.value = status }
				options={ [
					{label: getTransactionStatusName(TransactionStatus.Draft), value: TransactionStatus.Draft},
					{label: getTransactionStatusName(TransactionStatus.Posted), value: TransactionStatus.Posted},
					{label: getTransactionStatusName(TransactionStatus.Voided), value: TransactionStatus.Voided}
				] }
			/>
		);
	}

	return undefined;
}