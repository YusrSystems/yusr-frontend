import PricingMethodsApiServiceOld from "@/core/networking/PricingMethodsApiServiceOld";
import { type BasicSearchableSelectParamsOld, ChangableSearchableSelect } from "yusr-ui";
import { SystemPermissionsResources } from "../../auth/systemPermissionsResources";
import type PricingMethodOld from "../../data/pricingMethodOld";
import { PricingMethodSlice } from "../../data/pricingMethodOld";
import { useAppSelector } from "../../state/store";

export default function PricingMethodsSearchableSelectOld(
  { ...props }: BasicSearchableSelectParamsOld<PricingMethodOld>
)
{
  const pricingMethodState = useAppSelector((state) => state.pricingMethod);
  const authState = useAppSelector((state) => state.auth);

  return (
    <ChangableSearchableSelect<PricingMethodOld>
      labelKey="name"
      createKey="name"
      mode="inline"
      state={ pricingMethodState }
      apiService={ new PricingMethodsApiServiceOld() }
      systemPermissionsResources={ SystemPermissionsResources.PricingMethods }
      allowUpdate={ false }
      entityActions={ {
        filter: PricingMethodSlice.entityActions.filter,
        refresh: PricingMethodSlice.entityActions.refresh
      } }
      authPermissions={ authState.loggedInUser?.role?.permissions ?? [] }
      { ...props }
    />
  );
}
