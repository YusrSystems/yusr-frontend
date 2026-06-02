import type { UserOld } from "../entities";
import { BaseApiServiceOld } from "./baseApiServiceOld";

export class UsersApiService extends BaseApiServiceOld<UserOld>
{
  routeName: string = "Users";
}
