import { BaseApiService, BaseServices, UserDto } from "yusr-ui";
import { ErpAuthService } from "./erpAuthService";
import DashboardApiService from "@/core/networking/dashboardApiService.ts";
import SettingsApiService from "@/core/networking/settingsApiService.ts";
import { type AccountDto } from "@/core/data/account.ts";
import type { PaymentMethodDto } from "@/core/data/paymentMethod.ts";
import { type BalanceTransferDto } from "@/core/data/balanceTransfer.ts";
import type { PartnerDto } from "@/core/data/partner.ts";
import PosSessionApiService from "@/core/networking/posSessionApiService.ts";
import PosCheckoutApiService from "@/core/networking/posCheckoutApiService.ts";
import PosTerminalsApiService from "@/core/networking/posTerminalsApiService.ts";
import FiscalYearsApiService from "@/core/networking/fiscalYearsApiService.ts";
import VouchersApiService from "@/core/networking/vouchersApiService.ts";
import PurchaseInvoicesApiService from "@/core/networking/purchaseInvoicesApiService.ts";
import SalesInvoicesApiService from "@/core/networking/salesInvoicesApiService.ts";
import type { QuotationDto } from "@/core/data/commercial/quotation.ts";
import { erpRolesApi } from "@/features/roles/roles.api";
import { storesApi } from "@/features/stores/stores.api";
import { pricingMethodsApi } from "@/features/pricingMethods/pricingMethods.api";
import { taxesApi } from "@/features/taxes/taxes.api";
import { unitsApi } from "@/features/units/units.api";
import { brandsApi } from "@/features/brands/brands.api";
import { categoriesApi } from "@/features/itemCategories/categories.api";
import { itemsApi } from "@/features/items/items.api";
import { itemsSettlementsApi, stocktakingsApi } from "@/features/stocktakings/stocktakings.api";
import { costAdjustmentsApi } from "@/features/costAdjustments/costAdjustments.api";
import { itemTransfersApi } from "@/features/itemTransfers/itemTransfers.api";


export class Services extends BaseServices
{
	public static override auth: ErpAuthService = new ErpAuthService();
	public static readonly erpRolesApi = erpRolesApi;
	public static readonly storesApi = storesApi;
	public static readonly pricingMethodsApi = pricingMethodsApi;
	public static readonly taxesApi = taxesApi;
	public static readonly unitsApi = unitsApi;
	public static readonly brandsApi = brandsApi;
	public static readonly categoriesApi = categoriesApi;
	public static readonly itemsApi = itemsApi;
	public static readonly stocktakingApi = stocktakingsApi;
	public static readonly itemsSettlementsApi = itemsSettlementsApi;
	public static readonly costAdjustmentsApi = costAdjustmentsApi;
	public static readonly itemTransfersApi = itemTransfersApi;
	public static readonly accountsApi = new BaseApiService<AccountDto>("Accounts");
	public static readonly partnersApi = new BaseApiService<PartnerDto>("Partners");
	public static readonly paymentMethodsApi = new BaseApiService<PaymentMethodDto>("PaymentMethods");
	public static readonly balanceTransfersApi = new BaseApiService<BalanceTransferDto>("BalanceTransfers");
	public static readonly voucherApi = new VouchersApiService();
	public static readonly salesInvoicesApi = new SalesInvoicesApiService();
	public static readonly purchaseInvoicesApi = new PurchaseInvoicesApiService();
	public static readonly quotationsApi = new BaseApiService<QuotationDto>("Quotations");
	public static readonly settingApi = new SettingsApiService();
	public static readonly dashboardApi = new DashboardApiService();
	public static readonly posSessionsApi = new PosSessionApiService();
	public static readonly posCheckoutApi = new PosCheckoutApiService();
	public static readonly posTerminalsApi = new PosTerminalsApiService();
	public static readonly usersApi = new BaseApiService<UserDto>("Users");
	public static readonly fiscalYearsApi = new FiscalYearsApiService();

	static
	{
		BaseServices.auth = Services.auth;
	}
}