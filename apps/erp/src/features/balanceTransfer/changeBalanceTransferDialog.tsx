import { SystemPermissionsResources } from "@/core/auth/systemPermissionsResources";
import AccountsSearchableSelect from "@/core/components/searchableSelect/accountsSearchableSelect";
import { AccountType } from "@/core/data/account";
import { Services } from "@/core/services/services";
import { signal } from "@preact/signals-react";
import { useSignals } from "@preact/signals-react/runtime";
import { useEffect, useMemo } from "react";
import { useTranslation } from "react-i18next";
import {
	ChangeableEntityMode,
	ChangeDialog,
	type CommonChangeDialogProps,
	DateField,
	FieldGroup,
	FieldsSection,
	FormField,
	NumberField,
	NumberToWordsService,
	SystemPermissionsActions,
	TextAreaField,
	TextField
} from "yusr-ui";
import { BalanceTransfer, type BalanceTransferDto } from "@/core/data/balanceTransfer.ts";
import ErpCurrencyIcon from "@/core/components/erpCurrencyIcon.tsx";
import { Cubits } from "@/core/services/cubits.ts";
import { TransactionStatus } from "#/types/transactionStatus.ts";


export default function ChangeBalanceTransferDialog(
	{dto, service, onSuccess}: CommonChangeDialogProps<BalanceTransferDto>
)
{
	useSignals();

	const {t} = useTranslation(["accounting", "common"]);
	const entity = useMemo(() => signal<BalanceTransfer>(dto ? BalanceTransfer.load(dto) : BalanceTransfer.create()), []);
	const amountToWords = useMemo(() => signal<string>(""), []);

	useEffect(() =>
	{
		if (entity.value.transactionStatus.value === TransactionStatus.Voided) return;
		Cubits.accounts.init([AccountType.CashAndBank], {"isLeafOnly": true});
	}, [entity.value.transactionStatus.value]);

	useEffect(() =>
	{
		if (entity.value.amount.value !== undefined && Services.auth.setting?.currency?.value)
		{
			amountToWords.value = NumberToWordsService.ConvertAmount(
				entity.value.amount.value,
				Services.auth.setting.currency.value
			);
		}
	}, [entity.value.amount.value, amountToWords]);

	if (
		(entity.value.mode.value === ChangeableEntityMode.Create
			&& !Services.auth.hasAuth(SystemPermissionsResources.BalanceTransfers, SystemPermissionsActions.Add))
		|| (entity.value.mode.value === ChangeableEntityMode.Update
			&& !Services.auth.hasAuth(SystemPermissionsResources.BalanceTransfers, SystemPermissionsActions.Update))
	)
	{
		return <ChangeDialog.Unauthorized/>;
	}

	const isUpdateMode = entity.value.mode.value === ChangeableEntityMode.Update;
	const title = !isUpdateMode
		? t("balanceTransfers.addNewTitle")
		: `${ t("common:crudRow.edit") } ${ t("balanceTransfers.entityName") }`;

	const isDraft = entity.value.transactionStatus.value === TransactionStatus.Draft;
	const isPosted = entity.value.transactionStatus.value === TransactionStatus.Posted;
	const isVoided = entity.value.transactionStatus.value === TransactionStatus.Voided;

	return (
		<ChangeDialog className="sm:max-w-lg">
			<ChangeDialog.Header title={ title }/>

			<div className="max-h-[75vh] overflow-y-auto px-2 pb-2">
				<FieldGroup>
					<FieldsSection columns={ 2 }>
						<DateField
							label={ t("balanceTransfers.transferDate") }
							value={ entity.value.date }
							disabled={ !isDraft }
						/>
						<NumberField
							label={ t("balanceTransfers.amount") }
							required
							min={ 0 }
							value={ entity.value.amount }
							error={ entity.value.getError("amount") }
							currency={ <ErpCurrencyIcon/> }
							disabled={ !isDraft }
						/>
						<div className="col-span-full">
							<TextField
								label={ t("balanceTransfers.amountInWords") }
								value={ amountToWords }
								disabled
							/>
						</div>
					</FieldsSection>

					<FieldsSection columns={ 2 }>
						<FormField
							label={ t("balanceTransfers.fromAccount") }
							required
							error={ entity.value.getError("fromGlAccountId") }
						>
							<AccountsSearchableSelect
								label={ entity.value.fromGlAccountName }
								id={ entity.value.fromGlAccountId }
								disabled={ !isDraft }
							/>
						</FormField>

						<FormField
							label={ t("balanceTransfers.toAccount") }
							required
							error={ entity.value.getError("toGlAccountId") }
						>
							<AccountsSearchableSelect
								label={ entity.value.toGlAccountName }
								id={ entity.value.toGlAccountId }
								disabled={ !isDraft }
							/>
						</FormField>
					</FieldsSection>

					<FieldsSection columns={ 1 }>
						<TextAreaField
							label={ t("balanceTransfers.description") }
							value={ entity.value.description }
							collapsible
							collapsedHeight={ 60 }
						/>
					</FieldsSection>
				</FieldGroup>
			</div>

			<ChangeDialog.Footer>
				<ChangeDialog.Close/>
				{ isDraft && (
					<>
						<ChangeDialog.SaveButton<BalanceTransfer, BalanceTransferDto>
							entity={ entity }
							service={ service }
							variant="outline"
							label={ t("common:saveAsDraft", "حفظ كمسودة") }
							transformData={ (data) =>
							{
								data.transactionStatus = TransactionStatus.Draft;
								return data;
							} }
							onSuccess={ (data) => onSuccess?.(data, entity.value.mode.value) }
							disabled={ isVoided }
						/>
						<ChangeDialog.SaveButton<BalanceTransfer, BalanceTransferDto>
							entity={ entity }
							service={ service }
							label={ t("common:saveAndPost", "حفظ وترحيل") }
							transformData={ (data) =>
							{
								data.transactionStatus = TransactionStatus.Posted;
								return data;
							} }
							onSuccess={ (data) => onSuccess?.(data, entity.value.mode.value) }
							checkEntityChanges={ false }
							disabled={ isVoided }
						/>
					</>
				) }
				{ (isPosted || isVoided) && (
					<ChangeDialog.SaveButton<BalanceTransfer, BalanceTransferDto>
						entity={ entity }
						service={ service }
						label={ t("common:saveButton.saveChanges") }
						onSuccess={ (data) => onSuccess?.(data, entity.value.mode.value) }
					/>
				) }
			</ChangeDialog.Footer>
		</ChangeDialog>
	);
}