import type { BalanceTransfer, BalanceTransferDto } from "@/core/data/balanceTransfer.ts";
import { ItemsCubit } from "@/features/items/state/itemsCubit";
import { BaseCubits, FilterFieldsCubit, PageCubit } from "yusr-ui";
import { Account, AccountDto } from "../data/account";
import { ErpRole, ErpRoleDto } from "../data/erpRole";
import ItemTransfer, { ItemTransferDto } from "../data/itemTransfer";
import PricingMethod, { PricingMethodDto } from "../data/pricingMethod";
import Stocktaking, { StocktakingDto } from "../data/stocktaking";
import { Tax, TaxDto } from "../data/tax";
import Unit, { UnitDto } from "../data/unit";
import { Services } from "./services";
import { type Voucher, VoucherDto } from "@/core/data/voucher.ts";
import Invoice, { type InvoiceDto } from "@/core/data/invoices/invoice.ts";
import type { Store, StoreDto } from "@/core/data/store.ts";
import { PaymentMethod, type PaymentMethodDto } from "@/core/data/paymentMethod.ts";


export class Cubits extends BaseCubits
{
	public static readonly taxes = new PageCubit<Tax, TaxDto>(Services.taxesApi);
	public static readonly stores = new PageCubit<Store, StoreDto>(Services.storesApi);
	public static readonly units = new PageCubit<Unit, UnitDto>(Services.unitsApi);
	public static readonly pricingMethods = new PageCubit<PricingMethod, PricingMethodDto>(Services.pricingMethodsApi);
	public static readonly paymentMethods = new PageCubit<PaymentMethod, PaymentMethodDto>(Services.paymentMethodsApi);
	public static readonly accounts = new PageCubit<Account, AccountDto>(Services.accountsApi);
	public static readonly balanceTransfers = new PageCubit<BalanceTransfer, BalanceTransferDto>(
		Services.balanceTransfersApi
	);
	public static readonly items = new ItemsCubit();
	public static readonly stocktaking = new PageCubit<Stocktaking, StocktakingDto>(Services.stocktakingApi);
	public static readonly itemTransfers = new PageCubit<ItemTransfer, ItemTransferDto>(Services.itemTransfersApi);
	public static readonly itemsSettlements = new PageCubit<Stocktaking, StocktakingDto>(Services.itemsSettlementsApi);
	public static override roles = new PageCubit<ErpRole, ErpRoleDto>(Services.rolesApi);
	public static readonly vouchers = new PageCubit<Voucher, VoucherDto>(Services.voucherApi);
	public static readonly invoices = new PageCubit<Invoice, InvoiceDto>(Services.invoicesApi);

	public static readonly accountFilterFields = new FilterFieldsCubit("Accounts");
	public static readonly itemFilterFields = new FilterFieldsCubit("Items");
	public static readonly invoiceFilterFields = new FilterFieldsCubit("Invoices");

	static
	{
		BaseCubits.roles = Cubits.roles;
	}
}
