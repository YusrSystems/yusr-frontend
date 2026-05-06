import { CountriesApiService } from "../networking";
import { createGenericEntitySlice } from "../state";
import type { ColumnName } from "../types/ColumnName";
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

export class CountryFilterColumns
{
  public static columnsNames: ColumnName<Country>[] = [{ label: "اسم الدولة", value: "name" }];
}

export class CountrySlice
{
  private static entitySliceInstance = createGenericEntitySlice<Country>("country", new CountriesApiService());
  public static entityActions = CountrySlice.entitySliceInstance.actions;
  public static entityReducer = CountrySlice.entitySliceInstance.reducer;
}
