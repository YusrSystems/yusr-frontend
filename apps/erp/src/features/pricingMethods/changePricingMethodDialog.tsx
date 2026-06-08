import { SystemPermissionsResources } from "@/core/auth/systemPermissionsResources";
import type PricingMethod from "@/core/data/pricingMethod";
import type { PricingMethodDto } from "@/core/data/pricingMethod";
import { Services } from "@/core/services/services";
import { useSignals } from "@preact/signals-react/runtime";
import { useTranslation } from "react-i18next";
import type { CommonChangeDialogProps } from "yusr-ui";
import { ChangeDialog, FieldGroup, SystemPermissionsActions, TextField } from "yusr-ui";

export default function ChangePricingMethodDialog(
  { entity, service, onSuccess }: CommonChangeDialogProps<PricingMethod, PricingMethodDto>
)
{
  useSignals();

  if (
    (entity.mode.value === "create"
      && !Services.auth.hasAuth(SystemPermissionsResources.PricingMethods, SystemPermissionsActions.Add))
    || (entity.mode.value === "update"
      && !Services.auth.hasAuth(SystemPermissionsResources.PricingMethods, SystemPermissionsActions.Update))
  )
  {
    return <ChangeDialog.Unauthorized />;
  }

  const { t } = useTranslation(["stocking", "common"]);
  const title = entity.mode.value === "create"
    ? t("pricingMethods.addNewTitle")
    : `${t("common:crudRow.edit")} ${t("pricingMethods.entityName")}`;

  return (
    <ChangeDialog className="sm:max-w-lg">
      <ChangeDialog.Header title={ title } />
      <FieldGroup>
        <TextField
          label={ t("pricingMethods.methodName") }
          required
          value={ entity.name }
          error={ entity.getError("name") }
        />
      </FieldGroup>
      <ChangeDialog.Footer>
        <ChangeDialog.Close />

        <ChangeDialog.SaveButton<PricingMethod, PricingMethodDto>
          entity={ entity }
          service={ service }
          onSuccess={ (data) => onSuccess?.(data) }
        />
      </ChangeDialog.Footer>
    </ChangeDialog>
  );
}
