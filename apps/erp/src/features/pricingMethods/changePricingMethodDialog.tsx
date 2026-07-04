import { SystemPermissionsResources } from "@/core/auth/systemPermissionsResources";
import { Services } from "@/core/services/services";
import { useSignals } from "@preact/signals-react/runtime";
import { useTranslation } from "react-i18next";
import {
	ChangeableEntityMode,
	ChangeDialog,
	type CommonChangeDialogProps,
	FieldGroup,
	SystemPermissionsActions,
	TextField
} from "yusr-ui";
import PricingMethod, { type PricingMethodDto } from "@/core/data/pricingMethod.ts";
import { useMemo } from "react";
import { signal } from "@preact/signals-react";


export default function ChangePricingMethodDialog(
	{dto, service, onSuccess}: CommonChangeDialogProps<PricingMethodDto>
)
{
	useSignals();
	const {t} = useTranslation(["stocking", "common"]);
	const entity = useMemo(() => signal<PricingMethod>(dto ? PricingMethod.load(dto) : PricingMethod.create()), []);

	if (
		(entity.value.mode.value === ChangeableEntityMode.Create
			&& !Services.auth.hasAuth(SystemPermissionsResources.PricingMethods, SystemPermissionsActions.Add))
		|| (entity.value.mode.value === ChangeableEntityMode.Update
			&& !Services.auth.hasAuth(SystemPermissionsResources.PricingMethods, SystemPermissionsActions.Update))
	)
	{
		return <ChangeDialog.Unauthorized/>;
	}

	const title = entity.value.mode.value === ChangeableEntityMode.Create
		? t("pricingMethods.addNewTitle")
		: `${ t("common:crudRow.edit") } ${ t("pricingMethods.entityName") }`;

	return (
		<ChangeDialog className="sm:max-w-lg">
			<ChangeDialog.Header title={ title }/>
			<FieldGroup>
				<TextField
					label={ t("pricingMethods.methodName") }
					required
					value={ entity.value.name }
					error={ entity.value.getError("name") }
				/>
			</FieldGroup>
			<ChangeDialog.Footer>
				<ChangeDialog.Close/>

				<ChangeDialog.SaveButton<PricingMethod, PricingMethodDto>
					entity={ entity }
					service={ service }
					onSuccess={ (data) => onSuccess?.(data, entity.value.mode.value) }
				/>
			</ChangeDialog.Footer>
		</ChangeDialog>
	);
}
