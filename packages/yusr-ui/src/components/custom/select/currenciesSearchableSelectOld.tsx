import { useSelector } from "react-redux";
import { YusrSystemPermissionsResources } from "../../../auth";
import { CurrencyOld, CurrencySlice } from "../../../entities";
import { BaseApiServiceOld, CurrenciesApiServiceOld } from "../../../networking";
import type { YusrRootState } from "../../../state";
import { ChangableSearchableSelect } from "./changableSearchableSelect";
import type { BasicSearchableSelectParamsOld } from "./searchableSelectOld";

export function CurrenciesSearchableSelectOld(
  { ...props }: BasicSearchableSelectParamsOld<CurrencyOld>
)
{
  const currencyState = useSelector((state: YusrRootState) => state.currency);
  const authState = useSelector((state: YusrRootState) => state.auth);

  return (
    <ChangableSearchableSelect<CurrencyOld>
      labelKey="name"
      state={ currencyState }
      apiService={ new CurrenciesApiServiceOld() as unknown as BaseApiServiceOld<CurrencyOld> }
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
