import type { TFunction } from "i18next";
import { SystemPermissionsActions } from "yusr-ui";
import { SystemPermissionsResources } from "../../core/auth/systemPermissionsResources";
import { Database, FileBarChart, ShoppingCart, Wallet } from "lucide-react";

export const getLabels = (t: TFunction<"erpCommon">): Record<string, string> => ({
  // Resources
  [SystemPermissionsResources.Branches]: t("permissions.resources.branches"),
  [SystemPermissionsResources.Settings]: t("permissions.resources.settings"),
  [SystemPermissionsResources.Users]: t("permissions.resources.users"),
  [SystemPermissionsResources.Roles]: t("permissions.resources.roles"),
  [SystemPermissionsResources.Dashboard]: t("permissions.resources.dashboard"),
  [SystemPermissionsResources.Invoices]: t("permissions.resources.invoices"),
  [SystemPermissionsResources.Vouchers]: t("permissions.resources.vouchers"),
  [SystemPermissionsResources.Accounts]: t("permissions.resources.accounts"),
  [SystemPermissionsResources.BalanceTransfers]: t("permissions.resources.balanceTransfers"),
  [SystemPermissionsResources.PaymentMethods]: t("permissions.resources.paymentMethods"),
  [SystemPermissionsResources.Items]: t("permissions.resources.items"),
  [SystemPermissionsResources.ItemTransfers]: t("permissions.resources.itemTransfers"),
  [SystemPermissionsResources.ItemsSettlements]: t("permissions.resources.itemsSettlements"),
  [SystemPermissionsResources.Stocktakings]: t("permissions.resources.stocktakings"),
  [SystemPermissionsResources.Units]: t("permissions.resources.units"),
  [SystemPermissionsResources.PricingMethods]: t("permissions.resources.pricingMethods"),
  [SystemPermissionsResources.Stores]: t("permissions.resources.stores"),
  [SystemPermissionsResources.Taxes]: t("permissions.resources.taxes"),
  [SystemPermissionsResources.Obligations]: t("permissions.resources.obligations"),
  [SystemPermissionsResources.PosTerminals]: t("permissions.resources.posTerminals"),

  // Invoice Permission Settings
  [SystemPermissionsResources.InvoiceAddSettlement]: t("permissions.invoice.addSettlement"),
  [SystemPermissionsResources.InvoiceShowProfit]: t("permissions.invoice.showProfit"),
  [SystemPermissionsResources.InvoiceShowItemProfit]: t("permissions.invoice.showItemProfit"),
  [SystemPermissionsResources.InvoiceSellBelowSellingPrice]: t("permissions.invoice.sellBelowSellingPrice"),
  [SystemPermissionsResources.InvoiceSellBeyondAvailableQuantity]: t("permissions.invoice.sellBeyondAvailableQuantity"),

  // Allowed Invoice Types
  [SystemPermissionsResources.InvoiceSell]: t("permissions.invoice.sell"),
  [SystemPermissionsResources.InvoicePurchase]: t("permissions.invoice.purchase"),

  // Allowed Account Types
  [SystemPermissionsResources.AccountShowBalance]: t("permissions.account.showBalance"),
  [SystemPermissionsResources.AccountClient]: t("permissions.account.client"),
  [SystemPermissionsResources.AccountSupplier]: t("permissions.account.supplier"),
  [SystemPermissionsResources.AccountEmployee]: t("permissions.account.employee"),
  [SystemPermissionsResources.AccountBank]: t("permissions.account.bank"),
  [SystemPermissionsResources.AccountBox]: t("permissions.account.box"),

  // Report Permissions
  [SystemPermissionsResources.ReportInvoice]: t("permissions.report.invoice"),
  [SystemPermissionsResources.ReportInvoiceList]: t("permissions.report.invoiceList"),
  [SystemPermissionsResources.ReportVoucher]: t("permissions.report.voucher"),
  [SystemPermissionsResources.ReportVoucherList]: t("permissions.report.voucherList"),
  [SystemPermissionsResources.ReportAccountStatement]: t("permissions.report.accountStatement"),
  [SystemPermissionsResources.ReportAccountList]: t("permissions.report.accountList"),
  [SystemPermissionsResources.ReportBalanceTransfer]: t("permissions.report.balanceTransfer"),
  [SystemPermissionsResources.ReportItemStatement]: t("permissions.report.itemStatement"),
  [SystemPermissionsResources.ReportItemList]: t("permissions.report.itemList"),
  [SystemPermissionsResources.ReportItemMovement]: t("permissions.report.itemMovement"),
  [SystemPermissionsResources.ReportItemTaxStatement]: t("permissions.report.itemTaxStatement"),
  [SystemPermissionsResources.ReportItemTransfer]: t("permissions.report.itemTransfer"),
  [SystemPermissionsResources.ReportBalanceSheet]: t("permissions.report.balanceSheet"),
  [SystemPermissionsResources.ReportTaxReturn]: t("permissions.report.taxReturn"),
  [SystemPermissionsResources.ReportProfitAndLoss]: t("permissions.report.profitAndLoss"),
  [SystemPermissionsResources.ReportStocktaking]: t("permissions.report.stocktaking"),
  [SystemPermissionsResources.ReportItemSettlement]: t("permissions.report.itemSettlement"),
  [SystemPermissionsResources.ReportItemBarcode]: t("permissions.report.itemBarcode"),

  // Actions
  [SystemPermissionsActions.Add]: t("permissions.actions.add"),
  [SystemPermissionsActions.Update]: t("permissions.actions.update"),
  [SystemPermissionsActions.Delete]: t("permissions.actions.delete")
});

