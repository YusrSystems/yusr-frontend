import { BaseEntity } from "./baseEntity";

export class Country extends BaseEntity
{
  public name!: string;
  public code!: string;

  constructor(init?: Partial<Country>)
  {
    super();
    Object.assign(this, init);
  }
}
