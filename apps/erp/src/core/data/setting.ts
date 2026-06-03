import type { Signal } from "@preact/signals-react";
import { type Branch, City, type Currency, Dto, type EntityMode, i18n, type StorageFile, ValidatableEntity, Validators } from "yusr-ui";
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

export class SettingDto extends Dto
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
}

export class Setting extends ValidatableEntity<SettingDto>
{
  declare registrationKey: Signal<string>;
  declare email: Signal<string>;
  declare companyName: Signal<string>;
  declare companyPhone: Signal<string>;
  declare companyBusinessCategory?: Signal<string>;
  declare crn?: Signal<string>;
  declare vatNumber?: Signal<string>;
  declare currencyId: Signal<number>;
  declare currency?: Signal<Currency>;
  declare logo?: Signal<StorageFile>;
  declare startDate: Signal<Date>;
  declare endDate: Signal<Date>;
  declare branchId: Signal<number>;
  declare branch?: Signal<Branch>;
  declare mainTaxId: Signal<number>;
  declare mainTax?: Signal<TaxOld>;
  declare sellAccountId?: Signal<number>;
  declare sellAccountName?: Signal<string>;
  declare purchaseAccountId?: Signal<number>;
  declare purchaseAccountName?: Signal<string>;
  declare mainPaymentMethodId?: Signal<number>;
  declare mainPaymentMethodName?: Signal<string>;
  declare mainStoreId?: Signal<number>;
  declare mainStoreName?: Signal<string>;
  declare invoicePolicy?: Signal<string>;
  declare invoicePrintSize: Signal<InvoicePrintSize>;
  declare eInvoicingEnvironmentType: Signal<EInvoicingEnvironmentType>;

  constructor(dto: Partial<SettingDto>, mode: EntityMode)
  {
    super(dto, mode, [{
      field: "companyName",
      selector: (d) => d.companyName,
      validators: [Validators.required(i18n.t("erpCommon:settings.companyNameRequired"))]
    }, {
      field: "companyPhone",
      selector: (d) => d.companyPhone,
      validators: [Validators.required(i18n.t("erpCommon:settings.companyPhoneRequired"))]
    }, {
      field: "branchId",
      selector: (d) => d.branchId,
      validators: [Validators.required(i18n.t("erpCommon:settings.branchRequired"))]
    }, {
      field: "email",
      selector: (d) => d.email,
      validators: [Validators.required(i18n.t("erpCommon:settings.emailRequired"))]
    }, {
      field: "currencyId",
      selector: (d) => d.currencyId,
      validators: [Validators.required(i18n.t("erpCommon:settings.currencyRequired"))]
    }]);
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
  public city!: City;
  public logo?: StorageFile;

  constructor(init?: Partial<SharingSetting>)
  {
    Object.assign(this, init);
  }
}
