import {
  type Branch,
  type BranchDto,
  type City,
  type CityDto,
  type Currency,
  CurrencyDto,
  type Role,
  type RoleDto,
  type User,
  type UserDto
} from "../entities";
import { PageCubit } from "../stateManager";
import { BaseServices } from "./baseServices";


export class BaseCubits
{
	public static readonly branches = new PageCubit<Branch, BranchDto>(BaseServices.branchesApi);
	public static readonly cities = new PageCubit<City, CityDto>(BaseServices.citiesApi);
	public static readonly currencies = new PageCubit<Currency, CurrencyDto>(BaseServices.currenciesApi);
	public static roles: PageCubit<Role<RoleDto>, RoleDto>;
	public static readonly users = new PageCubit<User, UserDto>(BaseServices.usersApi);
}
