import { BaseApiService } from "yusr-core";
import type Voucher from "../data/voucher";

export default class VouchersApiService extends BaseApiService<Voucher>
{
  routeName: string = "Vouchers";
}
