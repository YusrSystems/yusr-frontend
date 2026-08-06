export enum TransactionStatus
{
	Draft = 0,
	Posted = 1,
	Voided = 2
}

export interface ITransactionEntity
{
	statusId: TransactionStatus;
}

// export function getTransactionStatusName(status: TransactionStatus, t: TFunction | undefined): string
export function getTransactionStatusName(status: TransactionStatus): string
{
	switch (status)
	{
		case TransactionStatus.Draft:
			return "مسودة";
		case TransactionStatus.Posted:
			return "معتمد";
		case TransactionStatus.Voided:
			return "ملغي";
		default:
			return "Unknown";
	}
}

export function getTransactionStatusColor(status: TransactionStatus): string
{
	switch (status)
	{
		case TransactionStatus.Draft:
			return "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300";
		case TransactionStatus.Posted:
			return "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400";
		case TransactionStatus.Voided:
			return "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400";
		default:
			return "bg-gray-100 text-gray-800";
	}
}