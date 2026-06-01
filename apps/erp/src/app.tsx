import { useSignals } from "@preact/signals-react/runtime";
import type { i18n } from "i18next";
import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { BaseApiServiceOld, BranchesPage, NotFoundPage, NumbertoWordsService, ProtectedRoute, ThemeProvider, Toaster, TooltipProvider, UsersPage, Validators, YusrApiHelper } from "yusr-ui";
import AppLayout from "./appLayout";
import { useAppSelector } from "./core/state/store";
import BanksAccountsPage from "./features/accounts/banksAccountsPage";
import BoxesAccountsPage from "./features/accounts/boxesAccountsPage";
import ClientsAccountsPage from "./features/accounts/clientsAccountsPage";
import EmployeesAccountsPage from "./features/accounts/employeesAccountsPage";
import SuppliersAccountsPage from "./features/accounts/suppliersAccountsPage";
import BalanceTransfersPage from "./features/balanceTransfer/balanceTransfersPage";
import DashboardPage from "./features/dashboard/dashboardPage";
import PurchaseInvoicesPage from "./features/invoices/purchaseInvoices";
import QuotationInvoicesPage from "./features/invoices/quotationInvoicesPage";
import SellInvoicesPage from "./features/invoices/sellInvoicesPage";
import ItemsPage from "./features/items/itemsPage";
import ItemsSettlementsPage from "./features/itemsSettlements/itemsSettlementsPage";
import ItemTransfersPage from "./features/itemTransfers/itemTransfersPage";
import LandingPage from "./features/landing/landingPage";
import LoginPage from "./features/login/loginPage";
import PaymentMethodsPage from "./features/paymentMethods/paymentMethodsPage";
import PricingMethodsPage from "./features/pricingMethods/pricingMethodsPage";
import RegisterPage from "./features/register/presentation/registerPage";
import ReportsPage from "./features/reports/reportsPage";
import ErpRolesPage from "./features/roles/rolesPage";
import SettingPage from "./features/setting/settingPage";
import StocktakingsPage from "./features/stocktakings/stocktakingsPage";
import StoresPage from "./features/stores/storePage";
import TaxesPage from "./features/taxes/taxesPage";
import TenantInfoSharingPage from "./features/tenantInfoSharing/tenantInfoSharingPage";
import TestPage from "./features/test/testPage";
import UnitsPage from "./features/units/unitsPage";
import VouchersPage from "./features/vouchers/vouchersPage";

function App()
{
  const { t, i18n } = useTranslation("common");

  useEffect(() =>
  {
    NumbertoWordsService.init(t, i18n.language);
    YusrApiHelper.init(t, i18n.language);
    BaseApiServiceOld.init(t);
    Validators.init(t);
  }, [t, i18n.language]);

  useSignals();

  return <AppBody i18n={ i18n } />;
}

function AppBody({ i18n }: { i18n: i18n; })
{
  return (
    <TooltipProvider>
      <ThemeProvider defaultTheme="dark" storageKey="ui-theme">
        <AppRoutes />
        <Toaster richColors closeButton position="top-center" dir={ i18n.dir() } />
      </ThemeProvider>
    </TooltipProvider>
  );
}

function AppRoutes()
{
  const isAuthenticated = useAppSelector((state) => state.auth.isAuthenticated);

  return (
    <Router>
      <Routes>
        <Route path="/" element={ <LandingPage /> } />
        <Route path="/login" element={ <LoginPage /> } />
        <Route path="/register" element={ <RegisterPage /> } />
        <Route path="/sharing/:registrationKey" element={ <TenantInfoSharingPage /> } />

        <Route element={ <ProtectedRoute isAuthenticated={ isAuthenticated } /> }>
          <Route element={ <AppLayout /> }>
            <Route path="/test" element={ <TestPage /> } />
            <Route path="/dashboard" element={ <DashboardPage /> } />
            <Route path="/users" element={ <UsersPage /> } />
            <Route path="/settings" element={ <SettingPage /> } />
            <Route path="/taxes" element={ <TaxesPage /> } />
            <Route path="/branches" element={ <BranchesPage /> } />
            <Route path="/roles" element={ <ErpRolesPage /> } />
            <Route path="/stores" element={ <StoresPage /> } />
            <Route path="/units" element={ <UnitsPage /> } />
            <Route path="/clients" element={ <ClientsAccountsPage /> } />
            <Route path="/suppliers" element={ <SuppliersAccountsPage /> } />
            <Route path="/employees" element={ <EmployeesAccountsPage /> } />
            <Route path="/banks" element={ <BanksAccountsPage /> } />
            <Route path="/boxes" element={ <BoxesAccountsPage /> } />
            <Route path="/paymentMethods" element={ <PaymentMethodsPage /> } />
            <Route path="/balanceTransfer" element={ <BalanceTransfersPage /> } />
            <Route path="/sales" element={ <SellInvoicesPage /> } />
            <Route path="/sales/:id" element={ <SellInvoicesPage /> } />
            <Route path="/purchases" element={ <PurchaseInvoicesPage /> } />
            <Route path="/purchases/:id" element={ <PurchaseInvoicesPage /> } />
            <Route path="/quotations" element={ <QuotationInvoicesPage /> } />
            <Route path="/quotations/:id" element={ <QuotationInvoicesPage /> } />
            <Route path="/vouchers" element={ <VouchersPage /> } />
            <Route path="/items" element={ <ItemsPage /> } />
            <Route path="/pricingMethods" element={ <PricingMethodsPage /> } />
            <Route path="/itemTransfers" element={ <ItemTransfersPage /> } />
            <Route path="/stocktakings" element={ <StocktakingsPage /> } />
            <Route path="/itemsSettlements" element={ <ItemsSettlementsPage /> } />
            <Route path="/reports" element={ <ReportsPage /> } />
          </Route>
        </Route>

        <Route path="*" element={ <NotFoundPage /> } />
      </Routes>
    </Router>
  );
}

export default App;
