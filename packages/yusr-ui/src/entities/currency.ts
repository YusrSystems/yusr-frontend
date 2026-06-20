import type { Signal } from "@preact/signals-react";
import { Dto, Entity } from "../stateManager";


export class CurrencyDto extends Dto
{
	public name!: string;
	public code!: string;
	public isFeminine!: boolean;
	public plural!: string;
	public subName!: string;
	public subIsFeminine!: boolean;
	public subPlural!: string;
}

export class Currency extends Entity<CurrencyDto>
{
	public name: Signal<string>;
	public code: Signal<string>;
	public isFeminine: Signal<boolean>;
	public plural: Signal<string>;
	public subName: Signal<string>;
	public subIsFeminine: Signal<boolean>;
	public subPlural: Signal<string>;

	constructor(dto?: Partial<CurrencyDto>)
	{
		super(dto);

		this.name = this.assign("name", dto?.name ?? "");
		this.code = this.assign("code", dto?.code ?? "");
		this.isFeminine = this.assign("isFeminine", dto?.isFeminine ?? false);
		this.plural = this.assign("plural", dto?.plural ?? "");
		this.subName = this.assign("subName", dto?.subName ?? "");
		this.subIsFeminine = this.assign("subIsFeminine", dto?.subIsFeminine ?? false);
		this.subPlural = this.assign("subPlural", dto?.subPlural ?? "");
	}
}
