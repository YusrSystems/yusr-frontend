import type { Signal } from "@preact/signals-react";
import {
	Branch,
	BranchDto,
	Currency,
	CurrencyDto,
	Dto,
	i18n,
	StorageFile,
	ValidatableEntity,
	Validators
} from "yusr-ui";
import { Tax, type TaxDto } from "./tax";
import { InvoiceType } from "@/core/types/invoiceType.ts";


export enum EInvoicingEnvironmentType
{
	Production = 0,
	Simulation = 1,
	Test = 2,
	NotRegistered = 3
}

export enum InvoicePrintSize
{
	A4 = 0,
	ThermalPrinter = 1
}

export class SettingDto extends Dto
{
	public registrationKey!: string;
	public email!: string;
	public companyName!: string;
	public companyPhone!: string;
	public companyBusinessCategory?: string;
	public crn?: string;
	public vatNumber?: string;
	public referralsCount!: number;

	public currencyId!: number;
	public currency!: CurrencyDto;

	public logo?: StorageFile;

	public startDate!: Date;
	public endDate!: Date;

	public branchId!: number;
	public branch?: BranchDto;

	public mainTaxId!: number;
	public mainTax?: TaxDto;

	// --- System Accounts ---
	public receivablesAccountId!: number;
	public receivablesAccountName!: string;
	public payablesAccountId!: number;
	public payablesAccountName!: string;
	public salesRevenueAccountId!: number;
	public salesRevenueAccountName!: string;
	public cogsAccountId!: number;
	public cogsAccountName!: string;
	public inventoryAssetAccountId!: number;
	public inventoryAssetAccountName!: string;
	public outputTaxAccountId!: number;
	public outputTaxAccountName!: string;
	public inputTaxAccountId!: number;
	public inputTaxAccountName!: string;
	public paymentCommissionAccountId!: number;
	public paymentCommissionAccountName!: string;
	public openingBalanceEquityAccountId!: number;
	public openingBalanceEquityAccountName!: string;

	// --- Partner Defaults ---
	public defaultCustomerPartnerId?: number;
	public defaultCustomerPartnerName?: string;
	public defaultSupplierPartnerId?: number;
	public defaultSupplierPartnerName?: string;

	public mainPaymentMethodId?: number;
	public mainPaymentMethodName?: string;

	public mainStoreId?: number;
	public mainStoreName?: string;

	public saleInvoicePolicy?: string;
	public quotationInvoicePolicy?: string;
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
	public crn: Signal<string | undefined>;
	public vatNumber: Signal<string | undefined>;
	public referralsCount: Signal<number>;

	public currencyId: Signal<number>;
	public currency: Signal<Currency>;

	public logo: Signal<StorageFile | undefined>;

	public startDate: Signal<Date>;
	public endDate: Signal<Date>;

	public branchId: Signal<number>;
	public branch: Signal<Branch | undefined>;

	public mainTaxId: Signal<number>;
	public mainTax: Signal<Tax | undefined>;

	// --- System Accounts ---
	public receivablesAccountId: Signal<number>;
	public receivablesAccountName: Signal<string>;
	public payablesAccountId: Signal<number>;
	public payablesAccountName: Signal<string>;
	public salesRevenueAccountId: Signal<number>;
	public salesRevenueAccountName: Signal<string>;
	public cogsAccountId: Signal<number>;
	public cogsAccountName: Signal<string>;
	public inventoryAssetAccountId: Signal<number>;
	public inventoryAssetAccountName: Signal<string>;
	public outputTaxAccountId: Signal<number>;
	public outputTaxAccountName: Signal<string>;
	public inputTaxAccountId: Signal<number>;
	public inputTaxAccountName: Signal<string>;
	public paymentCommissionAccountId: Signal<number>;
	public paymentCommissionAccountName: Signal<string>;
	public openingBalanceEquityAccountId: Signal<number>;
	public openingBalanceEquityAccountName: Signal<string>;

	// --- Partner Defaults ---
	public defaultCustomerPartnerId: Signal<number | undefined>;
	public defaultCustomerPartnerName: Signal<string | undefined>;
	public defaultSupplierPartnerId: Signal<number | undefined>;
	public defaultSupplierPartnerName: Signal<string | undefined>;

	public mainPaymentMethodId: Signal<number | undefined>;
	public mainPaymentMethodName: Signal<string | undefined>;

	public mainStoreId: Signal<number | undefined>;
	public mainStoreName: Signal<string | undefined>;

	public saleInvoicePolicy: Signal<string | undefined>;
	public quotationInvoicePolicy: Signal<string | undefined>;
	public invoicePrintSize: Signal<InvoicePrintSize>;

	public eInvoicingEnvironmentType: Signal<EInvoicingEnvironmentType>;

