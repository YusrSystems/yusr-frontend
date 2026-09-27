import { VoucherDto } from "@/core/data/voucher";
import { apiClient, createCrudResource } from "#/api";


export const vouchersApi = {
	...createCrudResource<VoucherDto>("Vouchers"),

	terminateDistribution: (id: number, rowVer: number) =>
		apiClient.post<VoucherDto>(
			`/api/Vouchers/${ id }/TerminateDistribution?rowVer=${ rowVer }`,
			undefined,
			{successMessage: "تم إنهاء التوزيع الدوري للسند بنجاح"}
		)
};