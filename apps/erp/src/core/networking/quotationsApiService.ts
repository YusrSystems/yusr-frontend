import { BaseApiService, type RequestResult, YusrApiHelper } from "yusr-ui";
import { type ConvertQuotationDto, QuotationDto } from "@/core/data/commercial/quotation";
import { SalesInvoiceDto } from "@/core/data/commercial/salesInvoice";


export default class QuotationsApiService extends BaseApiService<QuotationDto>
{
	constructor()
	{
		super("Quotations");
	}

	async ConvertToInvoice(dto: ConvertQuotationDto): Promise<RequestResult<SalesInvoiceDto>>
	{
		return await YusrApiHelper.Post<SalesInvoiceDto>(
			`/api/${ this.routeName }/ConvertToInvoice`,
			dto,
			undefined,
			"تم تحويل عرض السعر إلى فاتورة مبيعات بنجاح"
		);
	}
}