import type { Signal } from "@preact/signals-react";
import { ChangeableEntity, ChangeableEntityMode, Dto, i18n, Validators } from "yusr-ui";


export const CommissionType = {
	Percent: 1,
	Amount: 2
} as const;

export type CommissionType = typeof CommissionType[keyof typeof CommissionType];

export class PaymentMethodDto extends Dto
{
	name!: string;
	accountId!: number;
	accountName!: string;
	commissionType!: CommissionType;
	commissionAmount!: number;
}

export class PaymentMethod extends ChangeableEntity<PaymentMethodDto>
{
	public name: Signal<string>;
	public accountId: Signal<number>;
	public accountName: Signal<string>;
	public commissionType: Signal<CommissionType>;
	public commissionAmount: Signal<number>;

	constructor(dto: Partial<PaymentMethodDto> | undefined, mode: ChangeableEntityMode = ChangeableEntityMode.Create)
	{
		super(dto, [{
			field: "name",
			selector: (d) => d.name,
			validators: [Validators.required(i18n.t("accounting:paymentMethods.nameRequired"))]
		}, {
			field: "accountId",
			selector: (d) => d.accountId,
			validators: [Validators.required(i18n.t("accounting:paymentMethods.accountRequired"))]
		}, {
			field: "commissionType",
			selector: (d) => d.commissionType,
			validators: [Validators.required(i18n.t("accounting:paymentMethods.commissionTypeRequired"))]
		}, {
			field: "commissionAmount",
			selector: (d) => d.commissionAmount,
			validators: [Validators.required(i18n.t("accounting:paymentMethods.commissionValueRequired"))]
		}], mode);

		this.name = this.assign("name", dto?.name ?? "");
		this.accountId = this.assign("accountId", dto?.accountId ?? 0);
		this.accountName = this.assign("accountName", dto?.accountName ?? "");
		this.commissionType = this.assign("commissionType", dto?.commissionType ?? CommissionType.Percent);
		this.commissionAmount = this.assign("commissionAmount", dto?.commissionAmount ?? 0);
	}
}
