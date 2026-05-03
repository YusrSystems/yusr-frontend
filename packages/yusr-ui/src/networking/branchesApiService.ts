import type { Branch } from "../entities";
import { BaseApiService } from "./baseApiService";

export class BranchesApiService extends BaseApiService<Branch>
{
  routeName: string = "Branches";
}
