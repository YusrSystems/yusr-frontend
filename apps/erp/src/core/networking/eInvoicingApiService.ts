import { ApiConstants, YusrApiHelper, type RequestResult } from "yusr-core";
import type { EInvoicingEnvironmentType } from "../data/setting";

export default class EInvoicingApiService
{
  routeName: string = "EInvoicing";

  async Link(otp: string, eInvoicingEnvironmentType: EInvoicingEnvironmentType): Promise<RequestResult<boolean>>
  {
    const url = `${ApiConstants.baseUrl}/${this.routeName}/LinkEInvoicing/${otp}/${eInvoicingEnvironmentType}`;
    return await YusrApiHelper.Get<boolean>(url);
  }
}
