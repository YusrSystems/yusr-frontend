import type Branch from "@/features/branches/data/branch";
import { BaseApiService } from "yusr-core";

export default class BranchesApiService extends BaseApiService<Branch>
{
  routeName: string = "Branches";
}
