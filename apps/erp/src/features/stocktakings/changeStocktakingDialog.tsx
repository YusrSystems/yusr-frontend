import StoresSearchableSelect from "@/core/components/searchableSelect/storesSearchableSelect";
import type Stocktaking from "@/core/data/stocktaking";
import type { StocktakingDto } from "@/core/data/stocktaking";
import { StocktakingItem } from "@/core/data/stocktakingItem";
import { Cubits } from "@/core/services/cubits";
import { signal } from "@preact/signals-react";
import { useSignals } from "@preact/signals-react/runtime";
import { useEffect, useMemo } from "react";
import { useTranslation } from "react-i18next";
import type { CommonChangeDialogProps } from "yusr-ui";
import { ChangeDialog, FieldGroup, FieldsSection, FormField, Loading, TextField } from "yusr-ui";
import { ItemType } from "../../core/data/itemOld";
import StocktakingItemsTable from "./stocktakingItemsTable";

export default function ChangeStocktakingDialog(
  { entity, service, onSuccess }: CommonChangeDialogProps<Stocktaking, StocktakingDto>
)
{
  useSignals();
  const { t } = useTranslation(["stocking", "common"]);
  const isLoading = useMemo(() => signal<boolean>(false), []);

  useEffect(() =>
  {
    Cubits.stores.init();

    if (entity.mode.value === "update" && entity?.id.value)
    {
      isLoading.value = true;
      const fetch = async () =>
      {
        const res = await service.Get(entity.id.value);
        if (res.data != undefined)
        {
          entity = res.data;
        }
        isLoading.value = false;
      };
      fetch();
    }
  }, []);

  useEffect(() =>
  {
    if (entity?.storeId.value)
    {
      Cubits.items.init([ItemType.Product], { storeId: entity.storeId.value });
    }
  }, [entity.storeId.value]);

  const title = entity.mode.value === "create"
    ? t("stocktakings.addNewTitle")
    : `${t("common:crudRow.edit")} ${t("stocktakings.entityName")}`;

  if (isLoading.value)
  {
    return (
      <ChangeDialog>
        <ChangeDialog.Header title={ title } />
        <Loading entityName={ t("stocktakings.entityName") } />
      </ChangeDialog>
    );
  }

  return (
    <ChangeDialog className="sm:max-w-7xl">
      <ChangeDialog.Header title={ title } />

      <div className="max-h-[75vh] overflow-y-auto px-2 pb-2">
        <FieldGroup>
          <FieldsSection columns={ 2 }>
            <TextField
              label={ t("stocktakings.stocktakingDate") }
              value={ entity.date }
              required
              disabled
            />

            <FormField
              label={ t("stocktakings.store") }
              required
              error={ entity.getError("storeId") }
            >
              <StoresSearchableSelect
                id={ entity.storeId }
                label={ entity.storeName }
                disabled={ entity.mode.value === "update" }
                onSelect={ (store) =>
                {
                  entity.storeId.value = store?.id.value;
                  entity.storeName.value = store?.name.value;
                  entity.stocktakingItems.value = [];
                } }
              />
            </FormField>
          </FieldsSection>

          <TextField
            label={ t("stocktakings.description") }
            value={ entity.description }
          />

          <StocktakingItemsTable
            entity={ entity }
            createInstance={ () => StocktakingItem.create() }
          />
        </FieldGroup>
      </div>

      <ChangeDialog.Footer>
        <ChangeDialog.Close />
        <ChangeDialog.SaveButton<Stocktaking, StocktakingDto>
          entity={ entity }
          service={ service }
          onSuccess={ (data) => onSuccess?.(data) }
        />
      </ChangeDialog.Footer>
    </ChangeDialog>
  );
}
