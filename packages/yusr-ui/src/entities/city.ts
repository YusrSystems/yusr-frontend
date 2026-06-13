import type { Signal } from "@preact/signals-react";
import { Dto, Entity } from "../stateManager";
import { BaseEntity } from "./baseEntity";
import { Country } from "./country";

export class CityOld extends BaseEntity
{
  public name!: string;
  public countryId!: number;
  public country!: Country;

  constructor(init?: Partial<CityOld>)
  {
    super();
    Object.assign(this, init);
  }
}

export class CityDto extends Dto
{
  public name!: string;
  public countryId!: number;
  public country!: Country;
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
