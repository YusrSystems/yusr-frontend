import type { Signal } from "@preact/signals-react";
import { Branch, type BranchOld, CityOld, Currency, CurrencyDto, Dto, i18n, type StorageFile, ValidatableEntity, Validators } from "yusr-ui";
import { Tax, type TaxDto } from "./tax";

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
  public currency?: CurrencyDto;

  public logo?: StorageFile;

  public startDate!: Date;
  public endDate!: Date;

  public branchId!: number;
  public branch?: BranchOld;

  public mainTaxId!: number;
  public mainTax?: TaxDto;

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
  public registrationKey: Signal<string>;
  public email: Signal<string>;
  public companyName: Signal<string>;
  public companyPhone: Signal<string>;
  public companyBusinessCategory?: Signal<string>;
  public crn?: Signal<string>;
  public vatNumber?: Signal<string>;

  public currencyId: Signal<number>;
  public currency?: Signal<Currency>;

  public logo?: Signal<StorageFile>;

  public startDate: Signal<Date>;
  public endDate: Signal<Date>;

  public branchId: Signal<number>;
  public branch?: Signal<Branch>;

  public mainTaxId: Signal<number>;
  public mainTax?: Signal<Tax>;

  public sellAccountId?: Signal<number>;
  public sellAccountName?: Signal<string>;

  public purchaseAccountId?: Signal<number>;
  public purchaseAccountName?: Signal<string>;

  public mainPaymentMethodId?: Signal<number>;
  public mainPaymentMethodName?: Signal<string>;

  public mainStoreId?: Signal<number>;
  public mainStoreName?: Signal<string>;

  public invoicePolicy?: Signal<string>;
  public invoicePrintSize: Signal<InvoicePrintSize>;

  public eInvoicingEnvironmentType: Signal<EInvoicingEnvironmentType>;

  constructor(dto: Partial<SettingDto>)
  {
    super(dto, [{
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

    this.registrationKey = this.assign("registrationKey", dto?.registrationKey ?? "");
    this.email = this.assign("email", dto?.email ?? "");
    this.companyName = this.assign("companyName", dto?.companyName ?? "");
    this.companyPhone = this.assign("companyPhone", dto?.companyPhone ?? "");
    this.companyBusinessCategory = this.assign("companyBusinessCategory", dto?.companyBusinessCategory ?? undefined);
    this.crn = this.assign("crn", dto?.crn ?? undefined);
    this.vatNumber = this.assign("vatNumber", dto?.vatNumber ?? undefined);
    this.currencyId = this.assign("currencyId", dto?.currencyId ?? 0);
    this.currency = this.assign("currency", new Currency(dto?.currency));
    this.logo = this.assign("logo", dto?.logo ?? undefined);
    this.startDate = this.assign("startDate", dto?.startDate ?? new Date());
    this.endDate = this.assign("endDate", dto?.endDate ?? new Date());
    this.branchId = this.assign("branchId", dto?.branchId ?? 0);
    this.branch = this.assign("branch", new Branch(dto?.branch));
    this.mainTaxId = this.assign("mainTaxId", dto?.mainTaxId ?? 0);
    this.mainTax = this.assign("mainTax", new Tax(dto?.mainTax));
    this.sellAccountId = this.assign("sellAccountId", dto?.sellAccountId ?? undefined);
    this.sellAccountName = this.assign("sellAccountName", dto?.sellAccountName ?? undefined);
    this.purchaseAccountId = this.assign("purchaseAccountId", dto?.purchaseAccountId ?? undefined);
    this.purchaseAccountName = this.assign("purchaseAccountName", dto?.purchaseAccountName ?? undefined);
    this.mainPaymentMethodId = this.assign("mainPaymentMethodId", dto?.mainPaymentMethodId ?? undefined);
    this.mainPaymentMethodName = this.assign("mainPaymentMethodName", dto?.mainPaymentMethodName ?? undefined);
    this.mainStoreId = this.assign("mainStoreId", dto?.mainStoreId ?? undefined);
    this.mainStoreName = this.assign("mainStoreName", dto?.mainStoreName ?? undefined);
    this.invoicePolicy = this.assign("invoicePolicy", dto?.invoicePolicy ?? undefined);
    this.invoicePrintSize = this.assign("invoicePrintSize", dto?.invoicePrintSize ?? InvoicePrintSize.A4);
    this.eInvoicingEnvironmentType = this.assign(
      "eInvoicingEnvironmentType",
      dto?.eInvoicingEnvironmentType ?? EInvoicingEnvironmentType.Simulation
    );
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
