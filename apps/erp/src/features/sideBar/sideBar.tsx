import { AppNavigator } from "@/app/appNavigator";
import logoOnlyDark from "@/assets/yusrLogoOnly_Dark.png";
import logoOnlyLight from "@/assets/yusrLogoOnly_Light.png";
import {
	Building2,
	FileChartColumnIncreasing,
	LayoutDashboardIcon,
	Package,
	ReceiptText,
	ScrollText,
	SettingsIcon,
	UsersIcon,
	WalletCards
} from "lucide-react";
import * as React from "react";
import { useTranslation } from "react-i18next";
import {
	Sidebar,
	SideBarCompanyData,
	SidebarContent,
	SidebarFooter,
	SidebarHeader,
	SidebarLogo,
	SideBarMainMenu,
	SidebarMenu,
	SidebarMenuItem,
	SideBarSecondaryMenu,
	SideBarUserData,
	SystemPermissionsActions,
	useSidebar,
	YusrApiHelper
} from "yusr-ui";
import { SystemPermissionsResources } from "@/core/auth/systemPermissionsResources.ts";
import { Services } from "@/core/services/services";
import { useSignals } from "@preact/signals-react/runtime";


export function SideBar({...props}: React.ComponentProps<typeof Sidebar>)
{
	useSignals();
	const {t} = useTranslation("erpCommon");

	const logoConfig = {
		full: {light: logoOnlyLight, dark: logoOnlyDark, sizeStyle: "w-12 px-2"},
		collapsed: {light: logoOnlyLight, dark: logoOnlyDark, sizeStyle: "w-8"}
	};

	const data = {
		navMain: [{
			title: t("sidebar.dashboard"),
			url: "/dashboard",
			icon: <LayoutDashboardIcon/>,
			hasAuth: true
		}, {
			title: t("sidebar.invoices"),
			url: "/invoices",
			icon: <ReceiptText/>,
			hasAuth: Services.auth.hasAuth(
				SystemPermissionsResources.InvoiceSell,
				SystemPermissionsActions.Get
			) || Services.auth.hasAuth(
				SystemPermissionsResources.InvoicePurchase,
				SystemPermissionsActions.Get
			),
			subItems: [{
				title: t("sidebar.sellInvoices"),
				url: "/sales",
				hasAuth: Services.auth.hasAuth(
					SystemPermissionsResources.InvoiceSell,
					SystemPermissionsActions.Get
				) && Services.auth.hasAuth(
					SystemPermissionsResources.Invoices,
					SystemPermissionsActions.Get
				)
			}, {
				title: t("sidebar.purchaseInvoices"),
				url: "/purchases",
				hasAuth: Services.auth.hasAuth(
					SystemPermissionsResources.InvoicePurchase,
					SystemPermissionsActions.Get
				) && Services.auth.hasAuth(
					SystemPermissionsResources.Invoices,
					SystemPermissionsActions.Get
				)
			}, {
				title: t("sidebar.quotationInvoices"),
				url: "/quotations",
				hasAuth: Services.auth.hasAuth(
					SystemPermissionsResources.InvoiceSell,
					SystemPermissionsActions.Get
				) && Services.auth.hasAuth(
					SystemPermissionsResources.Invoices,
					SystemPermissionsActions.Get
				)
			}]
		}, {
			title: t("sidebar.vouchers"),
			url: "/vouchers",
			icon: <ScrollText/>,
			hasAuth: Services.auth.hasAuth(
				SystemPermissionsResources.Vouchers,
				SystemPermissionsActions.Get
			)
		}, {
			title: t("sidebar.accounts"),
			url: "#",
			icon: <WalletCards/>,
			hasAuth: true,
			subItems: [{
				title: t("sidebar.clients"),
				url: "/clients",
				hasAuth: Services.auth.hasAuth(
					SystemPermissionsResources.AccountClient,
					SystemPermissionsActions.Get
				) && Services.auth.hasAuth(
					SystemPermissionsResources.Accounts,
					SystemPermissionsActions.Get
				)
			}, {
				title: t("sidebar.suppliers"),
				url: "/suppliers",
				hasAuth: Services.auth.hasAuth(
					SystemPermissionsResources.AccountSupplier,
					SystemPermissionsActions.Get
				) && Services.auth.hasAuth(
					SystemPermissionsResources.Accounts,
					SystemPermissionsActions.Get
				)
			}, {
				title: t("sidebar.employees"),
				url: "/employees",
				hasAuth: Services.auth.hasAuth(
					SystemPermissionsResources.AccountEmployee,
					SystemPermissionsActions.Get
				) && Services.auth.hasAuth(
					SystemPermissionsResources.Accounts,
					SystemPermissionsActions.Get
				)
			}, {
				title: t("sidebar.banks"),
				url: "/banks",
				hasAuth: Services.auth.hasAuth(
					SystemPermissionsResources.AccountBank,
					SystemPermissionsActions.Get
				) && Services.auth.hasAuth(
					SystemPermissionsResources.Accounts,
					SystemPermissionsActions.Get
				)
			}, {
				title: t("sidebar.boxes"),
				url: "/boxes",
				hasAuth: Services.auth.hasAuth(
					SystemPermissionsResources.AccountBox,
					SystemPermissionsActions.Get
				) && Services.auth.hasAuth(
					SystemPermissionsResources.Accounts,
					SystemPermissionsActions.Get
				)
			}, {
				title: t("sidebar.paymentMethods"),
				url: "/paymentMethods",
				hasAuth: Services.auth.hasAuth(
					SystemPermissionsResources.PaymentMethods,
					SystemPermissionsActions.Get
				)
			}, {
				title: t("sidebar.balanceTransfer"),
				url: "/balanceTransfer",
				hasAuth: Services.auth.hasAuth(
					SystemPermissionsResources.BalanceTransfers,
					SystemPermissionsActions.Get
				)
			}]
		}, {
			title: t("sidebar.items"),
			url: "#",
			icon: <Package/>,
			hasAuth: true,
			subItems: [{
				title: t("sidebar.items"),
				url: "/items",
				hasAuth: Services.auth.hasAuth(
					SystemPermissionsResources.Items,
					SystemPermissionsActions.Get
				)
			}, {
				title: t("sidebar.itemTransfers"),
				url: "/itemTransfers",
				hasAuth: Services.auth.hasAuth(
					SystemPermissionsResources.ItemTransfers,
					SystemPermissionsActions.Get
				)
			}, {
				title: t("sidebar.stocktakings"),
				url: "/stocktakings",
				hasAuth: Services.auth.hasAuth(
					SystemPermissionsResources.Stocktakings,
					SystemPermissionsActions.Get
				)
			}, {
				title: t("sidebar.itemsSettlements"),
				url: "/itemsSettlements",
				hasAuth: Services.auth.hasAuth(
					SystemPermissionsResources.ItemsSettlements,
					SystemPermissionsActions.Get
				)
			}, {
				title: t("sidebar.pricingMethods"),
				url: "/pricingMethods",
				hasAuth: Services.auth.hasAuth(
					SystemPermissionsResources.PricingMethods,
					SystemPermissionsActions.Get
				)
			}, {
				title: t("sidebar.units"),
				url: "/units",
				hasAuth: Services.auth.hasAuth(
					SystemPermissionsResources.Units,
					SystemPermissionsActions.Get
				)
			}, {
				title: t("sidebar.stores"),
				url: "/stores",
				hasAuth: Services.auth.hasAuth(
					SystemPermissionsResources.Stores,
					SystemPermissionsActions.Get
				)
			}, {
				title: t("sidebar.taxes"),
				url: "/taxes",
				hasAuth: Services.auth.hasAuth(
					SystemPermissionsResources.Taxes,
					SystemPermissionsActions.Get
				)
			}]
		}, {
			title: t("sidebar.branches"),
			url: "/branches",
			icon: <Building2/>,
			hasAuth: Services.auth.hasAuth(
				SystemPermissionsResources.Branches,
				SystemPermissionsActions.Get
			)
		}, {
			title: t("sidebar.users"),
			url: "#",
			icon: <UsersIcon/>,
			hasAuth: true,
			subItems: [{
				title: t("sidebar.roles"),
				url: "/roles",
				hasAuth: Services.auth.hasAuth(
					SystemPermissionsResources.Roles,
					SystemPermissionsActions.Get
				)
			}, {
				title: t("sidebar.users"),
				url: "/users",
				hasAuth: Services.auth.hasAuth(
					SystemPermissionsResources.Users,
					SystemPermissionsActions.Get
				)
			}]
		}, {
			title: t("sidebar.reports"),
			url: "/reports",
			icon: <FileChartColumnIncreasing/>,
			hasAuth: Services.auth.hasAuth(
				SystemPermissionsResources.Stores,
				SystemPermissionsActions.Get
			)
		}],
		navSecondary: [{
			title: t("sidebar.settings"),
			url: "/settings",
			icon: <SettingsIcon/>
		}]
	};

	const displayCompany = {
		name: Services.auth.setting?.companyName.value || "Default Name",
		logo: Services.auth.setting?.logo?.value?.url || "/default-avatar.jpg"
	};

	const LogoutHandler = async () =>
	{
		const result = await YusrApiHelper.Post(`/api/Logout`);

		if (result.status === 200 || result.status === 204)
		{
			AppNavigator.navigate("/login", true);
			Services.auth.logout();
		}
	};

	const {i18n} = useTranslation("common");
	const {state} = useSidebar();

	return (
		<Sidebar collapsible="icon" side={ i18n.dir() === "rtl" ? "right" : "left" } { ...props }>
			<SidebarHeader>
				<SidebarMenu>
					<SidebarMenuItem>
						<div
							className={ `gap-2 ${
								state === "collapsed"
									? "flex flex-col justify-end items-center"
									: "flex flex-row-reverse justify-end items-center"
							}` }
						>
							<SidebarLogo logos={ logoConfig }/>
						</div>
						<SideBarCompanyData company={ displayCompany }/>
					</SidebarMenuItem>
				</SidebarMenu>
			</SidebarHeader>

			<SidebarContent>
				<SideBarMainMenu items={ data.navMain }/>
				<SideBarSecondaryMenu
					items={ data.navSecondary }
					className="pt-10 mt-auto text-center"
					onLogout={ LogoutHandler }
				/>
			</SidebarContent>

			<SidebarFooter>
				<SideBarUserData user={ Services.auth.loggedInUser }/>
			</SidebarFooter>
		</Sidebar>
	);
}
