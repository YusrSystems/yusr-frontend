import { useTranslation } from "react-i18next";
import { FieldGroup, FieldsSection, SearchableSelect } from "yusr-ui";
import { AccountFilterColumns, ClientsAndSuppliersSlice } from "../../core/data/account";
import { PaymentMethodFilterColumns, PaymentMethodSlice } from "../../core/data/paymentMethod";
import { StoreFilterColumns, StoreSlice } from "../../core/data/store";
import { useAppDispatch, useAppSelector } from "../../core/state/store";
import { useSettingContext } from "./settingContext";

export default function DefaultsSection()
{
  const { t } = useTranslation("erpCommon");
  const { t: tStocking } = useTranslation("stocking");
  const { t: tAccounting } = useTranslation("accounting");
  const {
    formData,
    handleChange
  } = useSettingContext();

  const dispatch = useAppDispatch();
  const storeState = useAppSelector((state) => state.store);
  const paymentMethodState = useAppSelector((state) => state.paymentMethod);
  const accountState = useAppSelector((state) => state.clientsAndSuppliers);

  return (
    <div className="space-y-10 animate-in fade-in">
      <FieldGroup>
        <FieldsSection title={t("settings.defaultAccountsAndWarehouses")} columns={ 2 }>
          <div className="flex flex-col gap-1.5 w-full">
            <label className="text-sm font-medium">{t("settings.defaultWarehouse")}</label>
            <SearchableSelect
              items={ storeState.entities.data ?? [] }
              itemLabelKey="name"
              itemValueKey="id"
              value={ formData.mainStoreId?.toString() || "" }
              onValueChange={ (val) =>
              {
                const selected = storeState.entities.data?.find((s) => s.id.toString() === val);
                handleChange({ mainStoreId: selected?.id, mainStoreName: selected?.name });
              } }
              columnsNames={ StoreFilterColumns.columnsNames(tStocking) }
              onSearch={ (condition) => dispatch(StoreSlice.entityActions.filter(condition)) }
              isLoading={ storeState.isLoading }
              disabled={ storeState.isLoading }
            />
          </div>

          <div className="flex flex-col gap-1.5 w-full">
            <label className="text-sm font-medium">{t("settings.defaultPaymentMethod")}</label>
            <SearchableSelect
              items={ paymentMethodState.entities.data ?? [] }
              itemLabelKey="name"
              itemValueKey="id"
              value={ formData.mainPaymentMethodId?.toString() || "" }
              onValueChange={ (val) =>
              {
                const selected = paymentMethodState.entities.data?.find((p) => p.id.toString() === val);
                handleChange({ mainPaymentMethodId: selected?.id, mainPaymentMethodName: selected?.name });
              } }
              columnsNames={ PaymentMethodFilterColumns.columnsNames }
              onSearch={ (condition) => dispatch(PaymentMethodSlice.entityActions.filter(condition)) }
              isLoading={ paymentMethodState.isLoading }
              disabled={ paymentMethodState.isLoading }
            />
          </div>

          <div className="flex flex-col gap-1.5 w-full">
            <label className="text-sm font-medium">{t("settings.defaultSalesAccount")}</label>
            <SearchableSelect
              items={ accountState.entities.data ?? [] }
              itemLabelKey="name"
              itemValueKey="id"
              value={ formData.sellAccountId?.toString() || "" }
              onValueChange={ (val) =>
              {
                const selected = accountState.entities.data?.find((a) => a.id.toString() === val);
                handleChange({ sellAccountId: selected?.id, sellAccountName: selected?.name });
              } }
              columnsNames={ AccountFilterColumns.columnsNames(tAccounting) }
              onSearch={ (condition) => dispatch(ClientsAndSuppliersSlice.entityActions.filter(condition)) }
              isLoading={ accountState.isLoading }
              disabled={ accountState.isLoading }
            />
          </div>

          <div className="flex flex-col gap-1.5 w-full">
            <label className="text-sm font-medium">{t("settings.defaultPurchaseAccount")}</label>
            <SearchableSelect
              items={ accountState.entities.data ?? [] }
              itemLabelKey="name"
              itemValueKey="id"
              value={ formData.purchaseAccountId?.toString() || "" }
              onValueChange={ (val) =>
              {
                const selected = accountState.entities.data?.find((a) => a.id.toString() === val);
                handleChange({ purchaseAccountId: selected?.id, purchaseAccountName: selected?.name });
              } }
              columnsNames={ AccountFilterColumns.columnsNames(tAccounting) }
              onSearch={ (condition) => dispatch(ClientsAndSuppliersSlice.entityActions.filter(condition)) }
              isLoading={ accountState.isLoading }
              disabled={ accountState.isLoading }
            />
          </div>
        </FieldsSection>
      </FieldGroup>
    </div>
  );
}