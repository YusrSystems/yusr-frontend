import type PaymentMethod from "@/core/data/paymentMethod";
import { PaymentMethodFilterColumns, PaymentMethodSlice } from "@/core/data/paymentMethod";
import PaymentMethodsApiService from "@/core/networking/paymentMethodApiService";
import ChangePaymentMethodDialog from "@/features/paymentMethods/changePaymentMethodDialog";
import { useTranslation } from "react-i18next";
import { ChangableSearchableSelect, type EntitySearchableSelectParams } from "yusr-ui";
import { SystemPermissionsResources } from "../../auth/systemPermissionsResources";
import { useAppSelector } from "../../state/store";

export default function PaymentMethodsSearchableSelect(
  { id, disabled, isInvalid, onValueChange }: EntitySearchableSelectParams<PaymentMethod>
)
{
  const PaymentMethodState = useAppSelector((state) => state.paymentMethod);
  const authState = useAppSelector((state) => state.auth);
  const { t } = useTranslation("accounting");

  return (
    <ChangableSearchableSelect<PaymentMethod, {
      filterDataOutside?: boolean;
    }>
      id={ id }
      itemLabelKey="name"
      itemValueKey="id"
      state={ PaymentMethodState }
      apiService={ new PaymentMethodsApiService() }
      columnsNames={ PaymentMethodFilterColumns.columnsNames(t) }
      disabled={ disabled }
      isInvalid={ isInvalid }
      systemPermissionsResources={ SystemPermissionsResources.PaymentMethods }
      onValueChange={ onValueChange }
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
    />
  );
}
