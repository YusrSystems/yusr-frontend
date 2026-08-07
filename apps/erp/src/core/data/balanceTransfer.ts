import { type Signal } from "@preact/signals-react";
import {
	ChangeableEntity,
	ChangeableEntityMode,
	DateService,
	Dto,
	i18n,
	type IStatusWorkflowEntity,
	Validators
} from "yusr-ui";
import { type IStatusWorkflowDto, TransactionStatus } from "#/types/transactionStatus.ts";
import type { IRowVerDto, IRowVerEntity } from "#/types/rowVer.ts";


export class BalanceTransferDto extends Dto implements IStatusWorkflowDto, IRowVerDto
{
	public description?: string;
	public date!: string;
	public amount!: number;
	public fromGlAccountId!: number;
	public toGlAccountId!: number;
	public fromGlAccountName?: string;
	public toGlAccountName?: string;
	public rowVer!: number;
	public transactionStatus: TransactionStatus = TransactionStatus.Draft;
}

export class BalanceTransfer extends ChangeableEntity<BalanceTransferDto> implements IStatusWorkflowEntity, IRowVerEntity
{
	public description: Signal<string | undefined>;
	public date: Signal<string>;
	public amount: Signal<number>;
	public fromGlAccountId: Signal<number>;
	public toGlAccountId: Signal<number>;
	public fromGlAccountName: Signal<string | undefined>;
	public toGlAccountName: Signal<string | undefined>;
	public rowVer: Signal<number>;
	public transactionStatus: Signal<TransactionStatus>;

	constructor(dto?: Partial<BalanceTransferDto>, mode: ChangeableEntityMode = ChangeableEntityMode.Create)
	{
		super(dto, [{
			field: "amount",
			selector: (d) => d.amount,
			validators: [
				Validators.required(i18n.t("accounting:balanceTransfers.amountRequired", "المبلغ مطلوب")),
				Validators.min(0.01, i18n.t("accounting:balanceTransfers.amountMin", "المبلغ يجب أن يكون أكبر من الصفر"))
			]
		},
			{
				field: "fromGlAccountId",
				selector: (d) => d.fromGlAccountId,
				validators: [
					Validators.required(i18n.t("accounting:balanceTransfers.fromAccountRequired", "حساب الصادر مطلوب"))
				]
			},
			{
				field: "toGlAccountId",
				selector: (d) => d.toGlAccountId,
				validators: [
					Validators.required(i18n.t("accounting:balanceTransfers.toAccountRequired", "حساب الوارد مطلوب"))
				]
			},
			{
				field: "description",
				selector: (d) => d.description,
				validators: [
					Validators.optional(Validators.maxLength(500, i18n.t("accounting:balanceTransfers.descMax", "يجب ألا يتجاوز البيان 500 حرف")))
				]
			}
		], mode);

		this.description = this.assign("description", dto?.description);
		this.date = this.assign("date", dto?.date ?? DateService.formatDateOnly(new Date()));
		this.amount = this.assign("amount", dto?.amount);
		this.fromGlAccountId = this.assign("fromGlAccountId", dto?.fromGlAccountId);
		this.toGlAccountId = this.assign("toGlAccountId", dto?.toGlAccountId);
		this.fromGlAccountName = this.assign("fromGlAccountName", dto?.fromGlAccountName);
		this.toGlAccountName = this.assign("toGlAccountName", dto?.toGlAccountName);
		this.rowVer = this.assign("rowVer", dto?.rowVer);
		this.transactionStatus = this.assign("transactionStatus", dto?.transactionStatus ?? TransactionStatus.Draft);
	}
}