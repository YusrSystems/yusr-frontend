import { type RequestResult, YusrApiHelper } from "yusr-ui";
import type { EInvoicingEnvironmentType } from "../data/setting";


export default class EInvoicingApiService
{
	routeName: string = "EInvoicing";

	async Link(otp: string, eInvoicingEnvironmentType: EInvoicingEnvironmentType): Promise<RequestResult<boolean>>
	{
		const url = `/api/${ this.routeName }/LinkEInvoicing/${ otp }/${ eInvoicingEnvironmentType }`;
		return await YusrApiHelper.Get<boolean>(url);
	}
}