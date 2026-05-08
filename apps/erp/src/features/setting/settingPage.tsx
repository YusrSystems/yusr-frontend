import { Building2, Loader2, Receipt, Wallet } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { BranchSlice, Button, Card, CardContent, CardFooter, CurrencySlice, TabButton, useEntityForm, type ValidationRule, Validators } from "yusr-ui";
import { ClientsAndSuppliersSlice } from "../../core/data/account";
import { PaymentMethodSlice } from "../../core/data/paymentMethod";
import { Setting } from "../../core/data/setting";
import { StoreSlice } from "../../core/data/store";
import { TaxSlice } from "../../core/data/tax";
import SettingsApiService from "../../core/networking/settingsApiService";
import { updateSetting, useAppDispatch } from "../../core/state/store";
import BasicSection from "./basicSection";
import DefaultsSection from "./defaultsSection";
import InvoiceSection from "./invoiceSection";
import { SettingContext } from "./settingContext";

export default function SettingPage()
{
  const { t } = useTranslation("erpCommon");
  const { t: tCommon } = useTranslation("common");

  const validationRules: ValidationRule<Partial<Setting>>[] = useMemo(
    () => [{
      field: "companyName",
      selector: (d) => d.companyName,
      validators: [Validators.required(t("settings.companyNameRequired"))]
    }, {
      field: "companyPhone",
      selector: (d) => d.companyPhone,
      validators: [Validators.required(t("settings.companyPhoneRequired"))]
    }, {
      field: "branchId",
      selector: (d) => d.branchId,
      validators: [Validators.required(t("settings.branchRequired"))]
    }, {
      field: "email",
      selector: (d) => d.email,
      validators: [Validators.required(t("settings.emailRequired"))]
    }, {
      field: "currencyId",
      selector: (d) => d.currencyId,
      validators: [Validators.required(t("settings.currencyRequired"))]
    }],
    [t]
  );

  const INITIAL_STATE = useMemo(() => new Setting(), []);
  const { formData, handleChange, getError, isInvalid, validate, clearError } = useEntityForm<Setting>(
    INITIAL_STATE,
    validationRules
  );

  const [loading, setLoading] = useState(false);
  const [initLoading, setInitLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"basic" | "invoicing" | "accounts" | "subscription">("basic");

  const dispatch = useAppDispatch();

  useEffect(() =>
  {
    const fetchSettings = async () =>
    {
      setInitLoading(true);
      const response = await new SettingsApiService().Get();

      if (response.data)
      {
        handleChange(response.data);
        dispatch(updateSetting(response.data));
      }
      setInitLoading(false);
    };

    fetchSettings();
  }, []);

  useEffect(() =>
  {
    dispatch(CurrencySlice.entityActions.filter());
    dispatch(TaxSlice.entityActions.filter());
    dispatch(StoreSlice.entityActions.filter());
    dispatch(PaymentMethodSlice.entityActions.filter());
    dispatch(BranchSlice.entityActions.filter());
    dispatch(ClientsAndSuppliersSlice.entityActions.filter());
  }, [dispatch]);

  async function Save()
  {
    if (!validate())
    {
      setActiveTab("basic");
      return;
    }

    setLoading(true);
    const result = await new SettingsApiService().Update(formData as Setting, tCommon);
    setLoading(false);

    if (result.status === 200)
    {
      handleChange(result.data as Setting);
      dispatch(updateSetting(result.data as Setting));
    }
  }

  if (initLoading)
  {
    return (
      <div className="p-8 text-center text-muted-foreground flex flex-col items-center justify-center h-[50vh]">
        <Loader2 className="h-8 w-8 animate-spin text-primary mb-4" />
        { t("settings.loading") }
      </div>
    );
  }

  return (
    <SettingContext.Provider
      value={ {
        mode: "update",
        handleChange,
        formData,
        isInvalid,
        getError,
        clearError
      } }
    >
      <div className="container mx-auto px-5 pb-8 max-w-5xl">
        <div className="mb-5 text-center">
          <h1 className="text-3xl font-bold tracking-tight">{ t("settings.title") }</h1>
          <p className="text-muted-foreground mt-2">{ t("settings.subtitle") }</p>
        </div>

        <Card className="relative shadow-lg border-muted/40 py-0">
          <div className="flex border-b bg-muted/10 rounded-t-xl overflow-x-auto">
            <TabButton
              active={ activeTab === "basic" }
              icon={ Building2 }
              label={ t("settings.basicData") }
              onClick={ () => setActiveTab("basic") }
              content={ <></> }
            />
            <TabButton
              active={ activeTab === "invoicing" }
              icon={ Receipt }
              label={ t("settings.invoicesAndTaxes") }
              onClick={ () => setActiveTab("invoicing") }
              content={ <></> }
            />
            <TabButton
              active={ activeTab === "accounts" }
              icon={ Wallet }
              label={ t("settings.defaultAccounts") }
              onClick={ () => setActiveTab("accounts") }
              content={ <></> }
            />
          </div>

          <CardContent className="py-3 min-h-[50vh]">
            { activeTab === "basic" && <BasicSection /> }
            { activeTab === "invoicing" && <InvoiceSection /> }
            { activeTab === "accounts" && <DefaultsSection /> }
          </CardContent>

          <CardFooter className="flex justify-end border-t pt-4">
            <Button disabled={ loading } size="lg" className="px-12 font-bold text-md shadow-lg" onClick={ Save }>
              { loading && <Loader2 className="ml-2 h-5 w-5 animate-spin" /> }
              { t("settings.save") }
            </Button>
          </CardFooter>
        </Card>
      </div>
    </SettingContext.Provider>
  );
}
