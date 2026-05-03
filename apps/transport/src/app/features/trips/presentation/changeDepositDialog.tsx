import { filterCities } from "@/app/core/state/shared/citySlice";
import { useAppDispatch, useAppSelector } from "@/app/core/state/store";
import { useEffect, useMemo } from "react";
import { CityFilterColumns, type ValidationRule, Validators } from "yusr-ui";
import { ChangeDialog, FieldGroup, FieldsSection, FormField, NumberField, PhoneField, SearchableSelect, StorageFileField, TextField, useEntityForm, useStorageFile } from "yusr-ui";
import type { Deposit } from "../data/deposit";

type ChangeDepositDialogProps = { entity?: Deposit; onSuccess?: (newData: Deposit) => void; };

export default function ChangeDepositDialog({ entity, onSuccess }: ChangeDepositDialogProps)
{
  const cityState = useAppSelector((state) => state.city);
  const dispatch = useAppDispatch();
  const validationRules: ValidationRule<Partial<Deposit>>[] = useMemo(
    () => [
      {
        field: "fromCityId",
        selector: (d) => d.fromCityId,
        validators: [Validators.required("يرجى اختيار مدينة المغادرة")]
      },
      { field: "toCityId", selector: (d) => d.toCityId, validators: [Validators.required("يرجى اختيار مدينة الوجهة")] },
      {
        field: "sender",
        selector: (d) => d.sender,
        validators: [Validators.required("يرجى إدخال اسم المرسل")]
      },
      { field: "recipient", selector: (d) => d.recipient, validators: [Validators.required("يرجى إدخال اسم المستلم")] },
      {
        field: "senderPhone",
        selector: (d) => d.senderPhone,
        validators: [Validators.required("يرجى إدخال رقم هاتف المرسل")]
      },
      {
        field: "recipientPhone",
        selector: (d) => d.recipientPhone,
        validators: [Validators.required("يرجى إدخال رقم هاتف المستلم")]
      },
      {
        field: "description",
        selector: (d) => d.description,
        validators: [Validators.required("يرجى إدخال وصف الأمانة")]
      },
      { field: "amount", selector: (d) => d.amount, validators: [Validators.min(0, "يرجى إدخال المبلغ المطلوب")] }
    ],
    []
  );
  const { formData, handleChange, getError, isInvalid, validate, clearError } = useEntityForm<Deposit>(
    entity,
    validationRules
  );
  const { fileInputRef, handleFileChange, handleRemoveFile, handleDownload, showFilePreview, getFileSrc } =
    useStorageFile(handleChange, "image");

  useEffect(() =>
  {
    dispatch(filterCities(undefined));
  }, [dispatch]);

  return (
    <ChangeDialog
      title="بيانات الأمانة"
      className="sm:max-w-4xl"
      formData={ formData as Deposit }
      validate={ validate }
      onSuccess={ (data) => onSuccess?.(data as Deposit) }
    >
      <FieldGroup>
        <div className="flex flex-col lg:flex-row gap-4 items-start">
          <div className="flex-1 w-full space-y-2">
            <FieldsSection columns={ 2 }>
              <FormField label="من المدينة" isInvalid={ isInvalid("fromCityId") } error={ getError("fromCityId") }>
                <SearchableSelect
                  items={ cityState.entities.data ?? [] }
                  itemLabelKey="name"
                  itemValueKey="id"
                  placeholder="مدينة المغادرة"
                  value={ formData.fromCityId?.toString() || "" }
                  onValueChange={ (val) =>
                  {
                    const selectedCity = cityState.entities.data?.find((c) => c.id.toString() === val);
                    handleChange((prev) => ({
                      ...prev,
                      fromCityId: selectedCity?.id,
                      fromCityName: selectedCity?.name
                    }));
                    clearError("fromCityId");
                  } }
                  columnsNames={ CityFilterColumns.columnsNames }
                  onSearch={ (condition) => dispatch(filterCities(condition)) }
                  isLoading={ cityState.isLoading }
                  isInvalid={ isInvalid("fromCityId") }
                  disabled={ cityState.isLoading }
                />
              </FormField>

              <FormField label="إلى المدينة" isInvalid={ isInvalid("toCityId") } error={ getError("toCityId") }>
                <SearchableSelect
                  items={ cityState.entities.data ?? [] }
                  itemLabelKey="name"
                  itemValueKey="id"
                  placeholder="مدينة الوجهة"
                  value={ formData.toCityId?.toString() || "" }
                  onValueChange={ (val) =>
                  {
                    const selectedCity = cityState.entities.data?.find((c) => c.id.toString() === val);
                    handleChange((prev) => ({ ...prev, toCityId: selectedCity?.id, toCityName: selectedCity?.name }));
                    clearError("toCityId");
                  } }
                  columnsNames={ CityFilterColumns.columnsNames }
                  onSearch={ (condition) => dispatch(filterCities(condition)) }
                  isLoading={ cityState.isLoading }
                  isInvalid={ isInvalid("toCityId") }
                  disabled={ cityState.isLoading }
                />
              </FormField>

              <TextField
                label="اسم المرسل"
                value={ formData.sender || "" }
                isInvalid={ isInvalid("sender") }
                error={ getError("sender") }
                onChange={ (e) =>
                {
                  handleChange({ sender: e.target.value });
                  clearError("sender");
                } }
              />

              <PhoneField
                label="رقم هاتف المرسل"
                value={ formData.senderPhone || "" }
                isInvalid={ isInvalid("senderPhone") }
                error={ getError("senderPhone") }
                onChange={ (e) =>
                {
                  handleChange({ senderPhone: e.target.value });
                  clearError("senderPhone");
                } }
              />

              <TextField
                label="اسم المستلم"
                value={ formData.recipient || "" }
                isInvalid={ isInvalid("recipient") }
                error={ getError("recipient") }
                onChange={ (e) =>
                {
                  handleChange({ recipient: e.target.value });
                  clearError("recipient");
                } }
              />

              <PhoneField
                label="رقم هاتف المستلم"
                value={ formData.recipientPhone || "" }
                isInvalid={ isInvalid("recipientPhone") }
                error={ getError("recipientPhone") }
                onChange={ (e) =>
                {
                  handleChange({ recipientPhone: e.target.value });
                  clearError("recipientPhone");
                } }
              />

              <NumberField
                label="إجمالي المبلغ"
                value={ formData.amount }
                isInvalid={ isInvalid("amount") }
                error={ getError("amount") }
                onChange={ (val) =>
                {
                  handleChange({ amount: val });
                  clearError("amount");
                } }
              />

              <NumberField
                label="المبلغ المدفوع"
                value={ formData.paidAmount }
                onChange={ (val) => handleChange({ paidAmount: val }) }
              />
            </FieldsSection>
          </div>

          <div className="w-full md:w-100 shrink-0">
            <StorageFileField
              label="مرفق الأمانة"
              file={ formData.image }
              fileInputRef={ fileInputRef }
              onFileChange={ handleFileChange }
              onRemove={ handleRemoveFile }
              onDownload={ handleDownload }
              getFileSrc={ getFileSrc }
              showPreview={ showFilePreview }
              isInvalid={ isInvalid("image") }
              error={ getError("image") }
            />
          </div>
        </div>

        <TextField
          label="وصف الأمانة"
          placeholder="محتويات الأمانة"
          value={ formData.description || "" }
          isInvalid={ isInvalid("description") }
          error={ getError("description") }
          onChange={ (e) =>
          {
            handleChange({ description: e.target.value });
            clearError("description");
          } }
        />

        <TextField
          label="الملاحظات"
          placeholder="أي ملاحظات إضافية ..."
          value={ formData.notes || "" }
          onChange={ (e) => handleChange({ notes: e.target.value }) }
        />
      </FieldGroup>
    </ChangeDialog>
  );
}
