import { BaseApiService } from "yusr-core";
import type Vehicle from "./vehicle";

export default class VehiclesApiService extends BaseApiService<Vehicle>
{
  routeName: string = "Vehicles";
}
