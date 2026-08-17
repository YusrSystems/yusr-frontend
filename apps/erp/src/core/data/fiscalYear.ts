import { Signal } from "@preact/signals-react";
import { ChangeableEntity, ChangeableEntityMode, DateService, Dto, Validators } from "yusr-ui";
import { AccountClass } from "@/core/data/account.ts";


export enum FiscalYearStatus
{
	Open = 1,
	Locked = 2,
	Closed = 3
}

export enum FiscalPeriodStatus
{
	Open = 1,
	Locked = 2
}

export class FiscalPeriodDto extends Dto
{
	public fiscalYearId!: number;
	public periodNumber!: number;
	public name!: string;
	public startDate!: string;
	public endDate!: string;
	public status!: FiscalPeriodStatus;
	public rowVer!: number;
}

export class FiscalYearDto extends Dto
{
	public name!: string;
	public startDate!: string;
	public endDate!: string;
	public status!: FiscalYearStatus;
	public closingJournalEntryId?: number;
	public closingNotes?: string;
	public closedAt?: string;
	public closedBy?: number;
	public rowVer!: number;
	public periods: FiscalPeriodDto[] = [];
}

export class FiscalYearStatusUpdateDto
{
	public fiscalYearId!: number;
	public status!: FiscalYearStatus;
	public rowVer!: number;
}

export class CloseFiscalYearDto
{
	public fiscalYearId!: number;
	public closingNotes?: string;
	public rowVer!: number;
}

export class ReopenFiscalYearDto
{
	public fiscalYearId!: number;
	public rowVer!: number;
}

export class FiscalPeriodStatusUpdateDto
{
	public periodId!: number;
	public status!: FiscalPeriodStatus;
	public rowVer!: number;
}

export class NominalAccountClosingPreviewDto
{
	public glAccountId!: number;
	public accountName!: string;
	public accountClass!: AccountClass;
	public balance!: number;
	public debitAdjustment!: number;
	public creditAdjustment!: number;
}

export class YearEndClosingPreviewDto
{
	public fiscalYearId!: number;
	public fiscalYearName!: string;
	public startDate!: string;
	public endDate!: string;
	public totalRevenue!: number;
	public totalExpense!: number;
	public netIncome!: number;
	public isProfit!: boolean;
	public accountsToClose: NominalAccountClosingPreviewDto[] = [];
	public blockingIssues: string[] = [];
	public canClose!: boolean;
}

export class FiscalYear extends ChangeableEntity<FiscalYearDto>
{
	public name: Signal<string>;
	public startDate: Signal<string>;
	public endDate: Signal<string>;
	public status: Signal<FiscalYearStatus>;
	public rowVer: Signal<number>;

	constructor(dto?: Partial<FiscalYearDto>, mode: ChangeableEntityMode = ChangeableEntityMode.Create)
	{
		super(
			dto,
			[
				{
					field: "name",
					selector: (d) => d.name,
					validators: [Validators.required("اسم السنة المالية مطلوب")]
				},
				{
					field: "startDate",
					selector: (d) => d.startDate,
					validators: [Validators.required("تاريخ البداية مطلوب")]
				},
				{
					field: "endDate",
					selector: (d) => d.endDate,
					validators: [Validators.required("تاريخ النهاية مطلوب")]
				}
			],
			mode
		);

		const now = new Date();
		const currentYear = now.getFullYear();

		this.name = this.assign("name", dto?.name ?? currentYear.toString());
		this.startDate = this.assign(
			"startDate",
			dto?.startDate ?? DateService.formatDateOnly(new Date(currentYear, 0, 1))
		);
		this.endDate = this.assign(
			"endDate",
			dto?.endDate ?? DateService.formatDateOnly(new Date(currentYear, 11, 31))
		);
		this.status = this.assign("status", dto?.status ?? FiscalYearStatus.Open);
		this.rowVer = this.assign("rowVer", dto?.rowVer ?? 0);
	}
}
