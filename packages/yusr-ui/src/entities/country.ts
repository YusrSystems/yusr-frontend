import type { Signal } from "@preact/signals-react";
import { Dto, Entity } from "../stateManager";


export class CountryDto extends Dto
{
	public name!: string;
	public code!: string;
}

export class Country extends Entity<CountryDto>
{
	public name!: Signal<string>;
	public code!: Signal<string>;

	constructor(dto?: Partial<CountryDto> | undefined)
	{
		super();
		this.name = this.assign("name", dto?.name ?? "");
		this.code = this.assign("code", dto?.code ?? "");
	}
}
