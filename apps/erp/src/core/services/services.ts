import { AuthService, BaseServices } from "yusr-ui";
import { Setting, type SettingDto } from "../data/setting";
import TaxesApiService from "../networking/taxesApiService";

export class Services extends BaseServices
{
  public static auth = new AuthService<Setting, SettingDto>((dto) => new Setting(dto));
  public static taxesApi = new TaxesApiService();

  static
  {
    BaseServices.init(Services.auth);
  }
}
