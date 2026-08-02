import type { TFunction } from "i18next";


export enum ProfitAndLossRowDocumentType
{
	Sell = 1,
	SellReturn = 2,
	Payment = 3
}

export interface SalesProfitabilityLine
{
	id: number;
	documentId: number;
	documentType: ProfitAndLossRowDocumentType;
	date: string;
	partnerName: string;
	glAccountName: string;
	description?: string;
	salesAmount: number;
	cogsAmount: number;
	directCostsAmount: number;
	netProfit: number;
}

export interface SalesProfitabilityReportResult
{
	fromDate: string;
	toDate: string;
	lines: SalesProfitabilityLine[];
	totalCount: number;
	pageTotalSales: number;
	pageTotalCogs: number;
	pageTotalDirectCosts: number;
	pageNetProfit: number;
	pageNumber: number;
	rowsPerPage: number;
}

export function getProfitAndLossRowDocumentTypeName(type: ProfitAndLossRowDocumentType, t: TFunction<"accounting">): string
{
	switch (type)
	{
		case ProfitAndLossRowDocumentType.Sell:
			return t("invoices.sellInvoice");
		case ProfitAndLossRowDocumentType.SellReturn:
			return t("invoices.sellReturn");
		case ProfitAndLossRowDocumentType.Payment:
			return t("vouchers.paymentVoucher");
		default:
			return "Unknown";
	}
}

export function getProfitAndLossRowDocumentRoute(type: ProfitAndLossRowDocumentType): string | undefined
{
	switch (type)
	{
		case ProfitAndLossRowDocumentType.Sell:
		case ProfitAndLossRowDocumentType.SellReturn:
			return "sales";
		case ProfitAndLossRowDocumentType.Payment:
			return "vouchers";
		default:
			return undefined;
	}
}