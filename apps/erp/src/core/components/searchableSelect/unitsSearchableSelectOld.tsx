import UnitsApiServiceOld from "@/core/networking/unitApiServiceOld";
import { type BasicSearchableSelectParamsOld, ChangableSearchableSelect } from "yusr-ui";
import { SystemPermissionsResources } from "../../auth/systemPermissionsResources";
import type UnitOld from "../../data/unitOld";
import { UnitSlice } from "../../data/unitOld";
import { useAppSelector } from "../../state/store";

export default function UnitsSearchableSelectOld(
  { ...props }: BasicSearchableSelectParamsOld<UnitOld>
)
{
  const unitState = useAppSelector((state) => state.unit);
  const authState = useAppSelector((state) => state.auth);

  return (
    <ChangableSearchableSelect<UnitOld>
      labelKey="name"
      createKey="name"
      mode="inline"
      state={ unitState }
      apiService={ new UnitsApiServiceOld() }
      systemPermissionsResources={ SystemPermissionsResources.Units }
      allowUpdate={ false }
      entityActions={ {
        filter: UnitSlice.entityActions.filter,
        refresh: UnitSlice.entityActions.refresh
      } }
      authPermissions={ authState.loggedInUser?.role?.permissions ?? [] }
      { ...props }
    />
  );
}
