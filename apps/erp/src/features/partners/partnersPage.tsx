import { SystemPermissionsResources } from "@/core/auth/systemPermissionsResources";
import { Cubits } from "@/core/services/cubits";
import { Services } from "@/core/services/services";
import { useSignals } from "@preact/signals-react/runtime";
import { Printer, Users } from "lucide-react";
import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import {
	Button,
	ChangeableEntityMode,
	CrudPage,
	FilterSection,
	PageCubit,
	PageError,
	PageLoaded,
	PageLoading,
	SystemPermissionsActions,
	TableHeaderActionButtons,
	TablePreview,
	UnauthorizedPage,
	YoutubeButton
} from "yusr-ui";
import { PartnerDto, PartnerType } from "@/core/data/partner.ts";
import ChangePartnerDialog from "./changePartnerDialog";
import ErpCurrencyIcon from "@/core/components/erpCurrencyIcon.tsx";


export default function PartnersPage({type, cubit}: { type: PartnerType, cubit: PageCubit<PartnerDto> })
{
	useSignals();
	const {t} = useTranslation(["accounting", "erpCommon"]);

	useEffect(() =>
	{
		cubit.init([type]);
	}, [cubit, type]);

	if (!Services.auth.hasAuth(SystemPermissionsResources.Accounts, SystemPermissionsActions.Get))
	{
		return <UnauthorizedPage/>;
	}

	const isCustomerMode = type === PartnerType.Customer;
	const pageTitle = isCustomerMode
		? t("partners.customersTitle", "إدارة العملاء")
		: t("partners.suppliersTitle", "إدارة الموردين");

	const totalCardTitle = isCustomerMode
		? t("partners.totalCustomers", "مجموع العملاء")
		: t("partners.totalSuppliers", "مجموع الموردين");

	return (
		<CrudPage<PartnerDto>>
			<CrudPage.HeaderContainer>
				<div className="flex flex-col sm:flex-row sm:items-center gap-3">
					<h1>{ pageTitle }</h1>
					<YoutubeButton videoId="WNCe2c2kqCw"/>
				</div>

				<CrudPage.HeaderButtonsContainer>
					<TableHeaderActionButtons actionButtons={
						Services.auth.hasAuth(
							SystemPermissionsResources.ReportAccountList,
							SystemPermissionsActions.Get
						) ? [
							<Button
								key="print-list"
								variant="outline"
								onClick={ () => setTimeout(() => window.print(), 100) }
							>
								<Printer className="h-4 w-4"/>
								{ t("erpCommon:reports.partnersList", "طباعة الدليل") }
							</Button>
						] : []
					}/>

					{ Services.auth.hasAuth(SystemPermissionsResources.Accounts, SystemPermissionsActions.Add) && (
						<CrudPage.AddButton
							title={ isCustomerMode ? t("partners.addNewCustomer", "إضافة عميل") : t("partners.addNewSupplier", "إضافة مورد") }/>
					) }
				</CrudPage.HeaderButtonsContainer>
			</CrudPage.HeaderContainer>

			<CrudPage.Cards
				cards={ [{
					title: totalCardTitle,
					data: cubit.count.value.toString(),
					icon: <Users className="h-4 w-4 text-muted-foreground"/>
				}] }
			/>

			<div className="print:hidden">
				<FilterSection
					fieldsCubit={ Cubits.partnerFilterFields }
					onApply={ (groups) => cubit.applyFilterGroups(groups) }
					onClear={ () => cubit.clearFilterGroups() }
				/>
			</div>

			<CrudPage.SearchInput
				className="rounded-t-none!"
				onSearch={ (searchText) => cubit.search(searchText) }
			/>

			<PageTable cubit={ cubit }/>

			<CrudPage.ChangeDialog
				fetchEntity={ async (id: number) =>
				{
					const result = await Services.partnersApi.Get(id);
					return result.data;
				} }
				changeDialog={ (dto: PartnerDto | undefined, closeDialog) => (
					<ChangePartnerDialog
						dto={ dto }
						service={ Services.partnersApi }
						initDto={ {type: type} as PartnerDto }
						onSuccess={ (data, mode) =>
						{
							if (mode === ChangeableEntityMode.Create)
							{
								cubit.add(data);
								closeDialog();
							}
							else if (mode === ChangeableEntityMode.Update)
							{
								cubit.update(data);
							}
							cubit.init([type]);
						} }
					/>
				) }
			/>

			<CrudPage.DeleteDialog
				entityNameSelector={ (partner) => partner.name }
				service={ Services.partnersApi }
				onSuccess={ (entity) => cubit.delete(entity) }
			/>
		</CrudPage>
	);
}

function PageTable({cubit}: { cubit: PageCubit<PartnerDto> })
{
	useSignals();
	const {t} = useTranslation(["accounting", "common", "erpCommon"]);

	if (cubit.state.value instanceof PageLoading)
	{
		return <TablePreview.Loading/>;
	}

	if (cubit.state.value instanceof PageLoaded)
	{
		return (
			<CrudPage.Table>
				<CrudPage.TableBody<PartnerDto>
					isShareablePage={ true }
					data={ cubit.entities.value }
					headerRows={ [
						{rowBody: "", rowStyles: "text-left w-12.5"},
						{rowBody: t("partners.partnerId", "الرقم"), rowStyles: "w-24"},
						{rowBody: t("partners.partnerName", "الاسم"), rowStyles: "w-48"},
						{rowBody: t("partners.mobile", "الجوال"), rowStyles: "w-32"},
						{rowBody: t("partners.balance", "الرصيد الجاري"), rowStyles: "w-32"}
					] }
					tableRowMapper={ (partner) => [
						{rowBody: `#${ partner.id }`, rowStyles: ""},
						{rowBody: partner.name, rowStyles: "font-semibold"},
						{rowBody: partner.mobile || partner.phone || "-", rowStyles: "font-mono text-muted-foreground"},
						{
							rowBody: (
								<div className="flex items-center gap-1 font-mono">
									{ partner.balance.toLocaleString("en-US", {minimumFractionDigits: 2}) }
									<ErpCurrencyIcon/>
								</div>
							),
							rowStyles: partner.balance < 0 ? "text-red-600 font-bold" : "text-green-600 font-bold"
						}
					] }
					hasUpdatePermission={ Services.auth.hasAuth(
						SystemPermissionsResources.Accounts,
						SystemPermissionsActions.Update
					) }
					hasDeletePermission={ Services.auth.hasAuth(
						SystemPermissionsResources.Accounts,
						SystemPermissionsActions.Delete
					) }
				/>
				<CrudPage.TablePagination
					pageSize={ cubit.pageSize.value }
					totalNumber={ cubit.count.value }
					currentPage={ cubit.currentPage.value }
					onPageChanged={ (newPage) => cubit.changePage(newPage) }
				/>
			</CrudPage.Table>
		);
	}

	if (cubit.state.value instanceof PageError)
	{
		return <TablePreview.Error/>;
	}

	return <TablePreview.Empty/>;
}