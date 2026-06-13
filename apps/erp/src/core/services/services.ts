import { BaseServices } from "yusr-ui";
import AccountApiService from "../networking/accountApiService";
import BalanceTransfersApiService from "../networking/balanceTransferApiService";
import { ErpRoleApiService } from "../networking/erpRoleApiService";
import ItemsApiService from "../networking/itemApiService";
import PaymentMethodsApiService from "../networking/paymentMethodApiService";
import PricingMethodsApiService from "../networking/pricingMethodsApiService";
import StocktakingsApiService from "../networking/stocktakingApiService";
import { StoresApiService } from "../networking/storeApiService";
import TaxesApiService from "../networking/taxesApiService";
import UnitsApiService from "../networking/unitApiService";
import { ErpAuthService } from "./erpAuthService";

export class Services extends BaseServices
{
  public static override auth: ErpAuthService = new ErpAuthService();
  public static override rolesApi = new ErpRoleApiService();

  public static readonly taxesApi = new TaxesApiService();
  public static readonly storesApi = new StoresApiService();
  public static readonly unitsApi = new UnitsApiService();
  public static readonly pricingMethodsApi = new PricingMethodsApiService();
  public static readonly itemsApi = new ItemsApiService();
  public static readonly accountsApi = new AccountApiService();
  public static readonly paymentMethodsApi = new PaymentMethodsApiService();
  public static readonly balanceTransfersApi = new BalanceTransfersApiService();
  public static readonly stocktakingApi = new StocktakingsApiService();

  static
  {
    BaseServices.auth = Services.auth;
    BaseServices.rolesApi = Services.rolesApi;
  }
}
