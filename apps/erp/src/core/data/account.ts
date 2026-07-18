import { type Signal } from "@preact/signals-react";
import { ChangeableEntity, ChangeableEntityMode, Dto, i18n, Validators } from "yusr-ui";


export enum AccountClass
{
	Asset = 1,          // الأصول
	Liability = 2,      // الالتزامات
	Equity = 3,         // حقوق الملكية
	Revenue = 4,        // الإيرادات
	Expense = 5         // المصروفات
}

export enum AccountType
{
	// Asset Types
	CurrentAsset = 1,        // أصول متداولة
	AccountsReceivable = 2,  // ذمم مدينة
	CashAndBank = 3,         // النقد والبنوك
	NonCurrentAsset = 4,     // أصول غير متداولة
	InputTax = 5,            // ضريبة مدخلات
	InventoryAsset = 14,     // أصول المخزون

	// Liability Types
	CurrentLiability = 6,    // التزامات متداولة
	AccountsPayable = 7,     // ذمم دائنة
	NonCurrentLiability = 8, // التزامات غير متداولة
	OutputTax = 9,           // ضريبة مخرجات

	// Equity
	Equity = 10,
	OpeningBalanceEquity = 15, // رصيد افتتاحي - حقوق ملكية

	// Revenue
	SalesRevenue = 11,

	// Expense
	CostOfGoodsSold = 12,
	OperatingExpense = 13
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
			return AccountClass.Equity;

		case AccountType.SalesRevenue:
			return AccountClass.Revenue;

		case AccountType.CostOfGoodsSold:
		case AccountType.OperatingExpense:
			return AccountClass.Expense;

		default:
			return AccountClass.Asset;
	}
}

export class AccountDto extends Dto
{
	public name: string = "";
	public initialBalance: number = 0;
	public balance: number = 0;
	public notes?: string;
	public class!: AccountClass;
	public type!: AccountType;
	public parentAccountId?: number;
	public parentAccountName?: string;
	public isParent?: boolean;
}

export class Account extends ChangeableEntity<AccountDto>
{
	public name: Signal<string>;
	public initialBalance: Signal<number>;
	public balance: Signal<number>;
	public notes: Signal<string | undefined>;
	public class: Signal<AccountClass>;
	public type: Signal<AccountType>;
	public parentAccountId: Signal<number | undefined>;
	public parentAccountName: Signal<string | undefined>;
	public isParent: Signal<boolean>;

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
		this.initialBalance = this.assign("initialBalance", dto?.initialBalance ?? 0);
		this.balance = this.assign("balance", dto?.balance ?? 0);
		this.notes = this.assign("notes", dto?.notes);
		this.type = this.assign("type", dto?.type ?? AccountType.CurrentAsset);
		this.class = this.assign("class", dto?.class ?? getAccountClass(this.type.value));
		this.parentAccountId = this.assign("parentAccountId", dto?.parentAccountId ?? null);
		this.parentAccountName = this.assign("parentAccountName", dto?.parentAccountName ?? null);
		this.isParent = this.assign("isParent", dto?.isParent ?? false);

		// Synchronize AccountClass automatically when AccountType updates
		this.type.subscribe((newType) =>
		{
			this.class.value = getAccountClass(newType);
		});
	}
}