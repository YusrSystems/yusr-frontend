import { BaseApiService, type RequestResult, YusrApiHelper } from "yusr-ui";
import { type PosSessionCloseDto, PosSessionDto } from "../data/posSession";


export default class PosSessionApiService extends BaseApiService<PosSessionDto>
{
	constructor()
	{
		super("PosSessions");
	}

	async GetActiveSession(terminalId: number): Promise<RequestResult<PosSessionDto | undefined>>
	{
		return await YusrApiHelper.Get<PosSessionDto | undefined>(`/api/${ this.routeName }/Active/${ terminalId }`);
	}

	async OpenSession(data: Partial<PosSessionDto>): Promise<RequestResult<PosSessionDto>>
	{
		return await YusrApiHelper.Post<PosSessionDto>(`/api/${ this.routeName }/Open`, data);
	}

	async CloseSession(data: PosSessionCloseDto): Promise<RequestResult<PosSessionDto>>
	{
		return await YusrApiHelper.Post<PosSessionDto>(`/api/${ this.routeName }/Close`, data);
	}
}