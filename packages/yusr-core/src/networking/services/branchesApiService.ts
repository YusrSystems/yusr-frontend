import type { Branch } from "../../entities/branch";
import { BaseApiService } from "./baseApiService";

export class BranchesApiService extends BaseApiService<Branch>
{
  routeName: string = "Branches";
}
