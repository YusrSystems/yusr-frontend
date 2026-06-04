import { AuthService } from "yusr-ui";
import { Setting, type SettingDto } from "../data/setting";
import TaxesApiService from "../networking/taxesApiService";

export class Services
{
  public static auth = new AuthService<Setting, SettingDto>((dto) => new Setting(dto));
  public static taxesApi = new TaxesApiService();
}
