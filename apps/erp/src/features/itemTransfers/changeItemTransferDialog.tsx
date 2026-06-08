import StoresSearchableSelect from "@/core/components/searchableSelect/storesSearchableSelect";
import { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { ChangeDialogOld, type CommonChangeDialogPropsOld, DialogContent, DialogDescription, DialogHeader, DialogTitle, FieldGroup, FieldsSection, FilterByTypeRequest, FormFieldOld, Loading, TextFieldOld, useFormErrors, useFormInit, useValidate } from "yusr-ui";
import { ItemType } from "../../core/data/item";
import ItemTransfer, { ItemTransfersItem, ItemTransferSlice, ItemTransferValidationRules } from "../../core/data/itemTransfer";
import { fetchStoreItems } from "../../core/state/shared/storeItemsSlice";
import { useAppDispatch, useAppSelector } from "../../core/state/store";
import StoreItemSelector from "../items/storeItemSelector";
import { ItemTransferActions } from "./logic/itemTransferActions";
import { initializeItems } from "./logic/itemTransferSlice";
import SelectedItemsTable from "./selectedItemsTable";
import { StoreSlice } from "@/core/data/storeSlice";

export default function ChangeItemTransferDialog({
  entity,
  mode,
  service,
  onSuccess
}: CommonChangeDialogPropsOld<ItemTransfer>)
{
  const { t } = useTranslation(["stocking", "common"]);
  const dispatch = useAppDispatch();
  const [initLoading, setInitLoading] = useState(false);
  const storeState = useAppSelector((state) => state.store);
  const { items } = useAppSelector((state) => state.itemTransferUI);

  const initialValues = useMemo(
    () => ({
      ...entity,
      transferDate: entity?.transferDate
        ? new Date(entity.transferDate).toLocaleDateString("en-CA")
        : new Date().toLocaleDateString("en-CA"),
      itemTransfersItems: entity?.itemTransfersItems || []
    }),
    [entity]
  );

  const { formData, errors } = useAppSelector((state) => state.itemTransferForm);
  const { getError, isInvalid } = useFormErrors(errors);
  const { validate } = useValidate(
    formData,
    ItemTransferValidationRules.validationRules(t),
    (errors) => dispatch(ItemTransferSlice.formActions.setErrors(errors))
  );
  useFormInit(ItemTransferSlice.formActions.setInitialData, initialValues);

  useEffect(() =>
  {
    if (mode === "update" && entity?.itemTransfersItems)
    {
      ItemTransferActions.initialize(dispatch, entity.itemTransfersItems);
    }
    return () =>
    {
      ItemTransferActions.clear(dispatch);
    };
  }, [dispatch, entity, mode]);

  useEffect(() =>
  {
    const mappedItems = items.map(
      (item) =>
        new ItemTransfersItem({
          id: isNaN(Number(item.id)) ? Math.floor(Math.random() * 1000000) : Number(item.id),
          itemId: item.itemId,
          itemName: item.itemName,
          itemUnitPricingMethodId: item.selectedPricingMethodId,
          itemUnitPricingMethodName: item.itemUnitPricingMethods.find((m) =>
            m.id === item.selectedPricingMethodId
          )?.itemUnitPricingMethodName || "",
          quantity: item.quantity,
          itemUnitPricingMethods: item.itemUnitPricingMethods as any
        })
    );
    dispatch(ItemTransferSlice.formActions.updateFormData({ itemTransfersItems: mappedItems }));
  }, [items]);

  useEffect(() =>
  {
    if (mode === "update" && entity?.id)
    {
      setInitLoading(true);
      const getItem = async () =>
      {
        const res = await service.Get(entity.id);
        dispatch(ItemTransferSlice.formActions.updateFormData({ ...res.data }));
        dispatch(initializeItems(res.data?.itemTransfersItems ?? []));
        setInitLoading(false);
      };
      getItem();
    }
  }, [entity?.id, mode]);

  const handleValidate = () =>
  {
    const isFormValid = validate();
    const isTableValid = ItemTransferActions.validate(dispatch, items, t);
    return isFormValid && isTableValid;
  };

  useEffect(() =>
  {
    if (formData.fromStoreId)
    {
      dispatch(fetchStoreItems({
        pageNumber: 1,
        rowsPerPage: 100,
        storeId: formData.fromStoreId,
        request: new FilterByTypeRequest({ types: [ItemType.Product] })
      }));
    }
  }, [dispatch, formData.fromStoreId]);

  useEffect(() =>
  {
    dispatch(StoreSlice.entityActions.filter());
  }, [dispatch]);

  const availableFromStores = useMemo(() =>
  {
    if (!storeState.entities.data)
    {
      return [];
    }
    return storeState.entities.data.filter((s) => s.id !== formData.toStoreId);
  }, [storeState.entities.data, formData.toStoreId]);

  const availableToStores = useMemo(() =>
  {
    if (!storeState.entities.data)
    {
      return [];
    }
    return storeState.entities.data.filter((s) => s.id !== formData.fromStoreId);
  }, [storeState.entities.data, formData.fromStoreId]);

  if (initLoading)
  {
    return (
      <DialogContent dir="rtl">
        <DialogHeader>
          <DialogTitle>
            { mode === "create"
              ? t("itemTransfers.addNewTitle")
              : `${t("common:crudRow.edit")} ${t("itemTransfers.entityName")}` }
          </DialogTitle>
          <DialogDescription />
        </DialogHeader>
        <Loading entityName={ t("items.entityName") } />
      </DialogContent>
    );
  }

  return (
    <ChangeDialogOld<ItemTransfer>
      title={ mode === "create"
        ? t("itemTransfers.addNewTitle")
        : `${t("common:crudRow.edit")} ${t("itemTransfers.entityName")}` }
      className="sm:max-w-5xl"
      formData={ formData }
      dialogMode={ mode }
      service={ service }
      disable={ () => storeState.isLoading }
      onSuccess={ (data) => onSuccess?.(data, mode) }
      validate={ handleValidate }
    >
      <FieldGroup>
        <FieldsSection columns={ 3 }>
          <TextFieldOld
            label={ t("itemTransfers.stocktakingDate") }
            required
            value={ formData.transferDate ? new Date(formData.transferDate).toLocaleDateString("en-CA") : "" }
            isInvalid={ isInvalid("date") }
            error={ getError("date") }
            disabled
          />
          <FormFieldOld
            label={ t("itemTransfers.fromStore") }
            required
            isInvalid={ isInvalid("fromStoreId") }
            error={ getError("fromStoreId") }
          >
            <StoresSearchableSelect
              selectedId={ formData.fromStoreId }
              selectedLabel={ formData.fromStoreName }
              items={ availableFromStores }
              disabled={ mode === "update" }
              isInvalid={ isInvalid("fromStoreId") }
              onValueChange={ (store) =>
              {
                ItemTransferActions.clear(dispatch);
                dispatch(
                  ItemTransferSlice.formActions.updateFormData({
                    fromStoreId: store?.id,
                    fromStoreName: store?.name
                  })
                );
              } }
            />
          </FormFieldOld>

          <FormFieldOld
            label={ t("itemTransfers.toStore") }
            required
            isInvalid={ isInvalid("toStoreId") }
            error={ getError("toStoreId") }
          >
            <StoresSearchableSelect
              selectedId={ formData.toStoreId }
              selectedLabel={ formData.toStoreName }
              items={ availableToStores }
              disabled={ mode === "update" }
              isInvalid={ isInvalid("toStoreId") }
              onValueChange={ (store) =>
              {
                dispatch(
                  ItemTransferSlice.formActions.updateFormData({ toStoreId: store?.id, toStoreName: store?.name })
                );
              } }
            />
          </FormFieldOld>
        </FieldsSection>

        <FieldsSection columns={ 1 }>
          <TextFieldOld
            label={ t("itemTransfers.description") }
            value={ formData.description || "" }
            onChange={ (e) => dispatch(ItemTransferSlice.formActions.updateFormData({ description: e.target.value })) }
          />
        </FieldsSection>

        <FieldsSection columns={ 1 }>
          { formData.fromStoreId && (
            <>
              { mode === "create" && (
                <StoreItemSelector
                  itemTypes={ [ItemType.Product] }
                  storeId={ formData.fromStoreId }
                  onSelect={ (storeItem, selectedIupm) =>
                  {
                    ItemTransferActions.addItem(dispatch, storeItem, selectedIupm);
                  } }
                />
              ) }

              <SelectedItemsTable mode={ mode } />
            </>
          ) }
        </FieldsSection>
      </FieldGroup>
    </ChangeDialogOld>
  );
}
