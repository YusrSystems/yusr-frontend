import { BaseApiService } from "yusr-ui";
import { Store, type StoreDto } from "../data/store";


export class StoresApiService extends BaseApiService<Store, StoreDto>
{
	routeName: string = "Stores";

	override createEntity(dto: StoreDto): Store
	{
		return new Store(dto);
	}
}
