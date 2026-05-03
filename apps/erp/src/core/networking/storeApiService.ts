import { BaseApiService } from "yusr-ui";
import type Store from "../data/store";

export default class StoresApiService extends BaseApiService<Store>
{
  routeName: string = "Stores";
}
