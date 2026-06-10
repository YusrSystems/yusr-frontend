import { type Signal } from "@preact/signals-react";
import { ChangeableEntity, type ChangeableEntityMode, City, CityDto, Dto, i18n, ValidatableEntity, Validators } from "yusr-ui";

export const AccountType = {
  Client: 1,
  Supplier: 2,
  Employee: 3,
  Bank: 4,
  Box: 5
} as const;

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

export class AccountContact extends ValidatableEntity<AccountContactDto>
{
  declare accountId: Signal<number>;
  declare number: Signal<string>;

  constructor(dto: Partial<AccountContactDto>)
  {
    super(dto, [{
      field: "number",
      selector: (d) => d.number,
      validators: [Validators.exactLength(10, i18n.t("accounting:accounts.contactNumberLength"))]
    }]);
  }
}

export class Account extends ChangeableEntity<AccountDto>
{
  declare type: Signal<number>;
  declare name: Signal<string>;
  declare initialBalance: Signal<number>;
  declare balance: Signal<number>;
  declare vatNumber: Signal<string | undefined>;
  declare crn: Signal<string | undefined>;
  declare parentId: Signal<number | undefined>;
  declare parentName: Signal<string | undefined>;
  declare bankAccountNumber: Signal<string | undefined>;
  declare cityId: Signal<number | undefined>;
  declare cityName: Signal<string | undefined>;
  declare city: Signal<City | undefined>;
  declare street: Signal<string | undefined>;
  declare district: Signal<string | undefined>;
  declare buildingNumber: Signal<string | undefined>;
  declare postalCode: Signal<string | undefined>;
  declare notes: Signal<string | undefined>;
  declare accountContacts: Signal<AccountContact[]>;

  constructor(dto: Partial<AccountDto>, mode: ChangeableEntityMode = "create")
  {
    super(
      {
        id: dto?.id ?? 0,
        type: dto?.type ?? 0,
        name: dto?.name ?? "",
        initialBalance: dto?.initialBalance ?? 0,
        balance: dto?.balance ?? 0,
        vatNumber: dto?.vatNumber,
        crn: dto?.crn,
        parentId: dto?.parentId,
        parentName: dto?.parentName,
        bankAccountNumber: dto?.bankAccountNumber,
        cityId: dto?.cityId,
        cityName: dto?.city?.name,
        city: dto?.city,
        street: dto?.street,
        district: dto?.district,
        buildingNumber: dto?.buildingNumber,
        postalCode: dto?.postalCode,
        notes: dto?.notes,
        accountContacts: (dto.accountContacts ?? [{ id: 0, accountId: dto?.id ?? 0, number: "" } as AccountContactDto])
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
