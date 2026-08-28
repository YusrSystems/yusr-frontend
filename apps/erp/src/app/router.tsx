import { Services } from "@/core/services/services";
import BalanceTransfersPage from "@/features/balanceTransfer/balanceTransfersPage";
import LegalDocViewer from "@/features/legal/legaldocviewer";
import { PaymentMethodsPage } from "@/features/paymentMethods/paymentMethodsPage";
import { ErpRolesPage } from "@/features/roles/erpRolesPage";
import VouchersPage from "@/features/vouchers/vouchersPage";
import { createBrowserRouter } from "react-router-dom";
import { BaseFilterableApiService, BranchesPage, ErrorFallback, NotFoundPage, UsersPage } from "yusr-ui";
import DashboardPage from "../features/dashboard/dashboardPage";
import ItemsPage from "../features/items/itemsPage";
import ItemsSettlementsPage from "../features/stocktakings/itemsSettlementsPage";
import ItemTransfersPage from "../features/itemTransfers/itemTransfersPage";
import LandingPage from "../features/landing/landingPage";
import LoginPage from "../features/login/loginPage";
import PricingMethodsPage from "../features/pricingMethods/pricingMethodsPage";
import RegisterPage from "../features/register/presentation/registerPage";
import ReportsPage from "../features/reports/reportsPage";
import SettingPage from "../features/setting/settingPage";
import StocktakingsPage from "../features/stocktakings/stocktakingsPage";
import StoresPage from "../features/stores/storePage";
import TaxesPage from "../features/taxes/taxesPage";
import TenantInfoSharingPage from "../features/tenantInfoSharing/tenantInfoSharingPage";
import UnitsPage from "../features/units/unitsPage";
import AppLayout from "./appLayout";
import AuthGate from "@/app/authGate";
import CostAdjustmentsPage from "@/features/costAdjustments/costAdjustmentsPage";
import { ItemsListReportPage } from "@/features/reports/itemsList/itemsListReportPage";
import { ItemsMovementReportPage } from "@/features/reports/itemsMovement/itemsMovementReportPage";
import { VatReturnReportPage } from "@/features/reports/vatReturn/vatReturnReportPage";
import { InvoicesListReportPage } from "@/features/reports/invoicesList/invoicesListReportPage";
import { ProfitAndLossReportPage } from "@/features/reports/profitAndLoss/profitAndLossReportPage";
import { BalanceSheetReportPage } from "@/features/reports/balanceSheet/balanceSheetReportPage";
import { ItemStatementReportPage } from "@/features/reports/itemStatement/itemStatementReportPage";
import { AccountStatementReportPage } from "@/features/reports/accountStatement/accountStatementReportPage";
import { PartnerStatementReportPage } from "@/features/reports/partnerStatement/partnerStatementReportPage";
import { AccountsListReportPage } from "@/features/reports/accountsList/accountsListReportPage";
import AccountsPage from "@/features/accounts/accountsPage";
import PartnersPage from "@/features/partners/partnersPage";
import { PartnerType } from "@/core/data/partner";
import { SalesProfitabilityReportPage } from "@/features/reports/salesProfitability/salesProfitabilityReportPage";
import { TaxAuditReportPage } from "@/features/reports/taxAudit/taxAuditReportPage";
import { StockValuationReportPage } from "@/features/reports/stockValuation/stockValuationReportPage";
import { LowStockReportPage } from "@/features/reports/lowStock/lowStockReportPage";
import PosTerminalsPage from "@/features/Pos/posTerminals/posTerminalsPage";
import PosEntryPage from "@/features/Pos/posSession/posEntryPage";
import PosScreenPage from "@/features/Pos/posScreen/posScreenPage";
import { VouchersListReportPage } from "@/features/reports/vouchersList/vouchersListReportPage";
import PosCustomerDisplayPage from "@/features/Pos/posScreen/posCustomerDisplayPage";
import FiscalYearsPage from "@/features/fiscalYears/fiscalYearsPage";
import SalesInvoicesPage from "@/features/commercial/sales/salesInvoicesPage.tsx";
import PurchaseInvoicesPage from "@/features/commercial/purchases/purchaseInvoicesPage.tsx";
import QuotationsPage from "@/features/commercial/quotations/quotationsPage.tsx";


const refreshPage = () =>
{
	window.location.reload();
};

