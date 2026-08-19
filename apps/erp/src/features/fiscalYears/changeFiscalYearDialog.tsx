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
	TextField,
	TitleSeparator
} from "yusr-ui";
import { FiscalYear, FiscalYearDto } from "@/core/data/fiscalYear.ts";
import { useMemo } from "react";
import { signal } from "@preact/signals-react";
import { FiscalPeriodsList } from "./components/fiscalPeriodsList";


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
		<ChangeDialog className={ isUpdateMode ? "sm:max-w-4xl" : "sm:max-w-lg" }>
			<ChangeDialog.Header title={ title }/>

			<div className="max-h-[75vh] overflow-y-auto px-2 pb-2">
				<FieldGroup className="gap-6">
					<FieldsSection title="البيانات الأساسية" columns={ 3 }>
						<TextField
							label="اسم السنة المالية"
							required
							placeholder={ `مثال: ${ (new Date()).getFullYear() }` }
							value={ entity.value.name }
							error={ entity.value.getError("name") }
						/>

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

					{ isUpdateMode && dto && (
						<div className="space-y-3">
							<TitleSeparator title="الفترات الشهرية"/>
							<FiscalPeriodsList year={ dto }/>
						</div>
					) }
				</FieldGroup>
			</div>

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