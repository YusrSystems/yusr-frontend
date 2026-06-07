import { User, type UserDto } from "../entities";
import type { UserOld } from "../entities/userOld";
import { BaseApiService } from "./baseApiService";
import { BaseApiServiceOld } from "./baseApiServiceOld";

export class UsersApiServiceOld extends BaseApiServiceOld<UserOld>
{
  routeName: string = "Users";
}

export class UsersApiService extends BaseApiService<User, UserDto>
{
  routeName: string = "Users";

  createEntity(dto: UserDto): User
  {
    return new User(dto);
  }
}
