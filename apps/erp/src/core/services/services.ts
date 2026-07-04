import { BaseApiService, BaseServices, RolesApiService } from "yusr-ui";
import ItemsApiService from "../networking/itemApiService";
import UnitsApiService from "../networking/unitApiService";
import { ErpAuthService } from "./erpAuthService";
import DashboardApiService from "@/core/networking/dashboardApiService.ts";
import InvoicesApiService from "@/core/networking/invoiceApiService.ts";
import SettingsApiService from "@/core/networking/settingsApiService.ts";
import { TaxDto } from "@/core/data/tax.ts";
import type { StoreDto } from "@/core/data/store.ts";
import type { ErpRoleDto } from "@/core/data/erpRole.ts";
import { type StocktakingDto } from "@/core/data/stocktaking.ts";
import type { ItemTransferDto } from "@/core/data/itemTransfer.ts";
import type { CostAdjustmentDto } from "@/core/data/costAdjustment.ts";
import type { PricingMethodDto } from "@/core/data/pricingMethod.ts";
import { type AccountDto } from "@/core/data/account.ts";
import type { PaymentMethodDto } from "@/core/data/paymentMethod.ts";
import { type BalanceTransferDto } from "@/core/data/balanceTransfer.ts";
import type { VoucherDto } from "@/core/data/voucher.ts";


export class Services extends BaseServices
{
	public static override auth: ErpAuthService = new ErpAuthService();
	public static override rolesApi = new RolesApiService<ErpRoleDto>;

	public static readonly taxesApi = new BaseApiService<TaxDto>("Taxes");
	public static readonly storesApi = new BaseApiService<StoreDto>("Stores");
	public static readonly unitsApi = new UnitsApiService();
	public static readonly pricingMethodsApi = new BaseApiService<PricingMethodDto>("PricingMethods");
	public static readonly stocktakingApi = new BaseApiService<StocktakingDto>("Stocktakings");
	public static readonly itemsSettlementsApi = new BaseApiService<StocktakingDto>("ItemSettlements");
	public static readonly itemTransfersApi = new BaseApiService<ItemTransferDto>("ItemTransfers");
	public static readonly costAdjustmentsApi = new BaseApiService<CostAdjustmentDto>("CostAdjustments");
	public static readonly itemsApi = new ItemsApiService();
	public static readonly accountsApi = new BaseApiService<AccountDto>("Accounts");
	public static readonly paymentMethodsApi = new BaseApiService<PaymentMethodDto>("PaymentMethods");
	public static readonly balanceTransfersApi = new BaseApiService<BalanceTransferDto>("BalanceTransfers");
	public static readonly voucherApi = new BaseApiService<VoucherDto>("Vouchers");
	public static readonly invoicesApi = new InvoicesApiService();
	public static readonly settingApi = new SettingsApiService();
	public static readonly dashboardApi = new DashboardApiService();

	static
	{
		BaseServices.auth = Services.auth;
		BaseServices.rolesApi = Services.rolesApi;
	}
}
