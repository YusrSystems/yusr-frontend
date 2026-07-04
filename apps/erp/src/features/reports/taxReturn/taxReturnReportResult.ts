export interface TaxReturnReportResult
{
	fromDate: string;
	toDate: string;

	salesLocal15NoTax: number;
	salesLocal15Tax: number;
	salesLocal15ReturnsNoTax: number;
	salesLocal15ReturnsTax: number;

	salesLocal0NoTax: number;
	salesLocal0Tax: number;
	salesLocal0ReturnsNoTax: number;
	salesLocal0ReturnsTax: number;

	exportNoTax: number;
	exportTax: number;
	exportReturnsNoTax: number;
	exportReturnsTax: number;

	salesExemptNoTax: number;
	salesExemptTax: number;
	salesExemptReturnsNoTax: number;
	salesExemptReturnsTax: number;

	purchLocal15NoTax: number;
	purchLocal15Tax: number;
	purchLocal15ReturnsNoTax: number;
	purchLocal15ReturnsTax: number;

	importPaidNoTax: number;
	importPaidTax: number;
	importPaidReturnsNoTax: number;
	importPaidReturnsTax: number;

	importReverseChargeNoTax: number;
	importReverseChargeTax: number;
	importReverseChargeReturnsNoTax: number;
	importReverseChargeReturnsTax: number;

	purch0NoTax: number;
	purch0Tax: number;
	purch0ReturnsNoTax: number;
	purch0ReturnsTax: number;

	purchExemptNoTax: number;
	purchExemptTax: number;
	purchExemptReturnsNoTax: number;
	purchExemptReturnsTax: number;
}