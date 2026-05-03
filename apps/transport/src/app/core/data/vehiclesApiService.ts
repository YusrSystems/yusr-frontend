import { BaseApiService } from "yusr-ui";
import type Vehicle from "./vehicle";

export default class VehiclesApiService extends BaseApiService<Vehicle>
{
  routeName: string = "Vehicles";
}
