import type Item from "@/core/data/item";
import { ItemSlice } from "@/core/data/item";
import ItemsApiService from "@/core/networking/itemApiService";
import ChangeItemDialog from "@/features/items/changeItemDialog";
import { type BasicSearchableSelectParams, ChangableSearchableSelect } from "yusr-ui";
import { SystemPermissionsResources } from "../../auth/systemPermissionsResources";
import { useAppSelector } from "../../state/store";

export default function ItemsSearchableSelect(
  { ...props }: BasicSearchableSelectParams<Item> & { items?: Item[]; }
)
{
  const itemState = useAppSelector((state) => state.item);
  const authState = useAppSelector((state) => state.auth);

  return (
    <ChangableSearchableSelect<Item>
      labelKey="name"
      mode="dialog"
      state={ itemState }
      apiService={ new ItemsApiService() }
      systemPermissionsResources={ SystemPermissionsResources.Items }
      allowAdd={ false }
      allowUpdate={ false }
      entityActions={ {
        filter: ItemSlice.entityActions.filter,
        refresh: ItemSlice.entityActions.refresh
      } }
      changeDialog={ ChangeItemDialog }
      authPermissions={ authState.loggedInUser?.role?.permissions ?? [] }
      { ...props }
    />
  );
}
