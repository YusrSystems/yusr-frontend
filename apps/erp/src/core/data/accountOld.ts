import { type TFunction } from "i18next";
import { BaseEntity, CityOld, createGenericDialogSlice, createGenericEntitySlice, createGenericFormSlice, FilterByTypeRequest, type ValidationRuleOld, Validators } from "yusr-ui";
import { SystemPermissionsResources } from "../auth/systemPermissionsResources";
import AccountsApiServiceOld from "../networking/accountApiServiceOld";

export const AccountType = {
  Client: 1,
  Supplier: 2,
  Employee: 3,
  Bank: 4,
  Box: 5
} as const;

export type AccountType = (typeof AccountType)[keyof typeof AccountType];

export const accountTypeToResource: Record<AccountType, string> = {
  [AccountType.Client]: SystemPermissionsResources.AccountClient,
  [AccountType.Supplier]: SystemPermissionsResources.AccountSupplier,
  [AccountType.Employee]: SystemPermissionsResources.AccountEmployee,
  [AccountType.Bank]: SystemPermissionsResources.AccountBank,
  [AccountType.Box]: SystemPermissionsResources.AccountBox
};

export class AccountContactOld extends BaseEntity
{
  public accountId!: number;
  public number!: string;

  constructor(init?: Partial<AccountContactOld>)
  {
    super();
    Object.assign(this, init);
  }
}

export default class AccountOld extends BaseEntity
{
  public type!: AccountType;
  public name!: string;
  public initialBalance!: number;
  public balance!: number;
  public vatNumber?: string;
  public crn?: string;
  public parentId?: number;
  public parentName?: string;
  public bankAccountNumber?: string;
  public cityId?: number;
  public city?: CityOld;
  public street?: string;
  public district?: string;
  public buildingNumber?: string;
  public postalCode?: string;
  public notes?: string;
  public accountContacts: AccountContactOld[] = [];

  constructor(init?: Partial<AccountOld>)
  {
    super();
    Object.assign(this, init);
    if (init?.accountContacts)
    {
      this.accountContacts = init.accountContacts.map(
        (c) => new AccountContactOld(c)
      );
    }
  }
}

export class AccountValidationRules
{
  public static validationRules = (t: TFunction<"accounting">): ValidationRuleOld<Partial<AccountOld>>[] => [{
    field: "name",
    selector: (d) => d.name,
    validators: [Validators.required(t("accounts.nameRequired"))]
  }, {
    field: "type",
    selector: (d) => d.type,
    validators: [Validators.required(t("accounts.typeRequired"))]
  }, {
    field: "buildingNumber",
    selector: (d) => d.buildingNumber,
    validators: [Validators.optional(
      Validators.exactLength(4, t("accounts.buildingNumberLength")),
      Validators.numeric(t("accounts.buildingNumberNumeric"))
    )]
  }, {
    field: "postalCode",
    selector: (d) => d.postalCode,
    validators: [Validators.optional(
      Validators.exactLength(5, t("accounts.postalCodeLength")),
      Validators.numeric(t("accounts.postalCodeNumeric"))
    )]
  }];
}

export type AccountSliceType = ReturnType<typeof AccountSlice.create>;

export class AccountSlice
{
  static create(sliceName: string, types: AccountType[])
  {
    const entitySliceInstance = createGenericEntitySlice(
      sliceName,
      new AccountsApiServiceOld(),
      (pageNumber, rowsPerPage, searchText) =>
        new AccountsApiServiceOld().FilterByTypes(
          pageNumber,
          rowsPerPage,
          new FilterByTypeRequest({ types, searchText })
        )
    );

    const dialogSliceInstance = createGenericDialogSlice<AccountOld>(
      sliceName + "Dialog"
    );
    const formSliceInstance = createGenericFormSlice<AccountOld>(
      sliceName + "Form"
    );

    return {
      entityActions: entitySliceInstance.actions,
      entityReducer: entitySliceInstance.reducer,
      dialogActions: dialogSliceInstance.actions,
      dialogReducer: dialogSliceInstance.reducer,
      formActions: formSliceInstance.actions,
      formReducer: formSliceInstance.reducer
    };
  }
}

export const ClientsSlice = AccountSlice.create("clients", [AccountType.Client]);
export const SuppliersSlice = AccountSlice.create("suppliers", [AccountType.Supplier]);
export const EmployeesSlice = AccountSlice.create("employees", [AccountType.Employee]);
export const BanksSlice = AccountSlice.create("banks", [AccountType.Bank]);
export const BoxesSlice = AccountSlice.create("boxes", [AccountType.Box]);
export const BanksAndBoxesSlice = AccountSlice.create("banksAndBoxes", [AccountType.Box, AccountType.Bank]);
export const ClientsAndSuppliersSlice = AccountSlice.create(
  "clientsAndSuppliers",
  [AccountType.Client, AccountType.Supplier]
);
