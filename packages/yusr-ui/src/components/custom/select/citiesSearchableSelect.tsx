import { useSelector } from "react-redux";
import { YusrSystemPermissionsResources } from "../../../auth";
import { City, CitySlice } from "../../../entities";
import { BaseApiService, CitiesApiService } from "../../../networking";
import type { YusrRootState } from "../../../state";
import { ChangableSearchableSelect } from "./changableSearchableSelect";
import type { BasicSearchableSelectParams } from "./searchableSelect";

export function CitiesSearchableSelect(
  { ...props }: BasicSearchableSelectParams<City>
)
{
  const cityState = useSelector((state: YusrRootState) => state.city);
  const authState = useSelector((state: YusrRootState) => state.auth);

  return (
    <ChangableSearchableSelect<City>
      labelKey="name"
      state={ cityState }
      apiService={ new CitiesApiService() as unknown as BaseApiService<City> }
      systemPermissionsResources={ YusrSystemPermissionsResources.Branches }
      entityActions={ {
        filter: CitySlice.entityActions.filter,
        refresh: CitySlice.entityActions.refresh
      } }
      authPermissions={ authState.loggedInUser?.role?.permissions ?? [] }
      allowAdd={ false }
      allowUpdate={ false }
      { ...props }
    />
  );
}
