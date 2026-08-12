import { BaseApiService, type RequestResult, YusrApiHelper } from "yusr-ui";
import { PosTerminalDto } from "@/core/data/posTerminal";


export default class PosTerminalsApiService extends BaseApiService<PosTerminalDto>
{
	constructor()
	{
		super("PosTerminals");
	}

	async AddFavorite(terminalId: number, itemId: number, displayOrder: number = 0): Promise<RequestResult<boolean>>
	{
		return await YusrApiHelper.Post<boolean>(
			`/api/${ this.routeName }/${ terminalId }/Favorites/Add?itemId=${ itemId }&displayOrder=${ displayOrder }`
		);
	}

	async RemoveFavorite(terminalId: number, itemId: number): Promise<RequestResult<boolean>>
	{
		return await YusrApiHelper.Delete<boolean>(
			`/api/${ this.routeName }/${ terminalId }/Favorites/${ itemId }`
		);
	}
}