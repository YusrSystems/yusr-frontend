import StoresSearchableSelect from "@/core/components/searchableSelect/storesSearchableSelect";
import { Plus, Trash2 } from "lucide-react";
import { useTranslation } from "react-i18next";
import { Button, type DialogMode, FormField, NumberField, TextFieldOld, useFormErrors } from "yusr-ui";
import { ItemSlice, ItemStore, ItemType } from "../../../core/data/item";
import { useAppDispatch, useAppSelector } from "../../../core/state/store";

export default function StorageTab({ mode }: { mode: DialogMode; })
{
  const { t } = useTranslation("stocking");
  const dispatch = useAppDispatch();

  const { formData, errors } = useAppSelector((state) => state.itemForm);
  const { getError, isInvalid } = useFormErrors(errors);

  const addStore = () =>
    dispatch(ItemSlice.formActions.updateFormData({
      itemStores: [...(formData.itemStores || []), new ItemStore({ quantity: 0, initialQuantity: 0 })]
    }));
  const updateStore = (index: number, updates: Partial<ItemStore>) =>
  {
    const list = [...(formData.itemStores || [])];
    list[index] = { ...list[index], ...updates };

    if (updates.initialQuantity !== undefined)
    {
      const totalInitial = list.reduce(
        (sum, store) => sum + (Number(store.initialQuantity) || 0),
        0
      );
      dispatch(ItemSlice.formActions.updateFormData({ itemStores: list, initialQuantity: totalInitial }));
    }
    else
    {
      dispatch(ItemSlice.formActions.updateFormData({ itemStores: list }));
    }
  };
  const removeStore = (index: number) =>
  {
    const list = [...(formData.itemStores || [])];
    list.splice(index, 1);
    const totalInitial = list.reduce(
      (sum, store) => sum + (Number(store.initialQuantity) || 0),
      0
    );
    dispatch(ItemSlice.formActions.updateFormData({ itemStores: list, initialQuantity: totalInitial }));
  };

  const hasError = isInvalid("itemStores");
  const errorMessage = getError("itemStores");
  const isService = formData.type === ItemType.Service;

  return (
    <div className="space-y-6 animate-in fade-in">
      <div className="grid grid-cols-3 gap-6">
        <NumberField
          label={ t("items.minQuantity") }
          value={ formData.minQuantity || "" }
          onChange={ (val) => dispatch(ItemSlice.formActions.updateFormData({ minQuantity: val })) }
        />
        <NumberField
          label={ t("items.maxQuantity") }
          value={ formData.maxQuantity || "" }
          onChange={ (val) => dispatch(ItemSlice.formActions.updateFormData({ maxQuantity: val })) }
        />
        <TextFieldOld
          label={ t("items.locationInStore") }
          value={ formData.location || "" }
          onChange={ (e) => dispatch(ItemSlice.formActions.updateFormData({ location: e.target.value })) }
        />
        <NumberField
          label={ t("items.totalInitialQuantity") }
          value={ formData.initialQuantity || "0" }
          disabled={ true }
          className="bg-muted font-bold"
        />
        <NumberField
          label={ t("items.totalCurrentQuantity") }
          value={ formData.quantity || "0" }
          disabled={ true }
          className="bg-muted font-bold"
        />
      </div>

      <div className="pt-4">
        <div className="flex justify-between items-center mb-4">
          <h3 className="font-bold">{ t("items.storageMethods") }</h3>
          <Button type="button" size="sm" onClick={ addStore }>
            <Plus className="w-4 h-4 me-2" /> { t("items.addStorageMethod") }
          </Button>
        </div>

        <div className={ `bg-muted/20 rounded-lg border overflow-hidden ${hasError ? "border-red-500" : ""}` }>
          <table className="w-full text-sm text-right">
            <thead className="bg-muted/50 text-muted-foreground">
              <tr>
                <th className="p-3 w-16 text-start">{ t("items.number") }</th>
                <th className="p-3 w-48 text-start">{ t("items.store") }</th>
                <th className="p-3 w-48 text-start">{ t("items.initialQuantity") }</th>
                <th className="p-3 w-48 text-start">{ t("items.currentQuantity") }</th>
                <th className="p-3 w-16 text-center"></th>
              </tr>
            </thead>
            <tbody>
              { formData.itemStores?.map((store, index) => (
                <tr key={ index } className="border-t border-muted">
                  <td className="p-3 font-bold text-start">{ index + 1 }</td>
                  <td className="p-3">
                    <FormField
                      label=""
                      isInvalid={ hasError && !isService && !store.storeId }
                    >
                      <StoresSearchableSelect
                        selectedId={ formData.itemStores?.[index]?.storeId }
                        selectedLabel={ formData.itemStores?.[index]?.storeName }
                        isInvalid={ hasError && !isService && !store.storeId }
                        onValueChange={ (store) =>
                        {
                          updateStore(index, {
                            storeId: store?.id,
                            storeName: store?.name
                          });
                        } }
                      />
                    </FormField>
                  </td>
                  <td className="p-3">
                    <NumberField
                      label=""
                      value={ store.initialQuantity || 0 }
                      disabled={ mode === "update" }
                      isInvalid={ hasError && !isService && !store.initialQuantity }
                      onChange={ (val) =>
                        updateStore(index, {
                          initialQuantity: val
                        }) }
                    />
                  </td>
                  <td className="p-3">
                    <NumberField
                      label=""
                      value={ store.quantity || "0" }
                      disabled
                    />
                  </td>
                  <td className="p-3 text-center">
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="text-red-500 hover:text-red-700 hover:bg-red-100"
                      onClick={ () => removeStore(index) }
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </td>
                </tr>
              )) }
            </tbody>
          </table>
          { formData.itemStores?.length === 0 && (
            <div className="p-4 text-center text-muted-foreground">
              { t("items.noStores") }
            </div>
          ) }
        </div>
        { hasError && errorMessage && (
          <div className="text-xs font-medium text-red-500 mt-2 animate-in fade-in slide-in-from-top-1">
            { errorMessage }
          </div>
        ) }
      </div>
    </div>
  );
}
