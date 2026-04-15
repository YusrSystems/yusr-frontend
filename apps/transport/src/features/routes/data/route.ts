import { BaseEntity, type ColumnName } from "@yusr_systems/core";

export class Route extends BaseEntity
{
  public name!: string;
  public fromCityId!: number;
  public toCityId!: number;

  public fromCityName!: string;
  public toCityName!: string;
  public routeStations!: RouteStation[];

  constructor(init?: Partial<Route>)
  {
    super();
    Object.assign(this, init);
  }
}

export class RouteStation extends BaseEntity
{
  public routeId!: number;
  public period!: number;
  public index!: number;
  public cityId!: number;

  public cityName!: string;

  constructor(init?: Partial<RouteStation>)
  {
    super();
    Object.assign(this, init);
  }
}

export class RouteFilterColumns
{
  public static columnsNames: ColumnName[] = [{ label: "اسم الخط", value: "Name" }];
}
