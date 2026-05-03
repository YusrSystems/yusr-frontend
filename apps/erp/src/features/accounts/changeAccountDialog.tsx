import { Plus, Trash2 } from "lucide-react";
import { useEffect, useMemo } from "react";
import { CityFilterColumns, SystemPermissions } from "yusr-core";
import type { CommonChangeDialogProps, FormState, IEntityState } from "yusr-ui";
import { Button, ChangeDialog, FieldGroup, FieldsSection, FormField, Input, NumberField, SearchableSelect, SelectField, TextAreaField, TextField, useFormErrors, useFormInit, useValidate } from "yusr-ui";
import { SystemPermissionsActions } from "../../core/auth/systemPermissionsActions";
import { SystemPermissionsResources } from "../../core/auth/systemPermissionsResources";
import Account, { AccountContact, AccountFilterColumns, type AccountSliceType, AccountType, accountTypeToResource, AccountValidationRules } from "../../core/data/account";
import { filterCities } from "../../core/state/shared/citySlice";
import { type RootState, useAppDispatch, useAppSelector } from "../../core/state/store";

export default function ChangeAccountDialog({
  entity,
  mode,
  service,
  onSuccess,
  slice,
  fixedType,
  selectTypes = [],
  selectEntityState,
  selectFormState
}: CommonChangeDialogProps<Account> & {
  slice: AccountSliceType;
  fixedType?: AccountType;
  selectTypes?: {
    label: string;
    value: string;
  }[];
  selectEntityState: (state: RootState) => IEntityState<Account>;
  selectFormState: (state: RootState) => FormState<Account>;
})
{
  const dispatch = useAppDispatch();
  const cityState = useAppSelector((state) => state.city);
  const authState = useAppSelector((state) => state.auth);
  const accountState = useAppSelector(selectEntityState);

  const initialValues = useMemo(
    () => ({
      type: entity?.type || fixedType,
      ...entity,
      name: entity?.name || "",
      accountContacts: entity?.accountContacts || [new AccountContact()]
    }),
    [entity]
  );

  const { formData, errors } = useAppSelector(selectFormState);
  const { getError, isInvalid } = useFormErrors(errors);
  const { validate } = useValidate(
    formData,
    AccountValidationRules.validationRules,
    (errors) => dispatch(slice.formActions.setErrors(errors))
  );
  useFormInit(slice.formActions.setInitialData, initialValues);

  useEffect(() =>
  {
    dispatch(filterCities(undefined));
    dispatch(slice.entityActions.filter(undefined));
  }, [dispatch]);

  const addContact = () =>
  {
    dispatch(slice.formActions.updateFormData({
      accountContacts: [...(formData.accountContacts || []), new AccountContact()]
    }));
  };

  const updateContact = (
    index: number,
    field: keyof AccountContact,
    value: any
  ) =>
  {
    const newContacts = [...(formData.accountContacts || [])];
    newContacts[index] = { ...newContacts[index], [field]: value };
    dispatch(slice.formActions.updateFormData({ accountContacts: newContacts }));
  };

  const removeContact = (index: number) =>
  {
    const newContacts = [...(formData.accountContacts || [])];
    newContacts.splice(index, 1);
    dispatch(slice.formActions.updateFormData({ accountContacts: newContacts }));
  };

  const isBank = formData?.type === AccountType.Bank;
  const isBox = formData?.type === AccountType.Box;
  const requiresTaxInfo = formData?.type === AccountType.Client
    || formData?.type === AccountType.Supplier
    || formData?.type === AccountType.Employee;
  const requiresAddress = !isBank;
  const requiresContacts = !isBank && !isBox;

  const getTypeName = () =>
  {
    if (!formData?.type)
    {
      return "";
    }

    switch (formData.type)
    {
      case AccountType.Client:
        return "عميل";
      case AccountType.Supplier:
        return "مورد";
      case AccountType.Employee:
        return "موظف";
      case AccountType.Bank:
        return "بنك";
      case AccountType.Box:
        return "صندوق";
    }
  };

  const canShowBalance = SystemPermissions.hasAuth(
    authState.loggedInUser?.role?.permissions ?? [],
    SystemPermissionsResources.AccountShowBalance,
    SystemPermissionsActions.Get
  );

  const authorized = () =>
  {
    if (formData.type == undefined)
    {
      return true;
    }

    return SystemPermissions.hasAuth(
      authState.loggedInUser?.role?.permissions ?? [],
      accountTypeToResource[formData.type],
      SystemPermissionsActions.Get
    );
  };

  return (
    <ChangeDialog<Account>
      title={ `${mode === "create" ? "إضافة" : "تعديل"} حساب ${getTypeName()}` }
      className="sm:max-w-4xl"
      formData={ formData }
      dialogMode={ mode }
      service={ service }
      disable={ () => cityState.isLoading || accountState.isLoading }
      onSuccess={ (data) => onSuccess?.(data, mode) }
      validate={ validate }
      authorized={ authorized() }
    >
      <div className="max-h-[75vh] overflow-y-auto px-2 pb-2">
        <FieldGroup className="gap-10">
          <FieldsSection title="المعلومات الأساسية" columns={ 2 }>
            { selectTypes.length > 0 && (
              <SelectField
                label="نوع الحساب"
                required
                disabled={ mode === "update" }
                value={ formData.type?.toString() || "" }
                onValueChange={ (val) =>
                  dispatch(slice.formActions.updateFormData({ type: Number(val) as AccountType })) }
                options={ selectTypes }
                isInvalid={ isInvalid("type") }
                error={ getError("type") }
              />
            ) }

            <TextField
              label="اسم الحساب"
              required
              value={ formData.name || "" }
              onChange={ (e) => dispatch(slice.formActions.updateFormData({ name: e.target.value })) }
              isInvalid={ isInvalid("name") }
              error={ getError("name") }
            />

            { (formData.type === AccountType.Client || formData.type === AccountType.Supplier) && (
              <FormField label="الحساب الأب">
                <SearchableSelect
                  items={ accountState.entities.data ?? [] }
                  itemLabelKey="name"
                  itemValueKey="id"
                  value={ formData.parentId?.toString() || "" }
                  columnsNames={ AccountFilterColumns.columnsNames }
                  onSearch={ (condition) => dispatch(slice.entityActions.filter(condition)) }
                  isLoading={ accountState.isLoading }
                  disabled={ accountState.isLoading || mode === "update" }
                  onValueChange={ (val) =>
                  {
                    const selected = accountState.entities.data?.find(
                      (a) => a.id.toString() === val
                    );
                    dispatch(slice.formActions.updateFormData({
                      parentId: selected?.id,
                      parentName: selected?.name
                    }));
                  } }
                />
              </FormField>
            ) }

            <NumberField
              label="الرصيد الافتتاحي"
              value={ canShowBalance ? (formData.initialBalance || "") : "" }
              onChange={ (val) => dispatch(slice.formActions.updateFormData({ initialBalance: val })) }
            />

            <NumberField
              label="الرصيد"
              disabled
              value={ canShowBalance ? (formData.balance || "") : "" }
              onChange={ (val) => dispatch(slice.formActions.updateFormData({ initialBalance: val })) }
            />
          </FieldsSection>

          { (requiresTaxInfo || isBank) && (
            <FieldsSection
              title={ isBank ? "المعلومات البنكية" : "المعلومات الضريبية والتجارية" }
              columns={ 2 }
            >
              { requiresTaxInfo && (
                <>
                  <TextField
                    label="الرقم الضريبي (VAT)"
                    value={ formData.vatNumber || "" }
                    onChange={ (e) => dispatch(slice.formActions.updateFormData({ vatNumber: e.target.value })) }
                    dir="ltr"
                  />
                  <TextField
                    label="السجل التجاري (CRN)"
                    value={ formData.crn || "" }
                    onChange={ (e) => dispatch(slice.formActions.updateFormData({ crn: e.target.value })) }
                    dir="ltr"
                  />
                </>
              ) }

              { isBank && (
                <TextField
                  label="رقم الحساب البنكي"
                  value={ formData.bankAccountNumber || "" }
                  onChange={ (e) => dispatch(slice.formActions.updateFormData({ bankAccountNumber: e.target.value })) }
                  dir="ltr"
                />
              ) }
            </FieldsSection>
          ) }

          { (requiresAddress || requiresContacts) && (
            <div
              className={ `grid gap-6 ${
                requiresAddress && requiresContacts
                  ? "grid-cols-1 md:grid-cols-2"
                  : "grid-cols-1"
              }` }
            >
              { requiresAddress && (
                <FieldsSection title="معلومات العنوان" columns={ 1 }>
                  <div className="flex flex-col gap-1.5 w-full">
                    <label className="text-sm font-medium">المدينة</label>
                    <SearchableSelect
                      items={ cityState.entities.data ?? [] }
                      itemLabelKey="name"
                      itemValueKey="id"
                      placeholder="اختر المدينة"
                      value={ formData.cityId?.toString() || "" }
                      columnsNames={ CityFilterColumns.columnsNames }
                      onSearch={ (condition) => dispatch(filterCities(condition)) }
                      isLoading={ cityState.isLoading }
                      disabled={ cityState.isLoading }
                      onValueChange={ (val) =>
                      {
                        const selected = cityState.entities.data?.find(
                          (c) => c.id.toString() === val
                        );
                        dispatch(slice.formActions.updateFormData({ cityId: selected?.id, city: selected }));
                      } }
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <TextField
                      label="الحي"
                      value={ formData.district || "" }
                      onChange={ (e) => dispatch(slice.formActions.updateFormData({ district: e.target.value })) }
                    />
                    <TextField
                      label="الشارع"
                      value={ formData.street || "" }
                      onChange={ (e) => dispatch(slice.formActions.updateFormData({ street: e.target.value })) }
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <TextField
                      label="رقم المبنى"
                      value={ formData.buildingNumber || "" }
                      onChange={ (e) => dispatch(slice.formActions.updateFormData({ buildingNumber: e.target.value })) }
                      isInvalid={ isInvalid("buildingNumber") }
                      error={ getError("buildingNumber") }
                    />
                    <TextField
                      label="الرمز البريدي"
                      value={ formData.postalCode || "" }
                      onChange={ (e) => dispatch(slice.formActions.updateFormData({ postalCode: e.target.value })) }
                      isInvalid={ isInvalid("postalCode") }
                      error={ getError("postalCode") }
                    />
                  </div>
                </FieldsSection>
              ) }

              { requiresContacts && (
                <FieldsSection title="أرقام التواصل" columns={ 1 }>
                  <div className="relative flex flex-col max-h-50 border rounded-md">
                    <div className="space-y-3 overflow-y-auto p-3 flex-1">
                      { formData.accountContacts?.map((contact, index) => (
                        <div key={ index } className="flex items-center gap-3">
                          <div className="flex-1">
                            <Input
                              value={ contact.number || "" }
                              onChange={ (e) =>
                                updateContact(index, "number", e.target.value) }
                              placeholder="05xxxxxxxx"
                            />
                          </div>
                          <Button
                            type="button"
                            variant="destructive"
                            size="icon"
                            className="sticky"
                            onClick={ () =>
                              removeContact(index) }
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      )) }
                    </div>

                    <div className="sticky bottom-0 p-3 border-t">
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={ addContact }
                        className="w-full border-dashed"
                      >
                        <Plus className="h-4 w-4 ml-2" />
                        إضافة رقم تواصل
                      </Button>
                    </div>
                  </div>
                </FieldsSection>
              ) }
            </div>
          ) }

          <FieldsSection title="معلومات إضافية" columns={ 1 }>
            <TextAreaField
              label="ملاحظات"
              value={ formData.notes || "" }
              onChange={ (e) => dispatch(slice.formActions.updateFormData({ notes: e.target.value })) }
              rows={ 3 }
            />
          </FieldsSection>
        </FieldGroup>
      </div>
    </ChangeDialog>
  );
}
