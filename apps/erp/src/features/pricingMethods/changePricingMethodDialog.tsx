import { SystemPermissionsResources } from "@/core/auth/systemPermissionsResources";
import { Services } from "@/core/services/services";
import { useSignals } from "@preact/signals-react/runtime";
import { useTranslation } from "react-i18next";
import { ChangeableEntityMode, type CommonChangeDialogProps } from "yusr-ui";
import { ChangeDialog, FieldGroup, SystemPermissionsActions, TextField } from "yusr-ui";
import PricingMethod, { type PricingMethodDto } from "@/core/data/pricingMethod.ts";


export default function ChangePricingMethodDialog(
	{entity, service, onSuccess}: CommonChangeDialogProps<PricingMethod, PricingMethodDto>
)
{
	useSignals();
	const {t} = useTranslation(["stocking", "common"]);

	if (
		(entity.mode.value === ChangeableEntityMode.Create
			&& !Services.auth.hasAuth(SystemPermissionsResources.PricingMethods, SystemPermissionsActions.Add))
		|| (entity.mode.value === ChangeableEntityMode.Update
			&& !Services.auth.hasAuth(SystemPermissionsResources.PricingMethods, SystemPermissionsActions.Update))
	)
	{
		return <ChangeDialog.Unauthorized/>;
	}

	const title = entity.mode.value === ChangeableEntityMode.Create
		? t("pricingMethods.addNewTitle")
		: `${ t("common:crudRow.edit") } ${ t("pricingMethods.entityName") }`;

	return (
		<ChangeDialog className="sm:max-w-lg">
			<ChangeDialog.Header title={ title }/>
			<FieldGroup>
				<TextField
					label={ t("pricingMethods.methodName") }
					required
					value={ entity.name }
					error={ entity.getError("name") }
				/>
			</FieldGroup>
			<ChangeDialog.Footer>
				<ChangeDialog.Close/>

				<ChangeDialog.SaveButton<PricingMethod, PricingMethodDto>
					entity={ entity }
					service={ service }
					onSuccess={ (data) => onSuccess?.(data) }
				/>
			</ChangeDialog.Footer>
		</ChangeDialog>
	);
}
