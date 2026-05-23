import logoOnlyDark from "@/assets/yusrLogoOnly_Dark.png";
import logoOnlyLight from "@/assets/yusrLogoOnly_Light.png";
import { Building2, FileChartColumnIncreasing, LayoutDashboardIcon, Package, ReceiptText, ScrollText, SettingsIcon, UsersIcon, WalletCards } from "lucide-react";
import * as React from "react";
import { useTranslation } from "react-i18next";
import { ApiConstants, Sidebar, SideBarCompanyData, SidebarContent, SidebarFooter, SidebarHeader, SidebarLogo, SideBarMainMenu, SidebarMenu, SidebarMenuItem, SideBarSecondaryMenu, SideBarUserData, SystemPermissions, SystemPermissionsActions, useSidebar, YusrApiHelper } from "yusr-ui";
import { SystemPermissionsResources } from "../../core/auth/systemPermissionsResources";
import { logout, useAppDispatch, useAppSelector } from "../../core/state/store";

export function SideBar({ ...props }: React.ComponentProps<typeof Sidebar>)
{
  const { t } = useTranslation("erpCommon");
  const authState = useAppSelector((state) => state.auth);
  const permissions: string[] = authState.loggedInUser?.role?.permissions || [];

  const dispatch = useAppDispatch();

  const logoConfig = {
    full: { light: logoOnlyLight, dark: logoOnlyDark, sizeStyle: "w-12 px-2" },
    collapsed: { light: logoOnlyLight, dark: logoOnlyDark, sizeStyle: "w-8" }
  };

  const data = {
    navMain: [{
      title: t("sidebar.dashboard"),
      url: "/dashboard",
      icon: <LayoutDashboardIcon />,
      hasAuth: true
    }, {
      title: t("sidebar.invoices"),
      url: "/invoices",
      icon: <ReceiptText />,
      hasAuth: SystemPermissions.hasAuth(
        permissions,
        SystemPermissionsResources.InvoiceSell,
        SystemPermissionsActions.Get
      ) || SystemPermissions.hasAuth(
        permissions,
        SystemPermissionsResources.InvoicePurchase,
        SystemPermissionsActions.Get
      ),
      subItems: [{
        title: t("sidebar.sellInvoices"),
        url: "/sales",
        hasAuth: SystemPermissions.hasAuth(
          permissions,
          SystemPermissionsResources.InvoiceSell,
          SystemPermissionsActions.Get
        ) && SystemPermissions.hasAuth(
          authState.loggedInUser?.role?.permissions ?? [],
          SystemPermissionsResources.Invoices,
          SystemPermissionsActions.Get
        )
      }, {
        title: t("sidebar.purchaseInvoices"),
        url: "/purchases",
        hasAuth: SystemPermissions.hasAuth(
          permissions,
          SystemPermissionsResources.InvoicePurchase,
          SystemPermissionsActions.Get
        ) && SystemPermissions.hasAuth(
          authState.loggedInUser?.role?.permissions ?? [],
          SystemPermissionsResources.Invoices,
          SystemPermissionsActions.Get
        )
      }, {
        title: t("sidebar.quotationInvoices"),
        url: "/quotations",
        hasAuth: SystemPermissions.hasAuth(
          permissions,
          SystemPermissionsResources.InvoiceSell,
          SystemPermissionsActions.Get
        ) && SystemPermissions.hasAuth(
          authState.loggedInUser?.role?.permissions ?? [],
          SystemPermissionsResources.Invoices,
          SystemPermissionsActions.Get
        )
      }]
    }, {
      title: t("sidebar.vouchers"),
      url: "/vouchers",
      icon: <ScrollText />,
      hasAuth: SystemPermissions.hasAuth(
        permissions,
        SystemPermissionsResources.Vouchers,
        SystemPermissionsActions.Get
      )
    }, {
      title: t("sidebar.accounts"),
      url: "#",
      icon: <WalletCards />,
      hasAuth: true,
      subItems: [{
        title: t("sidebar.clients"),
        url: "/clients",
        hasAuth: SystemPermissions.hasAuth(
          permissions,
          SystemPermissionsResources.AccountClient,
          SystemPermissionsActions.Get
        ) && SystemPermissions.hasAuth(
          authState.loggedInUser?.role?.permissions ?? [],
          SystemPermissionsResources.Accounts,
          SystemPermissionsActions.Get
        )
      }, {
        title: t("sidebar.suppliers"),
        url: "/suppliers",
        hasAuth: SystemPermissions.hasAuth(
          permissions,
          SystemPermissionsResources.AccountSupplier,
          SystemPermissionsActions.Get
        ) && SystemPermissions.hasAuth(
          authState.loggedInUser?.role?.permissions ?? [],
          SystemPermissionsResources.Accounts,
          SystemPermissionsActions.Get
        )
      }, {
        title: t("sidebar.employees"),
        url: "/employees",
        hasAuth: SystemPermissions.hasAuth(
          permissions,
          SystemPermissionsResources.AccountEmployee,
          SystemPermissionsActions.Get
        ) && SystemPermissions.hasAuth(
          authState.loggedInUser?.role?.permissions ?? [],
          SystemPermissionsResources.Accounts,
          SystemPermissionsActions.Get
        )
      }, {
        title: t("sidebar.banks"),
        url: "/banks",
        hasAuth: SystemPermissions.hasAuth(
          permissions,
          SystemPermissionsResources.AccountBank,
          SystemPermissionsActions.Get
        ) && SystemPermissions.hasAuth(
          authState.loggedInUser?.role?.permissions ?? [],
          SystemPermissionsResources.Accounts,
          SystemPermissionsActions.Get
        )
      }, {
        title: t("sidebar.boxes"),
        url: "/boxes",
        hasAuth: SystemPermissions.hasAuth(
          permissions,
          SystemPermissionsResources.AccountBox,
          SystemPermissionsActions.Get
        ) && SystemPermissions.hasAuth(
          authState.loggedInUser?.role?.permissions ?? [],
          SystemPermissionsResources.Accounts,
          SystemPermissionsActions.Get
        )
      }, {
        title: t("sidebar.paymentMethods"),
        url: "/paymentMethods",
        hasAuth: SystemPermissions.hasAuth(
          permissions,
          SystemPermissionsResources.PaymentMethods,
          SystemPermissionsActions.Get
        )
      }, {
        title: t("sidebar.balanceTransfer"),
        url: "/balanceTransfer",
        hasAuth: SystemPermissions.hasAuth(
          permissions,
          SystemPermissionsResources.BalanceTransfers,
          SystemPermissionsActions.Get
        )
      }]
    }, {
      title: t("sidebar.items"),
      url: "#",
      icon: <Package />,
      hasAuth: true,
      subItems: [{
        title: t("sidebar.items"),
        url: "/items",
        hasAuth: SystemPermissions.hasAuth(
          permissions,
          SystemPermissionsResources.Items,
          SystemPermissionsActions.Get
        )
      }, {
        title: t("sidebar.itemTransfers"),
        url: "/itemTransfers",
        hasAuth: SystemPermissions.hasAuth(
          permissions,
          SystemPermissionsResources.ItemTransfers,
          SystemPermissionsActions.Get
        )
      }, {
        title: t("sidebar.stocktakings"),
        url: "/stocktakings",
        hasAuth: SystemPermissions.hasAuth(
          permissions,
          SystemPermissionsResources.Stocktakings,
          SystemPermissionsActions.Get
        )
      }, {
        title: t("sidebar.itemsSettlements"),
        url: "/itemsSettlements",
        hasAuth: SystemPermissions.hasAuth(
          permissions,
          SystemPermissionsResources.ItemsSettlements,
          SystemPermissionsActions.Get
        )
      }, {
        title: t("sidebar.pricingMethods"),
        url: "/pricingMethods",
        hasAuth: SystemPermissions.hasAuth(
          permissions,
          SystemPermissionsResources.PricingMethods,
          SystemPermissionsActions.Get
        )
      }, {
        title: t("sidebar.units"),
        url: "/units",
        hasAuth: SystemPermissions.hasAuth(
          permissions,
          SystemPermissionsResources.Units,
          SystemPermissionsActions.Get
        )
      }, {
        title: t("sidebar.stores"),
        url: "/stores",
        hasAuth: SystemPermissions.hasAuth(
          permissions,
          SystemPermissionsResources.Stores,
          SystemPermissionsActions.Get
        )
      }, {
        title: t("sidebar.taxes"),
        url: "/taxes",
        hasAuth: SystemPermissions.hasAuth(
          permissions,
          SystemPermissionsResources.Taxes,
          SystemPermissionsActions.Get
        )
      }]
    }, {
      title: t("sidebar.branches"),
      url: "/branches",
      icon: <Building2 />,
      hasAuth: SystemPermissions.hasAuth(
        permissions,
        SystemPermissionsResources.Branches,
        SystemPermissionsActions.Get
      )
    }, {
      title: t("sidebar.users"),
      url: "#",
      icon: <UsersIcon />,
      hasAuth: true,
      subItems: [{
        title: t("sidebar.roles"),
        url: "/roles",
        hasAuth: SystemPermissions.hasAuth(
          permissions,
          SystemPermissionsResources.Roles,
          SystemPermissionsActions.Get
        )
      }, {
        title: t("sidebar.users"),
        url: "/users",
        hasAuth: SystemPermissions.hasAuth(
          permissions,
          SystemPermissionsResources.Users,
          SystemPermissionsActions.Get
        )
      }]
    }, {
      title: t("sidebar.reports"),
      url: "/reports",
      icon: <FileChartColumnIncreasing />,
      hasAuth: SystemPermissions.hasAuth(
        permissions,
        SystemPermissionsResources.Stores,
        SystemPermissionsActions.Get
      )
    }],
    navSecondary: [{
      title: t("sidebar.settings"),
      url: "/settings",
      icon: <SettingsIcon />
    }]
  };

  const displayCompany = {
    name: authState.setting?.companyName || "Default Name",
    logo: authState.setting?.logo?.url || "/default-avatar.jpg"
  };

  const LogoutHandler = async () =>
  {
    const result = await YusrApiHelper.Post(`${ApiConstants.baseUrl}/Logout`);

    if (result.status === 200 || result.status === 204)
    {
      dispatch(logout());
    }
  };

  const { i18n } = useTranslation("common");
  const { state } = useSidebar();

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
              <SidebarLogo logos={ logoConfig } />
            </div>
            <SideBarCompanyData company={ displayCompany } />
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarContent>
        <SideBarMainMenu items={ data.navMain } />
        <SideBarSecondaryMenu
          items={ data.navSecondary }
          className="pt-10 mt-auto text-center"
          onLogout={ LogoutHandler }
        />
      </SidebarContent>

      <SidebarFooter>
        <SideBarUserData user={ authState.loggedInUser } />
      </SidebarFooter>
    </Sidebar>
  );
}
