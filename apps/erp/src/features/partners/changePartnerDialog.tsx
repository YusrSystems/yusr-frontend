import { Services } from "@/core/services/services";
import { useSignals } from "@preact/signals-react/runtime";
import { useTranslation } from "react-i18next";
import {
	ChangeableEntityMode,
	ChangeDialog,
	CitiesSearchableSelect,
	type CommonChangeDialogProps,
	FieldGroup,
	FieldsSection,
	FormField,
	NumberField,
	SystemPermissionsActions,
	TextAreaField,
	TextField,
	YoutubeButton
} from "yusr-ui";
import { SystemPermissionsResources } from "@/core/auth/systemPermissionsResources";
import AccountsSearchableSelect from "@/core/components/searchableSelect/accountsSearchableSelect";
import { Partner, type PartnerDto, PartnerType } from "@/core/data/partner.ts";
import ErpCurrencyIcon from "@/core/components/erpCurrencyIcon.tsx";
import { useEffect, useMemo } from "react";
import { signal } from "@preact/signals-react";
import { Cubits } from "@/core/services/cubits.ts";
import { AccountType } from "@/core/data/account.ts";


export default function ChangePartnerDialog(
	{dto, service, onSuccess, initDto}: CommonChangeDialogProps<PartnerDto> & {
		initDto?: PartnerDto;
	}
)
{
	useSignals();
	const {t} = useTranslation(["accounting", "common"]);

	const entity = useMemo(() => signal<Partner>(dto ? Partner.load(dto) : Partner.create(initDto)), []);
	const isUpdateMode = entity.value.mode.value === ChangeableEntityMode.Update;

	useEffect(() =>
	{
		Cubits.accounts.init([entity.value.type.value === PartnerType.Customer ? AccountType.AccountsReceivable : AccountType.AccountsPayable]);
		Cubits.cities.init();
	}, [entity.value.type.value]);

	if (
		(entity.value.mode.value === ChangeableEntityMode.Create
			&& !Services.auth.hasAuth(SystemPermissionsResources.Accounts, SystemPermissionsActions.Add))
		|| (entity.value.mode.value === ChangeableEntityMode.Update
			&& !Services.auth.hasAuth(SystemPermissionsResources.Accounts, SystemPermissionsActions.Update))
	)
	{
		return <ChangeDialog.Unauthorized/>;
	}

	const title = !isUpdateMode
		? entity.value.type.value === PartnerType.Customer
			? t("partners.addNewCustomer", "إضافة عميل جديد")
			: t("partners.addNewSupplier", "إضافة مورد جديد")
		: entity.value.type.value === PartnerType.Customer
			? t("partners.editCustomer", "تعديل عميل")
			: t("partners.editSupplier", "تعديل مورد");

	return (
		<ChangeDialog className="sm:max-w-4xl">
			<ChangeDialog.Header title={ title }/>
			<div className="max-h-[75vh] overflow-y-auto px-2 pb-2">
				<FieldGroup className="gap-8">

					<FieldsSection columns={ 2 }>
						<div className="col-span-2">
							<TextField
								label={ t("partners.partnerName", "الاسم") }
								required
								value={ entity.value.name }
								error={ entity.value.getError("name") }
								className="col-span-2"
							/>
						</div>
						<TextField
							label={ t("partners.mobile", "الجوال") }
							value={ entity.value.mobile ?? "" }
						/>
						<TextField
							label={ t("partners.phone", "الهاتف") }
							value={ entity.value.phone ?? "" }
						/>
						<TextField
							label={ t("partners.crn", "السجل التجاري (CRN)") }
							value={ entity.value.crn ?? "" }
							error={ entity.value.getError("crn") }
						/>
						<TextField
							label={ t("partners.vatNumber", "الرقم الضريبي (VAT)") }
							value={ entity.value.vatNumber ?? "" }
							error={ entity.value.getError("vatNumber") }
						/>
					</FieldsSection>

					<FieldsSection title={ t("partners.nationalAddress", "العنوان الوطني") } columns={ 2 }>
						<div className="col-span-2">
							<FormField label={ t("partners.city", "المدينة") }>
								<CitiesSearchableSelect
									id={ entity.value.cityId }
									label={ entity.value.cityName }
								/>
							</FormField>
						</div>
						<TextField
							label={ t("partners.district", "الحي") }
							value={ entity.value.district ?? "" }
						/>
						<TextField
							label={ t("partners.street", "الشارع") }
							value={ entity.value.street ?? "" }
						/>
						<TextField
							label={ t("partners.buildingNumber", "رقم المبنى") }
							value={ entity.value.buildingNumber ?? "" }
							error={ entity.value.getError("buildingNumber") }
						/>
						<TextField
							label={ t("partners.postalCode", "الرمز البريدي") }
							value={ entity.value.postalCode ?? "" }
							error={ entity.value.getError("postalCode") }
						/>
					</FieldsSection>

					<FieldsSection title={ t("partners.financialAndGl", "البيانات المالية") }
					               columns={ 2 }>
						<NumberField
							label={ t("partners.openingBalance", "الرصيد الافتتاحي") }
							value={ entity.value.openingBalance }
							error={ entity.value.getError("openingBalance") }
							currency={ <ErpCurrencyIcon/> }
						/>
						<NumberField
							label={ t("partners.balance", "الرصيد الحالي") }
							value={ entity.value.balance }
							disabled
							currency={ <ErpCurrencyIcon/> }
						/>
						<div className="col-span-2">
							<FormField
								label={ t("partners.customGl", "حساب استاذ مخصص") }>
								<AccountsSearchableSelect
									id={ entity.value.overrideGlAccountId }
									label={ entity.value.overrideGlAccountName }
									placeholder="اتركه فارغاً لاستخدام حساب الذمم الافتراضي"
									showAddButton={ false }
								/>
							</FormField>
						</div>
					</FieldsSection>

					<FieldsSection columns={ 1 }>
						<TextAreaField
							label={ t("partners.notes", "ملاحظات") }
							value={ entity.value.notes ?? "" }
							rows={ 3 }
						/>
					</FieldsSection>
				</FieldGroup>
			</div>
			<ChangeDialog.Footer>
				<div className="flex items-center justify-between w-full">
					<YoutubeButton videoId="WNCe2c2kqCw"/>
					<div className="flex justify-end gap-3">
						<ChangeDialog.Close/>
						<ChangeDialog.SaveButton<Partner, PartnerDto>
							entity={ entity }
							service={ service }
							onSuccess={ (data) => onSuccess?.(data, entity.value.mode.value) }
						/>
					</div>
				</div>
			</ChangeDialog.Footer>
		</ChangeDialog>
	);
}