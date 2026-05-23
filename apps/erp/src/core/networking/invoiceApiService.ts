import { ApiConstants, BaseApiService, FilterByTypeRequest, type FilterResult, type RequestResult, YusrApiHelper } from "yusr-ui";
import type Invoice from "../data/invoice";
import type { EInvoiceStatus } from "../data/invoice";

export default class InvoicesApiService extends BaseApiService<Invoice>
{
  routeName: string = "Invoices";

  async FilterByTypes(
    pageNumber: number,
    rowsPerPage: number,
    request: FilterByTypeRequest<Invoice>
  ): Promise<RequestResult<FilterResult<Invoice>>>
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
