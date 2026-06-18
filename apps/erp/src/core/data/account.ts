import { type Signal } from "@preact/signals-react";
import { ChangeableEntity, ChangeableEntityMode, City, CityDto, Dto, i18n, Validators } from "yusr-ui";


export const AccountType = {
	Client: 1,
	Supplier: 2,
	Employee: 3,
	Bank: 4,
	Box: 5
} as const;

export type AccountType = (typeof AccountType)[keyof typeof AccountType];

export class AccountContactDto extends Dto
{
	public accountId!: number;
	public number: string = "";
}

export class AccountDto extends Dto
{
	public type: number = 0;
	public name: string = "";
	public initialBalance: number = 0;
	public balance: number = 0;
	public vatNumber?: string;
	public crn?: string;
	public parentId?: number;
	public parentName?: string;
	public bankAccountNumber?: string;
	public cityId?: number;
	public cityName?: string;

	public city?: CityDto;
	public street?: string;
	public district?: string;
	public buildingNumber?: string;
	public postalCode?: string;
	public notes?: string;
	public accountContacts: AccountContactDto[] = [];
}

export class AccountContact extends ChangeableEntity<AccountContactDto>
{
	public accountId: Signal<number>;
	public number: Signal<string>;

	constructor(dto?: Partial<AccountContactDto>)
	{
		super(dto, [{
			field: "number",
			selector: (d) => d.number,
			validators: [Validators.custom(
				(number: string) =>
				{
					return !(number.length > 0 && number.length !== 10);
				},
				i18n.t("accounting:accounts.contactNumberLength")
			)]
		}], ChangeableEntityMode.Create);

		this.accountId = this.assign("accountId", dto?.accountId ?? 0);
		this.number = this.assign("number", dto?.number ?? 0);
	}
}

export class Account extends ChangeableEntity<AccountDto, ChangeableEntityMode>
{
	public type: Signal<number>;
	public name: Signal<string>;
	public initialBalance: Signal<number>;
	public balance: Signal<number>;
	public vatNumber: Signal<string | undefined>;
	public crn: Signal<string | undefined>;
	public parentId: Signal<number | undefined>;
	public parentName: Signal<string | undefined>;
	public bankAccountNumber: Signal<string | undefined>;
	public cityId: Signal<number | undefined>;
	public cityName: Signal<string | undefined>;
	public city: Signal<City | undefined>;
	public street: Signal<string | undefined>;
	public district: Signal<string | undefined>;
	public buildingNumber: Signal<string | undefined>;
	public postalCode: Signal<string | undefined>;
	public notes: Signal<string | undefined>;
	public accountContacts: Signal<AccountContact[]>;

	constructor(dto: Partial<AccountDto> | undefined, mode: ChangeableEntityMode = ChangeableEntityMode.Create)
	{
		super(
			{
				...dto,
				accountContacts: (dto?.accountContacts ?? [{
					id: 0,
					accountId: dto?.id ?? 0,
					number: ""
				} as AccountContactDto])
					.map((t) => t instanceof AccountContact ? t : new AccountContact(t)) as unknown[] as AccountContactDto[]
			},
			[{
				field: "type",
				selector: (d) => d.type,
				validators: [Validators.required(i18n.t("accounting:accounts.typeRequired"))]
			}, {
				field: "name",
				selector: (d) => d.name,
				validators: [Validators.required(i18n.t("accounting:accounts.nameRequired"))]
			}, {
				field: "buildingNumber",
				selector: (d) => d.buildingNumber,
				validators: [Validators.optional(
					Validators.exactLength(4, i18n.t("accounting:accounts.buildingNumberLength")),
					Validators.numeric(i18n.t("accounting:accounts.buildingNumberNumeric"))
				)]
			}, {
				field: "postalCode",
				selector: (d) => d.postalCode,
				validators: [Validators.optional(
					Validators.exactLength(5, i18n.t("accounting:accounts.postalCodeLength")),
					Validators.numeric(i18n.t("accounting:accounts.postalCodeNumeric"))
				)]
			}],
			mode
		);

		this.type = this.assign("type", dto?.type ?? 0);
		this.name = this.assign("name", dto?.name ?? "");
		this.initialBalance = this.assign("initialBalance", dto?.initialBalance ?? 0);
		this.balance = this.assign("balance", dto?.balance ?? 0);
		this.vatNumber = this.assign("vatNumber", dto?.vatNumber);
		this.crn = this.assign("crn", dto?.crn);
		this.parentId = this.assign("parentId", dto?.parentId);
		this.parentName = this.assign("parentName", dto?.parentName);
		this.bankAccountNumber = this.assign("bankAccountNumber", dto?.bankAccountNumber);
		this.cityId = this.assign("cityId", dto?.cityId);
		this.cityName = this.assign("cityName", dto?.cityName);
		this.city = this.assign("city", dto?.city);
		this.street = this.assign("street", dto?.street);
		this.district = this.assign("district", dto?.district);
		this.buildingNumber = this.assign("buildingNumber", dto?.buildingNumber);
		this.postalCode = this.assign("postalCode", dto?.postalCode);
		this.notes = this.assign("notes", dto?.notes);
		const accountContactsList = (dto?.accountContacts ?? []).map((t) => new AccountContact(t));

		this.accountContacts = this.assign("accountContacts", accountContactsList);

		const checkChildren = () =>
		{
			this.hasChanges.value = this.accountContacts.value.some((m) => m.hasChanges.value);
		};
		this.accountContacts.value.forEach((t) => t.hasChanges.subscribe(checkChildren));
	}

	override validate(dto?: Partial<AccountDto>): boolean
	{
		if (!super.validate(dto))
		{
			return false;
		}
		return this.accountContacts.value.every((c) => c.validate());
	}
}
