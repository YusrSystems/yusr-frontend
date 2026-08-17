import { YusrSystemPermissionsResources } from "yusr-ui";


export const SystemPermissionsResources = {
	...YusrSystemPermissionsResources,

	// Core
	PricingMethods: "PricingMethods",
	Stores: "Stores",
	Taxes: "Taxes",
	Units: "Units",

	// Accounts & Fiscal Years
	Accounts: "Accounts",
	BalanceTransfers: "BalanceTransfers",
	PaymentMethods: "PaymentMethods",
	Vouchers: "Vouchers",
	Partners: "Partners",
	FiscalYears: "FiscalYears",
	FiscalPeriods: "FiscalPeriods",
	FiscalYearClose: "FiscalYearClose",
	FiscalYearReopen: "FiscalYearReopen",

	// Invoices & POS
	Invoices: "Invoices",
	Obligations: "Obligations",
	PosTerminals: "PosTerminals",
	PosSessions: "PosSessions",

	// Items
	Items: "Items",
	Brands: "Brands",
	Categories: "Categories",
	ItemsSettlements: "ItemsSettlements",
	ItemTransfers: "ItemTransfers",
	Stocktakings: "Stocktakings",
	CostAdjustments: "CostAdjustments",

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