import { type Signal } from "@preact/signals-react";
import { ChangeableEntity, ChangeableEntityMode, CityDto, Dto, i18n, Validators } from "yusr-ui";


export enum PartnerType
{
	Customer,
	Supplier
}

export class PartnerDto extends Dto
{
	public name!: string;
	public type!: PartnerType;
	public vatNumber?: string;
	public crn?: string;
	public phone?: string;
	public mobile?: string;
	public notes?: string;
	public openingBalance: number = 0;
	public balance: number = 0;
	public overrideGlAccountId?: number;
	public overrideGlAccountName?: string;
	public cityId?: number;
	public cityName?: string;
	public street?: string;
	public district?: string;
	public buildingNumber?: string;
	public postalCode?: string;

	public city?: CityDto;
}

export class Partner extends ChangeableEntity<PartnerDto>
{
	public name: Signal<string>;
	public type: Signal<PartnerType>;
	public vatNumber: Signal<string | undefined>;
	public crn: Signal<string | undefined>;
	public phone: Signal<string | undefined>;
	public mobile: Signal<string | undefined>;
	public notes: Signal<string | undefined>;
	public openingBalance: Signal<number>;
	public balance: Signal<number>;
	public overrideGlAccountId: Signal<number | undefined>;
	public overrideGlAccountName: Signal<string | undefined>;
	public cityId: Signal<number | undefined>;
	public cityName: Signal<string | undefined>;
	public street: Signal<string | undefined>;
	public district: Signal<string | undefined>;
	public buildingNumber: Signal<string | undefined>;
	public postalCode: Signal<string | undefined>;

	public city: Signal<CityDto | undefined>;

	constructor(dto: Partial<PartnerDto> | undefined, mode: ChangeableEntityMode = ChangeableEntityMode.Create)
	{
		super(dto, [
			{
				field: "name",
				selector: (d) => d.name,
				validators: [
					Validators.required(i18n.t("accounting:partners.nameRequired", "اسم الجهة مطلوب")),
					Validators.maxLength(150, i18n.t("accounting:partners.nameMax", "يجب ألا يتجاوز الاسم 150 حرف"))
				]
			},
			{
				field: "type",
				selector: (d) => d.type,
				validators: [Validators.required(i18n.t("accounting:partners.typeRequired", "نوع الجهة مطلوب"))]
			},
			{
				field: "vatNumber",
				selector: (d) => d.vatNumber,
				validators: [
					Validators.optional(
						Validators.maxLength(20, i18n.t("accounting:partners.vatLength", "الرقم الضريبي يجب ألا يتجاوز 20 خانة")),
						Validators.numeric(i18n.t("accounting:partners.vatNumeric", "الرقم الضريبي يجب أن يحتوي على أرقام فقط"))
					)
				]
			},
			{
				field: "crn",
				selector: (d) => d.crn,
				validators: [
					Validators.optional(
						Validators.maxLength(10, i18n.t("accounting:partners.crnLength", "السجل التجاري يجب ألا يتجاوز 10 خانات")),
						Validators.numeric(i18n.t("accounting:partners.crnNumeric", "السجل التجاري يجب أن يحتوي على أرقام فقط"))
					)
				]
			},
			{
				field: "buildingNumber",
				selector: (d) => d.buildingNumber,
				validators: [
					Validators.optional(
						Validators.exactLength(4, i18n.t("accounting:partners.buildingLength", "رقم المبنى يجب أن يكون 4 خانات")),
						Validators.numeric(i18n.t("accounting:partners.buildingNumeric", "رقم المبنى يجب أن يحتوي على أرقام فقط"))
					)
				]
			},
			{
				field: "postalCode",
				selector: (d) => d.postalCode,
				validators: [
					Validators.optional(
						Validators.exactLength(5, i18n.t("accounting:partners.postalLength", "الرمز البريدي يجب أن يكون 5 خانات")),
						Validators.numeric(i18n.t("accounting:partners.postalNumeric", "الرمز البريدي يجب أن يحتوي على أرقام فقط"))
					)
				]
			},
			{
				field: "openingBalance",
				selector: (d) => d.openingBalance,
				validators: [
					Validators.min(0, i18n.t("accounting:partners.openingBalanceMin", "الرصيد الافتتاحي لا يمكن أن يكون سالباً"))
				]
			},
			{
				field: "notes",
				selector: (d) => d.notes,
				validators: [
					Validators.optional(Validators.maxLength(500, i18n.t("accounting:partners.notesMax", "يجب ألا تتجاوز الملاحظات 500 حرف")))
				]
			}
		], mode);

		this.name = this.assign("name", dto?.name ?? "");
		this.type = this.assign("type", dto?.type ?? PartnerType.Customer);
		this.vatNumber = this.assign("vatNumber", dto?.vatNumber);
		this.crn = this.assign("crn", dto?.crn);
		this.phone = this.assign("phone", dto?.phone);
		this.mobile = this.assign("mobile", dto?.mobile);
		this.notes = this.assign("notes", dto?.notes);
		this.openingBalance = this.assign("openingBalance", dto?.openingBalance ?? 0);
		this.balance = this.assign("balance", dto?.balance ?? 0);
		this.overrideGlAccountId = this.assign("overrideGlAccountId", dto?.overrideGlAccountId);
		this.overrideGlAccountName = this.assign("overrideGlAccountName", dto?.overrideGlAccountName);
		this.cityId = this.assign("cityId", dto?.cityId);
		this.cityName = this.assign("cityName", dto?.cityName);
		this.street = this.assign("street", dto?.street);
		this.district = this.assign("district", dto?.district);
		this.buildingNumber = this.assign("buildingNumber", dto?.buildingNumber);
		this.postalCode = this.assign("postalCode", dto?.postalCode);
		this.city = this.assign("city", dto?.city);
	}
}