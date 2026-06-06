import { useSignals } from "@preact/signals-react/runtime";
import { useTranslation } from "react-i18next";
import { SystemPermissionsActions, YusrSystemPermissionsResources } from "../../auth";
import { ChangeDialog, CitiesSearchableSelect, type CommonChangeDialogProps, FieldsSection, FormField, TextField } from "../../components/custom";
import { FieldGroup } from "../../components/pure";
import { Branch, BranchDto } from "../../entities";
import { BaseServices } from "../../services";

export function ChangeBranchDialog({ entity, service, onSuccess }: CommonChangeDialogProps<Branch, BranchDto>)
{
  useSignals();

  if (
    (entity.mode.value === "create"
      && !BaseServices.auth.hasAuth(YusrSystemPermissionsResources.Branches, SystemPermissionsActions.Add))
    || (entity.mode.value === "update"
      && !BaseServices.auth.hasAuth(YusrSystemPermissionsResources.Branches, SystemPermissionsActions.Update))
  )
  {
    return <ChangeDialog.Unauthorized />;
  }

  const { t } = useTranslation(["commonEntities", "common"]);
  const title = entity.mode.value === "create"
    ? t("branches.addNewTitle")
    : `${t("common:crudRow.edit")} ${t("branches.entityName")}`;

  return (
    <ChangeDialog>
      <ChangeDialog.Header title={ title } />

      <FieldGroup className="py-2">
        <TextField
          label={ t("branches.branchName") }
          required
          value={ entity.name }
          error={ entity.getError("name") }
        />

        <FormField
          label={ t("branches.city") }
          required
          error={ entity.getError("cityId") }
        >
          <CitiesSearchableSelect
            id={ entity.cityId }
            label={ entity.cityName }
          />
        </FormField>

        <FieldsSection title="" columns={ 2 }>
          <TextField
            label={ t("branches.street") }
            value={ entity.street }
          />
          <TextField
            label={ t("branches.district") }
            value={ entity.district }
          />
          <TextField
            label={ t("branches.buildingNumber") }
            value={ entity.buildingNumber }
            error={ entity.getError("buildingNumber") }
          />
          <TextField
            label={ t("branches.postalCode") }
            value={ entity.postalCode }
            error={ entity.getError("postalCode") }
          />
        </FieldsSection>
      </FieldGroup>

      <ChangeDialog.Footer>
        <ChangeDialog.Close />

        <ChangeDialog.SaveButton<Branch, BranchDto>
          entity={ entity }
          service={ service }
          onSuccess={ (data) => onSuccess?.(data) }
        />
      </ChangeDialog.Footer>
    </ChangeDialog>
  );
}
