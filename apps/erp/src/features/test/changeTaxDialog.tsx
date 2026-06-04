import { SystemPermissionsResources } from "@/core/auth/systemPermissionsResources";
import { Services } from "@/core/services/services";
import { useSignals } from "@preact/signals-react/runtime";
import { useTranslation } from "react-i18next";
import type { CommonChangeDialogProps } from "yusr-ui";
import { ChangeDialog, FieldGroup, NumberField, SelectField, SystemPermissionsActions, TextField } from "yusr-ui";
import { Tax, TaxDto } from "../../core/data/tax";

export default function ChangeTaxDialog({ entity, service, onSuccess }: CommonChangeDialogProps<Tax, TaxDto>)
{
  useSignals();

  if (
    (entity.mode.value === "create"
      && !Services.auth.hasAuth(SystemPermissionsResources.Taxes, SystemPermissionsActions.Add))
    || (entity.mode.value === "update"
      && !Services.auth.hasAuth(SystemPermissionsResources.Taxes, SystemPermissionsActions.Update))
  )
  {
    return <ChangeDialog.Unauthorized />;
  }

  const { t } = useTranslation(["accounting", "common"]);
  const title = entity.mode.value === "create"
    ? t("taxes.addNewTitle")
    : `${t("common:crudRow.edit")} ${t("taxes.entityName")}`;

  return (
    <ChangeDialog className="sm:max-w-lg">
      <ChangeDialog.Header title={ title } />

      <FieldGroup>
        <div className="grid grid-cols-2 gap-4">
          <TextField
            label={ t("taxes.taxName") }
            required
            value={ entity.name }
            error={ entity.getError("name") }
          />

          <NumberField
            label={ t("taxes.percentage") }
            required
            min={ 1 }
            max={ 100 }
            value={ entity.percentage }
            error={ entity.getError("percentage") }
          />
        </div>

        <SelectField
          label={ t("taxes.isPrimary") }
          value={ entity.isPrimary }
          required={ true }
          options={ [{ label: t("common:yes"), value: true }, { label: t("common:no"), value: false }] }
        />
      </FieldGroup>

      <ChangeDialog.Footer>
        <ChangeDialog.Close />

        <ChangeDialog.SaveButton<Tax, TaxDto>
          entity={ entity }
          service={ service }
          onSuccess={ (data) => onSuccess?.(data) }
        />
      </ChangeDialog.Footer>
    </ChangeDialog>
  );
}
