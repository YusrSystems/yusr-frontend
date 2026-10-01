import { type Signal } from "@preact/signals-react";
import { ChangeableEntity, ChangeableEntityMode, Dto, i18n, Validators } from "yusr-ui";


export enum AccountClass
{
	Asset = 1,
	Liability = 2,
	Equity = 3,
	Revenue = 4,
	Expense = 5
}

export enum AccountType
{
	CurrentAsset = 1,
	AccountsReceivable = 2,
	CashAndBank = 3,
	NonCurrentAsset = 4,
	InputTax = 5,
	InventoryAsset = 14,
	CurrentLiability = 6,
	AccountsPayable = 7,
	NonCurrentLiability = 8,
	OutputTax = 9,
	Equity = 10,
	OpeningBalanceEquity = 15,
	RetainedEarnings = 17,
	SalesRevenue = 11,
	CostOfGoodsSold = 12,
	OperatingExpense = 13,
	InventoryAdjustment = 16
}

export function getAccountClass(type: AccountType): AccountClass
{
	switch (type)
	{
		case AccountType.CurrentAsset:
		case AccountType.AccountsReceivable:
		case AccountType.CashAndBank:
		case AccountType.NonCurrentAsset:
		case AccountType.InputTax:
		case AccountType.InventoryAsset:
			return AccountClass.Asset;

		case AccountType.CurrentLiability:
		case AccountType.AccountsPayable:
		case AccountType.NonCurrentLiability:
		case AccountType.OutputTax:
			return AccountClass.Liability;

		case AccountType.Equity:
		case AccountType.OpeningBalanceEquity:
		case AccountType.RetainedEarnings:
			return AccountClass.Equity;

		case AccountType.SalesRevenue:
			return AccountClass.Revenue;

		case AccountType.CostOfGoodsSold:
		case AccountType.OperatingExpense:
		case AccountType.InventoryAdjustment:
			return AccountClass.Expense;

		default:
			return AccountClass.Asset;
	}
}

export function getAccountTypesByClasses(classes: AccountClass[]): AccountType[]
{
	const types: AccountType[] = [];

	for (const cls of classes)
	{
		switch (cls)
		{
			case AccountClass.Asset:
				types.push(
					AccountType.CurrentAsset,
					AccountType.AccountsReceivable,
					AccountType.CashAndBank,
					AccountType.NonCurrentAsset,
					AccountType.InputTax,
					AccountType.InventoryAsset
				);
				break;

			case AccountClass.Liability:
				types.push(
					AccountType.CurrentLiability,
					AccountType.AccountsPayable,
					AccountType.NonCurrentLiability,
					AccountType.OutputTax
				);
				break;

			case AccountClass.Equity:
				types.push(
					AccountType.Equity,
					AccountType.OpeningBalanceEquity,
					AccountType.RetainedEarnings
				);
				break;

			case AccountClass.Revenue:
				types.push(
					AccountType.SalesRevenue
				);
				break;

			case AccountClass.Expense:
				types.push(
					AccountType.CostOfGoodsSold,
					AccountType.OperatingExpense,
					AccountType.InventoryAdjustment
				);
				break;
		}
	}

	return types;
}

export function getAllowedParentTypes(childType: AccountType): AccountType[]
{
	switch (childType)
	{
		case AccountType.CurrentAsset:
			return [AccountType.CurrentAsset];
		case AccountType.NonCurrentAsset:
			return [AccountType.NonCurrentAsset];
		case AccountType.CashAndBank:
			return [AccountType.CurrentAsset, AccountType.CashAndBank];
		case AccountType.AccountsReceivable:
			return [AccountType.CurrentAsset, AccountType.AccountsReceivable];
		case AccountType.InventoryAsset:
			return [AccountType.CurrentAsset, AccountType.InventoryAsset];
		case AccountType.InputTax:
			return [AccountType.CurrentAsset, AccountType.InputTax];

		case AccountType.CurrentLiability:
			return [AccountType.CurrentLiability];
		case AccountType.NonCurrentLiability:
			return [AccountType.NonCurrentLiability];
		case AccountType.AccountsPayable:
			return [AccountType.CurrentLiability, AccountType.AccountsPayable];
		case AccountType.OutputTax:
			return [AccountType.CurrentLiability, AccountType.OutputTax];

		case AccountType.Equity:
			return [AccountType.Equity];
		case AccountType.RetainedEarnings:
			return [AccountType.Equity, AccountType.RetainedEarnings];
		case AccountType.OpeningBalanceEquity:
			return [AccountType.Equity, AccountType.OpeningBalanceEquity];

		case AccountType.SalesRevenue:
			return [AccountType.SalesRevenue];

		case AccountType.CostOfGoodsSold:
			return [AccountType.CostOfGoodsSold];
		case AccountType.OperatingExpense:
			return [AccountType.OperatingExpense];
		case AccountType.InventoryAdjustment:
			return [AccountType.InventoryAdjustment];
		default:
			return [];
	}
}

export class AccountDto extends Dto
{
	public name: string = "";
	public openingBalance: number = 0;
	public balance: number = 0;
	public notes?: string;
	public class!: AccountClass;
	public type!: AccountType;
	public parentAccountId?: number;
	public parentAccountName?: string;
	public isParent?: boolean;
	public isActive?: boolean;
}

export class Account extends ChangeableEntity<AccountDto>
{
	public name: Signal<string>;
	public openingBalance: Signal<number>;
	public balance: Signal<number>;
	public notes: Signal<string | undefined>;
	public class: Signal<AccountClass>;
	public type: Signal<AccountType>;
	public parentAccountId: Signal<number | undefined>;
	public parentAccountName: Signal<string | undefined>;
	public isParent: Signal<boolean>;
	public isActive: Signal<boolean>;

	constructor(dto: Partial<AccountDto> | undefined, mode: ChangeableEntityMode = ChangeableEntityMode.Create)
	{
		super(dto, [
			{
				field: "name",
				selector: (d) => d.name,
				validators: [Validators.required(i18n.t("accounting:accounts.nameRequired"))]
			},
			{
				field: "type",
				selector: (d) => d.type,
				validators: [Validators.required(i18n.t("accounting:accounts.typeRequired"))]
			},
			{
				field: "parentAccountId",
				selector: (d) => d.parentAccountId,
				validators: [
					Validators.custom((val, form) =>
					{
						if (!val || !form.id) return true;
						return Number(val) !== Number(form.id);
					}, i18n.t("accounting:accounts.selfParentError", "لا يمكن للحساب أن يكون أباً لنفسه"))
				]
			}
		], mode);

		this.name = this.assign("name", dto?.name ?? "");
		this.openingBalance = this.assign("openingBalance", dto?.openingBalance ?? 0);
		this.balance = this.assign("balance", dto?.balance ?? 0);
		this.notes = this.assign("notes", dto?.notes);
		this.type = this.assign("type", dto?.type ?? AccountType.CurrentAsset);
		this.class = this.assign("class", dto?.class ?? getAccountClass(this.type.value));
		this.parentAccountId = this.assign("parentAccountId", dto?.parentAccountId ?? null);
		this.parentAccountName = this.assign("parentAccountName", dto?.parentAccountName ?? null);
		this.isParent = this.assign("isParent", dto?.isParent ?? false);
		this.isActive = this.assign("isActive", dto?.isActive ?? false);

		this.type.subscribe((newType) =>
		{
			this.class.value = getAccountClass(newType);
		});
	}
}