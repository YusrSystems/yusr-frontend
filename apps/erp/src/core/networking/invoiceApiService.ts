import { ApiConstants, type ApiFilterResult, BaseApiServiceOld, FilterByTypeRequest, type RequestResult, YusrApiHelper } from "yusr-ui";
import type InvoiceOld from "../data/invoiceOld.ts";
import type { EInvoiceStatus } from "../data/invoiceOld.ts";

export default class InvoicesApiService extends BaseApiServiceOld<InvoiceOld>
{
  routeName: string = "Invoices";

  async FilterByTypes(
    pageNumber: number,
    rowsPerPage: number,
    request: FilterByTypeRequest
  ): Promise<RequestResult<ApiFilterResult<InvoiceOld>>>
  {
    return await YusrApiHelper.Post(
      `${ApiConstants.baseUrl}/${this.routeName}/FilterByTypes?pageNumber=${pageNumber}&rowsPerPage=${rowsPerPage}`,
      request
    );
  }

  async GetReturnInvoiceInitialDetails(id: number): Promise<RequestResult<InvoiceOld>>
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
