import { BaseApiService } from "yusr-ui";
import CostAdjustment, { type CostAdjustmentDto } from "../data/costAdjustment";


export default class CostAdjustmentsApiService extends BaseApiService<CostAdjustment, CostAdjustmentDto>
{
	routeName: string = "CostAdjustments";

	override createEntity(dto: CostAdjustmentDto): CostAdjustment
	{
		return new CostAdjustment(dto);
	}
}