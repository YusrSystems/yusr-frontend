import { SystemPermissionsResources } from "@/core/auth/systemPermissionsResources";
import type Unit from "@/core/data/unit";
import type { UnitDto } from "@/core/data/unit";
import { Services } from "@/core/services/services";
import { useSignals } from "@preact/signals-react/runtime";
import { useTranslation } from "react-i18next";
import type { CommonChangeDialogProps } from "yusr-ui";
import { ChangeDialog, FieldGroup, SystemPermissionsActions, TextField } from "yusr-ui";

export default function ChangeUnitDialog({ entity, service, onSuccess }: CommonChangeDialogProps<Unit, UnitDto>)
{
  useSignals();

  if (
    (entity.mode.value === "create"
      && !Services.auth.hasAuth(SystemPermissionsResources.Units, SystemPermissionsActions.Add))
    || (entity.mode.value === "update"
      && !Services.auth.hasAuth(SystemPermissionsResources.Units, SystemPermissionsActions.Update))
  )
  {
    return <ChangeDialog.Unauthorized />;
  }

  const { t } = useTranslation(["stocking", "common"]);
  const title = entity.mode.value === "create"
    ? t("units.addNewTitle")
    : `${t("common:crudRow.edit")} ${t("units.entityName")}`;

  return (
    <ChangeDialog className="sm:max-w-lg">
      <ChangeDialog.Header title={ title } />
      <FieldGroup>
        <TextField
          label={ t("units.unitName") }
          required
          value={ entity.name }
          error={ entity.getError("name") }
        />
      </FieldGroup>
      <ChangeDialog.Footer>
        <ChangeDialog.Close />

        <ChangeDialog.SaveButton<Unit, UnitDto>
          entity={ entity }
          service={ service }
          onSuccess={ (data) => onSuccess?.(data) }
        />
      </ChangeDialog.Footer>
    </ChangeDialog>
  );
}
