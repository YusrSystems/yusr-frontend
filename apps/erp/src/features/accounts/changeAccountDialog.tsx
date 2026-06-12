import { Services } from "@/core/services/services";
import { useSignals } from "@preact/signals-react/runtime";
import { useTranslation } from "react-i18next";
import { type CommonChangeDialogProps, NumberField, TablePreviewCompact } from "yusr-ui";

import { SystemPermissionsResources } from "@/core/auth/systemPermissionsResources";
import { AccountsSearchableSelect } from "@/core/components/searchableSelect/accountsSearchableSelect";
import { Plus, Trash2 } from "lucide-react";
import { Button, ChangeDialog, CitiesSearchableSelect, CurrencyIcon, FieldGroup, FieldsSection, FormField, PhoneField, SystemPermissionsActions, TextAreaField, TextField } from "yusr-ui";
import { type Account, AccountContact, type AccountDto, AccountType } from "../../core/data/account";

export default function ChangeAccountDialog(
  { entity, service, onSuccess }: CommonChangeDialogProps<Account, AccountDto>
)
{
  useSignals();

  if (
    (entity.mode.value === "create"
      && !Services.auth.hasAuth(SystemPermissionsResources.Accounts, SystemPermissionsActions.Add))
    || (entity.mode.value === "update"
      && !Services.auth.hasAuth(SystemPermissionsResources.Accounts, SystemPermissionsActions.Update))
  )
  {
    return <ChangeDialog.Unauthorized />;
  }

  const { t } = useTranslation(["accounting", "common"]);

  const title = entity.mode.value === "create"
    ? t("accounts.addNewTitle")
    : `${t("common:crudRow.edit")} ${t("accounts.entityName")}`;

  const canShowBalance = Services.auth.hasAuth(
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
    <ChangeDialog className="sm:max-w-4xl">
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

          { (entity.type.value === AccountType.Client || entity.type.value === AccountType.Supplier) && (
            <FormField label={ t("accounts.parentAccount") }>
              <AccountsSearchableSelect
                disabled={ entity.mode.value === "update" }
                types={ entity.type.value === AccountType.Client ? [AccountType.Client] : [AccountType.Supplier] }
                id={ entity.parentId }
                label={ entity.parentName }
              />
            </FormField>
          ) }

          { canShowBalance && (
            <NumberField
              label={ t("accounts.openingBalance") }
              value={ entity.initialBalance }
              currency={ <CurrencyIcon /> }
            />
          ) }

          { canShowBalance && (
            <NumberField
              label={ t("accounts.balance") }
              disabled
              value={ entity.balance }
              currency={ <CurrencyIcon /> }
            />
          ) }
        </FieldsSection>

        { requiresTaxInfo && <TaxFields entity={ entity } /> }

        { isBank && <BankFields entity={ entity } /> }

        <div
          className={ `grid gap-6 ${
            requiresAddress && requiresContacts
              ? "grid-cols-1 md:grid-cols-2"
              : "grid-cols-1"
          }` }
        >
          { requiresAddress && <AddressFields entity={ entity } /> }
          { requiresContacts && <ContactsFields entity={ entity } /> }
        </div>

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
          transformData={ (entity) =>
          {
            entity.accountContacts.value = entity.accountContacts.value.filter((c) => Boolean(c.number.value));
            return entity;
          } }
        />
      </ChangeDialog.Footer>
    </ChangeDialog>
  );
}

function BankFields({ entity }: { entity: Account; })
{
  useSignals();
  const { t } = useTranslation(["accounting", "common"]);
  return (
    <FieldsSection title={ t("accounts.bankingInfo") } columns={ 2 }>
      <TextField
        label={ t("accounts.bankAccountNumber") }
        value={ entity.bankAccountNumber || "" }
      />
    </FieldsSection>
  );
}

function TaxFields({ entity }: { entity: Account; })
{
  useSignals();
  const { t } = useTranslation(["accounting", "common"]);
  return (
    <FieldsSection title={ t("accounts.taxCommercialInfo") } columns={ 2 }>
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
    </FieldsSection>
  );
}

function ContactsFields({ entity }: { entity: Account; })
{
  useSignals();
  const { t } = useTranslation(["accounting", "common"]);

  return (
    <FieldsSection title={ t("accounts.contactNumbers") } columns={ 1 }>
      <div className="relative flex flex-col max-h-50 border rounded-md overflow-hidden">
        <div className="space-y-3 overflow-y-auto p-3 flex-1 min-h-0">
          { entity.accountContacts?.value.length === 0 && <TablePreviewCompact.Empty /> }
          { entity.accountContacts?.value.length > 0
            && entity.accountContacts?.value.map((contact, index) => (
              <div key={ index } className="flex items-center gap-3">
                <div className="flex-1">
                  <PhoneField
                    value={ contact.number }
                    placeholder="05xxxxxxxx"
                    error={ contact.getError("number") }
                  />
                </div>
                <Button
                  type="button"
                  variant="destructive"
                  size="icon"
                  onClick={ () =>
                  {
                    entity.accountContacts.value = entity.accountContacts.value.filter((_, i) =>
                      i !== index
                    );
                  } }
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            )) }
        </div>

        <div className="p-3 border-t bg-background shrink-0">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={ () =>
            {
              entity.accountContacts.value = [...entity.accountContacts.value, new AccountContact({ number: "" })];
            } }
            className="w-full border-dashed"
          >
            <Plus className="h-4 w-4 ml-2" />
            { t("accounts.addContact") }
          </Button>
        </div>
      </div>
    </FieldsSection>
  );
}

function AddressFields({ entity }: { entity: Account; })
{
  useSignals();
  const { t } = useTranslation(["accounting", "common"]);

  return (
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
  );
}
