import type { Branch } from "../entities/branch";
import { BaseApiServiceOld } from "./baseApiServiceOld";

export class BranchesApiService extends BaseApiServiceOld<Branch>
{
  routeName: string = "Branches";
}
