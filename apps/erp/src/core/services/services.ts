import { BaseServices } from "yusr-ui";
import AccountApiService from "../networking/accountApiService";
import { ErpRoleApiService } from "../networking/erpRoleApiService";
import PricingMethodsApiService from "../networking/PricingMethodsApiService";
import { StoresApiService } from "../networking/storeApiService";
import TaxesApiService from "../networking/taxesApiService";
import UnitsApiService from "../networking/unitApiService";
import { ErpAuthService } from "./erpAuthService";

export class Services extends BaseServices
{
  public static override auth: ErpAuthService = new ErpAuthService();
  public static override rolesApi = new ErpRoleApiService();
  public static taxesApi = new TaxesApiService();
  public static storesApi = new StoresApiService();
  public static unitsApi = new UnitsApiService();
  public static pricingMethodsApi = new PricingMethodsApiService();

  public static accountsApi = new AccountApiService();
  static
  {
    BaseServices.auth = Services.auth;
    BaseServices.rolesApi = Services.rolesApi;
  }
}
