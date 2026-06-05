import type { Signal } from "@preact/signals-react";
import { Dto, Entity } from "../stateManager";
import { BaseEntity } from "./baseEntity";
import type { Country } from "./country";

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
  declare name: Signal<string>;
  declare countryId: Signal<number>;
  declare country: Signal<Country>;
}
