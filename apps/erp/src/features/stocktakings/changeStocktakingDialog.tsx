import StoresSearchableSelect from "@/core/components/searchableSelect/storesSearchableSelect";
import type { StocktakingDto } from "@/core/data/stocktaking";
import Stocktaking from "@/core/data/stocktaking";
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
  const currentEntity = useMemo(() => signal<Stocktaking>(entity), []);

  useEffect(() =>
  {
    Cubits.stores.init();

    if (currentEntity.value.mode.value === "update" && currentEntity.value?.id.value)
    {
      isLoading.value = true;
      const fetch = async () =>
      {
        const res = await service.Get(currentEntity.value.id.value);
        if (res.data != undefined)
        {
          currentEntity.value = Stocktaking.load(res.data.toJson());
          currentEntity.value.date.value = new Date(currentEntity.value.date.value).toLocaleDateString("en-CA");
        }
        isLoading.value = false;
      };
      fetch();
    }
  }, []);

  useEffect(() =>
  {
    if (currentEntity.value?.storeId.value)
    {
      Cubits.items.init([ItemType.Product], { storeId: currentEntity.value.storeId.value });
    }
  }, [currentEntity.value.storeId.value]);

  const title = currentEntity.value.mode.value === "create"
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
              value={ currentEntity.value.date }
              required
              disabled
            />

            <FormField
              label={ t("stocktakings.store") }
              required
              error={ currentEntity.value.getError("storeId") }
            >
              <StoresSearchableSelect
                id={ currentEntity.value.storeId }
                label={ currentEntity.value.storeName }
                disabled={ currentEntity.value.mode.value === "update" }
                onSelect={ (store) =>
                {
                  currentEntity.value.storeId.value = store?.id.value;
                  currentEntity.value.storeName.value = store?.name.value;
                  currentEntity.value.stocktakingItems.value = [];
                } }
              />
            </FormField>
          </FieldsSection>

          <TextField
            label={ t("stocktakings.description") }
            value={ currentEntity.value.description }
          />

          <StocktakingItemsTable
            entity={ currentEntity.value }
            createInstance={ () => StocktakingItem.create() }
          />
        </FieldGroup>
      </div>

      <ChangeDialog.Footer>
        <ChangeDialog.Close />
        <ChangeDialog.SaveButton<Stocktaking, StocktakingDto>
          entity={ currentEntity.value }
          service={ service }
          onSuccess={ (data) => onSuccess?.(data) }
        />
      </ChangeDialog.Footer>
    </ChangeDialog>
  );
}
