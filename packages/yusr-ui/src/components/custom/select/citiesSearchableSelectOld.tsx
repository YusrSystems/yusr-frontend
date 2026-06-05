import { useSelector } from "react-redux";
import { YusrSystemPermissionsResources } from "../../../auth";
import { CityOld } from "../../../entities";
import { BaseApiServiceOld, CitiesApiServiceOld } from "../../../networking";
import type { YusrRootState } from "../../../state";
import { ChangableSearchableSelect } from "./changableSearchableSelect";
import type { BasicSearchableSelectParamsOld } from "./searchableSelectOld";
import { CitySlice } from "../../../entities/citySlice";

export function CitiesSearchableSelectOld(
  { ...props }: BasicSearchableSelectParamsOld<CityOld>
)
{
  const cityState = useSelector((state: YusrRootState) => state.city);
  const authState = useSelector((state: YusrRootState) => state.auth);

  return (
    <ChangableSearchableSelect<CityOld>
      labelKey="name"
      state={ cityState }
      apiService={ new CitiesApiServiceOld() as unknown as BaseApiServiceOld<CityOld> }
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
