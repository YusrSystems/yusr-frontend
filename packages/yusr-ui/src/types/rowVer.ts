import type { Signal } from "@preact/signals-react";


export interface IRowVerDto
{
	rowVer: number;
}

export interface IRowVerEntity
{
	rowVer: Signal<number>;
}

export abstract class RowVer
{
	static isEntity(target: unknown): target is IRowVerEntity
	{
		return Boolean(
			target &&
			typeof target === "object" &&
			"rowVer" in target &&
			target.rowVer &&
			typeof target.rowVer === "object" &&
			"value" in target.rowVer
		);
	}

	static isDto(target: unknown): target is IRowVerDto
	{
		return Boolean(
			target &&
			typeof target === "object" &&
			"rowVer" in target &&
			typeof (target as Record<string, unknown>).rowVer === "number"
		);
	}
}