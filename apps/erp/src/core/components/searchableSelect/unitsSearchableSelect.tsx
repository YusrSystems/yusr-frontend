import UnitsApiService from "@/core/networking/unitApiService";
import ChangeUnitDialog from "@/features/units/changeUnitDialog";
import { type BasicSearchableSelectParams, ChangableSearchableSelect } from "yusr-ui";
import { SystemPermissionsResources } from "../../auth/systemPermissionsResources";
import type Unit from "../../data/unit";
import { UnitSlice } from "../../data/unit";
import { useAppSelector } from "../../state/store";

export default function UnitsSearchableSelect(
  { ...props }: BasicSearchableSelectParams<Unit>
)
{
  const unitState = useAppSelector((state) => state.unit);
  const authState = useAppSelector((state) => state.auth);

  return (
    <ChangableSearchableSelect<Unit>
      labelKey="name"
      createKey="name"
      mode="inline"
      state={ unitState }
      apiService={ new UnitsApiService() }
      systemPermissionsResources={ SystemPermissionsResources.Units }
      allowUpdate={ false }
      entityActions={ {
        filter: UnitSlice.entityActions.filter,
        refresh: UnitSlice.entityActions.refresh
      } }
      changeDialog={ ChangeUnitDialog }
      authPermissions={ authState.loggedInUser?.role?.permissions ?? [] }
      { ...props }
    />
  );
}
