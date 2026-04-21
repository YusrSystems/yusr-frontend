import type Vehicle from "@/app/core/data/vehicle";
import { useMemo } from "react";
import { type ValidationRule, Validators } from "yusr-core";
import type { CommonChangeDialogProps } from "yusr-ui";
import { ChangeDialog, FieldGroup, NumberField, StorageFileField, TextField, useEntityForm, useStorageFile } from "yusr-ui";

export default function ChangeVehicleDialog({ entity, mode, service, onSuccess }: CommonChangeDialogProps<Vehicle>)
{
  const validationRules: ValidationRule<Partial<Vehicle>>[] = useMemo(
    () => [{ field: "name", selector: (d) => d.name, validators: [Validators.required("يرجى إدخال اسم المركبة")] }, {
      field: "chairsNumber",
      selector: (d) => d.chairsNumber,
      validators: [
        Validators.required("يرجى إدخال إجمالي عدد المقاعد"),
        Validators.min(1, "يجب أن يكون عدد المقاعد أكبر من 0")
      ]
    }, {
      field: "chairsNumberPerRow",
      selector: (d) => d.chairsNumberPerRow,
      validators: [
        Validators.required("يرجى إدخال عدد المقاعد في الصف"),
        Validators.min(1, "يجب أن يكون عدد المقاعد في الصف أكبر من 0")
      ]
    }],
    []
  );

  const initialValues = useMemo(
    () => ({
      ...entity,
      name: entity?.name || "",
      make: entity?.make || "",
      model: entity?.model || "",
      chairsNumber: entity?.chairsNumber || 0,
      chairsNumberPerRow: entity?.chairsNumberPerRow || 0,
      files: entity?.files || []
    }),
    [entity]
  );

  const { formData, handleChange, getError, isInvalid, validate } = useEntityForm<Vehicle>(
    initialValues,
    validationRules
  );

  const { fileInputRef, handleFileChange, handleRemoveFile, handleDownload, showFilePreview, getFileSrc } =
    useStorageFile<Partial<Vehicle>>((updater) => handleChange(updater), "files");

  return (
    <ChangeDialog<Vehicle>
      title={ `${mode === "create" ? "إضافة" : "تعديل"} مركبة` }
      className="sm:max-w-2xl"
      formData={ formData }
      dialogMode={ mode }
      service={ service }
      disable={ () => false }
      onSuccess={ (data) => onSuccess?.(data, mode) }
      validate={ validate }
    >
      <FieldGroup>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <TextField
            label="اسم المركبة"
            required
            value={ formData.name || "" }
            onChange={ (e) => handleChange({ name: e.target.value }) }
            isInvalid={ isInvalid("name") }
            error={ getError("name") }
          />

          <TextField
            label="الشركة المصنعة (Make)"
            value={ formData.make || "" }
            onChange={ (e) => handleChange({ make: e.target.value }) }
            isInvalid={ isInvalid("make") }
            error={ getError("make") }
          />

          <TextField
            label="الموديل (Model)"
            value={ formData.model || "" }
            onChange={ (e) => handleChange({ model: e.target.value }) }
            isInvalid={ isInvalid("model") }
            error={ getError("model") }
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
          <NumberField
            label="إجمالي عدد المقاعد"
            required
            value={ formData.chairsNumber || "" }
            onChange={ (e) => handleChange({ chairsNumber: Number(e) }) }
            isInvalid={ isInvalid("chairsNumber") }
            error={ getError("chairsNumber") }
          />

          <NumberField
            label="عدد المقاعد في الصف الواحد"
            required
            value={ formData.chairsNumberPerRow || "" }
            onChange={ (e) => handleChange({ chairsNumberPerRow: Number(e) }) }
            isInvalid={ isInvalid("chairsNumberPerRow") }
            error={ getError("chairsNumberPerRow") }
          />
        </div>

        <div className="mt-6">
          <StorageFileField
            label="صور وملفات المركبة"
            file={ formData.files }
            onFileChange={ handleFileChange }
            onRemove={ handleRemoveFile }
            onDownload={ handleDownload }
            getFileSrc={ getFileSrc }
            showPreview={ showFilePreview }
            fileInputRef={ fileInputRef }
            dir="rtl"
          />
        </div>
      </FieldGroup>
    </ChangeDialog>
  );
}
