import { ApiConstants, YusrApiHelper } from "yusr-core";
import type { RequestResult } from "../data/requestResult";
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
