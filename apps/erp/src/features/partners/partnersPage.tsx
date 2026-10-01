import { SystemPermissionsResources } from "@/core/auth/systemPermissionsResources";
import { Cubits } from "@/core/services/cubits";
import { Services } from "@/core/services/services";
import { useSignals } from "@preact/signals-react/runtime";
import { Power, Printer, Users } from "lucide-react";
import { useEffect } from "react";
import { useTranslation } from "react-i18next";
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
	TableHeaderActionButtons,
	TablePreview,
	UnauthorizedPage,
	YoutubeButton
} from "yusr-ui";
import { PartnerDto, PartnerType } from "@/core/data/partner.ts";
import ChangePartnerDialog from "./changePartnerDialog";
import ErpCurrencyIcon from "@/core/components/erpCurrencyIcon.tsx";
import { AppNavigator } from "@/app/appNavigator.ts";
import { APP_NAME } from "../../../appConfig.ts";
import { partnersApi } from "./partners.api";
import { toast } from "sonner";


export default function PartnersPage({type}: { type: PartnerType })
{
	useSignals();
	const {t} = useTranslation(["accounting", "erpCommon"]);

	useEffect(() =>
	{
		if (Services.auth.hasAuth(SystemPermissionsResources.Partners, SystemPermissionsActions.Get))
		{
			void Cubits.partners.init([type]);
		}
	}, [type]);

	const isCustomerMode = type === PartnerType.Customer;
	const pageTitle = isCustomerMode
		? t("partners.customersTitle", "إدارة العملاء")
		: t("partners.suppliersTitle", "إدارة الموردين");

	const totalCardTitle = isCustomerMode
		? t("partners.totalCustomers", "مجموع العملاء")
		: t("partners.totalSuppliers", "مجموع الموردين");

	useEffect(() =>
	{
		document.title = `${ pageTitle } | ${ APP_NAME }`;
		return () =>
		{
			document.title = APP_NAME;
		};
	}, [pageTitle]);

	if (!Services.auth.hasAuth(SystemPermissionsResources.Partners, SystemPermissionsActions.Get))
	{
		return <UnauthorizedPage/>;
	}

	const handleToggleStatus = async (partner: PartnerDto) =>
	{
		const targetStatus = !partner.isActive;
		const actionName = targetStatus ? "تفعيل" : "تعطيل";

		const process = async () =>
		{
			const res = await partnersApi.updateStatus(partner.id, targetStatus);
			if (res.ok)
			{
				partner.isActive = targetStatus;
				Cubits.partners.update(partner);
				return targetStatus ? "تم تفعيل الجهة بنجاح" : "تم تعطيل الجهة بنجاح";
			}
			throw new Error(res.errors?.[0] || `فشل في ${ actionName } الجهة`);
		};

		toast.promise(process(), {
			loading: `جاري ${ actionName } الجهة #${ partner.id }...`
		});
	};

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

					{ Services.auth.hasAuth(SystemPermissionsResources.Partners, SystemPermissionsActions.Add) && (
						<CrudPage.AddButton
							title={ isCustomerMode ? t("partners.addNewCustomer", "إضافة عميل") : t("partners.addNewSupplier", "إضافة مورد") }/>
					) }
				</CrudPage.HeaderButtonsContainer>
			</CrudPage.HeaderContainer>

			<CrudPage.Cards
				cards={ [{
					title: totalCardTitle,
					data: Cubits.partners.count.value.toString(),
					icon: <Users className="h-4 w-4 text-muted-foreground"/>
				}] }
			/>

			<div className="print:hidden">
				<FilterSection
					fieldsCubit={ Cubits.partnerFilterFields }
					onApply={ (groups) => Cubits.partners.applyFilterGroups(groups) }
					onClear={ () => Cubits.partners.clearFilterGroups() }
				/>
			</div>

			<CrudPage.SearchInput
				className="rounded-t-none!"
				onSearch={ (searchText) => Cubits.partners.search(searchText) }
			/>
			<PageTable onToggleStatus={ handleToggleStatus }/>
			<CrudPage.ChangeDialog
				fetchEntity={ async (id: number) =>
				{
					const result = await partnersApi.get(id);
					return result.data;
				} }
				changeDialog={ (dto: PartnerDto | undefined, closeDialog) => (
					<ChangePartnerDialog
						dto={ dto }
						initDto={ {type: type} as PartnerDto }
						onSuccess={ (data, mode) =>
						{
							if (mode === ChangeableEntityMode.Create)
							{
								Cubits.partners.add(data);
								closeDialog();
							}
							else if (mode === ChangeableEntityMode.Update)
							{
								Cubits.partners.update(data);
							}
							void Cubits.partners.init([type]);
						} }
					/>
				) }
			/>
			<CrudPage.DeleteDialog<PartnerDto>
				entityNameSelector={ (partner) => partner.name }
				resource={ partnersApi }
				onSuccess={ (entity) => Cubits.partners.delete(entity) }
			/>
		</CrudPage>
	);
}

