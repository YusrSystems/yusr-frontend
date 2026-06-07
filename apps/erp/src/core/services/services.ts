import { BaseServices } from "yusr-ui";
import TaxesApiService from "../networking/taxesApiService";
import { ErpAuthService } from "./erpAuthService";

export class Services extends BaseServices
{
  public static override auth: ErpAuthService = new ErpAuthService();
  public static taxesApi = new TaxesApiService();

  static
  {
    BaseServices.auth = Services.auth;
  }
}
