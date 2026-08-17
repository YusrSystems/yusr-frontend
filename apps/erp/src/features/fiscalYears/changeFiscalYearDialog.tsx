import { SystemPermissionsResources } from "@/core/auth/systemPermissionsResources";
import { Services } from "@/core/services/services";
import { useSignals } from "@preact/signals-react/runtime";
import {
	ChangeableEntityMode,
	ChangeDialog,
	type CommonChangeDialogProps,
	DateField,
	FieldGroup,
	FieldsSection,
	SystemPermissionsActions,
	TextField
} from "yusr-ui";
import { FiscalYear, FiscalYearDto } from "@/core/data/fiscalYear.ts";
import { useMemo } from "react";
import { signal } from "@preact/signals-react";


export default function ChangeFiscalYearDialog({
	dto,
	service,
	onSuccess
}: CommonChangeDialogProps<FiscalYearDto>)
{
	useSignals();

	const entity = useMemo(() => signal<FiscalYear>(dto ? FiscalYear.load(dto) : FiscalYear.create()), [dto]);

	if (
		(entity.value.mode.value === ChangeableEntityMode.Create &&
			!Services.auth.hasAuth(SystemPermissionsResources.FiscalYears, SystemPermissionsActions.Add)) ||
		(entity.value.mode.value === ChangeableEntityMode.Update &&
			!Services.auth.hasAuth(SystemPermissionsResources.FiscalYears, SystemPermissionsActions.Update))
	)
	{
		return <ChangeDialog.Unauthorized/>;
	}

	const isUpdateMode = entity.value.mode.value === ChangeableEntityMode.Update;
	const title = !isUpdateMode ? "إضافة سنة مالية جديدة" : "تعديل السنة المالية";

	return (
		<ChangeDialog className="sm:max-w-lg">
			<ChangeDialog.Header title={ title }/>
			<FieldGroup>
				<FieldsSection columns={ 1 }>
					<TextField
						label="اسم السنة المالية"
						required
						placeholder={ `مثال: ${ (new Date()).getFullYear() }` }
						value={ entity.value.name }
						error={ entity.value.getError("name") }
					/>
				</FieldsSection>

				<FieldsSection columns={ 2 }>
					<DateField
						label="تاريخ البداية"
						required
						value={ entity.value.startDate }
						error={ entity.value.getError("startDate") }
					/>

					<DateField
						label="تاريخ النهاية"
						required
						value={ entity.value.endDate }
						error={ entity.value.getError("endDate") }
					/>
				</FieldsSection>
			</FieldGroup>

			<ChangeDialog.Footer>
				<ChangeDialog.Close/>
				<ChangeDialog.SaveButton<FiscalYear, FiscalYearDto>
					entity={ entity }
					service={ service }
					onSuccess={ (data) => onSuccess?.(data, entity.value.mode.value) }
				/>
			</ChangeDialog.Footer>
		</ChangeDialog>
	);
}
