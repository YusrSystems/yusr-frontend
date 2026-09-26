import { type BranchDto, type CityDto, CurrencyDto, type RoleDto, type UserDto } from "#/entities";
import { ListCubit, PageCubit } from "#/stateManager";
import { BaseServices } from "./baseServices";
import { ContinueWithGoogleCubit } from "../stateManager/continueWithGoogleCubit";
import { citiesApi } from "../features/cities/cities.api";
import { currenciesApi } from "../features/currencies/currencies.api";


export class BaseCubits
{
	public static readonly branches = new ListCubit<BranchDto>(BaseServices.branchesApi);
	public static readonly cities = new ListCubit<CityDto>(citiesApi);
	public static readonly currencies = new ListCubit<CurrencyDto>(currenciesApi);
	public static roles: PageCubit<RoleDto>;
	public static readonly users = new PageCubit<UserDto>(BaseServices.usersApi);
	public static readonly continueWithGoogle = new ContinueWithGoogleCubit();
}