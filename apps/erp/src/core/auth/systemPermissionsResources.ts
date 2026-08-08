import { YusrSystemPermissionsResources } from "yusr-ui";


export const SystemPermissionsResources = {
	...YusrSystemPermissionsResources,

	// Core
	PricingMethods: "PricingMethods",
	Stores: "Stores",
	Taxes: "Taxes",
	Units: "Units",

	// Accounts
	Accounts: "Accounts",
	BalanceTransfers: "BalanceTransfers",
	PaymentMethods: "PaymentMethods",
	Vouchers: "Vouchers",
	Partners: "Partners",

	// Invoices
	Invoices: "Invoices",
	Obligations: "Obligations",
	PosTerminals: "PosTerminals",

	// Items
	Items: "Items",
	ItemsSettlements: "ItemsSettlements",
	ItemTransfers: "ItemTransfers",
	Stocktakings: "Stocktakings",
	CostAdjustments: "CostAdjustments",

	// Dashboard
	Dashboard: "Dashboard",

	// Invoice Permission Settings
	InvoiceAddSettlement: "InvoiceAddSettlement",
	InvoiceShowProfit: "InvoiceShowProfit",
	InvoiceShowItemProfit: "InvoiceShowItemProfit",
	InvoiceSellBelowSellingPrice: "InvoiceSellBelowSellingPrice",
	InvoiceSellBeyondAvailableQuantity: "InvoiceSellBeyondAvailableQuantity",

	// Allowed Invoice Types
	InvoiceSell: "InvoiceSell",
	InvoicePurchase: "InvoicePurchase",

	// Allowed Account Types
	AccountShowBalance: "AccountShowBalance",
	AccountClient: "AccountClient",
	AccountSupplier: "AccountSupplier",
	AccountEmployee: "AccountEmployee",
	AccountBank: "AccountBank",
	AccountBox: "AccountBox",

	// Reports
	ReportInvoice: "ReportInvoice",
	ReportInvoiceList: "ReportInvoiceList",
	ReportVoucher: "ReportVoucher",
	ReportVoucherList: "ReportVoucherList",
	ReportAccountStatement: "ReportAccountStatement",
	ReportPartnerStatement: "ReportPartnerStatement",
	ReportAccountList: "ReportAccountList",
	ReportBalanceTransfer: "ReportBalanceTransfer",
	ReportItemStatement: "ReportItemStatement",
	ReportItemList: "ReportItemList",
	ReportItemMovement: "ReportItemMovement",
	ReportItemTaxStatement: "ReportItemTaxStatement",
	ReportItemTransfer: "ReportItemTransfer",
	ReportBalanceSheet: "ReportBalanceSheet",
	ReportVatReturn: "ReportVatReturn",
	ReportPl: "ReportPl",
	ReportStocktaking: "ReportStocktaking",
	ReportItemSettlement: "ReportItemSettlement",
	ReportItemBarcode: "ReportItemBarcode",
	ReportSalesProfitability: "ReportSalesProfitability",
	ReportTaxAudit: "ReportTaxAudit",
	ReportStockValuation: "ReportStockValuation",
	ReportLowStock: "ReportLowStock"

} as const;