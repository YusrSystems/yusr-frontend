import ClientsAndSuppliersSearchableSelect from "@/core/components/searchableSelect/clientsAndSuppliersSearchableSelect";
import PaymentMethodsSearchableSelect from "@/core/components/searchableSelect/paymentMethodsSearchableSelect";
import StoresSearchableSelect from "@/core/components/searchableSelect/storesSearchableSelect";
import { SettingSlice } from "@/core/data/settingOld";
import { useAppSelector } from "@/core/state/store";
import { useTranslation } from "react-i18next";
import { FieldGroup, FieldsSection, useAppDispatch } from "yusr-ui";

export default function DefaultsSection()
{
  const { t } = useTranslation("erpCommon");
  const { formData } = useAppSelector((state) => state.settingForm);
  const dispatch = useAppDispatch();

  return (
    <div className="space-y-10 animate-in fade-in">
      <FieldGroup>
        <FieldsSection title={ t("settings.defaultAccountsAndWarehouses") } columns={ 2 }>
          <div className="flex flex-col gap-1.5 w-full">
            <label className="text-sm font-medium">{ t("settings.defaultWarehouse") }</label>
            <StoresSearchableSelect
              showNullOption
              selectedId={ formData.mainStoreId }
              selectedLabel={ formData.mainStoreName }
              onValueChange={ (selected) =>
                dispatch(
                  SettingSlice.formActions.updateFormData({ mainStoreId: selected?.id, mainStoreName: selected?.name })
                ) }
            />
          </div>

          <div className="flex flex-col gap-1.5 w-full">
            <label className="text-sm font-medium">{ t("settings.defaultPaymentMethod") }</label>
            <PaymentMethodsSearchableSelect
              showNullOption
              selectedId={ formData.mainPaymentMethodId }
              selectedLabel={ formData.mainPaymentMethodName }
              onValueChange={ (selected) =>
                dispatch(
                  SettingSlice.formActions.updateFormData({
                    mainPaymentMethodId: selected?.id,
                    mainPaymentMethodName: selected?.name
                  })
                ) }
            />
          </div>

          <div className="flex flex-col gap-1.5 w-full">
            <label className="text-sm font-medium">{ t("settings.defaultSalesAccount") }</label>
            <ClientsAndSuppliersSearchableSelect
              showNullOption
              selectedId={ formData.sellAccountId }
              selectedLabel={ formData.sellAccountName }
              onValueChange={ (account) =>
                dispatch(
                  SettingSlice.formActions.updateFormData(
                    { sellAccountId: account?.id, sellAccountName: account?.name }
                  )
                ) }
            />
          </div>

          <div className="flex flex-col gap-1.5 w-full">
            <label className="text-sm font-medium">{ t("settings.defaultPurchaseAccount") }</label>
            <ClientsAndSuppliersSearchableSelect
              showNullOption
              selectedId={ formData.purchaseAccountId }
              selectedLabel={ formData.purchaseAccountName }
              onValueChange={ (account) =>
                dispatch(
                  SettingSlice.formActions.updateFormData(
                    { purchaseAccountId: account?.id, purchaseAccountName: account?.name }
                  )
                ) }
            />
          </div>
        </FieldsSection>
      </FieldGroup>
    </div>
  );
}
