import { type BranchOld } from "../entities/branch";
import { BaseApiServiceOld } from "./baseApiServiceOld";

export class BranchesApiServiceOld extends BaseApiServiceOld<BranchOld>
{
  routeName: string = "Branches";
}
