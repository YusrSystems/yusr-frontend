import { Services } from "@/core/services/services";
import BalanceTransfersPage from "@/features/balanceTransfer/balanceTransfersPage";
import LegalDocViewer from "@/features/legal/legaldocviewer";
import { PaymentMethodsPage } from "@/features/paymentMethods/paymentMethodsPage";
import { ErpRolesPage } from "@/features/roles/erpRolesPage";
import VouchersPage from "@/features/vouchers/vouchersPage.tsx";
import { createBrowserRouter } from "react-router-dom";
import { BaseFilterableApiService, BranchesPage, ErrorFallback, NotFoundPage, UsersPage } from "yusr-ui";
import DashboardPage from "../features/dashboard/dashboardPage";
import ItemsPage from "../features/items/itemsPage";
import ItemsSettlementsPage from "../features/stocktakings/itemsSettlementsPage.tsx";
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
import SellInvoicesPage from "@/features/invoices/sellInvoicesPage";
import PurchaseInvoicesPage from "@/features/invoices/purchaseInvoices.tsx";
import QuotationInvoicesPage from "@/features/invoices/quotationInvoicesPage.tsx";
import AuthGate from "@/app/authGate.tsx";
import CostAdjustmentsPage from "@/features/costAdjustments/costAdjustmentsPage.tsx";
import { ItemsListReportPage } from "@/features/reports/itemsList/itemsListReportPage.tsx";
import { ItemsMovementReportPage } from "@/features/reports/itemsMovement/itemsMovementReportPage.tsx";
import { TaxReturnReportPage } from "@/features/reports/taxReturn/taxReturnReportPage.tsx";
import { ItemsTaxStatementReportPage } from "@/features/reports/itemsTaxStatement/itemsTaxStatementReportPage.tsx";
import { InvoicesListReportPage } from "@/features/reports/invoicesList/invoicesListReportPage.tsx";
import { ProfitAndLossReportPage } from "@/features/reports/profitAndLoss/profitAndLossReportPage.tsx";
import { BalanceSheetReportPage } from "@/features/reports/balanceSheet/balanceSheetReportPage.tsx";
import { ItemStatementReportPage } from "@/features/reports/itemStatement/itemStatementReportPage.tsx";
import { AccountStatementReportPage } from "@/features/reports/accountStatement/accountStatementReportPage.tsx";
import { AccountsListReportPage } from "@/features/reports/accountsList/accountsListReportPage.tsx";
import AccountsPage from "@/features/accounts/accountsPage.tsx";


const refreshPage = () =>
{
	window.location.reload();
};
export const router = createBrowserRouter([{
	errorElement: (
		<ErrorFallback
			reset={ refreshPage }
		/>
	),
	children: [
		{path: "/", element: <LandingPage/>},
		{path: "/login", element: <LoginPage/>},
		{path: "/register/:joinedByKey?", element: <RegisterPage/>},
		// {path: "/register", element: <MaintenanceFallback/>},
		{path: "/legal", element: <LegalDocViewer/>},
		{path: "/sharing/:registrationKey", element: <TenantInfoSharingPage/>},
		{
			element: <AuthGate/>,
			children: [{
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
					{path: "/paymentMethods", element: <PaymentMethodsPage/>},
					{path: "/balanceTransfer/:id?", element: <BalanceTransfersPage/>},
					{path: "/items/:id?", element: <ItemsPage/>},
					{path: "/costAdjustments", element: <CostAdjustmentsPage/>},
					{path: "/pricingMethods", element: <PricingMethodsPage/>},
					{path: "/itemTransfers/:id?", element: <ItemTransfersPage/>},
					{path: "/stocktakings", element: <StocktakingsPage/>},
					{path: "/itemsSettlements/:id?", element: <ItemsSettlementsPage/>},
					{path: "/vouchers/:id?", element: <VouchersPage/>},
					{path: "/reports", element: <ReportsPage/>},

					// invoices
					{path: "/sales/:id?", element: <SellInvoicesPage/>},
					{path: "/purchases/:id?", element: <PurchaseInvoicesPage/>},
					{path: "/quotations/:id?", element: <QuotationInvoicesPage/>},

					// reports
					{path: "/reports/itemsList", element: <ItemsListReportPage/>},
					{path: "/reports/accountsList", element: <AccountsListReportPage/>},
					{path: "/reports/invoicesList", element: <InvoicesListReportPage/>},
					{path: "/reports/itemsMovement", element: <ItemsMovementReportPage/>},
					{path: "/reports/taxReturn", element: <TaxReturnReportPage/>},
					{path: "/reports/itemsTaxStatement", element: <ItemsTaxStatementReportPage/>},
					{path: "/reports/profitAndLoss", element: <ProfitAndLossReportPage/>},
					{path: "/reports/balanceSheet", element: <BalanceSheetReportPage/>},
					{path: "/reports/itemStatement/:itemId?/:itemName?", element: <ItemStatementReportPage/>},
					{
						path: "/reports/accountStatement/:accountId?/:accountName?",
						element: <AccountStatementReportPage/>
					}

				]
			}
			]
		},
		{path: "*", element: <NotFoundPage/>}
	]
}]);

router.subscribe((state) =>
{
	if (state.historyAction === "PUSH" || state.historyAction === "POP")
	{
		BaseFilterableApiService.abortAll();
	}
});