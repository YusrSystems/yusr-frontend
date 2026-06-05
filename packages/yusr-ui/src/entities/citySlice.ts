import { CitiesApiServiceOld } from "../networking/citiesApiServiceOld";
import { createGenericEntitySlice } from "../state";
import type { CityOld } from "./city";

export class CitySlice
{
  private static entitySliceInstance = createGenericEntitySlice<CityOld>("city", new CitiesApiServiceOld());
  public static entityActions = CitySlice.entitySliceInstance.actions;
  public static entityReducer = CitySlice.entitySliceInstance.reducer;
}
