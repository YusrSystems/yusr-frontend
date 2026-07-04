import { type BranchDto, type CityDto, CurrencyDto, type RoleDto, type UserDto } from "../entities";
import { PageCubit } from "../stateManager";
import { BaseServices } from "./baseServices";
import { ContinueWithGoogleCubit } from "../stateManager/continueWithGoogleCubit";


export class BaseCubits
{
	public static readonly branches = new PageCubit<BranchDto>(BaseServices.branchesApi);
	public static readonly cities = new PageCubit<CityDto>(BaseServices.citiesApi);
	public static readonly currencies = new PageCubit<CurrencyDto>(BaseServices.currenciesApi);
	public static roles: PageCubit<RoleDto>;
	public static readonly users = new PageCubit<UserDto>(BaseServices.usersApi);
	public static readonly continueWithGoogle = new ContinueWithGoogleCubit();
}
