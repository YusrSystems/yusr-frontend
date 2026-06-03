import { Star } from "lucide-react";
import { useTranslation } from "react-i18next";
import { type DialogMode, SelectFieldOld, StorageFileField, StorageType, TextAreaField, TextFieldOld, useFormErrors, useStorageFile } from "yusr-ui";
import Item, { ItemSlice, ItemType, ItemUnitPricingMethod } from "../../../core/data/item";
import { useAppDispatch, useAppSelector } from "../../../core/state/store";
import TaxesSection from "./taxesSection";

export default function BasicTab({ mode }: { mode: DialogMode; })
{
  const { t } = useTranslation("stocking");
  const dispatch = useAppDispatch();
  const {
    fileInputRef,
    handleFileChange,
    handleRemoveFile,
    handleDownload,
    showFilePreview,
    handleSetPrimary,
    getFileSrc
  } = useStorageFile(
    (data) => dispatch(ItemSlice.formActions.updateFormData(data as Partial<Item>)),
    "itemImages",
    StorageType.Public
  );

  const { formData, errors } = useAppSelector((state) => state.itemForm);
  const { getError, isInvalid } = useFormErrors(errors);

  const serviceIdsState = useAppSelector((state) => state.serviceIds);

  return (
    <div className="space-y-6 animate-in fade-in">
      <div className="flex flex-col lg:flex-row gap-8">
        <div className="flex-1 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <TextFieldOld
              label={ t("items.itemName") }
              required
              value={ formData.name || "" }
              isInvalid={ isInvalid("name") }
              error={ getError("name") }
              onChange={ (e) =>
              {
                dispatch(ItemSlice.formActions.updateFormData({ name: e.target.value }));
                dispatch(ItemSlice.formActions.clearError("name"));
              } }
            />
            <SelectFieldOld
              label={ t("items.itemType") }
              required
              disabled={ mode === "update" }
              value={ formData.type?.toString() || "" }
              onValueChange={ (val) =>
                dispatch(ItemSlice.formActions.updateFormData({
                  type: Number(val) as ItemType,
                  itemStores: [],
                  initialQuantity: 0,
                  sellUnitId: val === ItemType.Service.toString()
                    ? serviceIdsState.serviceIds?.unitId || 0
                    : undefined,
                  sellUnitName: val === ItemType.Service.toString() ? t("items.service") : undefined,
                  itemUnitPricingMethods: val === ItemType.Service.toString()
                    ? [
                      new ItemUnitPricingMethod({
                        unitId: serviceIdsState.serviceIds?.unitId || 0,
                        pricingMethodId: serviceIdsState.serviceIds?.pricingMethodId || 0,
                        unitName: t("items.service"),
                        pricingMethodName: t("items.service"),
                        quantityMultiplier: 1,
                        itemUnitPricingMethodName: t("items.service")
                      })
                    ]
                    : []
                })) }
              options={ [{ label: t("items.product"), value: ItemType.Product.toString() }, {
                label: t("items.service"),
                value: ItemType.Service.toString()
              }] }
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <TextFieldOld
              label={ t("items.class") }
              value={ formData.class || "" }
              onChange={ (e) => dispatch(ItemSlice.formActions.updateFormData({ class: e.target.value })) }
            />
            <SelectFieldOld
              label={ t("items.status") }
              required
              value={ formData.statusId?.toString() || "1" }
              onValueChange={ (val) => dispatch(ItemSlice.formActions.updateFormData({ statusId: Number(val) })) }
              options={ [{ label: t("items.active"), value: "1" }, { label: t("items.inactive"), value: "0" }] }
            />
          </div>

          <TextAreaField
            label={ t("items.description") }
            value={ formData.description || "" }
            onChange={ (e) => dispatch(ItemSlice.formActions.updateFormData({ description: e.target.value })) }
            rows={ 2 }
          />

          <TextAreaField
            label={ t("items.notes") }
            value={ formData.notes || "" }
            onChange={ (e) => dispatch(ItemSlice.formActions.updateFormData({ notes: e.target.value })) }
            rows={ 2 }
          />
        </div>

        <div className="w-full lg:w-108 shrink-0 bg-muted/10 p-4 rounded-lg border">
          <StorageFileField
            label={ t("items.itemImages") }
            file={ formData.itemImages }
            fileInputRef={ fileInputRef }
            onFileChange={ handleFileChange }
            onRemove={ handleRemoveFile }
            onDownload={ handleDownload }
            getFileSrc={ getFileSrc }
            showPreview={ showFilePreview }
            extraActions={ [{
              icon: <Star className="h-4 w-4" />,
              label: "Mark as Primary",
              className: "bg-yellow-500 text-white",
              onClick: (index) => handleSetPrimary(index)
            }] }
          />
        </div>
      </div>

      <TaxesSection mode={ mode } />
    </div>
  );
}
