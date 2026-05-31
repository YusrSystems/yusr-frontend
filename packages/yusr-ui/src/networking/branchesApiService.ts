import type { Branch } from "../entities";
import { BaseApiServiceOld } from "./baseApiServiceOld";

export class BranchesApiService extends BaseApiServiceOld<Branch>
{
  routeName: string = "Branches";
}
