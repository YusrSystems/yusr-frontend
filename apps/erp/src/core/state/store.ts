import { configureStore } from "@reduxjs/toolkit";
import { type TypedUseSelectorHook, useDispatch, useSelector } from "react-redux";
import { BranchSlice, CitySlice, createAuthSlice, CurrencySlice, RoleSlice, setupAuthListenersForRedux, systemReducer, UserOld, UserSlice, type YusrAppDispatch, type YusrRootState } from "yusr-ui";
import dashboardReducer from "../../features/dashboard/logic/dashboardSlice";
import registerReducer from "../../features/register/logic/registerSlice";
import { BanksAndBoxesSlice, BanksSlice, BoxesSlice, ClientsAndSuppliersSlice, ClientsSlice, EmployeesSlice, SuppliersSlice } from "../data/accountOld";
import { BalanceTransferSlice } from "../data/balanceTransfer";
import { PurchasesSlice, QuotationSlice, SalesSlice } from "../data/invoiceOld.ts";
import { ItemSlice } from "../data/itemOld";
import { ItemsSettlementSlice } from "../data/itemsSettlement";
import { PaymentMethodSlice } from "../data/paymentMethod";
import { PricingMethodSlice } from "../data/pricingMethodOld";
import { type SettingOld, SettingSlice } from "../data/settingOld";
import { StoreSlice } from "../data/storeSlice";
import { TaxSlice } from "../data/tax";
import { UnitSlice } from "../data/unitOld";
import { VoucherSlice } from "../data/voucherOld.ts";
import itemBarcodeReducer from "./shared/itemBarcodeSlice";
import serviceIdsReducer from "./shared/serviceIdsSlice";
import storeItemsReducer from "./shared/storeItemsSlice";

const authSlice = createAuthSlice<UserOld, SettingOld>();
export const {
  login,
  logout,
  updateLoggedInUser,
  updateSetting,
  syncFromStorage
} = authSlice.actions;

export const store = configureStore({
  reducer: {
    branch: BranchSlice.entityReducer,
    branchForm: BranchSlice.formReducer,
    branchDialog: BranchSlice.dialogReducer,
    role: RoleSlice.entityReducer,
    roleForm: RoleSlice.formReducer,
    roleDialog: RoleSlice.dialogReducer,
    user: UserSlice.entityReducer,
    userForm: UserSlice.formReducer,
    userDialog: UserSlice.dialogReducer,
    city: CitySlice.entityReducer,
    currency: CurrencySlice.entityReducer,
    auth: authSlice.reducer,
    system: systemReducer,
    storeItems: storeItemsReducer,
    itemBarcode: itemBarcodeReducer,
    serviceIds: serviceIdsReducer,
    settingForm: SettingSlice.formReducer,
    tax: TaxSlice.entityReducer,
    taxForm: TaxSlice.formReducer,
    taxDialog: TaxSlice.dialogReducer,
    store: StoreSlice.entityReducer,
    storeForm: StoreSlice.formReducer,
    storeDialog: StoreSlice.dialogReducer,
    unit: UnitSlice.entityReducer,
    unitForm: UnitSlice.formReducer,
    unitDialog: UnitSlice.dialogReducer,
    clients: ClientsSlice.entityReducer,
    clientsForm: ClientsSlice.formReducer,
    clientsDialog: ClientsSlice.dialogReducer,
    suppliers: SuppliersSlice.entityReducer,
    suppliersForm: SuppliersSlice.formReducer,
    suppliersDialog: SuppliersSlice.dialogReducer,
    employees: EmployeesSlice.entityReducer,
    employeesForm: EmployeesSlice.formReducer,
    employeesDialog: EmployeesSlice.dialogReducer,
    banks: BanksSlice.entityReducer,
    banksForm: BanksSlice.formReducer,
    banksDialog: BanksSlice.dialogReducer,
    boxes: BoxesSlice.entityReducer,
    boxesForm: BoxesSlice.formReducer,
    boxesDialog: BoxesSlice.dialogReducer,
    banksAndBoxes: BanksAndBoxesSlice.entityReducer,
    banksAndBoxesForm: BanksAndBoxesSlice.formReducer,
    clientsAndSuppliers: ClientsAndSuppliersSlice.entityReducer,
    clientsAndSuppliersForm: ClientsAndSuppliersSlice.formReducer,
    sales: SalesSlice.entityReducer,
    salesForm: SalesSlice.formReducer,
    salesDialog: SalesSlice.dialogReducer,
    quotations: QuotationSlice.entityReducer,
    quotationsForm: QuotationSlice.formReducer,
    quotationsDialog: QuotationSlice.dialogReducer,
    purchases: PurchasesSlice.entityReducer,
    purchasesForm: PurchasesSlice.formReducer,
    purchasesDialog: PurchasesSlice.dialogReducer,
    paymentMethod: PaymentMethodSlice.entityReducer,
    paymentMethodForm: PaymentMethodSlice.formReducer,
    paymentMethodDialog: PaymentMethodSlice.dialogReducer,
    balanceTransfer: BalanceTransferSlice.entityReducer,
    balanceTransferForm: BalanceTransferSlice.formReducer,
    balanceTransferDialog: BalanceTransferSlice.dialogReducer,
    voucher: VoucherSlice.entityReducer,
    voucherForm: VoucherSlice.formReducer,
    voucherDialog: VoucherSlice.dialogReducer,
    item: ItemSlice.entityReducer,
    itemForm: ItemSlice.formReducer,
    itemDialog: ItemSlice.dialogReducer,
    pricingMethod: PricingMethodSlice.entityReducer,
    pricingMethodForm: PricingMethodSlice.formReducer,
    pricingMethodDialog: PricingMethodSlice.dialogReducer,
    itemsSettlement: ItemsSettlementSlice.entityReducer,
    itemsSettlementForm: ItemsSettlementSlice.formReducer,
    itemsSettlementDialog: ItemsSettlementSlice.dialogReducer,
    dashboard: dashboardReducer,
    register: registerReducer
  }
});

setupAuthListenersForRedux(store.dispatch, {
  logout: authSlice.actions.logout,
  syncFromStorage: authSlice.actions.syncFromStorage
});

export type RootState = ReturnType<typeof store.getState> & YusrRootState;
export type AppDispatch = YusrAppDispatch & typeof store.dispatch;

export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
