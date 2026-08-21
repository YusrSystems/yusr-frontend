import { BaseApiService, type RequestResult, YusrApiHelper } from "yusr-ui";
import type { VoucherDto } from "@/core/data/voucher.ts";


export default class VouchersApiService extends BaseApiService<VoucherDto>
{
	constructor()
	{
		super("Vouchers");
	}

	async TerminateDistribution(id: number, rowVer: number): Promise<RequestResult<VoucherDto>>
	{
		return await YusrApiHelper.Post<VoucherDto>(
			`/api/${ this.routeName }/${ id }/TerminateDistribution?rowVer=${ rowVer }`
		);
	}
}