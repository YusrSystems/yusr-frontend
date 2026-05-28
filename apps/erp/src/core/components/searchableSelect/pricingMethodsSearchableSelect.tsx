import PricingMethodsApiService from "@/core/networking/PricingMethodsApiService";
import ChangePricingMethodDialog from "@/features/pricingMethods/changePricingMethodDialog";
import { type BasicSearchableSelectParams, ChangableSearchableSelect } from "yusr-ui";
import { SystemPermissionsResources } from "../../auth/systemPermissionsResources";
import type PricingMethod from "../../data/pricingMethod";
import { PricingMethodSlice } from "../../data/pricingMethod";
import { useAppSelector } from "../../state/store";

export default function PricingMethodsSearchableSelect(
  { ...props }: BasicSearchableSelectParams<PricingMethod>
)
{
  const pricingMethodState = useAppSelector((state) => state.pricingMethod);
  const authState = useAppSelector((state) => state.auth);

  return (
    <ChangableSearchableSelect<PricingMethod>
      labelKey="name"
      mode="inline"
      state={ pricingMethodState }
      apiService={ new PricingMethodsApiService() }
      systemPermissionsResources={ SystemPermissionsResources.PricingMethods }
      allowUpdate={ false }
      entityActions={ {
        filter: PricingMethodSlice.entityActions.filter,
        refresh: PricingMethodSlice.entityActions.refresh
      } }
      changeDialog={ ChangePricingMethodDialog }
      authPermissions={ authState.loggedInUser?.role?.permissions ?? [] }
      { ...props }
    />
  );
}
