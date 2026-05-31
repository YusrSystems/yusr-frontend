import { ApiConstants, type ApiFilterResult, BaseApiServiceOld, FilterByTypeRequest, type RequestResult, YusrApiHelper } from "yusr-ui";
import type Invoice from "../data/invoice";
import type { EInvoiceStatus } from "../data/invoice";

export default class InvoicesApiService extends BaseApiServiceOld<Invoice>
{
  routeName: string = "Invoices";

  async FilterByTypes(
    pageNumber: number,
    rowsPerPage: number,
    request: FilterByTypeRequest<Invoice>
  ): Promise<RequestResult<ApiFilterResult<Invoice>>>
  {
    return await YusrApiHelper.Post(
      `${ApiConstants.baseUrl}/${this.routeName}/FilterByTypes?pageNumber=${pageNumber}&rowsPerPage=${rowsPerPage}`,
      request
    );
  }

  async GetReturnInvoiceInitialDetails(id: number): Promise<RequestResult<Invoice>>
  {
    return await YusrApiHelper.Get(`${ApiConstants.baseUrl}/${this.routeName}/GetReturnInvoiceInitialDetails/${id}`);
  }

  async ResendEInvoice(invoiceId: number): Promise<RequestResult<EInvoiceStatus>>
  {
    return await YusrApiHelper.Put(
      `${ApiConstants.baseUrl}/${this.routeName}/ResendEInvoice/${invoiceId}`
    );
  }
}
