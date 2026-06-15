import {ApiConstants, BaseApiService, type RequestResult, YusrApiHelper} from "yusr-ui";
import type {EInvoiceStatus} from "../data/invoiceOld.ts";
import Invoice, {InvoiceDto} from "@/core/data/invoice.ts";

export default class InvoicesApiService extends BaseApiService<Invoice, InvoiceDto> {
    routeName: string = "Invoices";

    override createEntity(dto: InvoiceDto): Invoice {
        return new Invoice(dto);
    }

    async GetReturnInvoiceInitialDetails(id: number): Promise<RequestResult<InvoiceDto>> {
        return await YusrApiHelper.Get(`${ApiConstants.baseUrl}/${this.routeName}/GetReturnInvoiceInitialDetails/${id}`);
    }

    async ResendEInvoice(invoiceId: number): Promise<RequestResult<EInvoiceStatus>> {
        return await YusrApiHelper.Put(
            `${ApiConstants.baseUrl}/${this.routeName}/ResendEInvoice/${invoiceId}`
        );
    }
}
