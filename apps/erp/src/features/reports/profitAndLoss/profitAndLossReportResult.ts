import { AccountType } from "@/core/data/account.ts";
import type { InvoiceType } from "@/core/types/invoiceType.ts";


export enum AccountOrStoreType
{
	Store = 0,
	Account = 1
}

export interface ProfitAndLossRow
{
	id: number;
	invoiceId: number;
	invoiceType: InvoiceType;
	invoiceDate: string;

	fromId?: number;
	fromName?: string;
	fromType: AccountOrStoreType;
	fromAccountType?: AccountType;

	toId?: number;
	toName?: string;
	toType: AccountOrStoreType;
	toAccountType?: AccountType;

	taxAmount: number;
	quantity: number;
	cost: number;
	amount: number;
	profit: number;
}

export interface ProfitAndLossReportResult
{
	invoiceListRows: ProfitAndLossRow[];
	fromDate?: string;
	toDate?: string;

	pageNumber: number;
	rowsPerPage: number;
	totalCount: number;
}