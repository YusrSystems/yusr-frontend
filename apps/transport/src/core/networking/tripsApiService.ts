import type { Trip } from "@/features/trips/data/trip";
import { BaseApiService } from "yusr-core";

export default class TripsApiService extends BaseApiService<Trip>
{
  routeName: string = "Trips";
}
