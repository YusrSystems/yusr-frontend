import type { Role, RoleDto } from "../entities";
import { BranchesApiService, CitiesApiService, CurrenciesApiService, RolesApiService, UsersApiService } from "../networking";
import type { AuthService } from "./authService";

export class BaseServices
{
  public static readonly citiesApi = new CitiesApiService();
  public static readonly currenciesApi = new CurrenciesApiService();
  public static readonly branchesApi = new BranchesApiService();
  public static readonly usersApi = new UsersApiService();
  public static rolesApi: RolesApiService<Role<RoleDto>, RoleDto>;
  public static auth: AuthService;
}
