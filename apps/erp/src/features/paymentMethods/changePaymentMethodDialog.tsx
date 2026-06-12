import { SystemPermissionsResources } from "@/core/auth/systemPermissionsResources";
import { AccountsSearchableSelect } from "@/core/components/searchableSelect/accountsSearchableSelect";
import { AccountType } from "@/core/data/accountOld";
import { Services } from "@/core/services/services";
import { useSignals } from "@preact/signals-react/runtime";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";
import { ChangeDialog, type CommonChangeDialogProps, FieldGroup, FormField, NumberField, SelectField, SystemPermissionsActions, TextField } from "yusr-ui";
import { CommissionTypeOld } from "../../core/data/paymentMethod";
import type { PaymentMethod, PaymentMethodDto } from "./data/paymentMethod";
import { useEffect } from "react";
import { Cubits } from "@/core/services/cubits";

export default function ChangePaymentMethodDialog(
  { entity, service, onSuccess }: CommonChangeDialogProps<PaymentMethod, PaymentMethodDto>
)
{
  useSignals();

  if (
    (entity.mode.value === "create"
      && !Services.auth.hasAuth(SystemPermissionsResources.PaymentMethods, SystemPermissionsActions.Add))
    || (entity.mode.value === "update"
      && !Services.auth.hasAuth(SystemPermissionsResources.PaymentMethods, SystemPermissionsActions.Update))
  )
  {
    return <ChangeDialog.Unauthorized />;
  }

  useEffect(() =>
  {
    Cubits.accounts.init([AccountType.Bank, AccountType.Box]);
  }, []);

  const { t } = useTranslation(["accounting", "common"]);
  const title = entity.mode.value === "create"
    ? t("paymentMethods.addNewTitle")
    : `${t("common:crudRow.edit")} ${t("paymentMethods.entityName")}`;

  function formatCommission(type: CommissionTypeOld, amount: number): string | null
  {
    if (type === CommissionTypeOld.Amount)
    {
      return t("paymentMethods.commissionHintAmount", { amount });
    }

    let numerator = amount;
    let denominator = 100;

    while (numerator % 1 !== 0)
    {
      numerator *= 10;
      denominator *= 10;
    }

    numerator = Math.round(numerator);

    return t("paymentMethods.commissionHintPercent", { n: numerator, d: denominator });
  }

  const hasBankPerm = Services.auth.hasAuth(
    SystemPermissionsResources.AccountBank,
    SystemPermissionsActions.Get
  );

  const hasBoxPerm = Services.auth.hasAuth(
    SystemPermissionsResources.AccountBox,
    SystemPermissionsActions.Get
  );
  let types: AccountType[] = [];
  if (hasBankPerm)
  {
    types.push(AccountType.Bank);
  }

  if (hasBoxPerm)
  {
    types.push(AccountType.Box);
  }

  const canChangeBankAccount = (hasBankPerm || hasBoxPerm) && entity.mode.value === "create";

  if (!hasBankPerm && !hasBoxPerm)
  {
    toast.warning(t("paymentMethods.noPermissionToEditAdmin"));
  }

  return (
    <ChangeDialog className="sm:max-w-lg">
      <ChangeDialog.Header title={ title } />
      <FieldGroup>
        <div className="grid grid-cols-2 gap-4">
          <TextField
            label={ t("paymentMethods.methodName") }
            required
            value={ entity.name }
            error={ entity.getError("name") }
          />

          <FormField
            label={ t("paymentMethods.responsibleAccount") }
            required
            error={ entity.getError("accountId") }
          >
            <AccountsSearchableSelect
              label={ entity.accountName }
              id={ entity.accountId }
              types={ types }
              disabled={ !canChangeBankAccount }
            />
          </FormField>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <SelectField
            label={ t("paymentMethods.commissionType") }
            required
            value={ entity.commissionType || CommissionTypeOld.Percent.toString() }
            error={ entity.getError("commissionType") }
            options={ [{
              label: t("paymentMethods.percentage"),
              value: CommissionTypeOld.Percent
            }, {
              label: t("paymentMethods.fixedAmount"),
              value: CommissionTypeOld.Amount
            }] }
          />
          <div className="flex flex-col gap-1">
            <NumberField
              label={ t("paymentMethods.commissionValue") }
              required
              min={ 0.1 }
              max={ 100 }
              value={ entity.commissionAmount }
              error={ entity.getError("commissionAmount") }
            />
            <p className="text-sm text-red-600 font-bold">
              { formatCommission(
                entity.commissionType.value ?? CommissionTypeOld.Percent,
                entity.commissionAmount.value ?? 0
              ) }
            </p>
          </div>
        </div>
      </FieldGroup>

      <ChangeDialog.Footer>
        <ChangeDialog.Close />
        <ChangeDialog.SaveButton<PaymentMethod, PaymentMethodDto>
          entity={ entity }
          service={ service }
          onSuccess={ (data) => onSuccess?.(data) }
          disabled={ !canChangeBankAccount }
        />
      </ChangeDialog.Footer>
    </ChangeDialog>
  );
}
