import { Box, Database, DollarSign } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import type { CommonChangeDialogProps } from "yusr-ui";
import { ChangeDialogTabbed, DialogContent, DialogDescription, DialogHeader, DialogTitle, Loading, StorageType, useFormErrors, useFormInit, useStorageFile, useValidate } from "yusr-ui";
import Item, { ItemSlice, ItemType, ItemValidationRules } from "../../core/data/item";
import { PricingMethodSlice } from "../../core/data/pricingMethod";
import { StoreSlice } from "../../core/data/store";
import { TaxSlice } from "../../core/data/tax";
import { UnitSlice } from "../../core/data/unit";
import { fetchServiceIds } from "../../core/state/shared/serviceIdsSlice";
import { useAppDispatch, useAppSelector } from "../../core/state/store";
import BasicTab from "./basic/basicTab";
import PricingTab from "./pricing/pricingTab";
import StorageTab from "./storage/storageTab";

const BASIC_FIELDS = ["name", "type"] as const;
const STORAGE_FIELDS = ["itemStores"] as const;
const PRICING_FIELDS = ["sellUnitId", "initialCost", "itemUnitPricingMethods"] as const;

export default function ChangeItemDialog({
  entity,
  mode,
  service,
  onSuccess
}: CommonChangeDialogProps<Item>)
{
  const { t } = useTranslation(["stocking", "common"]);
  const dispatch = useAppDispatch();
  const [initLoading, setInitLoading] = useState(false);
  const { commitFiles } = useStorageFile(
    (data) => dispatch(ItemSlice.formActions.updateFormData(data as Partial<Item>)),
    "itemImages",
    StorageType.Public
  );

  const initialValues = useMemo(
    () => ({
      type: entity?.type || ItemType.Product,
      statusId: entity?.statusId || 1,
      taxable: entity?.taxable ?? true,
      taxIncluded: entity?.taxIncluded ?? false,
      ...entity,
      name: entity?.name || "",
      itemUnitPricingMethods: entity?.itemUnitPricingMethods || [],
      itemTaxes: entity?.itemTaxes || [],
      itemStores: entity?.itemStores || [],
      itemImages: entity?.itemImages || []
    }),
    [entity]
  );

  const { formData, errors } = useAppSelector((state) => state.itemForm);
  const { isInvalid } = useFormErrors(errors);
  const { validate } = useValidate(
    formData,
    ItemValidationRules.validationRules(t),
    (errors) => dispatch(ItemSlice.formActions.setErrors(errors))
  );
  useFormInit(ItemSlice.formActions.setInitialData, initialValues);

  const basicHasError = BASIC_FIELDS.some((f) => isInvalid(f));
  const storageHasError = STORAGE_FIELDS.some((f) => isInvalid(f));
  const pricingHasError = PRICING_FIELDS.some((f) => isInvalid(f));

  useEffect(() =>
  {
    dispatch(TaxSlice.entityActions.filter());
    dispatch(UnitSlice.entityActions.filter());
    dispatch(PricingMethodSlice.entityActions.filter());
    dispatch(StoreSlice.entityActions.filter());
    dispatch(fetchServiceIds());
  }, [dispatch]);

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
          dispatch(ItemSlice.formActions.setInitialData(res.data));
        }
        setInitLoading(false);
      };

      getItem();
    }
  }, [entity?.id, mode]);

  const transformDataBeforeSave = async (data: Item | Partial<Item>): Promise<Item | Partial<Item>> =>
  {
    const resolvedFiles = await commitFiles(
      formData.itemImages,
      `Items`
    );

    dispatch(ItemSlice.formActions.updateFormData({ itemImages: resolvedFiles }));

    return {
      ...data,
      itemImages: resolvedFiles
    };
  };

  if (initLoading)
  {
    return (
      <DialogContent dir="rtl">
        <DialogHeader>
          <DialogTitle>
            { mode === "create" ? t("items.addNewTitle") : `${t("common:crudRow.edit")} ${t("items.entityName")}` }
          </DialogTitle>
          <DialogDescription />
        </DialogHeader>
        <Loading entityName={ t("items.entityName") } />
      </DialogContent>
    );
  }

  return (
    <ChangeDialogTabbed<Item>
      changeDialogProps={ {
        title: mode === "create" ? t("items.addNewTitle") : `${t("common:crudRow.edit")} ${t("items.entityName")}`,
        className: "sm:max-w-7xl",
        formData,
        dialogMode: mode,
        service,
        onSuccess: (data) => onSuccess?.(data, mode),
        validate,
        transformData: transformDataBeforeSave
      } }
      tabs={ [
        {
          label: t("items.basicInfo"),
          icon: Box,
          active: true,
          hasError: basicHasError,
          content: <BasicTab mode={ mode } />
        },
        ...(formData.type !== ItemType.Service
          ? [{
            label: t("items.storage"),
            icon: Database,
            active: false,
            hasError: storageHasError,
            content: <StorageTab mode={ mode } />
          }]
          : []),
        {
          label: t("items.pricing"),
          icon: DollarSign,
          active: false,
          hasError: pricingHasError,
          content: <PricingTab mode={ mode } />
        }
      ] }
    />
  );
}
