import { BalanceTransferDto } from "@/core/data/balanceTransfer.ts";
import { ItemsCubit } from "@/features/items/state/itemsCubit";
import { BaseCubits, FilterFieldsCubit, ListCubit, PageCubit, PageReportCubit, ReportCubit } from "yusr-ui";
import { AccountDto } from "../data/account";
import { ErpRoleDto } from "../data/erpRole";
import { PricingMethodDto } from "../data/pricingMethod";
import { StocktakingDto } from "../data/stocktaking";
import { TaxDto } from "../data/tax";
import { UnitDto } from "../data/unit";
import { VoucherDto } from "@/core/data/voucher.ts";
import { StoreDto } from "@/core/data/store.ts";
import { PaymentMethodDto } from "@/core/data/paymentMethod.ts";
import { CostAdjustmentDto } from "@/core/data/costAdjustment.ts";
import { ItemTransferDto } from "@/core/data/itemTransfer.ts";
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
import { PartnerDto } from "@/core/data/partner.ts";
import type {
	SalesProfitabilityReportRequest
} from "@/features/reports/salesProfitability/salesProfitabilityReportRequest.ts";
import type {
	SalesProfitabilityReportResult
} from "@/features/reports/salesProfitability/salesProfitabilityReportResult.ts";
import type {
	ItemsProfitabilityReportRequest
} from "@/features/reports/itemsProfitability/itemsProfitabilityReportRequest.ts";
import type {
	ItemsProfitabilityReportResult
} from "@/features/reports/itemsProfitability/itemsProfitabilityReportResult.ts";
import type { TaxAuditReportRequest } from "@/features/reports/taxAudit/taxAuditReportRequest.ts";
import type { TaxAuditReportResult } from "@/features/reports/taxAudit/taxAuditReportResult.ts";
import type { StockValuationReportRequest } from "@/features/reports/stockValuation/stockValuationReportRequest.ts";
import type { StockValuationReportResult } from "@/features/reports/stockValuation/stockValuationReportResult.ts";
import type { LowStockReportRequest } from "@/features/reports/lowStock/lowStockReportRequest.ts";
import type { LowStockReportResult } from "@/features/reports/lowStock/lowStockReportResult.ts";
import type {
	ReceivablesAgingReportRequest
} from "@/features/reports/receivablesAging/receivablesAgingReportRequest.ts";
import type { ReceivablesAgingReportResult } from "@/features/reports/receivablesAging/receivablesAgingReportResult.ts";
import { PosTerminalDto } from "@/core/data/posTerminal.ts";
import { CategoryDto } from "@/core/data/category.ts";
import { BrandDto } from "@/core/data/brand.ts";
import { FiscalYearDto } from "@/core/data/fiscalYear.ts";
import { SalesInvoiceDto } from "@/core/data/commercial/salesInvoice.ts";
import { PurchaseInvoiceDto } from "@/core/data/commercial/purchaseInvoice.ts";
import { QuotationDto } from "@/core/data/commercial/quotation.ts";
import { erpRolesApi } from "@/features/roles/roles.api";
import { storesApi } from "@/features/stores/stores.api";
import { pricingMethodsApi } from "@/features/pricingMethods/pricingMethods.api";
import { taxesApi } from "@/features/taxes/taxes.api";
import { unitsApi } from "@/features/units/units.api";
import { brandsApi } from "@/features/brands/brands.api";
import { categoriesApi } from "@/features/itemCategories/categories.api";
import { itemsSettlementsApi, stocktakingsApi } from "@/features/stocktakings/stocktakings.api";
import { costAdjustmentsApi } from "@/features/costAdjustments/costAdjustments.api";
import { itemTransfersApi } from "@/features/itemTransfers/itemTransfers.api";
import { accountsApi } from "@/features/accounts/accounts.api";
import { partnersApi } from "@/features/partners/partners.api";
import { paymentMethodsApi } from "@/features/paymentMethods/paymentMethod.api.ts";
import { balanceTransfersApi } from "@/features/balanceTransfer/balanceTransfers.api";
import { fiscalYearsApi } from "@/features/fiscalYears/fiscalYears.api";
import { vouchersApi } from "@/features/vouchers/vouchers.api";
import { posTerminalsApi } from "@/features/Pos/posTerminals/posTerminals.api";
import { salesInvoicesApi } from "@/features/commercial/sales/salesInvoices.api";
import { purchaseInvoicesApi } from "@/features/commercial/purchases/purchaseInvoices.api";
import { quotationsApi } from "@/features/commercial/quotations/quotations.api";


