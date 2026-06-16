import { BaseApiService } from "yusr-ui";
import { Voucher, VoucherDto } from "@/core/data/voucher.ts";


export default class VouchersApiService extends BaseApiService<Voucher, VoucherDto>
{
	routeName: string = "Vouchers";

	override createEntity(dto: VoucherDto): Voucher
	{
		return new Voucher(dto);
	}
}
