import { BaseApiServiceOld } from "yusr-ui";
import type Voucher from "../data/voucher";

export default class VouchersApiService extends BaseApiServiceOld<Voucher>
{
  routeName: string = "Vouchers";
}
