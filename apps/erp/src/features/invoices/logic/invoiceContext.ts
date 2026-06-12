import { createContext, useContext } from "react";
import type { ThunkDispatch } from "redux-thunk";
import type { AuthState, IEntityState, UserOld } from "yusr-ui";
import type AccountOld from "../../../core/data/accountOld";
import type { AccountSliceType } from "../../../core/data/accountOld";
import type Invoice from "../../../core/data/invoice";
import type { SettingOld } from "../../../core/data/settingOld";
import type { InvoiceDialogMode, InvoiceSliceType } from "../changeInvoiceDialog";

export type InvoiceContextType = {
  formData: Partial<Invoice>;
  errors: Record<string, string>;
  getError: (field: string) => string;
  isInvalid: (field: string) => boolean;
  slice: InvoiceSliceType;
  mode: InvoiceDialogMode;
  authState: AuthState<UserOld, SettingOld>;
  dispatch: ThunkDispatch<any, any, any>;
  disabled: boolean;
  accountState: IEntityState<AccountOld>;
  accountSlice: AccountSliceType;
};
export const InvoiceContext = createContext<InvoiceContextType | undefined>(
  undefined
);

export function useInvoiceContext(): InvoiceContextType
{
  const invoiceContext = useContext(InvoiceContext);
  if (!invoiceContext)
  {
    throw new Error(
      "useInvoiceContext must be used within an InvoiceContext.Provider"
    );
  }
  return invoiceContext;
}
