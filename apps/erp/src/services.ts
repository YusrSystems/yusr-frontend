import { AuthService, User, UserDto } from "yusr-ui";
import type { Setting, SettingDto } from "./core/data/setting";

export class Services
{
  public static auth = new AuthService<User, UserDto, Setting, SettingDto>();
}
