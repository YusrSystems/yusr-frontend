import { AuthService } from "yusr-ui";
import { Setting, type SettingDto } from "./core/data/setting";
import TaxesApiService from "./core/networking/taxesApiService";

export class Services
{
  public static auth = new AuthService<Setting, SettingDto>((dto) => new Setting(dto));
  public static taxesApi = new TaxesApiService();
}
