import { Services } from "@/core/services/services";
import LegalDocViewer from "@/features/legal/legaldocviewer";
import { PaymentMethodsPage } from "@/features/paymentMethods/paymentMethodsPage";
import { ErpRolesPage } from "@/features/roles/erpRolesPage";
import { createBrowserRouter } from "react-router-dom";
import { BranchesPage, BranchOld, ErrorFallback, MaintenanceFallback, NotFoundPage, ProtectedRoute, UsersPage } from "yusr-ui";
import { BanksAccountsPage } from "../features/accounts/banksAccountsPage";
import { BoxesAccountsPage } from "../features/accounts/boxesAccountsPage";
import { ClientsAccountsPage } from "../features/accounts/clientsAccountsPage";
import { EmployeesAccountsPage } from "../features/accounts/employeesAccountsPage";
import { SuppliersAccountsPage } from "../features/accounts/suppliersAccountsPage";
import BalanceTransfersPage from "../features/balanceTransfer/balanceTransfersPage";
import DashboardPage from "../features/dashboard/dashboardPage";
import PurchaseInvoicesPage from "../features/invoices/purchaseInvoices";
import QuotationInvoicesPage from "../features/invoices/quotationInvoicesPage";
import SellInvoicesPage from "../features/invoices/sellInvoicesPage";
import ItemsPage from "../features/items/itemsPage";
import ItemsSettlementsPage from "../features/itemsSettlements/itemsSettlementsPage";
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
import TestPage from "../features/test/testPage";
import UnitsPage from "../features/units/unitsPage";
import VouchersPage from "../features/vouchers/vouchersPage";
import AppLayout from "./appLayout";

function ProtectedRouteWrapper()
{
  return <ProtectedRoute isAuthenticated={ Services.auth.isAuthenticated } />;
}
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
    { path: "/", element: <LandingPage /> },
    { path: "/login", element: <LoginPage /> },
    { path: "/register", element: <MaintenanceFallback /> },
    { path: "/register", element: <RegisterPage /> },
    { path: "/legal", element: <LegalDocViewer /> },
    { path: "/sharing/:registrationKey", element: <TenantInfoSharingPage /> },
    {
      element: <ProtectedRouteWrapper />,
      children: [{
        element: <AppLayout />,
        children: [
          { path: "/test", element: <TestPage /> },
          { path: "/dashboard", element: <DashboardPage /> },
          { path: "/users", element: <UsersPage /> },
          { path: "/settings", element: <SettingPage /> },
          { path: "/taxes", element: <TaxesPage /> },
          {
            path: "/branches",
            element: (
              <BranchesPage
                onUpdate={ (data) =>
                {
                  if (Services.auth.setting?.branch?.value)
                  {
                    Services.auth.setting!.branch!.value = new BranchOld({
                      cityId: data.cityId.value
                    });
                  }
                } }
              />
            )
          },
          { path: "/roles", element: <ErpRolesPage /> },
          { path: "/stores", element: <StoresPage /> },
          { path: "/units", element: <UnitsPage /> },
          { path: "/clients", element: <ClientsAccountsPage /> },
          { path: "/suppliers", element: <SuppliersAccountsPage /> },
          { path: "/employees", element: <EmployeesAccountsPage /> },
          { path: "/banks", element: <BanksAccountsPage /> },
          { path: "/boxes", element: <BoxesAccountsPage /> },
          { path: "/paymentMethods", element: <PaymentMethodsPage /> },
          { path: "/balanceTransfer", element: <BalanceTransfersPage /> },
          { path: "/sales", element: <SellInvoicesPage /> },
          { path: "/sales/:id", element: <SellInvoicesPage /> },
          { path: "/purchases", element: <PurchaseInvoicesPage /> },
          { path: "/purchases/:id", element: <PurchaseInvoicesPage /> },
          { path: "/quotations", element: <QuotationInvoicesPage /> },
          { path: "/quotations/:id", element: <QuotationInvoicesPage /> },
          { path: "/vouchers", element: <VouchersPage /> },
          { path: "/items", element: <ItemsPage /> },
          { path: "/pricingMethods", element: <PricingMethodsPage /> },
          { path: "/itemTransfers", element: <ItemTransfersPage /> },
          { path: "/stocktakings", element: <StocktakingsPage /> },
          { path: "/itemsSettlements", element: <ItemsSettlementsPage /> },
          { path: "/reports", element: <ReportsPage /> }
        ]
      }]
    },
    { path: "*", element: <NotFoundPage /> }
  ]
}]);
