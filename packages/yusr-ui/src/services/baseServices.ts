import { BranchesApiService, CitiesApiService, CurrenciesApiService, RolesApiService, UsersApiService } from "../networking";
import type { AuthService } from "./authService";

export class BaseServices
{
  public static readonly citiesApi = new CitiesApiService();
  public static readonly currenciesApi = new CurrenciesApiService();
  public static readonly rolesApi = new RolesApiService();
  public static readonly branchesApi = new BranchesApiService();
  public static readonly usersApi = new UsersApiService();
  public static auth: AuthService<any, any>;

  public static init(auth: AuthService<any, any>)
  {
    BaseServices.auth = auth;
  }
}
