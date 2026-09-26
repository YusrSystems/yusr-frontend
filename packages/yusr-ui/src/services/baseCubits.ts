import { type BranchDto, type CityDto, CurrencyDto, type RoleDto, type UserDto } from "#/entities";
import { ListCubit } from "#/stateManager";
import { BaseServices } from "./baseServices";
import { ContinueWithGoogleCubit } from "../stateManager/continueWithGoogleCubit";
import { citiesApi } from "../features/cities/cities.api";
import { currenciesApi } from "../features/currencies/currencies.api";
import { usersApi } from "../features/users/users.api";
import { rolesApi } from "../features/roles/roles.api";


export class BaseCubits
{
	public static readonly branches = new ListCubit<BranchDto>(BaseServices.branchesApi);
	public static readonly cities = new ListCubit<CityDto>(citiesApi);
	public static readonly currencies = new ListCubit<CurrencyDto>(currenciesApi);
	public static roles: ListCubit<RoleDto> = new ListCubit<RoleDto>(rolesApi);
	public static readonly users = new ListCubit<UserDto>(usersApi);
	public static readonly continueWithGoogle = new ContinueWithGoogleCubit();
}