import type { Signal } from "@preact/signals-react";
import { Dto, Entity } from "../stateManager";
import { BaseEntity } from "./baseEntity";

export class CurrencyOld extends BaseEntity
{
  public name!: string;
  public code!: string;
  public isFeminine!: boolean;
  public plural!: string;
  public subName!: string;
  public subIsFeminine!: boolean;
  public subPlural!: string;

  constructor(init?: Partial<CurrencyOld>)
  {
    super();
    Object.assign(this, init);
  }
}

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
  declare name: Signal<string>;
  declare code: Signal<string>;
  declare isFeminine: Signal<boolean>;
  declare plural: Signal<string>;
  declare subName: Signal<string>;
  declare subIsFeminine: Signal<boolean>;
  declare subPlural: Signal<string>;
}
