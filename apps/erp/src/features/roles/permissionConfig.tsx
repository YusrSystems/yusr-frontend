import type { TFunction } from "i18next";
import { Database, FileBarChart, ShoppingCart, Wallet } from "lucide-react";
import { BaseServices, SystemPermissionsActions } from "yusr-ui";
import { SystemPermissionsResources } from "@/core/auth/systemPermissionsResources.ts";
import type { ErpRole } from "@/core/data/erpRole.ts";
import { Cubits } from "@/core/services/cubits.ts";
import type { RolePreset } from "#/features/roles/changeRoleDialog.tsx";


export const getLabels = (t: TFunction<"erpCommon">): Record<string, string> => ({
	// Resources
	[SystemPermissionsResources.Branches]: t("permissions.resources.branches"),
	[SystemPermissionsResources.Settings]: t("permissions.resources.settings"),
	[SystemPermissionsResources.Users]: t("permissions.resources.users"),
	[SystemPermissionsResources.Roles]: t("permissions.resources.roles"),
	[SystemPermissionsResources.Invoices]: t("permissions.resources.invoices"),
	[SystemPermissionsResources.Vouchers]: t("permissions.resources.vouchers"),
	[SystemPermissionsResources.Accounts]: t("permissions.resources.accounts"),
	[SystemPermissionsResources.BalanceTransfers]: t("permissions.resources.balanceTransfers"),
	[SystemPermissionsResources.PaymentMethods]: t("permissions.resources.paymentMethods"),
	[SystemPermissionsResources.Partners]: t("permissions.resources.partners", "الجهات"),
	[SystemPermissionsResources.Items]: t("permissions.resources.items"),
	[SystemPermissionsResources.Brands]: t("permissions.resources.brands", "العلامات التجارية"),
	[SystemPermissionsResources.Categories]: t("permissions.resources.categories", "التصنيفات"),
	[SystemPermissionsResources.ItemTransfers]: t("permissions.resources.itemTransfers"),
	[SystemPermissionsResources.ItemsSettlements]: t("permissions.resources.itemsSettlements"),
	[SystemPermissionsResources.Stocktakings]: t("permissions.resources.stocktakings"),
	[SystemPermissionsResources.Units]: t("permissions.resources.units"),
	[SystemPermissionsResources.PricingMethods]: t("permissions.resources.pricingMethods"),
	[SystemPermissionsResources.Stores]: t("permissions.resources.stores"),
	[SystemPermissionsResources.Taxes]: t("permissions.resources.taxes"),
	[SystemPermissionsResources.PosTerminals]: t("permissions.resources.posTerminals"),
	[SystemPermissionsResources.PosSessions]: t("permissions.resources.posSessions", "جلسات نقاط البيع"),
	[SystemPermissionsResources.CostAdjustments]: t("permissions.resources.costAdjustments"),

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
	[SystemPermissionsResources.ReportPartnerStatement]: t("permissions.report.partnerStatement"),
	[SystemPermissionsResources.ReportAccountList]: t("permissions.report.accountList"),
	[SystemPermissionsResources.ReportBalanceTransfer]: t("permissions.report.balanceTransfer"),
	[SystemPermissionsResources.ReportItemStatement]: t("permissions.report.itemStatement"),
	[SystemPermissionsResources.ReportItemList]: t("permissions.report.itemList"),
	[SystemPermissionsResources.ReportItemMovement]: t("permissions.report.itemMovement"),
	[SystemPermissionsResources.ReportItemTaxStatement]: t("permissions.report.itemTaxStatement"),
	[SystemPermissionsResources.ReportItemTransfer]: t("permissions.report.itemTransfer"),
	[SystemPermissionsResources.ReportBalanceSheet]: t("permissions.report.balanceSheet"),
	[SystemPermissionsResources.ReportVatReturn]: "الإقرار الضريبي",
	[SystemPermissionsResources.ReportPl]: t("permissions.report.profitAndLoss"),
	[SystemPermissionsResources.ReportSalesProfitability]: t("permissions.report.salesProfitability", "تقرير ربحية المبيعات"),
	[SystemPermissionsResources.ReportTaxAudit]: "تقرير المراجعة الضريبية",
	[SystemPermissionsResources.ReportStocktaking]: t("permissions.report.stocktaking"),
	[SystemPermissionsResources.ReportItemSettlement]: t("permissions.report.itemSettlement"),
	[SystemPermissionsResources.ReportItemBarcode]: t("permissions.report.itemBarcode"),
	[SystemPermissionsResources.ReportStockValuation]: t("permissions.report.stockValuation", "تقرير تقييم المخزون"),
	[SystemPermissionsResources.ReportLowStock]: t("permissions.report.lowStock", "تقرير النواقص"),

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
		SystemPermissionsResources.Partners,
		SystemPermissionsResources.Items,
		SystemPermissionsResources.Brands,
		SystemPermissionsResources.Categories,
		SystemPermissionsResources.ItemTransfers,
		SystemPermissionsResources.ItemsSettlements,
		SystemPermissionsResources.Stocktakings,
		SystemPermissionsResources.CostAdjustments,
		SystemPermissionsResources.Units,
		SystemPermissionsResources.PricingMethods,
		SystemPermissionsResources.Stores,
		SystemPermissionsResources.Taxes,
		SystemPermissionsResources.PosTerminals,
		SystemPermissionsResources.PosSessions,
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
		SystemPermissionsResources.ReportPartnerStatement,
		SystemPermissionsResources.ReportAccountList,
		SystemPermissionsResources.ReportBalanceTransfer,
		SystemPermissionsResources.ReportItemStatement,
		SystemPermissionsResources.ReportItemList,
		SystemPermissionsResources.ReportItemMovement,
		SystemPermissionsResources.ReportItemTaxStatement,
		SystemPermissionsResources.ReportItemTransfer,
		SystemPermissionsResources.ReportBalanceSheet,
		SystemPermissionsResources.ReportVatReturn,
		SystemPermissionsResources.ReportPl,
		SystemPermissionsResources.ReportSalesProfitability,
		SystemPermissionsResources.ReportTaxAudit,
		SystemPermissionsResources.ReportStocktaking,
		SystemPermissionsResources.ReportItemSettlement,
		SystemPermissionsResources.ReportItemBarcode,
		SystemPermissionsResources.ReportStockValuation,
		SystemPermissionsResources.ReportLowStock
	]
}];

