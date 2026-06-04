import { RegisterApiService } from "@/core/networking/registerApiService";
import { Cubit } from "yusr-ui";
import { Registration } from "../data/registration";
import { type RegistrationState, RegistrationStateInitial } from "./registrationState";

export class RegistrationCubit extends Cubit<RegistrationState>
{
  public formData: Registration = new Registration({
    companyName: "",
    email: "",
    userPassword: "",
    currencyId: 1,
    username: "",
    id: 0
  });

  constructor()
  {
    super(new RegistrationStateInitial());
  }

  public async register()
  {
    console.log("=========== start register ===========");
    console.log("validating . . .");

    if (!this.formData.validate())
    {
      return;
    }
    console.log("=========== validated ===========");
    const service = new RegisterApiService();

    console.log("sending to backend");
    const result = await service.register(this.formData);
    console.log(result);
  }
}