export const router = createBrowserRouter([
	{
		errorElement: <ErrorFallback reset={ refreshPage }/>,
		children: [
			{path: "/", element: <LandingPage/>},
			{path: "/login", element: <LoginPage/>},
			{path: "/register/:joinedByKey?", element: <RegisterPage/>},
			{path: "/legal", element: <LegalDocViewer/>},
			{path: "/sharing/:registrationKey", element: <TenantInfoSharingPage/>},
			{
				element: <AuthGate/>,
				children: [
					{
						path: "/pos/screen/:terminalId?",
						element: <PosScreenPage/>
					},
					{path: "/pos/customer/:terminalId", element: <PosCustomerDisplayPage/>},
					{
						element: <AppLayout/>,
						children: [
							{path: "/dashboard", element: <DashboardPage/>},
							{path: "/users/:id?", element: <UsersPage/>},
							{path: "/settings", element: <SettingPage/>},
							{path: "/taxes", element: <TaxesPage/>},
							{path: "/branches", element: <BranchesPage onUpdate={ Services.auth.updateBranch }/>},
							{path: "/roles", element: <ErpRolesPage/>},
							{path: "/stores/:id?", element: <StoresPage/>},
							{path: "/units", element: <UnitsPage/>},
							{path: "/accounts/:id?", element: <AccountsPage/>},
							{path: "/fiscalYears/:id?", element: <FiscalYearsPage/>},
							{path: "/paymentMethods", element: <PaymentMethodsPage/>},
							{path: "/balanceTransfer/:id?", element: <BalanceTransfersPage/>},
							{path: "/items/:id?", element: <ItemsPage/>},
							{path: "/costAdjustments", element: <CostAdjustmentsPage/>},
							{path: "/pricingMethods", element: <PricingMethodsPage/>},
							{path: "/itemTransfers/:id?", element: <ItemTransfersPage/>},
							{path: "/stocktakings", element: <StocktakingsPage/>},
							{path: "/itemsSettlements/:id?", element: <ItemsSettlementsPage/>},
							{path: "/vouchers/:id?", element: <VouchersPage/>},
							{path: "/posTerminals", element: <PosTerminalsPage/>},
							{path: "/pos", element: <PosEntryPage/>},
							{
								path: "/clients/:id?",
								element: <PartnersPage type={ PartnerType.Customer }/>
							},
							{
								path: "/suppliers/:id?",
								element: <PartnersPage type={ PartnerType.Supplier }/>
							},
							{path: "/reports", element: <ReportsPage/>},

							// Commercial Documents
							{path: "/sales/:id?", element: <SalesInvoicesPage/>},
							{path: "/purchases/:id?", element: <PurchaseInvoicesPage/>},
							{path: "/quotations/:id?", element: <QuotationsPage/>},

							// Reports
							{path: "/reports/itemsList", element: <ItemsListReportPage/>},
							{path: "/reports/accountsList", element: <AccountsListReportPage/>},
							{path: "/reports/vouchersList", element: <VouchersListReportPage/>},
							{path: "/reports/invoicesList", element: <InvoicesListReportPage/>},
							{path: "/reports/itemsMovement", element: <ItemsMovementReportPage/>},
							{path: "/reports/vatReturn", element: <VatReturnReportPage/>},
							{path: "/reports/profitAndLoss", element: <ProfitAndLossReportPage/>},
							{path: "/reports/balanceSheet", element: <BalanceSheetReportPage/>},
							{path: "/reports/salesProfitability", element: <SalesProfitabilityReportPage/>},
							{path: "/reports/taxAudit", element: <TaxAuditReportPage/>},
							{path: "/reports/itemStatement/:itemId?/:itemName?", element: <ItemStatementReportPage/>},
							{
								path: "/reports/accountStatement/:accountId?/:accountName?",
								element: <AccountStatementReportPage/>
							},
							{
								path: "/reports/partnerStatement/:partnerId?/:partnerName?",
								element: <PartnerStatementReportPage/>
							},
							{
								path: "/reports/stockValuation",
								element: <StockValuationReportPage/>
							},
							{
								path: "/reports/lowStock",
								element: <LowStockReportPage/>
							}
						]
					}
				]
			},
			{path: "*", element: <NotFoundPage/>}
		]
	}
]);

router.subscribe((state) =>
{
	if (state.historyAction === "PUSH" || state.historyAction === "POP")
	{
		BaseFilterableApiService.abortAll();
	}
});