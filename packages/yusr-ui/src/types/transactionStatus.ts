import { type Signal } from "@preact/signals-react";


export enum TransactionStatus
{
	Draft = 0,
	Posted = 1,
	Voided = 2
}

export interface IStatusWorkflowDto
{
	transactionStatus: TransactionStatus;
}

export interface IStatusWorkflowEntity
{
	transactionStatus: Signal<TransactionStatus>;
}

export abstract class StatusWorkflow
{
	static isEntity(target: unknown): target is IStatusWorkflowEntity
	{
		return Boolean(
			target &&
			typeof target === "object" &&
			"transactionStatus" in target &&
			(target as Record<string, unknown>).transactionStatus &&
			typeof (target as Record<string, unknown>).transactionStatus === "object" &&
			"value" in ((target as Record<string, unknown>).transactionStatus as object)
		);
	}

	static isDto(target: unknown): target is IStatusWorkflowDto
	{
		return Boolean(
			target &&
			typeof target === "object" &&
			"transactionStatus" in target &&
			typeof (target as Record<string, unknown>).transactionStatus === "number"
		);
	}
}

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