const getResourcePerms = (resource: string, allowedActions?: string[]) =>
{
	const system = BaseServices.auth.systemPermissions.value;
	const actions = allowedActions ?? [
		SystemPermissionsActions.Get,
		SystemPermissionsActions.Add,
		SystemPermissionsActions.Update,
		SystemPermissionsActions.Delete
	];

	if (!actions.includes(SystemPermissionsActions.Get))
	{
		actions.unshift(SystemPermissionsActions.Get);
	}

	const matched = system.filter((p) =>
	{
		if (p === resource) return true;
		if (p.startsWith(`${ resource }.`))
		{
			const act = p.substring(resource.length + 1);
			return actions.includes(act);
		}
		return false;
	});

	if (matched.length > 0)
	{
		return matched;
	}

	return [
		resource,
		...actions.map((a) => `${ resource }.${ a }`)
	];
};

const single = (resource: string) =>
{
	const system = BaseServices.auth.systemPermissions.value;
	const matched = system.filter((p) =>
		p === resource ||
		p === `${ resource }.${ SystemPermissionsActions.Get }` ||
		p.startsWith(`${ resource }.`)
	);

	if (matched.length > 0)
	{
		return matched;
	}

	return [resource, `${ resource }.${ SystemPermissionsActions.Get }`];
};

const crud = (resource: string) => getResourcePerms(resource);
const readWrite = (resource: string) => getResourcePerms(resource, [SystemPermissionsActions.Get, SystemPermissionsActions.Add, SystemPermissionsActions.Update]);
const readOnly = (resource: string) => getResourcePerms(resource, [SystemPermissionsActions.Get]);

const selectAllStores = (role: ErpRole) =>
{
	if (Cubits.stores.entities.value.length > 0)
	{
		role.authorizedStores.value = Cubits.stores.entities.value.map((s) => s.id);
	}
};

