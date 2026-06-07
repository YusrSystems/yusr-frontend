import { Branch, type BranchDto, type BranchOld } from "../entities/branch";
import { BaseApiService } from "./baseApiService";
import { BaseApiServiceOld } from "./baseApiServiceOld";

export class BranchesApiServiceOld extends BaseApiServiceOld<BranchOld>
{
  routeName: string = "Branches";
}

export class BranchesApiService extends BaseApiService<Branch, BranchDto>
{
  routeName: string = "Branches";

  createEntity(dto: BranchDto): Branch
  {
    return new Branch(dto);
  }
}