export const getPermissionSections = (t: TFunction<"erpCommon">) => [{
  id: "tables",
  title: t("permissions.sections.tables"),
  icon: Database,
  resources: [
    SystemPermissionsResources.Invoices,
    SystemPermissionsResources.Vouchers,
    SystemPermissionsResources.Accounts,
    SystemPermissionsResources.BalanceTransfers,
    SystemPermissionsResources.PaymentMethods,
    SystemPermissionsResources.Items,
    SystemPermissionsResources.ItemTransfers,
    SystemPermissionsResources.ItemsSettlements,
    SystemPermissionsResources.Stocktakings,
    SystemPermissionsResources.Units,
    SystemPermissionsResources.PricingMethods,
    SystemPermissionsResources.Stores,
    SystemPermissionsResources.Taxes,
    SystemPermissionsResources.Users,
    SystemPermissionsResources.Roles,
    SystemPermissionsResources.Branches,
    SystemPermissionsResources.Settings
  ]
}, {
  id: "invoices",
  title: t("permissions.sections.invoices"),
  icon: ShoppingCart,
  resources: [
    SystemPermissionsResources.InvoiceAddSettlement,
    SystemPermissionsResources.InvoiceShowProfit,
    SystemPermissionsResources.InvoiceShowItemProfit,
    SystemPermissionsResources.InvoiceSellBelowSellingPrice,
    SystemPermissionsResources.InvoiceSellBeyondAvailableQuantity,
    SystemPermissionsResources.InvoiceSell,
    SystemPermissionsResources.InvoicePurchase
  ]
}, {
  id: "accounts",
  title: t("permissions.sections.accounts"),
  icon: Wallet,
  resources: [
    SystemPermissionsResources.AccountShowBalance,
    SystemPermissionsResources.AccountClient,
    SystemPermissionsResources.AccountSupplier,
    SystemPermissionsResources.AccountEmployee,
    SystemPermissionsResources.AccountBank,
    SystemPermissionsResources.AccountBox
  ]
}, {
  id: "reports",
  title: t("permissions.sections.reports"),
  icon: FileBarChart,
  resources: [
    SystemPermissionsResources.ReportInvoice,
    SystemPermissionsResources.ReportInvoiceList,
    SystemPermissionsResources.ReportVoucher,
    SystemPermissionsResources.ReportVoucherList,
    SystemPermissionsResources.ReportAccountStatement,
    SystemPermissionsResources.ReportAccountList,
    SystemPermissionsResources.ReportBalanceTransfer,
    SystemPermissionsResources.ReportItemStatement,
    SystemPermissionsResources.ReportItemList,
    SystemPermissionsResources.ReportItemMovement,
    SystemPermissionsResources.ReportItemTaxStatement,
    SystemPermissionsResources.ReportItemTransfer,
    SystemPermissionsResources.ReportBalanceSheet,
    SystemPermissionsResources.ReportTaxReturn,
    SystemPermissionsResources.ReportProfitAndLoss,
    SystemPermissionsResources.ReportStocktaking,
    SystemPermissionsResources.ReportItemSettlement,
    SystemPermissionsResources.ReportItemBarcode
  ]
}];
