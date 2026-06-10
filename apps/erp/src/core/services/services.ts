import { BaseServices } from "yusr-ui";
import AccountApiService from "../networking/accountApiService";
import { ErpRoleApiService } from "../networking/erpRoleApiService";
import ItemsApiService from "../networking/itemApiService";
import PricingMethodsApiService from "../networking/ppricingMethodsApiService";
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

  public static accountsApi = new AccountApiService();
  static
  {
    BaseServices.auth = Services.auth;
    BaseServices.rolesApi = Services.rolesApi;
  }
}
