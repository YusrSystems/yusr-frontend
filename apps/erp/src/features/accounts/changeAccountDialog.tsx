import { Services } from "@/core/services/services";
import { useSignals } from "@preact/signals-react/runtime";
import { useTranslation } from "react-i18next";
import {
	ChangeableEntityMode,
	ChangeDialog,
	cn,
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
import {
	Account,
	AccountClass,
	type AccountDto,
	AccountType,
	getAccountClass,
	getAccountTypesByClasses
} from "@/core/data/account.ts";
import ErpCurrencyIcon from "@/core/components/erpCurrencyIcon.tsx";
import React, { useEffect, useMemo } from "react";
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
				{label: "ضريبة مدخلات (Input Tax)", value: AccountType.InputTax},
				{label: "أصول المخزون (Inventory Asset)", value: AccountType.InventoryAsset}
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
				{label: "حقوق الملكية (Equity)", value: AccountType.Equity},
				{label: "حقوق ملكية رصيد افتتاحي (Opening Balance Equity)", value: AccountType.OpeningBalanceEquity}
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
				{label: "مصاريف تشغيلية (Operating Expense)", value: AccountType.OperatingExpense},
				{label: "تسوية قيمة المخزون (Inventory Adjustments)", value: AccountType.InventoryAdjustment}
			]
		}
	];

	const flatOptions = useMemo(() =>
	{
		const list: { label: React.ReactNode; value: AccountType | undefined; disabled?: boolean }[] = [];
		groupedAccountTypes.forEach((section) =>
		{
			section.options.forEach((opt) =>
			{
				list.push({
					// Wrap the text in our new custom component to display the text + badge
					label: <AccountTypeOptionItem type={ opt.value } label={ opt.label }/>,
					value: opt.value
				});
			});
		});
		return list;
	}, []);

	useEffect(() =>
	{
		Cubits.parentAccounts.init(getAccountTypesByClasses([getAccountClass(entity.value.type.value ?? AccountType.CashAndBank)]), {
			"isParentOnly": true
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
					<FieldsSection columns={ 1 }>
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
									entity.value.openingBalance.value = 0;
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
								value={ entity.value.openingBalance }
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

// ----------------------------------------------------------------------------------
// Custom Component (With temporary translations built directly in)
// ----------------------------------------------------------------------------------

interface AccountTypeOptionItemProps
{
	type: AccountType;
	label: string;
}

function AccountTypeOptionItem({type, label}: AccountTypeOptionItemProps)
{
	const accountClass = getAccountClass(type);

	const getClassBadgeDetails = (cls: AccountClass) =>
	{
		switch (cls)
		{
			case AccountClass.Asset:
				return {
					badgeText: "الأصول (Assets)",
					color: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400"
				};
			case AccountClass.Liability:
				return {
					badgeText: "الالتزامات (Liabilities)",
					color: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400"
				};
			case AccountClass.Equity:
				return {
					badgeText: "حقوق الملكية (Equity)",
					color: "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400"
				};
			case AccountClass.Revenue:
				return {
					badgeText: "الإيرادات (Revenue)",
					color: "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400"
				};
			case AccountClass.Expense:
				return {
					badgeText: "المصروفات (Expense)",
					color: "bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400"
				};
			default:
				return {
					badgeText: "غير معروف (Unknown)",
					color: "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300"
				};
		}
	};

	const {badgeText, color} = getClassBadgeDetails(accountClass);

	return (
		<div className="flex items-center justify-between w-full py-0.5 gap-4">
			<div className="flex flex-col min-w-0 flex-1 text-right">
				<span className="text-sm font-medium truncate">{ label }</span>
			</div>
			<div className="shrink-0 flex items-center">
				<span className={ cn("text-[11px] font-semibold px-2.5 py-0.5 rounded-full whitespace-nowrap", color) }>
					{ badgeText }
				</span>
			</div>
		</div>
	);
}