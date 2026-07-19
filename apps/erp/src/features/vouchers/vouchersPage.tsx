import { Services } from "@/core/services/services.ts";
import { SystemPermissionsResources } from "@/core/auth/systemPermissionsResources.ts";
import {
	Button,
	ChangeableEntityMode,
	CrudPage,
	PageError,
	PageLoaded,
	PageLoading,
	SystemPermissionsActions,
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
import { signal } from "@preact/signals-react";


export default function VouchersPage()
{
	useSignals();
	const {t} = useTranslation("accounting");
	useEffect(() => Cubits.vouchers.init(), []);
	const printedVoucher = useMemo(() => signal<VoucherDto | undefined>(), []);

	if (!Services.auth.hasAuth(SystemPermissionsResources.Vouchers, SystemPermissionsActions.Get))
	{
		return <UnauthorizedPage/>;
	}

	return (
		<>
			<CrudPage<VoucherDto>>
				<CrudPage.Header
					title={ t("vouchers.title") }
					addButtonTitle={ t("vouchers.addNewTitle") }
					isAddButtonVisible={ Services.auth.hasAuth(SystemPermissionsResources.Vouchers, SystemPermissionsActions.Add) }
				/>

				<Cards/>

				<CrudPage.SearchInput onSearch={ (searchText) => Cubits.vouchers.search(searchText) }/>

				<PageTable onPrint={ (voucher) =>
				{
					printedVoucher.value = voucher;
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
					onSuccess={ (entity) => Cubits.vouchers.delete(entity) }
				/>


			</CrudPage>

			{ createPortal(
				<PortalReportContainer>
					<VoucherReport voucher={ printedVoucher.value }/>
				</PortalReportContainer>,
				document.body
			) }
		</>);

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
						{rowBody: t("vouchers.voucherType"), rowStyles: "w-24"},
						{rowBody: t("vouchers.date"), rowStyles: "w-24"},
						{rowBody: t("vouchers.partyOrCategory", "المستفيد / البند"), rowStyles: "w-48"},
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
					hasDeletePermission={ Services.auth.hasAuth(
						SystemPermissionsResources.Vouchers,
						SystemPermissionsActions.Delete
					) }
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







