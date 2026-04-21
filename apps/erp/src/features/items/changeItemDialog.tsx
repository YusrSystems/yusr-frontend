import { Box, Database, DollarSign } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import type { CommonChangeDialogProps } from "yusr-ui";
import { ChangeDialogTabbed, DialogContent, DialogDescription, DialogHeader, DialogTitle, Loading, useFormErrors, useFormInit, useValidate } from "yusr-ui";
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
  const dispatch = useAppDispatch();
  const [initLoading, setInitLoading] = useState(false);

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
    ItemValidationRules.validationRules,
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

  if (initLoading)
  {
    return (
      <DialogContent dir="rtl">
        <DialogHeader>
          <DialogTitle>
            { mode === "create" ? "إضافة" : "تعديل" } مادة
          </DialogTitle>
          <DialogDescription />
        </DialogHeader>
        <Loading entityName="المادة" />
      </DialogContent>
    );
  }

  return (
    <ChangeDialogTabbed<Item>
      changeDialogProps={ {
        title: `${mode === "create" ? "إضافة" : "تعديل"} مادة`,
        className: "sm:max-w-7xl",
        formData,
        dialogMode: mode,
        service,
        onSuccess: (data) => onSuccess?.(data, mode),
        validate
      } }
      tabs={ [
        {
          label: "المعلومات الأساسية",
          icon: Box,
          active: true,
          hasError: basicHasError,
          content: <BasicTab mode={ mode } />
        },
        ...(formData.type !== ItemType.Service
          ? [{
            label: "التخزين",
            icon: Database,
            active: false,
            hasError: storageHasError,
            content: <StorageTab mode={ mode } />
          }]
          : []),
        {
          label: "التسعير",
          icon: DollarSign,
          active: false,
          hasError: pricingHasError,
          content: <PricingTab mode={ mode } />
        }
      ] }
    />
  );
}
