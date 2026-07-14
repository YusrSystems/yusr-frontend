import type { InvoiceType } from "@/core/types/invoiceType.ts";
import type { AccountType } from "@/core/data/account.ts";
import type { AccountOrStoreType } from "@/features/reports/itemStatement/itemStatementReportResult.ts";


export interface ItemTaxStatementRow
{
	id: number;
	date: string;

	invoiceId: number;
	invoiceType: InvoiceType;

	itemId: number;
	itemName: string;

	from: string;
	fromId: number;
	fromType: AccountOrStoreType;
	fromAccountType?: AccountType;

	to: string;
	toId: number;
	toType: AccountOrStoreType;
	toAccountType?: AccountType;

	tax: number;
	quantity: number;
	amount: number;
}

export interface ItemsTaxStatementReportResult
{
	fromDate?: string;
	toDate?: string;
	itemTaxStatementRows: ItemTaxStatementRow[];

	pageNumber: number;
	rowsPerPage: number;
	totalCount: number;
}