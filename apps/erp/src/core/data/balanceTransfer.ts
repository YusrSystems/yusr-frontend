import { type Signal } from "@preact/signals-react";
import { ChangeableEntity, ChangeableEntityMode, DateService, Dto, i18n, Validators } from "yusr-ui";


export class BalanceTransferDto extends Dto
{
	public description?: string;
	public date!: string;
	public amount!: number;
	public fromGlAccountId!: number;
	public toGlAccountId!: number;
	public fromGlAccountName?: string;
	public toGlAccountName?: string;
	public isDeleted: boolean = false;
}

export class BalanceTransfer extends ChangeableEntity<BalanceTransferDto>
{
	public description: Signal<string | undefined>;
	public date: Signal<string>;
	public amount: Signal<number>;
	public fromGlAccountId: Signal<number>;
	public toGlAccountId: Signal<number>;
	public fromGlAccountName: Signal<string | undefined>;
	public toGlAccountName: Signal<string | undefined>;
	public isDeleted: Signal<boolean>;

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
					Validators.required(i18n.t("accounting:balanceTransfers.fromAccountRequired", "حساب الصادر مطلوب")),
					Validators.custom((val, form) =>
					{
						return Number(val) !== Number(form.toGlAccountId);
					}, i18n.t("accounting:balanceTransfers.sameAccountError", "يجب أن يكون حساب الصادر وحساب الوارد مختلفين"))
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
		this.amount = this.assign("amount", dto?.amount ?? 0);
		this.fromGlAccountId = this.assign("fromGlAccountId", dto?.fromGlAccountId ?? 0);
		this.toGlAccountId = this.assign("toGlAccountId", dto?.toGlAccountId ?? 0);
		this.fromGlAccountName = this.assign("fromGlAccountName", dto?.fromGlAccountName);
		this.toGlAccountName = this.assign("toGlAccountName", dto?.toGlAccountName);
		this.isDeleted = this.assign("isDeleted", dto?.isDeleted ?? false);
	}
}