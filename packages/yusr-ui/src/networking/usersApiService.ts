import type { User } from "../entities";
import { BaseApiServiceOld } from "./baseApiServiceOld";

export class UsersApiService extends BaseApiServiceOld<User>
{
  routeName: string = "Users";
}
