import { useSelector } from "react-redux";
import { YusrSystemPermissionsResources } from "../../../auth";
import { Currency, CurrencySlice } from "../../../entities";
import { BaseApiService, CurrenciesApiService } from "../../../networking";
import type { YusrRootState } from "../../../state";
import { ChangableSearchableSelect } from "./changableSearchableSelect";
import type { BasicSearchableSelectParams } from "./searchableSelect";

export function CurrenciesSearchableSelect(
  { ...props }: BasicSearchableSelectParams<Currency>
)
{
  const currencyState = useSelector((state: YusrRootState) => state.currency);
  const authState = useSelector((state: YusrRootState) => state.auth);

  return (
    <ChangableSearchableSelect<Currency>
      labelKey="name"
      state={ currencyState }
      apiService={ new CurrenciesApiService() as unknown as BaseApiService<Currency> }
      systemPermissionsResources={ YusrSystemPermissionsResources.Branches }
      entityActions={ {
        filter: CurrencySlice.entityActions.filter,
        refresh: CurrencySlice.entityActions.refresh
      } }
      authPermissions={ authState.loggedInUser?.role?.permissions ?? [] }
      allowAdd={ false }
      allowUpdate={ false }
      { ...props }
    />
  );
}
