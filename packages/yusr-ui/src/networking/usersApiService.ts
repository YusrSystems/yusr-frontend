import { User, type UserDto } from "../entities";
import { BaseApiService } from "./baseApiService";

export class UsersApiService extends BaseApiService<User, UserDto>
{
  routeName: string = "Users";

  createEntity(dto: UserDto): User
  {
    return new User(dto);
  }
}
