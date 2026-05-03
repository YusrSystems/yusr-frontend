import type { Trip } from "@/app/features/trips/data/trip";
import { BaseApiService } from "yusr-ui";

export default class TripsApiService extends BaseApiService<Trip>
{
  routeName: string = "Trips";
}
