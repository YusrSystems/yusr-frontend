import { Services } from "@/core/services/services";
import { useSignals } from "@preact/signals-react/runtime";
import { useTranslation } from "react-i18next";
import { type CommonChangeDialogProps, NumberField, SystemPermissions } from "yusr-ui";

import { SystemPermissionsResources } from "@/core/auth/systemPermissionsResources";
import { AccountsSearchableSelect } from "@/core/components/searchableSelect/accountsSearchableSelect";
import { Signal, signal } from "@preact/signals-react";
import { Plus, Trash2 } from "lucide-react";
import { Button, ChangeDialog, CitiesSearchableSelect, CurrencyIcon, FieldGroup, FieldsSection, FormField, Input, SystemPermissionsActions, TextAreaField, TextField } from "yusr-ui";
import { type Account, AccountContact, type AccountDto, AccountType } from "./data/account";

export default function ChangeAccountDialog(
  { entity, service, onSuccess }: CommonChangeDialogProps<Account, AccountDto>
)
{
  useSignals();
  const { t } = useTranslation(["accounting", "common"]);
  if (
    (entity.mode.value === "create"
      && !Services.auth.hasAuth(SystemPermissionsResources.Accounts, SystemPermissionsActions.Add))
    || (entity.mode.value === "update"
      && !Services.auth.hasAuth(SystemPermissionsResources.Accounts, SystemPermissionsActions.Update))
  )
  {
    return <ChangeDialog.Unauthorized />;
  }

  const title = entity.mode.value === "create"
    ? t("accounts.addNewTitle")
    : `${t("common:crudRow.edit")} ${t("accounts.entityName")}`;

  const canShowBalance = SystemPermissions.hasAuth(
    Services.auth?.loggedInUser?.role?.value.permissions ?? [],
    SystemPermissionsResources.AccountShowBalance,
    SystemPermissionsActions.Get
  );

  const requiresTaxInfo = entity?.type.value === AccountType.Client
    || entity?.type.value === AccountType.Supplier
    || entity?.type.value === AccountType.Employee;

  const isBox = entity?.type.value === AccountType.Box;

  const isBank = entity?.type.value === AccountType.Bank;
  const requiresAddress = !isBank;
  const requiresContacts = !isBank && !isBox;
  return (
    <ChangeDialog className="sm:max-w-lg">
      <ChangeDialog.Header title={ title } />
      <FieldGroup>
        <FieldsSection title={ t("accounts.basicInfo") } columns={ 2 }>
          {
            /* { (selectTypes && selectTypes.length > 0)
            && (
              <SelectField
                label={ t("accounts.accountType") }
                required
                value={ entity.type }
                error={ entity.getError("type") }
                options={ selectTypes }
              />
            ) } */
          }

          <TextField
            label={ t("accounts.accountName") }
            required
            value={ entity.name }
            error={ entity.getError("name") }
          />

          <ClientAndSupplierAccountsFields entity={ entity } />

          <NumberField
            label={ t("accounts.openingBalance") }
            value={ canShowBalance ? entity.initialBalance : signal<number>(0) }
            currency={ <CurrencyIcon /> }
          />

          <NumberField
            label={ t("accounts.balance") }
            disabled
            value={ canShowBalance ? entity.balance : signal<number>(0) }
            currency={ <CurrencyIcon /> }
          />
        </FieldsSection>

        { (requiresTaxInfo || isBank) && (
          <RequiresTaxAndBankInfo entity={ entity } isBank={ isBank } isRequiresTaxInfo={ requiresTaxInfo } />
        ) }

        <RequiresAddressAndContacts
          entity={ entity }
          requiresAddress={ requiresAddress }
          requiresContacts={ requiresContacts }
        />

        <FieldsSection title={ t("accounts.additionalInfo") } columns={ 1 }>
          <TextAreaField
            label={ t("accounts.notes") }
            value={ entity.notes }
            rows={ 3 }
          />
        </FieldsSection>
      </FieldGroup>
      <ChangeDialog.Footer>
        <ChangeDialog.Close />
        <ChangeDialog.SaveButton<Account, AccountDto>
          entity={ entity }
          service={ service }
          onSuccess={ (data) => onSuccess?.(data) }
        />
      </ChangeDialog.Footer>
    </ChangeDialog>
  );
}

