import { VoucherDto } from "@/core/data/voucher.ts";
import { TransactionStatus } from "#/types";


export function canTerminateVoucherDistribution(voucher?: VoucherDto): boolean
{
	if (!voucher) return false;
	return voucher.transactionStatus === TransactionStatus.Posted
		&& Boolean(voucher.isDistributed || (voucher.distributionCount ?? 0) > 1)
		&& (voucher.remainingUnrecognizedAmount ?? 0) > 0;
}