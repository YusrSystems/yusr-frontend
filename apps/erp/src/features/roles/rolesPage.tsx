import { StoreSlice } from "@/core/data/store";
import { WarehouseIcon } from "lucide-react";
import { RoleSlice, RolesPage } from "yusr-ui";
import { updateLoggedInUser, useAppDispatch } from "../../core/state/store";
import { LABELS, PERMISSION_SECTIONS } from "./permissionConfig";
import StorePermissionsList from "./storePermissionsList";

export default function ErpRolesPage()
{
  const dispatch = useAppDispatch();

  return (
    <RolesPage
      onUpdateLoggedInUser={ (user) => dispatch(updateLoggedInUser({ ...user })) }
      ChangeRoleDialogAdditionalProps={ {
        additionalTabs: (formData) => [{
          active: false,
          icon: WarehouseIcon,
          label: "المستودعات المسموح بها",
          content: (
            <StorePermissionsList
              authorizedStoreIds={ formData.authorizedStores || [] }
              onChange={ (updated) => dispatch(RoleSlice.formActions.updateFormData({ authorizedStores: updated })) }
            />
          )
        }],
        initRequests: () => dispatch(StoreSlice.entityActions.filterAll()),
        permissionSecions: PERMISSION_SECTIONS,
        labels: LABELS
      } }
    />
  );
}
