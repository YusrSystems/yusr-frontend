import { Dto } from "yusr-ui";
import { PosSessionStatus } from "../types/posSessionStatus";
import { PaymentMethodCategory } from "../types/paymentMethodCategory";


export interface PosSessionCloseDto
{
	posSessionId: number;
	closingCash: number;
	closingNotes?: string;
	rowVer: number;
}

export class PosPaymentSummaryDto
{
	public paymentMethodId!: number;
	public paymentMethodName!: string;
	public category!: PaymentMethodCategory;
	public totalAmount!: number;
	public transactionCount!: number;
}

export class PosSessionDto extends Dto
{
	public posTerminalId!: number;
	public posTerminalName!: string;
	public storeId!: number;
	public storeName!: string;
	public branchId!: number;
	public branchName!: string;
	public cashierUserId!: number;
	public cashierUsername!: string;

	public status!: PosSessionStatus;
	public openedAt!: string;
	public closedAt?: string;

	public openingCash!: number;
	public closingCash!: number;
	public expectedCash!: number;
	public cashDifference!: number;

	public openingNotes?: string;
	public closingNotes?: string;
	public rowVer!: number;

	public totalSales!: number;
	public totalSalesReturns!: number;
	public totalNetSales!: number;
	public totalTaxAmount!: number;
	public transactionsCount!: number;

	public paymentSummaries: PosPaymentSummaryDto[] = [];
}