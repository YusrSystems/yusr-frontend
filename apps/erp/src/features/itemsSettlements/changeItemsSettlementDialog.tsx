import StoresSearchableSelectOld from "@/core/components/searchableSelect/storesSearchableSelectOld";
import type StoreOld from "@/core/data/store";
import { StoreSlice } from "@/core/data/storeSlice";
import { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import type { CommonChangeDialogPropsOld } from "yusr-ui";
import { ChangeDialogOld, DialogContent, DialogDescription, DialogHeader, DialogTitle, FieldGroup, FieldsSection, FilterByTypeRequest, FormFieldOld, Loading, TextFieldOld, useFormErrors, useFormInit, useValidate } from "yusr-ui";
import { ItemType } from "../../core/data/item";
import ItemsSettlement, { ItemsSettlementItem, ItemsSettlementSlice, ItemsSettlementValidationRules } from "../../core/data/itemsSettlement";
import type { IStocktaking } from "../../core/data/stocktaking";
import { fetchStoreItems } from "../../core/state/shared/storeItemsSlice";
import { useAppDispatch, useAppSelector } from "../../core/state/store";
import StocktakingItemsTable from "../stocktakings/stocktakingItemsTable";

export default function ChangeItemsSettlementDialog(
  { entity, mode, service, onSuccess }: CommonChangeDialogPropsOld<ItemsSettlement>
)
{
  const { t } = useTranslation(["stocking", "common"]);
  const dispatch = useAppDispatch();
  const [initLoading, setInitLoading] = useState(false);
  const storeState = useAppSelector((state) => state.store);

  const initialValues = useMemo(() => ({
    ...entity,
    date: entity?.date ? new Date(entity.date).toLocaleDateString("en-CA") : new Date().toLocaleDateString("en-CA"),
    itemsSettlementItems: entity?.itemsSettlementItems || []
  }), [entity]);

  const { formData, errors } = useAppSelector((state) => state.itemsSettlementForm);
  const { getError, isInvalid } = useFormErrors(errors);
  const { validate } = useValidate(
    formData,
    ItemsSettlementValidationRules.validationRules(t),
    (errors) => dispatch(ItemsSettlementSlice.formActions.setErrors(errors))
  );
  useFormInit(ItemsSettlementSlice.formActions.setInitialData, initialValues);

  useEffect(() =>
  {
    dispatch(StoreSlice.entityActions.filter());
  }, [dispatch]);

  useEffect(() =>
  {
    if (formData.storeId)
    {
      dispatch(fetchStoreItems({
        pageNumber: 1,
        rowsPerPage: 100,
        storeId: formData.storeId,
        request: new FilterByTypeRequest({ types: [ItemType.Product] })
      }));
    }
  }, [dispatch, formData.storeId]);

  useEffect(() =>
  {
    if (mode === "update" && entity?.id)
    {
      setInitLoading(true);
      const getItem = async () =>
      {
        const res = await service.Get(entity.id);
        dispatch(ItemsSettlementSlice.formActions.updateFormData({ ...res.data }));
        setInitLoading(false);
      };
      getItem();
    }
  }, [entity?.id, mode]);

  const handleStoreChange = (store?: StoreOld) =>
  {
    dispatch(ItemsSettlementSlice.formActions.updateFormData({
      storeId: store?.id,
      storeName: store?.name,
      itemsSettlementItems: []
    }));
    ItemsSettlementSlice.formActions.clearError("storeId");
  };

  const tableFormData = useMemo(() => ({
    ...formData,
    stocktakingItems: formData.itemsSettlementItems
  }), [formData]);

  const handleTableChange = (update: any) =>
  {
    if (typeof update === "function")
    {
      dispatch(ItemsSettlementSlice.formActions.updateFormData((prev) =>
      {
        const mappedPrev = { ...prev, stocktakingItems: prev.itemsSettlementItems };
        const result = update(mappedPrev);
        if (result.stocktakingItems !== undefined)
        {
          return { ...prev, itemsSettlementItems: result.stocktakingItems as ItemsSettlementItem[] };
        }
        return { ...prev, ...result };
      }));
    }
    else
    {
      if (update.stocktakingItems !== undefined)
      {
        dispatch(
          ItemsSettlementSlice.formActions.updateFormData({
            itemsSettlementItems: update.stocktakingItems as ItemsSettlementItem[]
          })
        );
      }
      else
      {
        dispatch(ItemsSettlementSlice.formActions.updateFormData(update));
      }
    }
  };

  if (initLoading)
  {
    return (
      <DialogContent dir="rtl">
        <DialogHeader>
          <DialogTitle>
            { mode === "create"
              ? t("itemsSettlements.addNewTitle")
              : `${t("common:crudRow.edit")} ${t("itemsSettlements.entityName")}` }
          </DialogTitle>
          <DialogDescription />
        </DialogHeader>
        <Loading entityName={ t("itemsSettlements.entityName") } />
      </DialogContent>
    );
  }

  return (
    <ChangeDialogOld<ItemsSettlement>
      title={ mode === "create"
        ? t("itemsSettlements.addNewTitle")
        : `${t("common:crudRow.edit")} ${t("itemsSettlements.entityName")}` }
      className="sm:max-w-6xl"
      formData={ formData }
      dialogMode={ mode }
      service={ service }
      disable={ () => storeState.isLoading }
      onSuccess={ (data) => onSuccess?.(data, mode) }
      validate={ validate }
    >
      <div className="max-h-[75vh] overflow-y-auto px-2 pb-2">
        <FieldGroup>
          <FieldsSection columns={ 2 }>
            <TextFieldOld
              label={ t("itemsSettlements.settlementDate") }
              required
              value={ formData.date
                ? new Date(formData.date).toLocaleDateString("en-CA")
                : "" }
              isInvalid={ isInvalid("date") }
              error={ getError("date") }
              disabled
            />

            <FormFieldOld
              label={ t("itemsSettlements.store") }
              required
              isInvalid={ isInvalid("storeId") }
              error={ getError("storeId") }
            >
              <StoresSearchableSelectOld
                disabled={ mode === "update" }
                isInvalid={ isInvalid("storeId") }
                onValueChange={ handleStoreChange }
                selectedId={ formData.storeId }
                selectedLabel={ formData.storeName }
              />
            </FormFieldOld>
          </FieldsSection>

          <TextFieldOld
            label={ t("itemsSettlements.description") }
            value={ formData.description || "" }
            onChange={ (e) =>
              dispatch(ItemsSettlementSlice.formActions.updateFormData({ description: e.target.value })) }
          />

          { formData.storeId && (
            <StocktakingItemsTable
              formData={ tableFormData as Partial<IStocktaking> }
              errors={ errors }
              handleChange={ handleTableChange }
              createInstance={ () => new ItemsSettlementItem() }
              mode={ mode }
            />
          ) }
        </FieldGroup>
      </div>
    </ChangeDialogOld>
  );
}
