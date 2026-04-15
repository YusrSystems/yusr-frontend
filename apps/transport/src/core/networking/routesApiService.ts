import type { Route } from "@/features/routes/data/route";
import { BaseApiService } from "yusr-core";

export default class RoutesApiService extends BaseApiService<Route>
{
  routeName: string = "Routes";
}
