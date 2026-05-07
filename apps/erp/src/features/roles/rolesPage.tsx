import { StoreSlice } from "@/core/data/store";
import { WarehouseIcon } from "lucide-react";
import { useTranslation } from "react-i18next";
import { RoleSlice, RolesPage } from "yusr-ui";
import { updateLoggedInUser, useAppDispatch } from "../../core/state/store";
import { getLabels, getPermissionSections } from "./permissionConfig";
import StorePermissionsList from "./storePermissionsList";

export default function ErpRolesPage()
{
  const dispatch = useAppDispatch();
  const { t } = useTranslation("erpCommon");

  return (
    <RolesPage
      onUpdateLoggedInUser={ (user) => dispatch(updateLoggedInUser({ ...user })) }
      ChangeRoleDialogAdditionalProps={ {
        additionalTabs: (formData) => [{
          active: false,
          icon: WarehouseIcon,
          label: t("permissions.resources.authorizedStores"),
          content: (
            <StorePermissionsList
              authorizedStoreIds={ formData.authorizedStores || [] }
              onChange={ (updated) => dispatch(RoleSlice.formActions.updateFormData({ authorizedStores: updated })) }
            />
          )
        }],
        initRequests: () => dispatch(StoreSlice.entityActions.filterAll()),
        permissionSecions: getPermissionSections(t),
        labels: getLabels(t)
      } }
    />
  );
}
