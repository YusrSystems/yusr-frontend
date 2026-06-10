import type ItemOld from "@/core/data/itemOld";
import { ItemSlice } from "@/core/data/itemOld";
import ItemsApiServiceOld from "@/core/networking/itemApiServiceOld";
import { type BasicSearchableSelectParamsOld, ChangableSearchableSelect } from "yusr-ui";
import { SystemPermissionsResources } from "../../auth/systemPermissionsResources";
import { useAppSelector } from "../../state/store";

export default function ItemsSearchableSelect(
  { ...props }: BasicSearchableSelectParamsOld<ItemOld> & { items?: ItemOld[]; }
)
{
  const itemState = useAppSelector((state) => state.item);
  const authState = useAppSelector((state) => state.auth);

  return (
    <ChangableSearchableSelect<ItemOld>
      labelKey="name"
      createKey="name"
      mode="dialog"
      state={ itemState }
      apiService={ new ItemsApiServiceOld() }
      systemPermissionsResources={ SystemPermissionsResources.Items }
      allowAdd={ false }
      allowUpdate={ false }
      entityActions={ {
        filter: ItemSlice.entityActions.filter,
        refresh: ItemSlice.entityActions.refresh
      } }
      authPermissions={ authState.loggedInUser?.role?.permissions ?? [] }
      { ...props }
    />
  );
}
