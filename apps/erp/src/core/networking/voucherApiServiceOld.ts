import {BaseApiServiceOld} from "yusr-ui";
import type VoucherOld from "../data/voucherOld.ts";

export default class VouchersApiServiceOld extends BaseApiServiceOld<VoucherOld> {
    routeName: string = "Vouchers";
}
