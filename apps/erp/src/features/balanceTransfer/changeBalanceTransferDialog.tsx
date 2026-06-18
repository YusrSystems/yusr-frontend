import { SystemPermissionsResources } from "@/core/auth/systemPermissionsResources";
import AccountsSearchableSelect from "@/core/components/searchableSelect/accountsSearchableSelect";
import { AccountType } from "@/core/data/account";
import { Services } from "@/core/services/services";
import { signal } from "@preact/signals-react";
import { useSignals } from "@preact/signals-react/runtime";
import { useEffect, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";
import {
	ChangeableEntityMode,
	ChangeDialog,
	type CommonChangeDialogProps,
	DateField,
	FieldGroup,
	FieldsSection,
	FormField,
	NumberField,
	NumbertoWordsService,
	SystemPermissionsActions,
	TextAreaField,
	TextField
} from "yusr-ui";
import type { BalanceTransfer, BalanceTransferDto } from "@/core/data/balanceTransfer.ts";
import ErpCurrencyIcon from "@/core/components/erpCurrencyIcon.tsx";
import { Cubits } from "@/core/services/cubits.ts";


export default function ChangeBalanceTransferDialog(
	{entity, service, onSuccess}: CommonChangeDialogProps<BalanceTransfer, BalanceTransferDto>
)
{
	useSignals();

	const {t} = useTranslation(["accounting", "common"]);
	const amountToWords = useMemo(() => signal<string>(""), []);
	const hasBankPerm = Services.auth.hasAuth(
		SystemPermissionsResources.AccountBank,
		SystemPermissionsActions.Get
	);

	const hasBoxPerm = Services.auth.hasAuth(
		SystemPermissionsResources.AccountBox,
		SystemPermissionsActions.Get
	);
	const types: AccountType[] = useMemo(() => [], []);
	if (hasBankPerm)
	{
		types.push(AccountType.Bank);
	}

	if (hasBoxPerm)
	{
		types.push(AccountType.Box);
	}
	useEffect(() =>
	{
		Cubits.accounts.init(types);
	}, [types]);
	useEffect(() =>
	{
		if (entity.amount.value !== undefined && Services.auth.setting?.currency?.value)
		{
			amountToWords.value = NumbertoWordsService.ConvertAmount(
				entity.amount.value,
				Services.auth.setting.currency.value
			);
		}
	}, [entity.amount.value, amountToWords]);

	if (
		(entity.mode.value === ChangeableEntityMode.Create
			&& !Services.auth.hasAuth(SystemPermissionsResources.BalanceTransfers, SystemPermissionsActions.Add))
		|| (entity.mode.value === ChangeableEntityMode.Update
			&& !Services.auth.hasAuth(SystemPermissionsResources.BalanceTransfers, SystemPermissionsActions.Update))
	)
	{
		return <ChangeDialog.Unauthorized/>;
	}

	const title = entity.mode.value === ChangeableEntityMode.Create
		? t("balanceTransfers.addNewTitle")
		: `${ t("common:crudRow.edit") } ${ t("balanceTransfers.entityName") }`;

	const hasSelectAccountPermission = hasBankPerm || hasBoxPerm;
	const canChangeBankAccount = hasSelectAccountPermission && entity.mode.value === ChangeableEntityMode.Create;
	console.log(canChangeBankAccount);
	if (!hasSelectAccountPermission)
	{
		toast.warning(t("paymentMethods.noPermissionToEditAdmin"));
	}

	return (
		<ChangeDialog className="sm:max-w-lg">
			<ChangeDialog.Header
				title={ title }
			/>

			<div className="max-h-[75vh] overflow-y-auto px-2 pb-2">
				<FieldGroup>
					<FieldsSection title={ t("balanceTransfers.transferDetails") } columns={ 2 }>
						<DateField
							label={ t("balanceTransfers.transferDate") }
							value={ entity.date }
							required
							error={ entity.getError("date") }
						/>
						<NumberField
							label={ t("balanceTransfers.amount") }
							required
							value={ entity.amount }
							error={ entity.getError("amount") }
							currency={ <ErpCurrencyIcon/> }
						/>
						<div className="col-span-full">
							<TextField
								label={ t("balanceTransfers.amountInWords") }
								value={ amountToWords }
								disabled
							/>
						</div>
					</FieldsSection>

					<FieldsSection title={ t("balanceTransfers.transferParties") } columns={ 2 }>
						<FormField
							label={ t("balanceTransfers.fromAccount") }
							required
							error={ entity.getError("fromAccountId") }
						>
							<AccountsSearchableSelect
								label={ entity.fromAccountName }
								id={ entity.fromAccountId }
								types={ types }
								disabled={ !canChangeBankAccount }
							/>
						</FormField>

						<FormField
							label={ t("balanceTransfers.toAccount") }
							required
							error={ entity.getError("toAccountId") }
						>
							<AccountsSearchableSelect
								label={ entity.toAccountName }
								id={ entity.toAccountId }
								types={ types }
								disabled={ !canChangeBankAccount }
							/>
						</FormField>
					</FieldsSection>

					<FieldsSection title={ t("balanceTransfers.additionalInfo") } columns={ 1 }>
						<TextAreaField
							label={ t("balanceTransfers.description") }
							value={ entity.description }
							rows={ 3 }
							placeholder={ ". . ." }
						/>
					</FieldsSection>
				</FieldGroup>
			</div>

			<ChangeDialog.Footer>
				<ChangeDialog.Close/>
				<ChangeDialog.SaveButton<BalanceTransfer, BalanceTransferDto>
					entity={ entity }
					service={ service }
					onSuccess={ (data) => onSuccess?.(data) }

				/>
			</ChangeDialog.Footer>
		</ChangeDialog>
	);
}
