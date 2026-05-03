import type PaymentMethod from "@/core/data/paymentMethod";
import { PaymentMethodFilterColumns, PaymentMethodSlice } from "@/core/data/paymentMethod";
import PaymentMethodsApiService from "@/core/networking/paymentMethodApiService";
import ChangePaymentMethodDialog from "@/features/paymentMethods/changePaymentMethodDialog";
import type { EntitySearchableSelectParams } from "yusr-ui";
import ChangableSearchableSelect from "../../../../../../packages/yusr-ui/src/components/custom/select/changableSearchableSelect";
import { SystemPermissionsResources } from "../../auth/systemPermissionsResources";
import { useAppSelector } from "../../state/store";

export default function PaymentMethodsSearchableSelect(
  { id, disabled, isInvalid, onValueChange }: EntitySearchableSelectParams<PaymentMethod>
)
{
  const PaymentMethodState = useAppSelector((state) => state.paymentMethod);
  const authState = useAppSelector((state) => state.auth);

  return (
    <ChangableSearchableSelect<PaymentMethod, {
      filterDataOutside?: boolean;
    }>
      id={ id }
      itemLabelKey="name"
      itemValueKey="id"
      state={ PaymentMethodState }
      apiService={ new PaymentMethodsApiService() }
      columnsNames={ PaymentMethodFilterColumns.columnsNames }
      disabled={ disabled }
      isInvalid={ isInvalid }
      systemPermissionsResources={ SystemPermissionsResources.PaymentMethods }
      onValueChange={ onValueChange }
      entityActions={ {
        filter: PaymentMethodSlice.entityActions.filter,
        refresh: PaymentMethodSlice.entityActions.refresh
      } }
      changeDialog={ ChangePaymentMethodDialog }
      changeDialogProps={ {
        filterDataOutside: true
      } }
      authPermissions={ authState.loggedInUser?.role?.permissions ?? [] }
    />
  );
}
