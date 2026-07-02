import { Services } from "@/core/services/services";
import BalanceTransfersPage from "@/features/balanceTransfer/balanceTransfersPage";
import LegalDocViewer from "@/features/legal/legaldocviewer";
import { PaymentMethodsPage } from "@/features/paymentMethods/paymentMethodsPage";
import { ErpRolesPage } from "@/features/roles/erpRolesPage";
import VouchersPage from "@/features/vouchers/vouchersPage.tsx";
import { createBrowserRouter } from "react-router-dom";
import {
	BaseFilterableApiService,
	BranchesPage,
	ErrorFallback,
	MaintenanceFallback,
	NotFoundPage,
	UsersPage
} from "yusr-ui";
import BanksAccountsPage from "../features/accounts/banksAccountsPage";
import BoxesAccountsPage from "../features/accounts/boxesAccountsPage";
import ClientsAccountsPage from "../features/accounts/clientsAccountsPage";
import { EmployeesAccountsPage } from "../features/accounts/employeesAccountsPage";
import { SuppliersAccountsPage } from "../features/accounts/suppliersAccountsPage";
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
import { TestReport } from "@/features/report/invoiceReport/testReport.tsx";
import { ItemsListReportPage } from "@/features/reports/itemsList/itemsListReportPage.tsx";
import { ItemsMovementReportPage } from "@/features/reports/itemsMovement/itemsMovementReportPage.tsx";
// import ReportPage from "@/features/report/reportPage.tsx";

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
		{path: "/report", element: <TestReport/>},
		{path: "/login", element: <LoginPage/>},
		{path: "/register", element: <RegisterPage/>},
		{path: "/register", element: <MaintenanceFallback/>},
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
					{path: "/stores", element: <StoresPage/>},
					{path: "/units", element: <UnitsPage/>},
					{path: "/clients", element: <ClientsAccountsPage/>},
					{path: "/suppliers", element: <SuppliersAccountsPage/>},
					{path: "/employees", element: <EmployeesAccountsPage/>},
					{path: "/banks", element: <BanksAccountsPage/>},
					{path: "/boxes", element: <BoxesAccountsPage/>},
					{path: "/paymentMethods", element: <PaymentMethodsPage/>},
					{path: "/balanceTransfer", element: <BalanceTransfersPage/>},
					{path: "/sales", element: <SellInvoicesPage/>},
					{path: "/sales/:id", element: <SellInvoicesPage/>},
					{path: "/purchases", element: <PurchaseInvoicesPage/>},
					{path: "/purchases/:id", element: <PurchaseInvoicesPage/>},
					{path: "/quotations", element: <QuotationInvoicesPage/>},
					{path: "/quotations/:id", element: <QuotationInvoicesPage/>},
					{path: "/vouchers", element: <VouchersPage/>},
					{path: "/items", element: <ItemsPage/>},
					{path: "/costAdjustments", element: <CostAdjustmentsPage/>},
					{path: "/pricingMethods", element: <PricingMethodsPage/>},
					{path: "/itemTransfers", element: <ItemTransfersPage/>},
					{path: "/stocktakings", element: <StocktakingsPage/>},
					{path: "/itemsSettlements", element: <ItemsSettlementsPage/>},
					{path: "/reports", element: <ReportsPage/>},

					// reports
					{path: "/reports/itemsList", element: <ItemsListReportPage/>},
					{path: "/reports/itemsMovement", element: <ItemsMovementReportPage/>}
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