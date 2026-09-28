import { BaseServices } from "yusr-ui";
import { ErpAuthService } from "./erpAuthService";
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
import { accountsApi } from "@/features/accounts/accounts.api";
import { partnersApi } from "@/features/partners/partners.api";
import { balanceTransfersApi } from "@/features/balanceTransfer/balanceTransfers.api";
import { paymentMethodsApi } from "@/features/paymentMethods/paymentMethod.api.ts";
import { fiscalYearsApi } from "@/features/fiscalYears/fiscalYears.api";
import { vouchersApi } from "@/features/vouchers/vouchers.api";
import { posTerminalsApi } from "@/features/Pos/posTerminals/posTerminals.api";
import { posSessionsApi } from "@/features/Pos/posSession/posSessions.api";
import { posCheckoutApi } from "@/features/Pos/posScreen/posCheckout.api";
import { salesInvoicesApi } from "@/features/commercial/sales/salesInvoices.api";
import { purchaseInvoicesApi } from "@/features/commercial/purchases/purchaseInvoices.api";
import { quotationsApi } from "@/features/commercial/quotations/quotations.api";
import { settingsApi } from "@/features/setting/settings.api";
import { dashboardApi } from "@/features/dashboard/dashboard.api";
import { eInvoicingApi } from "@/features/setting/eInvoicing/eInvoicing.api";


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
	public static readonly accountsApi = accountsApi;
	public static readonly partnersApi = partnersApi;
	public static readonly paymentMethodsApi = paymentMethodsApi;
	public static readonly balanceTransfersApi = balanceTransfersApi;
	public static readonly fiscalYearsApi = fiscalYearsApi;
	public static readonly voucherApi = vouchersApi;
	public static readonly posTerminalsApi = posTerminalsApi;
	public static readonly posSessionsApi = posSessionsApi;
	public static readonly posCheckoutApi = posCheckoutApi;
	public static readonly salesInvoicesApi = salesInvoicesApi;
	public static readonly purchaseInvoicesApi = purchaseInvoicesApi;
	public static readonly quotationsApi = quotationsApi;
	public static readonly settingApi = settingsApi;
	public static readonly dashboardApi = dashboardApi;
	public static readonly eInvoicingApi = eInvoicingApi;

	static
	{
		BaseServices.auth = Services.auth;
	}
}