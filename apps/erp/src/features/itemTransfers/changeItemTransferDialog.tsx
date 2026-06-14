import { SystemPermissionsResources } from "@/core/auth/systemPermissionsResources";
import StoresSearchableSelect from "@/core/components/searchableSelect/storesSearchableSelect";
import { Cubits } from "@/core/services/cubits";
import { Services } from "@/core/services/services";
import { signal } from "@preact/signals-react";
import { useSignals } from "@preact/signals-react/runtime";
import { useEffect, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { ChangeDialog, type CommonChangeDialogProps, FieldGroup, FieldsSection, FormField, Loading, SystemPermissionsActions, TextField } from "yusr-ui";
import { ItemType } from "../../core/data/itemOld";
import ItemTransfer, { ItemTransferDto } from "../../core/data/itemTransfer";
import ItemTransferTable from "./itemTransferTable";

export default function ChangeItemTransferDialog(
  { entity, service, onSuccess }: CommonChangeDialogProps<ItemTransfer, ItemTransferDto>
)
{
  useSignals();

  if (
    (entity.mode.value === "create"
      && !Services.auth.hasAuth(SystemPermissionsResources.ItemTransfers, SystemPermissionsActions.Add))
    || (entity.mode.value === "update"
      && !Services.auth.hasAuth(SystemPermissionsResources.ItemTransfers, SystemPermissionsActions.Update))
  )
  {
    return <ChangeDialog.Unauthorized />;
  }

  const { t } = useTranslation(["stocking", "common"]);
  const isLoading = useMemo(() => signal<boolean>(false), []);
  const currentEntity = useMemo(() => signal<ItemTransfer>(entity), []);
  const title = entity.mode.value === "create"
    ? t("itemTransfers.addNewTitle")
    : `${t("common:crudRow.edit")} ${t("itemTransfers.entityName")}`;

  useEffect(() =>
  {
    if (entity.mode.value === "update" && entity?.id.value)
    {
      isLoading.value = true;
      const fetch = async () =>
      {
        const res = await service.Get(entity.id.value);
        if (res.data != undefined)
        {
          res.data.transferDate.value = new Date(res.data.transferDate.value).toLocaleDateString("en-CA");
          currentEntity.value = ItemTransfer.load(res.data.toJson());
        }
        isLoading.value = false;
      };
      fetch();
    }
    else
    {
      Cubits.stores.init();
    }
  }, [entity?.id.value, entity.mode.value]);

  useEffect(() =>
  {
    if (entity.mode.value === "create" && currentEntity.value?.fromStoreId.value)
    {
      Cubits.items.init([ItemType.Product], { storeId: currentEntity.value.fromStoreId.value });
    }
  }, [currentEntity.value.fromStoreId.value]);

  if (isLoading.value)
  {
    return (
      <ChangeDialog>
        <ChangeDialog.Header title={ title } />
        <Loading entityName={ t("itemTransfers.entityName") } />
      </ChangeDialog>
    );
  }

  return (
    <ChangeDialog className="sm:max-w-7xl">
      <ChangeDialog.Header title={ title } />

      <div className="max-h-[75vh] overflow-y-auto px-2 pb-2">
        <FieldGroup>
          <FieldsSection columns={ 3 }>
            <TextField
              label={ t("itemTransfers.stocktakingDate") }
              required
              value={ currentEntity.value.transferDate }
              disabled
            />
            <FormField
              label={ t("itemTransfers.fromStore") }
              required
              error={ currentEntity.value.getError("fromStoreId") }
            >
              <StoresSearchableSelect
                id={ currentEntity.value.fromStoreId }
                label={ currentEntity.value.fromStoreName }
                disabled={ currentEntity.value.mode.value === "update" }
                onSelect={ () =>
                {
                  currentEntity.value.itemTransfersItems.value = [];
                } }
              />
            </FormField>

            <FormField
              label={ t("itemTransfers.toStore") }
              required
              error={ currentEntity.value.getError("toStoreId") }
            >
              <StoresSearchableSelect
                id={ currentEntity.value.toStoreId }
                label={ currentEntity.value.toStoreName }
                disabled={ currentEntity.value.mode.value === "update" }
              />
            </FormField>
          </FieldsSection>

          <FieldsSection columns={ 1 }>
            <TextField
              label={ t("itemTransfers.description") }
              value={ currentEntity.value.description }
            />
          </FieldsSection>

          <FieldsSection columns={ 1 }>
            <ItemTransferTable entity={ currentEntity.value } />
          </FieldsSection>
        </FieldGroup>
      </div>

      <ChangeDialog.Footer>
        <ChangeDialog.Close />
        <ChangeDialog.SaveButton<ItemTransfer, ItemTransferDto>
          entity={ currentEntity.value }
          service={ service }
          onSuccess={ (data) => onSuccess?.(data) }
        />
      </ChangeDialog.Footer>
    </ChangeDialog>
  );
}
