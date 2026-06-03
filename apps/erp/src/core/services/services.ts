import { AuthService } from "yusr-ui";
import TaxesApiService from "../networking/taxesApiService";
import { Setting, type SettingDto } from "../data/setting";

export class Services
{
  public static auth = new AuthService<Setting, SettingDto>((dto) => new Setting(dto, "update"));
  public static taxesApi = new TaxesApiService();
}
