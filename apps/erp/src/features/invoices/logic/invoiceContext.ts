import {createContext, useContext} from "react";
import type {ThunkDispatch} from "redux-thunk";
import type {AuthState, IEntityState, UserOld} from "yusr-ui";
import type AccountOld, {AccountSliceType} from "../../../core/data/accountOld";
import type InvoiceOld from "../../../core/data/invoiceOld.ts";
import type {SettingOld} from "../../../core/data/settingOld";
import type {InvoiceDialogMode, InvoiceSliceType} from "../changeInvoiceDialog.tsx";

export type InvoiceContextType = {
    formData: Partial<InvoiceOld>;
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

export function useInvoiceContext(): InvoiceContextType {
    const invoiceContext = useContext(InvoiceContext);
    if (!invoiceContext) {
        throw new Error(
            "useInvoiceContext must be used within an InvoiceContext.Provider"
        );
    }
    return invoiceContext;
}
