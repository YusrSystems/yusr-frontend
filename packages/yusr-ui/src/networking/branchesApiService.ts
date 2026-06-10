import { Branch, type BranchDto } from "../entities/branch";
import { BaseApiService } from "./baseApiService";

export class BranchesApiService extends BaseApiService<Branch, BranchDto>
{
  routeName: string = "Branches";

  createEntity(dto: BranchDto): Branch
  {
    return new Branch(dto);
  }
}
