import type { UserOld } from "../entities/userOld";
import { BaseApiServiceOld } from "./baseApiServiceOld";

export class UsersApiServiceOld extends BaseApiServiceOld<UserOld>
{
  routeName: string = "Users";
}
