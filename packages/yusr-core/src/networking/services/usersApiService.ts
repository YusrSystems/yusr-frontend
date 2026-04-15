import type { User } from "../../entities";
import { BaseApiService } from "./baseApiService";

export class UsersApiService extends BaseApiService<User>
{
  routeName: string = "Users";
}
