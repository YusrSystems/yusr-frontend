import type { Signal } from "@preact/signals-react";
import { Dto, Entity } from "../stateManager";
import { Country, CountryDto } from "./country";


export class CityDto extends Dto
{
	public name!: string;
	public countryId!: number;
	public country!: CountryDto;
}

export class City extends Entity<CityDto>
{
	public name: Signal<string>;
	public countryId: Signal<number>;
	public country: Signal<Country>;

	constructor(dto: Partial<CityDto>)
	{
		super(dto);

		this.name = this.assign("name", dto?.name ?? "");
		this.countryId = this.assign("countryId", dto?.countryId ?? 0);
		this.country = this.assign("country", new Country(dto.country));
	}
}
