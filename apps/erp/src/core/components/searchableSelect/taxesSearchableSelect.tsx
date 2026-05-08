import ChangeTaxDialog from "@/features/taxes/changeTaxDialog";
import { ChangableSearchableSelect, type EntitySearchableSelectParams } from "yusr-ui";
import { SystemPermissionsResources } from "../../auth/systemPermissionsResources";
import { Tax, TaxFilterColumns, TaxSlice } from "../../data/tax";
import TaxesApiService from "../../networking/taxesApiService";
import { useAppSelector } from "../../state/store";
import { useTranslation } from "react-i18next";

export default function TaxesSearchableSelect(
  { id, disabled, isInvalid, onValueChange }: EntitySearchableSelectParams<Tax>
)
{
  const taxState = useAppSelector((state) => state.tax);
  const authState = useAppSelector((state) => state.auth);
  const { t } = useTranslation("accounting");

  return (
    <ChangableSearchableSelect<Tax>
      id={ id }
      itemLabelKey="name"
      itemValueKey="id"
      state={ taxState }
      apiService={ new TaxesApiService() }
      columnsNames={ TaxFilterColumns.columnsNames(t) }
      disabled={ disabled }
      isInvalid={ isInvalid }
      systemPermissionsResources={ SystemPermissionsResources.Taxes }
      onValueChange={ onValueChange }
      entityActions={ {
        filter: TaxSlice.entityActions.filter,
        refresh: TaxSlice.entityActions.refresh
      } }
      changeDialog={ ChangeTaxDialog }
      authPermissions={ authState.loggedInUser?.role?.permissions ?? [] }
    />
  );
}
