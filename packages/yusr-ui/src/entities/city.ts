import { CitiesApiService } from "../networking";
import { createGenericEntitySlice } from "../state";
import type { ColumnName } from "../types";
import { BaseEntity } from "./baseEntity";
import type { Country } from "./country";

export class City extends BaseEntity
{
  public name!: string;
  public countryId!: number;
  public country!: Country;

  constructor(init?: Partial<City>)
  {
    super();
    Object.assign(this, init);
  }
}

export class CityFilterColumns
{
  public static columnsNames: ColumnName<City>[] = [{ label: "", value: "name" }];
}

export class CitySlice
{
  private static entitySliceInstance = createGenericEntitySlice<City>("city", new CitiesApiService());
  public static entityActions = CitySlice.entitySliceInstance.actions;
  public static entityReducer = CitySlice.entitySliceInstance.reducer;
}
