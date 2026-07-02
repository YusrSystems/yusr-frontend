import type { BalanceTransferDto } from "@/core/data/balanceTransfer.ts";
import { ItemsCubit } from "@/features/items/state/itemsCubit";
import { BaseCubits, FilterFieldsCubit, PageCubit, PageReportCubit, ReportCubit } from "yusr-ui";
import { AccountDto } from "../data/account";
import { ErpRoleDto } from "../data/erpRole";
import { PricingMethodDto } from "../data/pricingMethod";
import { StocktakingDto } from "../data/stocktaking";
import { TaxDto } from "../data/tax";
import { UnitDto } from "../data/unit";
import { Services } from "./services";
import { VoucherDto } from "@/core/data/voucher.ts";
import { type InvoiceDto } from "@/core/data/invoices/invoice.ts";
import type { StoreDto } from "@/core/data/store.ts";
import { type PaymentMethodDto } from "@/core/data/paymentMethod.ts";
import { type CostAdjustmentDto } from "@/core/data/costAdjustment.ts";
import type { ItemTransferDto } from "@/core/data/itemTransfer.ts";
import type { ItemsMovementReportRequest } from "@/core/data/report/itemsMovementReportRequest.ts";
import type { ItemsMovementReportResult } from "@/features/reports/itemsMovement/itemsMovementReportResult.ts";
import type { TaxReturnReportRequest } from "@/features/reports/taxReturn/taxReturnReportRequest.ts";
import type { TaxReturnReportResult } from "@/features/reports/taxReturn/taxReturnReportResult.ts";


export class Cubits extends BaseCubits
{
	public static readonly taxes = new PageCubit<TaxDto>(Services.taxesApi);
	public static readonly stores = new PageCubit<StoreDto>(Services.storesApi);
	public static readonly units = new PageCubit<UnitDto>(Services.unitsApi);
	public static readonly pricingMethods = new PageCubit<PricingMethodDto>(Services.pricingMethodsApi);
	public static readonly stocktaking = new PageCubit<StocktakingDto>(Services.stocktakingApi);
	public static readonly itemsSettlements = new PageCubit<StocktakingDto>(Services.itemsSettlementsApi);
	public static readonly itemTransfers = new PageCubit<ItemTransferDto>(Services.itemTransfersApi);
	public static readonly items = new ItemsCubit();
	public static readonly costAdjustments = new PageCubit<CostAdjustmentDto>(Services.costAdjustmentsApi);
	public static readonly paymentMethods = new PageCubit<PaymentMethodDto>(Services.paymentMethodsApi);
	public static readonly accounts = new PageCubit<AccountDto>(Services.accountsApi);
	public static readonly balanceTransfers = new PageCubit<BalanceTransferDto>(Services.balanceTransfersApi);
	public static override roles = new PageCubit<ErpRoleDto>(Services.rolesApi);
	public static readonly vouchers = new PageCubit<VoucherDto>(Services.voucherApi);
	public static readonly invoices = new PageCubit<InvoiceDto>(Services.invoicesApi);

	public static readonly accountFilterFields = new FilterFieldsCubit("Accounts");
	public static readonly itemFilterFields = new FilterFieldsCubit("Items");
	public static readonly invoiceFilterFields = new FilterFieldsCubit("Invoices");

	public static readonly ItemsMovementReport = new PageReportCubit<ItemsMovementReportRequest, ItemsMovementReportResult>("ItemsMovement");
	public static readonly TaxReturnReport = new ReportCubit<TaxReturnReportRequest, TaxReturnReportResult>("TaxReturn");

	static
	{
		BaseCubits.roles = Cubits.roles;
	}
}
