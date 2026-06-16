import type { RequestResult } from "../types";
import { YusrApiHelper } from "../networking/yusrApiHelper.ts";


export class SystemApiService
{
	routeName: string = "System";

	async GetSystemPermissions(): Promise<RequestResult<string[]>>
	{
		return await YusrApiHelper.Get(`$/api/${ this.routeName }/Permissions`);
	}
}
