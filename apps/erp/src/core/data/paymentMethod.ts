import type { Signal } from "@preact/signals-react";
import { ChangeableEntity, ChangeableEntityMode, Dto, i18n, Validators } from "yusr-ui";
import { PaymentMethodCategory } from "@/core/types/paymentMethodCategory.ts";


export enum CommissionType
{
	Percent = 1,
	Amount = 2
}

export class PaymentMethodDto extends Dto
{
	name!: string;
	glAccountId!: number;
	glAccountName!: string;
	commissionType!: CommissionType;
	commissionAmount!: number;
	category!: PaymentMethodCategory;
}

export class PaymentMethod extends ChangeableEntity<PaymentMethodDto>
{
	public name: Signal<string>;
	public glAccountId: Signal<number | undefined>;
	public glAccountName: Signal<string | undefined>;
	public commissionType: Signal<CommissionType>;
	public commissionAmount: Signal<number>;
	public category: Signal<PaymentMethodCategory>;

	constructor(dto: Partial<PaymentMethodDto> | undefined, mode: ChangeableEntityMode = ChangeableEntityMode.Create)
	{
		super(dto, [{
			field: "name",
			selector: (d) => d.name,
			validators: [Validators.required(i18n.t("accounting:paymentMethods.nameRequired"))]
		}, {
			field: "glAccountId",
			selector: (d) => d.glAccountId,
			validators: [Validators.required(i18n.t("accounting:paymentMethods.accountRequired", "الحساب مطلوب"))]
		}, {
			field: "commissionType",
			selector: (d) => d.commissionType,
			validators: [Validators.required(i18n.t("accounting:paymentMethods.commissionTypeRequired"))]
		}, {
			field: "commissionAmount",
			selector: (d) => d.commissionAmount,
			validators: [Validators.required(i18n.t("accounting:paymentMethods.commissionValueRequired"))]
		}, {
			field: "category",
			selector: (d) => d.category,
			validators: [Validators.required("التصنيف مطلوب")]
		}], mode);

		this.name = this.assign("name", dto?.name ?? "");
		this.glAccountId = this.assign("glAccountId", dto?.glAccountId);
		this.glAccountName = this.assign("glAccountName", dto?.glAccountName);
		this.commissionType = this.assign("commissionType", dto?.commissionType ?? CommissionType.Percent);
		this.commissionAmount = this.assign("commissionAmount", dto?.commissionAmount ?? 0);
		this.category = this.assign("category", dto?.category ?? PaymentMethodCategory.Cash);
	}
}