function PageTable({onToggleStatus}: { onToggleStatus: (partner: PartnerDto) => void })
{
	useSignals();
	const {t} = useTranslation(["accounting", "common", "erpCommon"]);
	const canUpdate = Services.auth.hasAuth(
		SystemPermissionsResources.Partners,
		SystemPermissionsActions.Update
	);

	if (Cubits.partners.state.value instanceof PageLoading)
	{
		return <TablePreview.Loading/>;
	}

	const getActions = (
		partner: PartnerDto,
		_openEditDialog: (dto: PartnerDto) => void,
		ItemComponent: typeof DropdownMenuItem | typeof ContextMenuItem
	) => [
		canUpdate ? (
			<ItemComponent
				key="toggle-status"
				className={ partner.isActive ? "text-destructive font-semibold cursor-pointer" : "text-emerald-600 font-semibold cursor-pointer" }
				onSelect={ () => onToggleStatus(partner) }
			>
				<Power className="w-4 h-4 me-2"/>
				{ partner.isActive ? "تعطيل الجهة" : "تفعيل الجهة" }
			</ItemComponent>
		) : null
	];

	if (Cubits.partners.state.value instanceof PageLoaded)
	{
		return (
			<CrudPage.Table>
				<CrudPage.TableBody<PartnerDto>
					isShareablePage={ true }
					data={ Cubits.partners.entities.value }
					headerRows={ [
						{rowBody: "", rowStyles: "text-left w-12.5"},
						{rowBody: t("partners.partnerId", "الرقم"), rowStyles: "w-24"},
						{rowBody: t("partners.partnerName", "الاسم"), rowStyles: "w-48"},
						{rowBody: "الحالة", rowStyles: "w-28 text-center"},
						{rowBody: t("partners.mobile", "الجوال"), rowStyles: "w-32"},
						{rowBody: t("partners.balance", "الرصيد الجاري"), rowStyles: "w-32"},
						...(Services.auth.hasAuth(
							SystemPermissionsResources.ReportPartnerStatement,
							SystemPermissionsActions.Get
						)
							? [{rowBody: "", rowStyles: "w-32"}]
							: [])
					] }
					tableRowMapper={ (partner) =>
					{
						const isCustomer = partner.type === PartnerType.Customer;
						const absBalance = Math.abs(partner.balance);

						const isDebit = isCustomer ? partner.balance >= 0 : partner.balance < 0;

						let balanceColor = "text-foreground";
						if (partner.balance !== 0)
						{
							if (isCustomer)
							{
								balanceColor = partner.balance > 0 ? "text-green-600" : "text-red-600";
							}
							else
							{
								balanceColor = partner.balance > 0 ? "text-red-600" : "text-green-600";
							}
						}

						return [
							{rowBody: `#${ partner.id }`, rowStyles: ""},
							{rowBody: partner.name, rowStyles: "font-semibold"},
							{
								rowBody: (
									<span
										className={ cn(
											"inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold",
											partner.isActive !== false
												? "bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300"
												: "bg-red-100 text-red-800 dark:bg-red-950/60 dark:text-red-300"
										) }
									>
										{ partner.isActive !== false ? "نشط" : "معطل" }
									</span>
								),
								rowStyles: "text-center"
							},
							{
								rowBody: partner.mobile || partner.phone || "-",
								rowStyles: "font-mono text-muted-foreground"
							},
							{
								rowBody: (
									<div className="flex items-center gap-2 font-mono">
										<span>{ absBalance.toLocaleString("en-US", {minimumFractionDigits: 2}) }</span>
										<ErpCurrencyIcon/>
										<span className="text-xs font-sans px-1.5 py-0.5 shrink-0">
											{ partner.balance !== 0 && (isDebit ? t("erpCommon:accounting.debit", "مدين") : t("erpCommon:accounting.credit", "دائن")) }
										</span>
									</div>
								),
								rowStyles: `${ balanceColor } font-bold`
							},
							...(Services.auth.hasAuth(
								SystemPermissionsResources.ReportPartnerStatement,
								SystemPermissionsActions.Get
							)
								? [
									{
										rowBody: <Button
											variant="outline"
											size="sm"
											onClick={ () =>
												AppNavigator.openInNewTab(
													`/reports/partnerStatement/${ partner.id }/${ encodeURIComponent(partner.name) }`
												)
											}>
											{ t("erpCommon:partnerStatement.button", "كشف حساب") }
										</Button>,
										rowStyles: "w-32"
									}
								]
								: [])
						];
					} }
					hasUpdatePermission={ canUpdate }
					hasDeletePermission={ Services.auth.hasAuth(
						SystemPermissionsResources.Partners,
						SystemPermissionsActions.Delete
					) }
					dropdownItems={ (partner, openEditDialog) => getActions(partner, openEditDialog, DropdownMenuItem) }
					contextMenuItems={ (partner, openEditDialog) => getActions(partner, openEditDialog, ContextMenuItem) }
				/>
				<CrudPage.TablePagination
					pageSize={ Cubits.partners.pageSize.value }
					totalNumber={ Cubits.partners.count.value }
					currentPage={ Cubits.partners.currentPage.value }
					onPageChanged={ (newPage) => Cubits.partners.changePage(newPage) }
				/>
			</CrudPage.Table>
		);
	}

	if (Cubits.partners.state.value instanceof PageError)
	{
		return <TablePreview.Error/>;
	}

	return <TablePreview.Empty/>;
}