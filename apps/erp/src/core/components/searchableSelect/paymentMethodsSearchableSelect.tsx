import type PaymentMethod from "@/core/data/paymentMethod";
import { PaymentMethodSlice } from "@/core/data/paymentMethod";
import PaymentMethodsApiService from "@/core/networking/paymentMethodApiService";
import ChangePaymentMethodDialog from "@/features/paymentMethods/changePaymentMethodDialog";
import { type BasicSearchableSelectParamsOld, ChangableSearchableSelect } from "yusr-ui";
import { SystemPermissionsResources } from "../../auth/systemPermissionsResources";
import { useAppSelector } from "../../state/store";

export default function PaymentMethodsSearchableSelect(
  { ...props }: BasicSearchableSelectParamsOld<PaymentMethod>
)
{
  const PaymentMethodState = useAppSelector((state) => state.paymentMethod);
  const authState = useAppSelector((state) => state.auth);

  return (
    <ChangableSearchableSelect<PaymentMethod, {
      filterDataOutside?: boolean;
    }>
      labelKey="name"
      createKey="name"
      state={ PaymentMethodState }
      apiService={ new PaymentMethodsApiService() }
      systemPermissionsResources={ SystemPermissionsResources.PaymentMethods }
      entityActions={ {
        filter: PaymentMethodSlice.entityActions.filter,
        refresh: PaymentMethodSlice.entityActions.refresh
      } }
      allowAdd={ false }
      allowUpdate={ false }
      changeDialog={ ChangePaymentMethodDialog }
      changeDialogProps={ {
        filterDataOutside: true
      } }
      authPermissions={ authState.loggedInUser?.role?.permissions ?? [] }
      { ...props }
    />
  );
}
