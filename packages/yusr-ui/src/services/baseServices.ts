import { type BranchDto, type CityDto, type CurrencyDto, type RoleDto, type UserDto } from "#/entities";
import { BaseApiService, BaseFilterableApiService, RolesApiService } from "#/networking";
import type { AuthService } from "./authService";
import { createSimpleListResource, type ISimpleListResource } from "#/api";


export class BaseServices
{
	public static readonly citiesApi = new BaseFilterableApiService<CityDto>("Cities");
	public static readonly currenciesApi = new BaseFilterableApiService<CurrencyDto>("Currencies");
	public static readonly branchesApi: ISimpleListResource<BranchDto> = createSimpleListResource<BranchDto>("Branches");
	public static readonly usersApi = new BaseApiService<UserDto>("Users");
	public static rolesApi: RolesApiService<RoleDto>;
	public static auth: AuthService;
}