export const getRolePresets = (t: TFunction<"erpCommon">): RolePreset<ErpRole>[] => [
	{
		id: "general_manager",
		name: t("roles.presets.generalManager", "مدير عام"),
		description: t("roles.presets.generalManagerDesc", "صلاحيات كاملة لجميع وظائف وتقارير النظام"),
		permissions: () => BaseServices.auth.systemPermissions.value,
		onApply: selectAllStores
	},
	{
		id: "branch_manager",
		name: t("roles.presets.branchManager", "مدير فرع"),
		description: t("roles.presets.branchManagerDesc", "إدارة العمليات اليومية للفرع والمبيعات والمخازن ونقاط البيع"),
		permissions: () => [
			// Tables
			...crud(SystemPermissionsResources.Invoices),
			...crud(SystemPermissionsResources.Vouchers),
			...readWrite(SystemPermissionsResources.Accounts),
			...readWrite(SystemPermissionsResources.BalanceTransfers),
			...readWrite(SystemPermissionsResources.Partners),
			...crud(SystemPermissionsResources.Items),
			...crud(SystemPermissionsResources.Brands),
			...crud(SystemPermissionsResources.Categories),
			...crud(SystemPermissionsResources.ItemTransfers),
			...crud(SystemPermissionsResources.ItemsSettlements),
			...crud(SystemPermissionsResources.Stocktakings),
			...readWrite(SystemPermissionsResources.Units),
			...readWrite(SystemPermissionsResources.PricingMethods),
			...readOnly(SystemPermissionsResources.Stores),
			...readOnly(SystemPermissionsResources.PaymentMethods),
			...readOnly(SystemPermissionsResources.Taxes),
			...crud(SystemPermissionsResources.PosTerminals),
			...crud(SystemPermissionsResources.PosSessions),

			// Invoices Tab
			...single(SystemPermissionsResources.InvoiceAddSettlement),
			...single(SystemPermissionsResources.InvoiceShowProfit),
			...single(SystemPermissionsResources.InvoiceShowItemProfit),
			...single(SystemPermissionsResources.InvoiceSellBelowSellingPrice),
			...single(SystemPermissionsResources.InvoiceSellBeyondAvailableQuantity),
			...single(SystemPermissionsResources.InvoiceSell),
			...single(SystemPermissionsResources.InvoicePurchase),

			// Accounts Tab
			...single(SystemPermissionsResources.AccountShowBalance),
			...single(SystemPermissionsResources.AccountClient),
			...single(SystemPermissionsResources.AccountSupplier),
			...single(SystemPermissionsResources.AccountBox),

			// Reports Tab
			...single(SystemPermissionsResources.ReportInvoice),
			...single(SystemPermissionsResources.ReportInvoiceList),
			...single(SystemPermissionsResources.ReportVoucher),
			...single(SystemPermissionsResources.ReportVoucherList),
			...single(SystemPermissionsResources.ReportAccountStatement),
			...single(SystemPermissionsResources.ReportPartnerStatement),
			...single(SystemPermissionsResources.ReportItemStatement),
			...single(SystemPermissionsResources.ReportItemList),
			...single(SystemPermissionsResources.ReportItemMovement),
			...single(SystemPermissionsResources.ReportItemTransfer),
			...single(SystemPermissionsResources.ReportStocktaking),
			...single(SystemPermissionsResources.ReportItemSettlement),
			...single(SystemPermissionsResources.ReportItemBarcode),
			...single(SystemPermissionsResources.ReportSalesProfitability),
			...single(SystemPermissionsResources.ReportLowStock)
		],
		onApply: selectAllStores
	},
	{
		id: "cashier",
		name: t("roles.presets.cashier", "كاشير / نقطة بيع"),
		description: t("roles.presets.cashierDesc", "إصدار فواتير البيع وإدارة جلسات نقاط البيع وتحصيل المدفوعات"),
		permissions: () => [
			// Tables
			...readWrite(SystemPermissionsResources.Invoices),
			...readWrite(SystemPermissionsResources.PosSessions),
			...readOnly(SystemPermissionsResources.PosTerminals),
			...readOnly(SystemPermissionsResources.Items),
			...readOnly(SystemPermissionsResources.Categories),
			...readOnly(SystemPermissionsResources.Brands),
			...readOnly(SystemPermissionsResources.Units),
			...readOnly(SystemPermissionsResources.PricingMethods),
			...readOnly(SystemPermissionsResources.Stores),
			...readOnly(SystemPermissionsResources.PaymentMethods),
			...readOnly(SystemPermissionsResources.Taxes),
			...readWrite(SystemPermissionsResources.Partners),

			// Invoices Tab
			...single(SystemPermissionsResources.InvoiceSell),
			...single(SystemPermissionsResources.InvoiceAddSettlement),

			// Accounts Tab
			...single(SystemPermissionsResources.AccountClient),

			// Reports Tab
			...single(SystemPermissionsResources.ReportInvoice),
			...single(SystemPermissionsResources.ReportItemBarcode)
		],
		onApply: selectAllStores
	},
	{
		id: "accountant",
		name: t("roles.presets.accountant", "محاسب"),
		description: t("roles.presets.accountantDesc", "إدارة السندات والحسابات والتحويلات المالية والتقارير المحاسبية"),
		permissions: () => [
			// Tables
			...crud(SystemPermissionsResources.Vouchers),
			...crud(SystemPermissionsResources.Accounts),
			...crud(SystemPermissionsResources.BalanceTransfers),
			...readOnly(SystemPermissionsResources.Invoices),
			...readOnly(SystemPermissionsResources.PaymentMethods),
			...readOnly(SystemPermissionsResources.Partners),
			...readOnly(SystemPermissionsResources.Taxes),
			...readOnly(SystemPermissionsResources.Stores),
			...readOnly(SystemPermissionsResources.Branches),
			...readOnly(SystemPermissionsResources.CostAdjustments),

			// Accounts Tab
			...single(SystemPermissionsResources.AccountShowBalance),
			...single(SystemPermissionsResources.AccountClient),
			...single(SystemPermissionsResources.AccountSupplier),
			...single(SystemPermissionsResources.AccountEmployee),
			...single(SystemPermissionsResources.AccountBank),
			...single(SystemPermissionsResources.AccountBox),

			// Reports Tab
			...single(SystemPermissionsResources.ReportVoucher),
			...single(SystemPermissionsResources.ReportVoucherList),
			...single(SystemPermissionsResources.ReportAccountStatement),
			...single(SystemPermissionsResources.ReportPartnerStatement),
			...single(SystemPermissionsResources.ReportAccountList),
			...single(SystemPermissionsResources.ReportBalanceTransfer),
			...single(SystemPermissionsResources.ReportBalanceSheet),
			...single(SystemPermissionsResources.ReportVatReturn),
			...single(SystemPermissionsResources.ReportPl),
			...single(SystemPermissionsResources.ReportTaxAudit),
			...single(SystemPermissionsResources.ReportInvoice),
			...single(SystemPermissionsResources.ReportInvoiceList)
		]
	},
	{
		id: "financial_manager",
		name: t("roles.presets.financialManager", "مدير مالي / رئيس حسابات"),
		description: t("roles.presets.financialManagerDesc", "إدارة مالية شاملة وتعديل التكاليف والقوائم والتقارير الختامية والضريبية"),
		permissions: () => [
			// Tables
			...crud(SystemPermissionsResources.Vouchers),
			...crud(SystemPermissionsResources.Accounts),
			...crud(SystemPermissionsResources.BalanceTransfers),
			...crud(SystemPermissionsResources.PaymentMethods),
			...crud(SystemPermissionsResources.Taxes),
			...crud(SystemPermissionsResources.CostAdjustments),
			...readOnly(SystemPermissionsResources.Invoices),
			...readOnly(SystemPermissionsResources.Items),
			...readOnly(SystemPermissionsResources.Partners),
			...readOnly(SystemPermissionsResources.Stores),
			...readOnly(SystemPermissionsResources.Branches),

			// Invoices Tab
			...single(SystemPermissionsResources.InvoiceShowProfit),
			...single(SystemPermissionsResources.InvoiceShowItemProfit),
			...single(SystemPermissionsResources.InvoiceSell),
			...single(SystemPermissionsResources.InvoicePurchase),

			// Accounts Tab
			...single(SystemPermissionsResources.AccountShowBalance),
			...single(SystemPermissionsResources.AccountClient),
			...single(SystemPermissionsResources.AccountSupplier),
			...single(SystemPermissionsResources.AccountEmployee),
			...single(SystemPermissionsResources.AccountBank),
			...single(SystemPermissionsResources.AccountBox),

			// Reports Tab
			...single(SystemPermissionsResources.ReportBalanceSheet),
			...single(SystemPermissionsResources.ReportVatReturn),
			...single(SystemPermissionsResources.ReportPl),
			...single(SystemPermissionsResources.ReportSalesProfitability),
			...single(SystemPermissionsResources.ReportTaxAudit),
			...single(SystemPermissionsResources.ReportAccountStatement),
			...single(SystemPermissionsResources.ReportPartnerStatement),
			...single(SystemPermissionsResources.ReportAccountList),
			...single(SystemPermissionsResources.ReportBalanceTransfer),
			...single(SystemPermissionsResources.ReportVoucher),
			...single(SystemPermissionsResources.ReportVoucherList),
			...single(SystemPermissionsResources.ReportInvoice),
			...single(SystemPermissionsResources.ReportInvoiceList),
			...single(SystemPermissionsResources.ReportStockValuation)
		],
		onApply: selectAllStores
	},
	{
		id: "storekeeper",
		name: t("roles.presets.storekeeper", "أمين مستودع / مسؤول مخزون"),
		description: t("roles.presets.storekeeperDesc", "إدارة الأصناف والتحويلات المخزنية والتسويات والجرد وتقارير المخزون"),
		permissions: () => [
			// Tables
			...crud(SystemPermissionsResources.Items),
			...crud(SystemPermissionsResources.Units),
			...crud(SystemPermissionsResources.Brands),
			...crud(SystemPermissionsResources.Categories),
			...crud(SystemPermissionsResources.ItemTransfers),
			...crud(SystemPermissionsResources.ItemsSettlements),
			...crud(SystemPermissionsResources.Stocktakings),
			...readOnly(SystemPermissionsResources.Stores),
			...readOnly(SystemPermissionsResources.PricingMethods),

			// Reports Tab
			...single(SystemPermissionsResources.ReportItemStatement),
			...single(SystemPermissionsResources.ReportItemList),
			...single(SystemPermissionsResources.ReportItemMovement),
			...single(SystemPermissionsResources.ReportItemTransfer),
			...single(SystemPermissionsResources.ReportStocktaking),
			...single(SystemPermissionsResources.ReportItemSettlement),
			...single(SystemPermissionsResources.ReportItemBarcode),
			...single(SystemPermissionsResources.ReportStockValuation),
			...single(SystemPermissionsResources.ReportLowStock)
		],
		onApply: selectAllStores
	},
	{
		id: "sales_representative",
		name: t("roles.presets.salesRepresentative", "مندوب / موظف مبيعات"),
		description: t("roles.presets.salesRepresentativeDesc", "إصدار فواتير المبيعات وإضافة العملاء واستعراض الأصناف والأسعار"),
		permissions: () => [
			// Tables
			...readWrite(SystemPermissionsResources.Invoices),
			...readWrite(SystemPermissionsResources.Partners),
			...readOnly(SystemPermissionsResources.Items),
			...readOnly(SystemPermissionsResources.Units),
			...readOnly(SystemPermissionsResources.Categories),
			...readOnly(SystemPermissionsResources.Brands),
			...readOnly(SystemPermissionsResources.PricingMethods),
			...readOnly(SystemPermissionsResources.PaymentMethods),
			...readOnly(SystemPermissionsResources.Stores),

			// Invoices Tab
			...single(SystemPermissionsResources.InvoiceSell),
			...single(SystemPermissionsResources.InvoiceAddSettlement),

			// Accounts Tab
			...single(SystemPermissionsResources.AccountClient),

			// Reports Tab
			...single(SystemPermissionsResources.ReportInvoice),
			...single(SystemPermissionsResources.ReportItemList),
			...single(SystemPermissionsResources.ReportItemBarcode)
		],
		onApply: selectAllStores
	},
	{
		id: "procurement_officer",
		name: t("roles.presets.procurementOfficer", "مسؤول مشتريات"),
		description: t("roles.presets.procurementOfficerDesc", "إصدار فواتير المشتريات وإدارة الموردين ومتابعة نواقص المخزون"),
		permissions: () => [
			// Tables
			...readWrite(SystemPermissionsResources.Invoices),
			...readWrite(SystemPermissionsResources.Partners),
			...readWrite(SystemPermissionsResources.Items),
			...readWrite(SystemPermissionsResources.PricingMethods),
			...readOnly(SystemPermissionsResources.Stores),
			...readOnly(SystemPermissionsResources.Units),
			...readOnly(SystemPermissionsResources.Categories),
			...readOnly(SystemPermissionsResources.Brands),
			...readOnly(SystemPermissionsResources.PaymentMethods),

			// Invoices Tab
			...single(SystemPermissionsResources.InvoicePurchase),

			// Accounts Tab
			...single(SystemPermissionsResources.AccountSupplier),

			// Reports Tab
			...single(SystemPermissionsResources.ReportInvoice),
			...single(SystemPermissionsResources.ReportInvoiceList),
			...single(SystemPermissionsResources.ReportItemList),
			...single(SystemPermissionsResources.ReportItemStatement),
			...single(SystemPermissionsResources.ReportItemMovement),
			...single(SystemPermissionsResources.ReportLowStock)
		],
		onApply: selectAllStores
	},
	{
		id: "data_entry",
		name: t("roles.presets.dataEntry", "مدخل بيانات"),
		description: t("roles.presets.dataEntryDesc", "إدخال وتحديث بيانات الأصناف والشركاء والتصنيفات والوحدات والأسعار"),
		permissions: () => [
			// Tables
			...readWrite(SystemPermissionsResources.Items),
			...readWrite(SystemPermissionsResources.Units),
			...readWrite(SystemPermissionsResources.Brands),
			...readWrite(SystemPermissionsResources.Categories),
			...readWrite(SystemPermissionsResources.Partners),
			...readWrite(SystemPermissionsResources.PricingMethods),
			...readOnly(SystemPermissionsResources.Stores),
			...readOnly(SystemPermissionsResources.Taxes),
			...readOnly(SystemPermissionsResources.PaymentMethods)
		],
		onApply: selectAllStores
	},
	{
		id: "auditor",
		name: t("roles.presets.auditor", "مراجع / مدقق"),
		description: t("roles.presets.auditorDesc", "صلاحيات قراءة واستعراض فقط لجميع السجلات والعمليات والتقارير المالية والمخزنية"),
		permissions: () => [
			// Tables
			...readOnly(SystemPermissionsResources.Invoices),
			...readOnly(SystemPermissionsResources.Vouchers),
			...readOnly(SystemPermissionsResources.Accounts),
			...readOnly(SystemPermissionsResources.BalanceTransfers),
			...readOnly(SystemPermissionsResources.PaymentMethods),
			...readOnly(SystemPermissionsResources.Partners),
			...readOnly(SystemPermissionsResources.Items),
			...readOnly(SystemPermissionsResources.Brands),
			...readOnly(SystemPermissionsResources.Categories),
			...readOnly(SystemPermissionsResources.ItemTransfers),
			...readOnly(SystemPermissionsResources.ItemsSettlements),
			...readOnly(SystemPermissionsResources.Stocktakings),
			...readOnly(SystemPermissionsResources.Units),
			...readOnly(SystemPermissionsResources.PricingMethods),
			...readOnly(SystemPermissionsResources.Stores),
			...readOnly(SystemPermissionsResources.Taxes),
			...readOnly(SystemPermissionsResources.PosTerminals),
			...readOnly(SystemPermissionsResources.PosSessions),
			...readOnly(SystemPermissionsResources.CostAdjustments),
			...readOnly(SystemPermissionsResources.Branches),

			// Invoices Tab
			...single(SystemPermissionsResources.InvoiceShowProfit),
			...single(SystemPermissionsResources.InvoiceShowItemProfit),

			// Accounts Tab
			...single(SystemPermissionsResources.AccountShowBalance),
			...single(SystemPermissionsResources.AccountClient),
			...single(SystemPermissionsResources.AccountSupplier),
			...single(SystemPermissionsResources.AccountEmployee),
			...single(SystemPermissionsResources.AccountBank),
			...single(SystemPermissionsResources.AccountBox),

			// Reports Tab
			...single(SystemPermissionsResources.ReportInvoice),
			...single(SystemPermissionsResources.ReportInvoiceList),
			...single(SystemPermissionsResources.ReportVoucher),
			...single(SystemPermissionsResources.ReportVoucherList),
			...single(SystemPermissionsResources.ReportAccountStatement),
			...single(SystemPermissionsResources.ReportPartnerStatement),
			...single(SystemPermissionsResources.ReportAccountList),
			...single(SystemPermissionsResources.ReportBalanceTransfer),
			...single(SystemPermissionsResources.ReportItemStatement),
			...single(SystemPermissionsResources.ReportItemList),
			...single(SystemPermissionsResources.ReportItemMovement),
			...single(SystemPermissionsResources.ReportItemTaxStatement),
			...single(SystemPermissionsResources.ReportItemTransfer),
			...single(SystemPermissionsResources.ReportBalanceSheet),
			...single(SystemPermissionsResources.ReportVatReturn),
			...single(SystemPermissionsResources.ReportPl),
			...single(SystemPermissionsResources.ReportSalesProfitability),
			...single(SystemPermissionsResources.ReportTaxAudit),
			...single(SystemPermissionsResources.ReportStocktaking),
			...single(SystemPermissionsResources.ReportItemSettlement),
			...single(SystemPermissionsResources.ReportItemBarcode),
			...single(SystemPermissionsResources.ReportStockValuation),
			...single(SystemPermissionsResources.ReportLowStock)
		],
		onApply: selectAllStores
	}
];