import { type BranchDto, type CityDto, type CurrencyDto, type RoleDto } from "#/entities";
import type { AuthService } from "./authService";
import { type IReadOnlyListResource, type ISimpleListResource } from "#/api";
import { citiesApi } from "../features/cities/cities.api";
import { currenciesApi } from "../features/currencies/currencies.api";
import { type IUsersApi, usersApi } from "../features/users/users.api";
import { rolesApi } from "../features/roles/roles.api";
import { branchesApi } from "#/features/branches/branches.api.ts";


export class BaseServices
{
	public static readonly citiesApi: IReadOnlyListResource<CityDto> = citiesApi;
	public static readonly currenciesApi: IReadOnlyListResource<CurrencyDto> = currenciesApi;
	public static readonly branchesApi: ISimpleListResource<BranchDto> = branchesApi;
	public static readonly usersApi: IUsersApi = usersApi;
	public static rolesApi: ISimpleListResource<RoleDto> = rolesApi;
	public static auth: AuthService;
}