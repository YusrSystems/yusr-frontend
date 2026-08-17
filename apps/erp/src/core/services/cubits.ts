import type { BalanceTransferDto } from "@/core/data/balanceTransfer.ts";
import { ItemsCubit } from "@/features/items/state/itemsCubit";
import { BaseCubits, FilterFieldsCubit, PageCubit, PageReportCubit, ReportCubit, UserDto } from "yusr-ui";
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
import type { ItemsMovementReportRequest } from "@/features/reports/itemsMovement/itemsMovementReportRequest.ts";
import type { ItemsMovementReportResult } from "@/features/reports/itemsMovement/itemsMovementReportResult.ts";
import type { VatReturnReportRequest } from "@/features/reports/vatReturn/vatReturnReportRequest.ts";
import type { VatReturnReportResult } from "@/features/reports/vatReturn/vatReturnReportResult.ts";

import type { BalanceSheetReportResult } from "@/features/reports/balanceSheet/balanceSheetReportResult.ts";
import type { BalanceSheetReportRequest } from "@/features/reports/balanceSheet/balanceSheetReportRequest.ts";
import type { ProfitAndLossReportRequest } from "@/features/reports/profitAndLoss/profitAndLossReportRequest.ts";
import type { ProfitAndLossReportResult } from "@/features/reports/profitAndLoss/profitAndLossReportResult.ts";
import type { ItemStatementReportResult } from "@/features/reports/itemStatement/itemStatementReportResult.ts";
import type { ItemStatementReportRequest } from "@/features/reports/itemStatement/itemStatementReportRequest.ts";
import type {
	AccountStatementReportRequest
} from "@/features/reports/accountStatement/accountStatementReportRequest.ts";
import type { AccountStatementReportResult } from "@/features/reports/accountStatement/accountStatementReportResult.ts";
import type {
	PartnerStatementReportRequest
} from "@/features/reports/partnerStatement/partnerStatementReportRequest.ts";
import type { PartnerStatementReportResult } from "@/features/reports/partnerStatement/partnerStatementReportResult.ts";
import type { PartnerDto } from "@/core/data/partner.ts";
import type {
	SalesProfitabilityReportRequest
} from "@/features/reports/salesProfitability/salesProfitabilityReportRequest.ts";
import type {
	SalesProfitabilityReportResult
} from "@/features/reports/salesProfitability/salesProfitabilityReportResult.ts";
import type { TaxAuditReportRequest } from "@/features/reports/taxAudit/taxAuditReportRequest.ts";
import type { TaxAuditReportResult } from "@/features/reports/taxAudit/taxAuditReportResult.ts";
import type { StockValuationReportRequest } from "@/features/reports/stockValuation/stockValuationReportRequest.ts";
import type { StockValuationReportResult } from "@/features/reports/stockValuation/stockValuationReportResult.ts";
import type { LowStockReportRequest } from "@/features/reports/lowStock/lowStockReportRequest.ts";
import type { LowStockReportResult } from "@/features/reports/lowStock/lowStockReportResult.ts";
import { PosTerminalDto } from "@/core/data/posTerminal.ts";
import { CategoryDto } from "@/core/data/category.ts";
import { BrandDto } from "@/core/data/brand.ts";
import { FiscalYearDto } from "@/core/data/fiscalYear.ts";


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
	public static readonly parentAccounts = new PageCubit<AccountDto>(Services.accountsApi);
	public static readonly balanceTransfers = new PageCubit<BalanceTransferDto>(Services.balanceTransfersApi);
	public static override roles = new PageCubit<ErpRoleDto>(Services.rolesApi);
	public static readonly vouchers = new PageCubit<VoucherDto>(Services.voucherApi);
	public static readonly invoices = new PageCubit<InvoiceDto>(Services.invoicesApi);
	public static readonly partners = new PageCubit<PartnerDto>(Services.partnersApi);
	public static readonly posTerminals = new PageCubit<PosTerminalDto>(Services.posTerminalsApi);
	public static readonly users = new PageCubit<UserDto>(Services.usersApi);
	public static readonly categories = new PageCubit<CategoryDto>(Services.categoriesApi);
	public static readonly brands = new PageCubit<BrandDto>(Services.brandsApi);
	public static readonly fiscalYears = new PageCubit<FiscalYearDto>(Services.fiscalYearsApi);

	// filter fields
	public static readonly accountFilterFields = new FilterFieldsCubit("Accounts");
	public static readonly itemFilterFields = new FilterFieldsCubit("Items");
	public static readonly invoiceFilterFields = new FilterFieldsCubit("Invoices");
	public static readonly partnerFilterFields = new FilterFieldsCubit("Partners");
	public static readonly voucherFilterFields = new FilterFieldsCubit("Vouchers");

	// reports
	public static readonly ItemsMovementReport = new PageReportCubit<ItemsMovementReportRequest, ItemsMovementReportResult>("ItemsMovement");
	public static readonly AccountStatementReport = new PageReportCubit<AccountStatementReportRequest, AccountStatementReportResult>("AccountStatement");
	public static readonly PartnerStatementReport = new PageReportCubit<PartnerStatementReportRequest, PartnerStatementReportResult>("PartnerStatement");
	public static readonly ItemStatementReport = new PageReportCubit<ItemStatementReportRequest, ItemStatementReportResult>("ItemStatement");
	public static readonly VatReturnReport = new ReportCubit<VatReturnReportRequest, VatReturnReportResult>("VatReturn");
	public static readonly BalanceSheetReport = new ReportCubit<BalanceSheetReportRequest, BalanceSheetReportResult>("BalanceSheet");
	public static readonly ProfitAndLossReport = new ReportCubit<ProfitAndLossReportRequest, ProfitAndLossReportResult>("ProfitAndLoss");
	public static readonly SalesProfitabilityReport = new PageReportCubit<SalesProfitabilityReportRequest, SalesProfitabilityReportResult>("SalesProfitability");
	public static readonly TaxAuditReport = new PageReportCubit<TaxAuditReportRequest, TaxAuditReportResult>("TaxAudit");
	public static readonly stockValuationReport = new PageReportCubit<StockValuationReportRequest, StockValuationReportResult>("StockValuation");
	public static readonly lowStockReport = new PageReportCubit<LowStockReportRequest, LowStockReportResult>("LowStock");

	static
	{
		BaseCubits.roles = Cubits.roles;
	}
}