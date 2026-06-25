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
	TextField
} from "yusr-ui";

import { SystemPermissionsResources } from "@/core/auth/systemPermissionsResources";
import AccountsSearchableSelect from "@/core/components/searchableSelect/accountsSearchableSelect";
import { Plus, Trash2 } from "lucide-react";
import { type Account, AccountContact, type AccountDto, AccountType } from "@/core/data/account.ts";
import ErpCurrencyIcon from "@/core/components/erpCurrencyIcon.tsx";
import { useMemo } from "react";
import { type Signal, signal } from "@preact/signals-react";


export default function ChangeAccountDialog(
	{entity, service, onSuccess, selectTypes}: CommonChangeDialogProps<Account, AccountDto> & {
		selectTypes?: AccountType[];
	}
)
{
	useSignals();
	const {t} = useTranslation(["accounting", "common"]);
	const currentEntity = useMemo(() => signal<Account>(entity), []); // I left the deps array empty, it causes infinite rerenders if you put anything inside it

	if (
		(currentEntity.value.mode.value === ChangeableEntityMode.Create
			&& !Services.auth.hasAuth(SystemPermissionsResources.Accounts, SystemPermissionsActions.Add))
		|| (currentEntity.value.mode.value === ChangeableEntityMode.Update
			&& !Services.auth.hasAuth(SystemPermissionsResources.Accounts, SystemPermissionsActions.Update))
	)
	{
		return <ChangeDialog.Unauthorized/>;
	}

	const title = currentEntity.value.mode.value === ChangeableEntityMode.Create
		? t("accounts.addNewTitle")
		: `${ t("common:crudRow.edit") } ${ t("accounts.entityName") }`;

	const canShowBalance = Services.auth.hasAuth(
		SystemPermissionsResources.AccountShowBalance,
		SystemPermissionsActions.Get
	);

	const requiresTaxInfo = currentEntity.value?.type.value === AccountType.Client
		|| currentEntity.value?.type.value === AccountType.Supplier
		|| currentEntity.value?.type.value === AccountType.Employee;

	const isBox = currentEntity.value?.type.value === AccountType.Box;
	const isBank = currentEntity.value?.type.value === AccountType.Bank;
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
			<FieldGroup>
				<FieldsSection title={ t("accounts.basicInfo") } columns={ 2 }>
					{ (selectTypes && selectTypes.length > 0)
						&& (
							<SelectField
								label={ t("accounts.accountType") }
								required
								value={ currentEntity.value.type }
								error={ currentEntity.value.getError("type") }
								options={ selectTypes.map((type) => ({
									value: type,
									label: accountTypeLabels[type]
								})) }
							/>
						) }

					<TextField
						label={ t("accounts.accountName") }
						required
						value={ currentEntity.value.name }
						error={ currentEntity.value.getError("name") }
					/>

					{ (currentEntity.value.type.value === AccountType.Client || currentEntity.value.type.value === AccountType.Supplier) && (
						<FormField label={ t("accounts.parentAccount") }>
							<AccountsSearchableSelect
								disabled={ currentEntity.value.mode.value === ChangeableEntityMode.Update }
								types={ currentEntity.value.type.value === AccountType.Client ? [AccountType.Client] : [AccountType.Supplier] }
								id={ currentEntity.value.parentId }
								label={ currentEntity.value.parentName }
								showAddButton={ false }
							/>
						</FormField>
					) }

					{ canShowBalance && (
						<NumberField
							label={ t("accounts.openingBalance") }
							value={ currentEntity.value.initialBalance }
							currency={ <ErpCurrencyIcon/> }
						/>
					) }

					{ canShowBalance && (
						<NumberField
							label={ t("accounts.balance") }
							disabled
							value={ currentEntity.value.balance }
							currency={ <ErpCurrencyIcon/> }
						/>
					) }
				</FieldsSection>

				{ requiresTaxInfo && <TaxFields entity={ currentEntity }/> }

				{ isBank && <BankFields entity={ currentEntity }/> }

				<div
					className={ `grid gap-6 ${
						requiresAddress && requiresContacts
							? "grid-cols-1 md:grid-cols-2"
							: "grid-cols-1"
					}` }
				>
					{ requiresAddress && <AddressFields entity={ currentEntity }/> }
					{ requiresContacts && <ContactsFields entity={ currentEntity }/> }
				</div>

				<FieldsSection title={ t("accounts.additionalInfo") } columns={ 1 }>
					<TextAreaField
						label={ t("accounts.notes") }
						value={ currentEntity.value.notes }
						rows={ 3 }
					/>
				</FieldsSection>
			</FieldGroup>
			<ChangeDialog.Footer>
				<ChangeDialog.Close/>
				<ChangeDialog.SaveButton<Account, AccountDto>
					entity={ currentEntity.value }
					service={ service }
					onSuccess={ (data) => onSuccess?.(data) }
				/>
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