	constructor(dto: Partial<SettingDto>)
	{
		super(dto, [
			{
				field: "companyName",
				selector: (d) => d.companyName,
				validators: [Validators.required(i18n.t("erpCommon:settings.companyNameRequired"))]
			},
			{
				field: "companyPhone",
				selector: (d) => d.companyPhone,
				validators: [Validators.required(i18n.t("erpCommon:settings.companyPhoneRequired"))]
			},
			{
				field: "branchId",
				selector: (d) => d.branchId,
				validators: [Validators.required(i18n.t("erpCommon:settings.branchRequired"))]
			},
			{
				field: "email",
				selector: (d) => d.email,
				validators: [Validators.required(i18n.t("erpCommon:settings.emailRequired"))]
			},
			{
				field: "currencyId",
				selector: (d) => d.currencyId,
				validators: [Validators.required(i18n.t("erpCommon:settings.currencyRequired"))]
			}
		]);

		this.registrationKey = this.assign("registrationKey", dto?.registrationKey ?? "");
		this.email = this.assign("email", dto?.email ?? "");
		this.companyName = this.assign("companyName", dto?.companyName ?? "");
		this.companyPhone = this.assign("companyPhone", dto?.companyPhone ?? "");
		this.companyBusinessCategory = this.assign("companyBusinessCategory", dto?.companyBusinessCategory ?? undefined);
		this.crn = this.assign("crn", dto?.crn ?? undefined);
		this.vatNumber = this.assign("vatNumber", dto?.vatNumber ?? undefined);
		this.referralsCount = this.assign("referralsCount", dto?.referralsCount ?? 0);
		this.currencyId = this.assign("currencyId", dto?.currencyId ?? undefined);
		this.currency = this.assign("currency", new Currency(dto?.currency));
		this.logo = this.assign("logo", dto?.logo ? new StorageFile(dto?.logo) : undefined);
		this.startDate = this.assign("startDate", dto?.startDate ?? new Date());
		this.endDate = this.assign("endDate", dto?.endDate ?? new Date());
		this.branchId = this.assign("branchId", dto?.branchId ?? 0);
		this.branch = this.assign("branch", new Branch(dto?.branch));
		this.mainTaxId = this.assign("mainTaxId", dto?.mainTaxId ?? 0);
		this.mainTax = this.assign("mainTax", new Tax(dto?.mainTax));

		// --- System Accounts ---
		this.receivablesAccountId = this.assign("receivablesAccountId", dto?.receivablesAccountId ?? 0);
		this.receivablesAccountName = this.assign("receivablesAccountName", dto?.receivablesAccountName ?? "");
		this.payablesAccountId = this.assign("payablesAccountId", dto?.payablesAccountId ?? 0);
		this.payablesAccountName = this.assign("payablesAccountName", dto?.payablesAccountName ?? "");
		this.salesRevenueAccountId = this.assign("salesRevenueAccountId", dto?.salesRevenueAccountId ?? 0);
		this.salesRevenueAccountName = this.assign("salesRevenueAccountName", dto?.salesRevenueAccountName ?? "");
		this.cogsAccountId = this.assign("cogsAccountId", dto?.cogsAccountId ?? 0);
		this.cogsAccountName = this.assign("cogsAccountName", dto?.cogsAccountName ?? "");
		this.inventoryAssetAccountId = this.assign("inventoryAssetAccountId", dto?.inventoryAssetAccountId ?? 0);
		this.inventoryAssetAccountName = this.assign("inventoryAssetAccountName", dto?.inventoryAssetAccountName ?? "");
		this.outputTaxAccountId = this.assign("outputTaxAccountId", dto?.outputTaxAccountId ?? 0);
		this.outputTaxAccountName = this.assign("outputTaxAccountName", dto?.outputTaxAccountName ?? "");
		this.inputTaxAccountId = this.assign("inputTaxAccountId", dto?.inputTaxAccountId ?? 0);
		this.inputTaxAccountName = this.assign("inputTaxAccountName", dto?.inputTaxAccountName ?? "");
		this.paymentCommissionAccountId = this.assign("paymentCommissionAccountId", dto?.paymentCommissionAccountId ?? 0);
		this.paymentCommissionAccountName = this.assign("paymentCommissionAccountName", dto?.paymentCommissionAccountName ?? "");
		this.openingBalanceEquityAccountId = this.assign("openingBalanceEquityAccountId", dto?.openingBalanceEquityAccountId ?? 0);
		this.openingBalanceEquityAccountName = this.assign("openingBalanceEquityAccountName", dto?.openingBalanceEquityAccountName ?? "");

		// --- Partner Defaults ---
		this.defaultCustomerPartnerId = this.assign("defaultCustomerPartnerId", dto?.defaultCustomerPartnerId);
		this.defaultCustomerPartnerName = this.assign("defaultCustomerPartnerName", dto?.defaultCustomerPartnerName);
		this.defaultSupplierPartnerId = this.assign("defaultSupplierPartnerId", dto?.defaultSupplierPartnerId);
		this.defaultSupplierPartnerName = this.assign("defaultSupplierPartnerName", dto?.defaultSupplierPartnerName);

		this.mainPaymentMethodId = this.assign("mainPaymentMethodId", dto?.mainPaymentMethodId);
		this.mainPaymentMethodName = this.assign("mainPaymentMethodName", dto?.mainPaymentMethodName);
		this.mainStoreId = this.assign("mainStoreId", dto?.mainStoreId);
		this.mainStoreName = this.assign("mainStoreName", dto?.mainStoreName);
		this.saleInvoicePolicy = this.assign("saleInvoicePolicy", dto?.saleInvoicePolicy);
		this.quotationInvoicePolicy = this.assign("quotationInvoicePolicy", dto?.quotationInvoicePolicy);
		this.invoicePrintSize = this.assign("invoicePrintSize", dto?.invoicePrintSize ?? InvoicePrintSize.A4);
		this.eInvoicingEnvironmentType = this.assign(
			"eInvoicingEnvironmentType",
			dto?.eInvoicingEnvironmentType ?? EInvoicingEnvironmentType.Simulation
		);
	}

	public getInvoicePolicy(invoiceType: InvoiceType)
	{
		if (invoiceType === InvoiceType.Sell || invoiceType === InvoiceType.SellReturn)
		{
			return this.saleInvoicePolicy.value;
		}
		else if (invoiceType === InvoiceType.Quotation)
		{
			return this.quotationInvoicePolicy.value;
		}
		return undefined;
	}
}