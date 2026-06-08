import { BaseServices } from "yusr-ui";
import { ErpRoleApiService } from "../networking/erpRoleApiService";
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

  static
  {
    BaseServices.auth = Services.auth;
    BaseServices.rolesApi = Services.rolesApi;
  }
}
