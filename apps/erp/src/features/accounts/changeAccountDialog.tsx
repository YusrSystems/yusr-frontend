import { Services } from "@/core/services/services";
import { useSignals } from "@preact/signals-react/runtime";
import { useTranslation } from "react-i18next";
import {
	ChangeableEntityMode,
	ChangeDialog,
	type CommonChangeDialogProps,
	FieldGroup,
	FieldsSection,
	FormField,
	NumberField,
	SelectField,
	SystemPermissionsActions,
	TextAreaField,
	TextField,
	YoutubeButton
} from "yusr-ui";
import { SystemPermissionsResources } from "@/core/auth/systemPermissionsResources";
import AccountsSearchableSelect from "@/core/components/searchableSelect/accountsSearchableSelect";
import { Account, AccountClass, type AccountDto, AccountType, getAccountClass } from "@/core/data/account.ts";
import ErpCurrencyIcon from "@/core/components/erpCurrencyIcon.tsx";
import { useEffect, useMemo } from "react";
import { signal } from "@preact/signals-react";
import { Cubits } from "@/core/services/cubits.ts";


export default function ChangeAccountDialog(
	{dto, service, onSuccess, initDto}: CommonChangeDialogProps<AccountDto> & {
		initDto?: AccountDto;
	}
)
{
	useSignals();
	const {t} = useTranslation(["accounting", "common"]);

	const entity = useMemo(() => signal<Account>(dto ? Account.load(dto) : Account.create(initDto)), []);

	const isUpdateMode = entity.value.mode.value === ChangeableEntityMode.Update;

	const title = !isUpdateMode
		? t("accounts.addNewTitle")
		: `${ t("common:crudRow.edit") } ${ t("accounts.entityName") }`;

	const groupedAccountTypes = [
		{
			group: "الأصول (Assets)",
			options: [
				{label: "أصول متداولة (Current Asset)", value: AccountType.CurrentAsset},
				{label: "ذمم مدينة (Accounts Receivable)", value: AccountType.AccountsReceivable},
				{label: "النقد والبنوك (Cash and Bank)", value: AccountType.CashAndBank},
				{label: "أصول غير متداولة (Non-Current Asset)", value: AccountType.NonCurrentAsset},
				{label: "ضريبة مدخلات (Input Tax)", value: AccountType.InputTax}
			]
		},
		{
			group: "الالتزامات (Liabilities)",
			options: [
				{label: "التزامات متداولة (Current Liability)", value: AccountType.CurrentLiability},
				{label: "ذمم دائنة (Accounts Payable)", value: AccountType.AccountsPayable},
				{label: "التزامات غير متداولة (Non-Current Liability)", value: AccountType.NonCurrentLiability},
				{label: "ضريبة مخرجات (Output Tax)", value: AccountType.OutputTax}
			]
		},
		{
			group: "حقوق الملكية (Equity)",
			options: [
				{label: "حقوق الملكية (Equity)", value: AccountType.Equity}
			]
		},
		{
			group: "الإيرادات (Revenue)",
			options: [
				{label: "الإيرادات (Sales Revenue)", value: AccountType.SalesRevenue}
			]
		},
		{
			group: "المصروفات (Expense)",
			options: [
				{label: "تكلفة البضاعة المباعة (Cost of Goods Sold)", value: AccountType.CostOfGoodsSold},
				{label: "مصاريف تشغيلية (Operating Expense)", value: AccountType.OperatingExpense}
			]
		}
	];

	const flatOptions = useMemo(() =>
	{
		const list: { label: string; value: AccountType | undefined; disabled?: boolean }[] = [];
		groupedAccountTypes.forEach((section) =>
		{
			section.options.forEach((opt) =>
			{
				list.push({label: opt.label, value: opt.value});
			});
		});
		return list;
	}, []);

	useEffect(() =>
	{
		Cubits.parentAccounts.init(undefined, {
			"isParentOnly": true,
			"filterClass": getAccountClass(entity.value.type.value ?? AccountType.CashAndBank)
		});
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

	return (
		<ChangeDialog className="sm:max-w-2xl">
			<ChangeDialog.Header title={ title }/>
			<div className="max-h-[70vh] overflow-y-auto px-2 pb-2">
				<FieldGroup>
					<FieldsSection title={ t("accounts.basicInfo", "البيانات الأساسية") } columns={ 1 }>
						<TextField
							label={ t("accounts.accountName", "اسم الحساب") }
							required
							value={ entity.value.name }
							error={ entity.value.getError("name") }
						/>

						<SelectField<AccountType>
							label={ t("accounts.accountType", "نوع الحساب") }
							required
							value={ entity.value.type }
							error={ entity.value.getError("type") }
							options={ flatOptions }
							disabled={ isUpdateMode }
							onValueChange={ (type) =>
							{
								if (getAccountClass(type) === AccountClass.Revenue || getAccountClass(type) === AccountClass.Expense)
								{
									entity.value.initialBalance.value = 0;
								}
							} }
						/>

						<FormField label={ t("accounts.parentAccount", "الحساب الأب") }
						           error={ entity.value.getError("parentAccountId") }>
							<AccountsSearchableSelect
								id={ entity.value.parentAccountId }
								label={ entity.value.parentAccountName }
								accountsCubit={ Cubits.parentAccounts }
								showAddButton={ false }
							/>
						</FormField>

						<div className="grid grid-cols-2 gap-4">
							<NumberField
								label={ t("accounts.openingBalance", "الرصيد الافتتاحي") }
								value={ entity.value.initialBalance }
								currency={ <ErpCurrencyIcon/> }
								disabled={ entity.value.isParent.value || getAccountClass(entity.value.type.value) === AccountClass.Revenue || getAccountClass(entity.value.type.value) === AccountClass.Expense }
							/>

							<NumberField
								label={ t("accounts.balance", "الرصيد الحالي") }
								disabled
								value={ entity.value.balance }
								currency={ <ErpCurrencyIcon/> }
							/>
						</div>

						<TextAreaField
							label={ t("accounts.notes", "ملاحظات") }
							value={ entity.value.notes }
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