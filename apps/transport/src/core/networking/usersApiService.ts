import type User from "@/features/users/data/user";
import { BaseApiService } from "yusr-core";

export default class UsersApiService extends BaseApiService<User>
{
  routeName: string = "Users";
}
