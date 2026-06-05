import type { TFunction } from "i18next";
import { type Branch, CityOld, createGenericFormSlice, type Currency, type StorageFile, type ValidationRuleOld, Validators } from "yusr-ui";
import type { TaxOld } from "./tax";

export const EInvoicingEnvironmentType = {
  Production: 0,
  Simulation: 1,
  Test: 2,
  NotRegistered: 3
} as const;

export type EInvoicingEnvironmentType = typeof EInvoicingEnvironmentType[keyof typeof EInvoicingEnvironmentType];

export const InvoicePrintSize = {
  A4: 0,
  ThermalPrinter: 1
} as const;

export type InvoicePrintSize = typeof InvoicePrintSize[keyof typeof InvoicePrintSize];

export class SettingOld
{
  public registrationKey!: string;
  public email!: string;
  public companyName!: string;
  public companyPhone!: string;
  public companyBusinessCategory?: string;
  public crn?: string;
  public vatNumber?: string;

  public currencyId!: number;
  public currency?: Currency;

  public logo?: StorageFile;

  public startDate!: Date;
  public endDate!: Date;

  public branchId!: number;
  public branch?: Branch;

  public mainTaxId!: number;
  public mainTax?: TaxOld;

  public sellAccountId?: number;
  public sellAccountName?: string;

  public purchaseAccountId?: number;
  public purchaseAccountName?: string;

  public mainPaymentMethodId?: number;
  public mainPaymentMethodName?: string;

  public mainStoreId?: number;
  public mainStoreName?: string;

  public invoicePolicy?: string;
  public invoicePrintSize!: InvoicePrintSize;
  public eInvoicingEnvironmentType!: EInvoicingEnvironmentType;

  constructor(init?: Partial<SettingOld>)
  {
    Object.assign(this, init);

    if (this.startDate)
    {
      this.startDate = new Date(this.startDate);
    }
    if (this.endDate)
    {
      this.endDate = new Date(this.endDate);
    }
  }
}

export class SharingSetting
{
  public registrationKey!: string;
  public companyName!: string;
  public companyPhone!: string;
  public crn?: string;
  public vatNumber?: string;
  public street!: string;
  public district!: string;
  public buildingNumber!: string;
  public postalCode!: string;
  public city!: CityOld;
  public logo?: StorageFile;

  constructor(init?: Partial<SharingSetting>)
  {
    Object.assign(this, init);
  }
}

export class SettingValidationRules
{
  public static validationRules = (t: TFunction<"erpCommon">): ValidationRuleOld<Partial<SettingOld>>[] => [{
    field: "companyName",
    selector: (d) => d.companyName,
    validators: [Validators.required(t("settings.companyNameRequired"))]
  }, {
    field: "companyPhone",
    selector: (d) => d.companyPhone,
    validators: [Validators.required(t("settings.companyPhoneRequired"))]
  }, {
    field: "branchId",
    selector: (d) => d.branchId,
    validators: [Validators.required(t("settings.branchRequired"))]
  }, {
    field: "email",
    selector: (d) => d.email,
    validators: [Validators.required(t("settings.emailRequired"))]
  }, {
    field: "currencyId",
    selector: (d) => d.currencyId,
    validators: [Validators.required(t("settings.currencyRequired"))]
  }];
}

export class SettingSlice
{
  private static formSliceInstance = createGenericFormSlice<SettingOld>("settingForm");
  public static formActions = SettingSlice.formSliceInstance.actions;
  public static formReducer = SettingSlice.formSliceInstance.reducer;
}
