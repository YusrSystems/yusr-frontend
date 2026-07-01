import { Services } from "@/core/services/services";
import { useSignals } from "@preact/signals-react/runtime";
import { useTranslation } from "react-i18next";
import {
	Button,
	ChangeableEntityMode,
	ChangeDialog,
	CitiesSearchableSelect,
	type CommonChangeDialogProps,
	FieldGroup,
	FieldsSection,
	FormField,
	NumberField,
	PhoneField,
	SelectField,
	SystemPermissionsActions,
	TablePreviewCompact,
	TextAreaField,
	TextField,
	YoutubeButton
} from "yusr-ui";

import { SystemPermissionsResources } from "@/core/auth/systemPermissionsResources";
import AccountsSearchableSelect from "@/core/components/searchableSelect/accountsSearchableSelect";
import { Plus, Trash2 } from "lucide-react";
import { Account, AccountContact, type AccountDto, AccountType } from "@/core/data/account.ts";
import ErpCurrencyIcon from "@/core/components/erpCurrencyIcon.tsx";
import { useMemo } from "react";
import { type Signal, signal } from "@preact/signals-react";


export default function ChangeAccountDialog(
	{dto, service, onSuccess, fixedType, selectTypes}: CommonChangeDialogProps<AccountDto> & {
		fixedType: AccountType;
		selectTypes?: AccountType[];
	}
)
{
	useSignals();
	const {t} = useTranslation(["accounting", "common"]);
	const entity = useMemo(() => signal<Account>(dto ? Account.load(dto) : Account.create({type: fixedType})), []);

	if (
		(entity.value.mode.value === ChangeableEntityMode.Create
			&& !Services.auth.hasAuth(SystemPermissionsResources.Accounts, SystemPermissionsActions.Add))
		|| (entity.value.mode.value === ChangeableEntityMode.Update
			&& !Services.auth.hasAuth(SystemPermissionsResources.Accounts, SystemPermissionsActions.Update))
	)
	{
		return <ChangeDialog.Unauthorized/>;
	}

	const title = entity.value.mode.value === ChangeableEntityMode.Create
		? t("accounts.addNewTitle")
		: `${ t("common:crudRow.edit") } ${ t("accounts.entityName") }`;

	const canShowBalance = Services.auth.hasAuth(
		SystemPermissionsResources.AccountShowBalance,
		SystemPermissionsActions.Get
	);

	const requiresTaxInfo = entity.value?.type.value === AccountType.Client
		|| entity.value?.type.value === AccountType.Supplier
		|| entity.value?.type.value === AccountType.Employee;

	const isBox = entity.value?.type.value === AccountType.Box;
	const isBank = entity.value?.type.value === AccountType.Bank;
	const requiresAddress = !isBank;
	const requiresContacts = !isBank && !isBox;

	const accountTypeLabels: Record<AccountType, string> = {
		[AccountType.Client]: t("accounts.client"),
		[AccountType.Supplier]: t("accounts.supplier"),
		[AccountType.Employee]: t("accounts.employee"),
		[AccountType.Bank]: t("accounts.bank"),
		[AccountType.Box]: t("accounts.box")
	};

	return (
		<ChangeDialog className="sm:max-w-4xl">
			<ChangeDialog.Header title={ title }/>
			<div className="max-h-[75vh] overflow-y-auto px-2 pb-2">
				<FieldGroup>
					<FieldsSection title={ t("accounts.basicInfo") } columns={ 2 }>
						{ (selectTypes && selectTypes.length > 0)
							&& (
								<SelectField
									label={ t("accounts.accountType") }
									required
									value={ entity.value.type }
									error={ entity.value.getError("type") }
									options={ selectTypes.map((type) => ({
										value: type,
										label: accountTypeLabels[type]
									})) }
								/>
							) }

						<TextField
							label={ t("accounts.accountName") }
							required
							value={ entity.value.name }
							error={ entity.value.getError("name") }
						/>

						{ (entity.value.type.value === AccountType.Client || entity.value.type.value === AccountType.Supplier) && (
							<FormField label={ t("accounts.parentAccount") }>
								<AccountsSearchableSelect
									disabled={ entity.value.mode.value === ChangeableEntityMode.Update }
									types={ entity.value.type.value === AccountType.Client ? [AccountType.Client] : [AccountType.Supplier] }
									id={ entity.value.parentId }
									label={ entity.value.parentName }
									showAddButton={ false }
								/>
							</FormField>
						) }

						{ canShowBalance && (
							<NumberField
								label={ t("accounts.openingBalance") }
								value={ entity.value.initialBalance }
								currency={ <ErpCurrencyIcon/> }
							/>
						) }

						{ canShowBalance && (
							<NumberField
								label={ t("accounts.balance") }
								disabled
								value={ entity.value.balance }
								currency={ <ErpCurrencyIcon/> }
							/>
						) }
					</FieldsSection>

					{ requiresTaxInfo && <TaxFields entity={ entity }/> }

					{ isBank && <BankFields entity={ entity }/> }

					<div
						className={ `grid gap-6 ${
							requiresAddress && requiresContacts
								? "grid-cols-1 md:grid-cols-2"
								: "grid-cols-1"
						}` }
					>
						{ requiresAddress && <AddressFields entity={ entity }/> }
						{ requiresContacts && <ContactsFields entity={ entity }/> }
					</div>

					<FieldsSection title={ t("accounts.additionalInfo") } columns={ 1 }>
						<TextAreaField
							label={ t("accounts.notes") }
							value={ entity.value.notes }
							rows={ 3 }
						/>
					</FieldsSection>
				</FieldGroup>
			</div>
			<ChangeDialog.Footer>
				<div className="flex items-center justify-between w-full">
					<YoutubeButton/>
					<div className="flex justify-end gap-3">
						<ChangeDialog.Close/>
						<ChangeDialog.SaveButton<Account, AccountDto>
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

function BankFields({entity}: { entity: Signal<Account>; })
{
	useSignals();
	const {t} = useTranslation(["accounting", "common"]);
	return (
		<FieldsSection title={ t("accounts.bankingInfo") } columns={ 2 }>
			<TextField
				label={ t("accounts.bankAccountNumber") }
				value={ entity.value.bankAccountNumber || "" }
			/>
		</FieldsSection>
	);
}

function TaxFields({entity}: { entity: Signal<Account>; })
{
	useSignals();
	const {t} = useTranslation(["accounting", "common"]);
	return (
		<FieldsSection title={ t("accounts.taxCommercialInfo") } columns={ 2 }>
			<TextField
				label={ t("accounts.vatNumber") }
				value={ entity.value.vatNumber }
				error={ entity.value.getError("vatNumber") }
			/>
			<TextField
				label={ t("accounts.crn") }
				value={ entity.value.crn }
				error={ entity.value.getError("crn") }
			/>
		</FieldsSection>
	);
}

function ContactsFields({entity}: { entity: Signal<Account>; })
{
	useSignals();
	const {t} = useTranslation(["accounting", "common"]);

	return (
		<FieldsSection title={ t("accounts.contactNumbers") } columns={ 1 }>
			<div className="relative flex flex-col max-h-50 border rounded-md overflow-hidden">
				<div className="space-y-3 overflow-y-auto p-3 flex-1 min-h-0">
					{ entity.value.accountContacts?.value.length === 0 && <TablePreviewCompact.Empty/> }
					{ entity.value.accountContacts?.value.length > 0
						&& entity.value.accountContacts?.value.map((contact, index) => (
							<div key={ index } className="flex items-center gap-3">
								<div className="flex-1">
									<PhoneField
										value={ contact.number }
										placeholder="05xxxxxxxx"
										error={ contact.getError("number") }
									/>
								</div>
								<Button
									type="button"
									variant="destructive"
									size="icon"
									onClick={ () =>
									{
										entity.value.accountContacts.value = entity.value.accountContacts.value.filter((_, i) =>
											i !== index
										);
									} }
								>
									<Trash2 className="h-4 w-4"/>
								</Button>
							</div>
						)) }
				</div>

				<div className="p-3 border-t bg-background shrink-0">
					<Button
						type="button"
						variant="outline"
						size="sm"
						onClick={ () =>
						{
							entity.value.accountContacts.value = [...entity.value.accountContacts.value, AccountContact.create()];
						} }
						className="w-full border-dashed"
					>
						<Plus className="h-4 w-4 ml-2"/>
						{ t("accounts.addContact") }
					</Button>
				</div>
			</div>
		</FieldsSection>
	);
}

function AddressFields({entity}: { entity: Signal<Account>; })
{
	useSignals();
	const {t} = useTranslation(["accounting", "common"]);

	return (
		<FieldsSection title={ t("accounts.addressInfo") } columns={ 1 }>
			<div className="flex flex-col gap-1.5 w-full">
				<label className="text-sm font-medium">{ t("accounts.city") }</label>
				<CitiesSearchableSelect
					id={ entity.value.cityId }
					label={ entity.value.cityName }
				/>
			</div>
			<div className="grid grid-cols-2 gap-2">
				<TextField
					label={ t("accounts.district") }
					value={ entity.value.district }
				/>
				<TextField
					label={ t("accounts.street") }
					value={ entity.value.street }
				/>
			</div>
			<div className="grid grid-cols-2 gap-2">
				<TextField
					label={ t("accounts.buildingNumber") }
					value={ entity.value.buildingNumber }
					error={ entity.value.getError("buildingNumber") }
				/>
				<TextField
					label={ t("accounts.postalCode") }
					value={ entity.value.postalCode }
					error={ entity.value.getError("postalCode") }
				/>
			</div>
		</FieldsSection>
	);
}