// to do later
function ClientAndSupplierAccountsFields({ entity }: { entity: Account; })
{
  useSignals();
  const { t } = useTranslation(["accounting", "common"]);

  return (
    <>
      { entity.type.value === AccountType.Client && (
        <FormField label={ t("accounts.parentAccount") }>
          <AccountsSearchableSelect
            type={ entity.type }
            id={ entity.parentId }
            label={ entity.parentName }
          />
        </FormField>
      ) }
    </>
  );
}

function RequiresTaxAndBankInfo(
  { entity, isBank, isRequiresTaxInfo }: { entity: Account; isBank: boolean; isRequiresTaxInfo: boolean; }
)
{
  useSignals();
  const { t } = useTranslation(["accounting", "common"]);
  return (
    <FieldsSection title={ isBank ? t("accounts.bankingInfo") : t("accounts.taxCommercialInfo") } columns={ 2 }>
      { isRequiresTaxInfo && <TaxFields entity={ entity } /> }
      { isBank && (
        <TextField
          label={ t("accounts.bankAccountNumber") }
          value={ entity.bankAccountNumber || "" }
        />
      ) }
    </FieldsSection>
  );
}

function TaxFields({ entity }: { entity: Account; })
{
  useSignals();
  const { t } = useTranslation(["accounting", "common"]);
  return (
    <>
      <TextField
        label={ t("accounts.vatNumber") }
        value={ entity.vatNumber }
        error={ entity.getError("vatNumber") }
      />
      <TextField
        label={ t("accounts.crn") }
        value={ entity.crn }
        error={ entity.getError("crn") }
      />
    </>
  );
}

function RequiresAddressAndContacts(
  { entity, requiresAddress, requiresContacts }: {
    entity: Account;
    requiresAddress: boolean;
    requiresContacts: boolean;
  }
)
{
  useSignals();
  const { t } = useTranslation(["accounting", "common"]);

  return (
    <>
      { (requiresAddress || requiresContacts) && (
        <div
          className={ `grid gap-6 ${
            requiresAddress && requiresContacts
              ? "grid-cols-1 md:grid-cols-2"
              : "grid-cols-1"
          }` }
        >
          { requiresAddress && (
            <FieldsSection title={ t("accounts.addressInfo") } columns={ 1 }>
              <div className="flex flex-col gap-1.5 w-full">
                <label className="text-sm font-medium">{ t("accounts.city") }</label>
                <CitiesSearchableSelect
                  id={ entity.cityId }
                  label={ entity.cityName }
                />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <TextField
                  label={ t("accounts.district") }
                  value={ entity.district }
                />
                <TextField
                  label={ t("accounts.street") }
                  value={ entity.street }
                />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <TextField
                  label={ t("accounts.buildingNumber") }
                  value={ entity.buildingNumber }
                  error={ entity.getError("buildingNumber") }
                />
                <TextField
                  label={ t("accounts.postalCode") }
                  value={ entity.postalCode }
                  error={ entity.getError("postalCode") }
                />
              </div>
            </FieldsSection>
          ) }

          { requiresContacts && (
            <FieldsSection title={ t("accounts.contactNumbers") } columns={ 1 }>
              <div className="relative flex flex-col max-h-50 border rounded-md">
                <div className="space-y-3 overflow-y-auto p-3 flex-1">
                  <BuildContacts accountContacts={ entity.accountContacts } />
                </div>

                <div className="sticky bottom-0 p-3 border-t">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={ () =>
                    {
                      entity.accountContacts.value = [
                        ...entity.accountContacts.value,
                        new AccountContact({ number: "" })
                      ];
                    } }
                    className="w-full border-dashed"
                  >
                    <Plus className="h-4 w-4 ml-2" />
                    { t("accounts.addContact") }
                  </Button>
                </div>
              </div>
            </FieldsSection>
          ) }
        </div>
      ) }
    </>
  );
}

function BuildContacts({ accountContacts }: { accountContacts: Signal<AccountContact[]>; })
{
  useSignals();

  return (
    <>
      { accountContacts?.value.map((contact, index) => (
        <div key={ index } className="flex items-center gap-3">
          <div className="flex-1">
            <Input
              value={ contact.number }
              placeholder="05xxxxxxxx"
            />
          </div>
          <Button
            type="button"
            variant="destructive"
            size="icon"
            className="sticky"
            onClick={ () =>
            {
              console.log(contact.number);

              const newArray = accountContacts.value.filter((_, i) => i !== index);
              accountContacts.value = newArray;
            } }
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      )) }
    </>
  );
}