export class Cubits extends BaseCubits
{
	public static readonly stores = new ListCubit<StoreDto>(storesApi);
	public static readonly pricingMethods = new ListCubit<PricingMethodDto>(pricingMethodsApi);
	public static readonly taxes = new ListCubit<TaxDto>(taxesApi);
	public static readonly units = new ListCubit<UnitDto>(unitsApi);
	public static readonly brands = new ListCubit<BrandDto>(brandsApi);
	public static readonly categories = new ListCubit<CategoryDto>(categoriesApi);
	public static readonly paymentMethods = new ListCubit<PaymentMethodDto>(paymentMethodsApi);
	public static readonly fiscalYears = new ListCubit<FiscalYearDto>(fiscalYearsApi);
	public static readonly posTerminals = new ListCubit<PosTerminalDto>(posTerminalsApi);
	public static readonly salesInvoices = new PageCubit<SalesInvoiceDto>(salesInvoicesApi);
	public static readonly purchaseInvoices = new PageCubit<PurchaseInvoiceDto>(purchaseInvoicesApi);
	public static readonly originalSalesInvoices = new PageCubit<SalesInvoiceDto>(salesInvoicesApi);
	public static readonly originalPurchaseInvoices = new PageCubit<PurchaseInvoiceDto>(purchaseInvoicesApi);
	public static readonly quotations = new PageCubit<QuotationDto>(quotationsApi);
	public static readonly stocktaking = new PageCubit<StocktakingDto>(stocktakingsApi);
	public static readonly itemsSettlements = new PageCubit<StocktakingDto>(itemsSettlementsApi);
	public static readonly costAdjustments = new PageCubit<CostAdjustmentDto>(costAdjustmentsApi);
	public static readonly itemTransfers = new PageCubit<ItemTransferDto>(itemTransfersApi);
	public static readonly balanceTransfers = new PageCubit<BalanceTransferDto>(balanceTransfersApi);
	public static readonly items = new ItemsCubit();
	public static readonly accounts = new PageCubit<AccountDto>(accountsApi);
	public static readonly parentAccounts = new PageCubit<AccountDto>(accountsApi);
	public static readonly partners = new PageCubit<PartnerDto>(partnersApi);
	public static readonly vouchers = new PageCubit<VoucherDto>(vouchersApi);
	public static override roles = new ListCubit<ErpRoleDto>(erpRolesApi);

	public static readonly accountFilterFields = new FilterFieldsCubit("Accounts");
	public static readonly itemFilterFields = new FilterFieldsCubit("Items");
	public static readonly salesInvoiceFilterFields = new FilterFieldsCubit("SalesInvoices");
	public static readonly purchaseInvoiceFilterFields = new FilterFieldsCubit("PurchaseInvoices");
	public static readonly quotationFilterFields = new FilterFieldsCubit("Quotations");
	public static readonly partnerFilterFields = new FilterFieldsCubit("Partners");

	public static readonly voucherFilterFields = new FilterFieldsCubit("Vouchers");
	public static readonly ItemsMovementReport = new PageReportCubit<ItemsMovementReportRequest, ItemsMovementReportResult>("ItemsMovement");
	public static readonly AccountStatementReport = new PageReportCubit<AccountStatementReportRequest, AccountStatementReportResult>("AccountStatement");
	public static readonly PartnerStatementReport = new PageReportCubit<PartnerStatementReportRequest, PartnerStatementReportResult>("PartnerStatement");
	public static readonly ItemStatementReport = new PageReportCubit<ItemStatementReportRequest, ItemStatementReportResult>("ItemStatement");
	public static readonly VatReturnReport = new ReportCubit<VatReturnReportRequest, VatReturnReportResult>("VatReturn");
	public static readonly BalanceSheetReport = new ReportCubit<BalanceSheetReportRequest, BalanceSheetReportResult>("BalanceSheet");
	public static readonly ProfitAndLossReport = new ReportCubit<ProfitAndLossReportRequest, ProfitAndLossReportResult>("ProfitAndLoss");
	public static readonly SalesProfitabilityReport = new PageReportCubit<SalesProfitabilityReportRequest, SalesProfitabilityReportResult>("SalesProfitability");
	public static readonly ItemsProfitabilityReport = new PageReportCubit<ItemsProfitabilityReportRequest, ItemsProfitabilityReportResult>("ItemsProfitability");
	public static readonly TaxAuditReport = new PageReportCubit<TaxAuditReportRequest, TaxAuditReportResult>("TaxAudit");
	public static readonly stockValuationReport = new PageReportCubit<StockValuationReportRequest, StockValuationReportResult>("StockValuation");
	public static readonly lowStockReport = new PageReportCubit<LowStockReportRequest, LowStockReportResult>("LowStock");
	public static readonly receivablesAgingReport = new PageReportCubit<ReceivablesAgingReportRequest, ReceivablesAgingReportResult>("ReceivablesAging");

	static
	{
		BaseCubits.roles = Cubits.roles;
	}
}