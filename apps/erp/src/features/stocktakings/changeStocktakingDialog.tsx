import StoresSearchableSelect from "@/core/components/searchableSelect/storesSearchableSelect";
import { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import type { CommonChangeDialogProps } from "yusr-ui";
import { ChangeDialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, FieldGroup, FieldsSection, FilterByTypeRequest, FormField, Loading, TextField, useFormErrors, useFormInit, useValidate } from "yusr-ui";
import { ItemType } from "../../core/data/item";
import Stocktaking, { StocktakingItem, StocktakingSlice, StocktakingValidationRules } from "../../core/data/stocktaking";
import Store, { StoreSlice } from "../../core/data/store";
import { fetchStoreItems } from "../../core/state/shared/storeItemsSlice";
import { useAppDispatch, useAppSelector } from "../../core/state/store";
import StocktakingItemsTable from "./stocktakingItemsTable";

export default function ChangeStocktakingDialog(
  { entity, mode, service, onSuccess }: CommonChangeDialogProps<Stocktaking>
)
{
  const { t } = useTranslation(["stocking", "common"]);
  const dispatch = useAppDispatch();
  const [initLoading, setInitLoading] = useState(false);
  const storeState = useAppSelector((state) => state.store);

  const initialValues = useMemo(() => ({
    ...entity,
    date: entity?.date ? new Date(entity.date).toLocaleDateString("en-CA") : new Date().toLocaleDateString("en-CA"),
    stocktakingItems: entity?.stocktakingItems || []
  }), [entity]);

  const { formData, errors } = useAppSelector((state) => state.stocktakingForm);
  const { getError, isInvalid } = useFormErrors(errors);
  const { validate } = useValidate(
    formData,
    StocktakingValidationRules.validationRules(t),
    (errors) => dispatch(StocktakingSlice.formActions.setErrors(errors))
  );
  useFormInit(StocktakingSlice.formActions.setInitialData, initialValues);

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
        request: new FilterByTypeRequest({ condition: undefined, types: [ItemType.Product] })
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
        if (res.data != undefined)
        {
          dispatch(StocktakingSlice.formActions.setInitialData(res.data));
        }
        setInitLoading(false);
      };
      getItem();
    }
  }, [entity?.id, mode]);

  const handleStoreChange = (store?: Store) =>
  {
    dispatch(StocktakingSlice.formActions.updateFormData({
      storeId: store?.id,
      storeName: store?.name,
      stocktakingItems: []
    }));
    StocktakingSlice.formActions.clearError("storeId");
  };

  if (initLoading)
  {
    return (
      <DialogContent dir="rtl">
        <DialogHeader>
          <DialogTitle>
            { mode === "create"
              ? t("stocktakings.addNewTitle")
              : `${t("common:crudRow.edit")} ${t("stocktakings.entityName")}` }
          </DialogTitle>
          <DialogDescription />
        </DialogHeader>
        <Loading entityName={ t("stocktakings.entityName") } />
      </DialogContent>
    );
  }

  return (
    <ChangeDialog<Stocktaking>
      title={ mode === "create"
        ? t("stocktakings.addNewTitle")
        : `${t("common:crudRow.edit")} ${t("stocktakings.entityName")}` }
      className="sm:max-w-7xl"
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
            <TextField
              label={ t("stocktakings.stocktakingDate") }
              required
              value={ formData.date
                ? new Date(formData.date).toLocaleDateString("en-CA")
                : "" }
              isInvalid={ isInvalid("date") }
              error={ getError("date") }
              disabled
            />

            <FormField
              label={ t("stocktakings.store") }
              required
              isInvalid={ isInvalid("storeId") }
              error={ getError("storeId") }
            >
              <StoresSearchableSelect
                selectedId={ formData.storeId }
                selectedLabel={ formData.storeName }
                disabled={ mode === "update" }
                isInvalid={ isInvalid("storeId") }
                onValueChange={ handleStoreChange }
              />
            </FormField>
          </FieldsSection>

          <TextField
            label={ t("stocktakings.description") }
            value={ formData.description || "" }
            onChange={ (e) => dispatch(StocktakingSlice.formActions.updateFormData({ description: e.target.value })) }
          />

          { formData.storeId && (
            <StocktakingItemsTable
              formData={ formData }
              errors={ errors }
              handleChange={ (update) =>
                dispatch(
                  StocktakingSlice.formActions.updateFormData(
                    update as Partial<Stocktaking> | ((prev: Partial<Stocktaking>) => Partial<Stocktaking>)
                  )
                ) }
              createInstance={ () => new StocktakingItem() }
              mode={ mode }
            />
          ) }
        </FieldGroup>
      </div>
    </ChangeDialog>
  );
}
