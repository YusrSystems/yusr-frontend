import { SystemPermissionsResources } from "@/core/auth/systemPermissionsResources";
import { Services } from "@/core/services/services";
import { useSignals } from "@preact/signals-react/runtime";
import { useTranslation } from "react-i18next";
import {
	ChangeableEntityMode,
	ChangeDialog,
	type CommonChangeDialogProps,
	FieldGroup,
	FieldsSection,
	NumberField,
	SelectField,
	SystemPermissionsActions,
	TextField
} from "yusr-ui";
import { Tax, TaxDto } from "@/core/data/tax.ts";
import { useMemo } from "react";
import { signal } from "@preact/signals-react";


export default function ChangeTaxDialog({dto, service, onSuccess}: CommonChangeDialogProps<TaxDto>)
{
	useSignals();
	const {t} = useTranslation(["accounting", "common"]);

	const entity = useMemo(() => signal<Tax>(dto ? Tax.load(dto) : Tax.create()), []);

	if (
		(entity.value.mode.value === ChangeableEntityMode.Create
			&& !Services.auth.hasAuth(SystemPermissionsResources.Taxes, SystemPermissionsActions.Add))
		|| (entity.value.mode.value === ChangeableEntityMode.Update
			&& !Services.auth.hasAuth(SystemPermissionsResources.Taxes, SystemPermissionsActions.Update))
	)
	{
		return <ChangeDialog.Unauthorized/>;
	}

	const title = entity.value.mode.value === ChangeableEntityMode.Create
		? t("taxes.addNewTitle")
		: `${ t("common:crudRow.edit") } ${ t("taxes.entityName") }`;

	return (
		<ChangeDialog className="sm:max-w-lg">
			<ChangeDialog.Header title={ title }/>

			<FieldGroup>
				<TextField
					label={ t("taxes.taxName") }
					required
					value={ entity.value.name }
					error={ entity.value.getError("name") }
				/>
				<FieldsSection columns={ 2 }>
					<NumberField
						label={ t("taxes.percentage") }
						required
						min={ 1 }
						max={ 100 }
						value={ entity.value.percentage }
						error={ entity.value.getError("percentage") }
					/>
					<SelectField
						label={ t("taxes.isPrimary") }
						value={ entity.value.isPrimary }
						required
						options={ [{label: t("common:yes"), value: true}, {label: t("common:no"), value: false}] }
					/>
				</FieldsSection>
			</FieldGroup>

			<ChangeDialog.Footer>
				<ChangeDialog.Close/>

				<ChangeDialog.SaveButton<Tax, TaxDto>
					entity={ entity }
					service={ service }
					onSuccess={ (data) =>
					{
						onSuccess?.(data, entity.value.mode.value);
					} }
				/>
			</ChangeDialog.Footer>
		</ChangeDialog>
	);
}
